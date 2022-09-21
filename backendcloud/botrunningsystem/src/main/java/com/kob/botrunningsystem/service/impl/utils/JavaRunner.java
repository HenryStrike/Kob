package com.kob.botrunningsystem.service.impl.utils;

import org.joor.Reflect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.UUID;
import java.util.function.Supplier;

@Component
public class JavaRunner extends Thread{
    private Bot bot;
    private static RestTemplate restTemplate;
    private final static String setBotMoveUrl = "http://127.0.0.1:8080/game/get/bot/move/";

    @Autowired
    private void setRestTemplate(RestTemplate restTemplate) {
        JavaRunner.restTemplate = restTemplate;
    }

    public void startTimeOut(long timeout, Bot bot) {
        this.bot = bot;
        this.start();

        // if this thread finished or exceed timeout limit, it will run following ops
        try {
            this.join(timeout);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            // stop the thread
            this.interrupt();
        }
    }

    @Override
    public void run() {
        // make sure Joor can compile the same class for each turn
        UUID uuid = UUID.randomUUID();
        String uid = uuid.toString().substring(0, 8);

        // put input into a file
        File file = new File("input.txt");
        try(PrintWriter fout = new PrintWriter(file)) {
            fout.println(bot.getInput());
            fout.flush();
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }

        // java implementation, override get()
        Supplier<Integer> botInterface = Reflect.compile(
            "com.kob.botrunningsystem.utils.BotInterfaceImpl" + uid,
            "package com.kob.botrunningsystem.utils;\n" +
                    "import java.io.File;\n" +
                    "import java.io.FileNotFoundException;\n" +
                    "import java.util.*;" +
                    "public class BotInterfaceImpl" + uid +
                    " implements java.util.function.Supplier<Integer> {\n" +
                    bot.getBotCode() +
                    "@Override\n" +
                    "    public Integer get() {\n" +
                    "        File file = new File(\"input.txt\");\n" +
                    "        try {\n" +
                    "            Scanner sc = new Scanner(file);\n" +
                    "            return nextMove(sc.next());\n" +
                    "        } catch (FileNotFoundException e) {\n" +
                    "            throw new RuntimeException(e);\n" +
                    "        }\n" +
                    "    }" +
                    "}"
        ).create().get();

        Integer direction = botInterface.get();
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("user_id", bot.getUserId().toString());
        data.add("direction", direction.toString());
        System.out.println("move: " + bot.getUserId() + " " + direction);
        restTemplate.postForObject(setBotMoveUrl, data, String.class);
    }
}

package com.kob.botrunningsystem.service.impl.utils;

import com.kob.botrunningsystem.utils.BotInterface;
import org.joor.Reflect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

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

        // use library function to run java code
        BotInterface botInterface = Reflect.compile(
            "com.kob.botrunningsystem.utils.BotInterfaceImpl" + uid,
            "package com.kob.botrunningsystem.utils;\n" +
                    "import java.util.ArrayList;\n" +
                    "import java.util.HashMap;\n" +
                    "import java.util.List;\n" +
                    "import java.util.Vector;\n" +
                    "public class BotInterfaceImpl" + uid +
                    " implements com.kob.botrunningsystem.utils.BotInterface{\n" +
                    bot.getBotCode() +
                    "}"
        ).create().get();

        Integer direction = botInterface.nextMove(bot.getInput());
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("user_id", bot.getUserId().toString());
        data.add("direction", direction.toString());
        System.out.println("move: " + bot.getUserId() + " " + direction);
        restTemplate.postForObject(setBotMoveUrl, data, String.class);
    }
}

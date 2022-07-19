package com.kob.backend.controller.pk;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pk/")
public class BotgetInfoController {

    @RequestMapping("getinfo/")
    public Map<String, String> getInfo(){
        Map<String, String> map = new HashMap<>();
        map.put("bot_name", "chl");
        map.put("bot_number", "101");
        return map;
    }
}

package com.kob.backend.controller.user.bot;

import com.kob.backend.service.user.bot.EditBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class EditBotController {
    @Autowired
    private EditBotService editBotService;

    @PostMapping("/user/bot/edit/")
    public Map<String, String> editBot(@RequestParam Map<String, String> data) {
        return editBotService.editBot(data);
    }
}

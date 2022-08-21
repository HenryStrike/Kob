package com.kob.backend.controller.game;

import com.kob.backend.service.game.SetBotMoveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
public class SetBotMoveController {
    @Autowired
    private SetBotMoveService setBotMoveService;

    @PostMapping("/game/get/bot/move/")
    public String getNextMove(@RequestParam MultiValueMap<String, String> data) {
        Integer userId = Integer.parseInt(Objects.requireNonNull(data.getFirst("user_id")));
        Integer direction = Integer.parseInt(Objects.requireNonNull(data.getFirst("direction")));
        return setBotMoveService.getNextMove(userId, direction);
    }
}

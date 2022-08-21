package com.kob.backend.service.game;

import org.springframework.util.MultiValueMap;

public interface SetBotMoveService {
    public String getNextMove(Integer userId, Integer direction);
}

package com.kob.backend.service.impl.game;

import com.kob.backend.consumer.WebSocketServer;
import com.kob.backend.service.game.StartGameService;
import org.springframework.stereotype.Service;

@Service
public class StartGameServiceImpl implements StartGameService {
    @Override
    public String startGame(Integer aId, Integer bId) {
        System.out.println("start game: " + aId + " " + bId);
        WebSocketServer.startGame(aId, bId);
        return "startGame success";
    }
}

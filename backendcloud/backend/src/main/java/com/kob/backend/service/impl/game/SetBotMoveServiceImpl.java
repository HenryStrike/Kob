package com.kob.backend.service.impl.game;

import com.kob.backend.consumer.WebSocketServer;
import com.kob.backend.consumer.utils.Games.Snake.Game;
import com.kob.backend.service.game.SetBotMoveService;
import org.springframework.stereotype.Service;

@Service
public class SetBotMoveServiceImpl implements SetBotMoveService {
    @Override
    public String getNextMove(Integer userId, Integer direction) {
        System.out.println("Bot move: " + userId + " " + direction);
        if(WebSocketServer.users.get(userId) != null) {
            Game game = WebSocketServer.users.get(userId).game;
            if(game.getPlayerA().getId().equals(userId)) {
                game.setNextStepA(direction);
            } else if(game.getPlayerB().getId().equals(userId)) {
                game.setNextStepB(direction);
            }
        }

        return "getNextMove success";
    }
}

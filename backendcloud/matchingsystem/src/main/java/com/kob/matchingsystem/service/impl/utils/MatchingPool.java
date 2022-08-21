package com.kob.matchingsystem.service.impl.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Component
public class MatchingPool extends Thread{
    private static List<Player> players = new ArrayList<>();
    private final Lock lock = new ReentrantLock();
    private static RestTemplate restTemplate;
    private final static String sendResultUrl = "http://127.0.0.1:8080/game/start/";

    @Autowired
    private void setRestTemplate(RestTemplate restTemplate){
        MatchingPool.restTemplate = restTemplate;
    }

    public void addPlayer(Integer userId, Integer score, Integer botId) {
        lock.lock();
        try {
            players.add(new Player(userId, score, botId, 0));
        }finally {
            lock.unlock();
        }
    }

    public void removePlayer(Integer userId) {
        lock.lock();
        try {
            List<Player> newList = new ArrayList<>();
            for(Player player : players) {
                if(!player.getId().equals(userId)) {
                    newList.add(player);
                }
            }
            players = newList;
        }finally {
            lock.unlock();
        }
    }

    private void didWait() {
        for(Player player : players) {
            player.setWaitTime(player.getWaitTime() + 1);
        }
    }

    private void matchPlayers() {
        // try to match all players
        System.out.println("matching players: " + players.toString());
        boolean[] used = new boolean[players.size()];
        for (int i = 0; i < players.size(); i ++ ) {
            if(used[i]) continue;
            for (int j = i + 1; j < players.size(); j ++ ) {
                if(used[j]) continue;
                Player a = players.get(i), b = players.get(j);
                if (checkMatched(a, b)) {
                    used[i] = used[j] = true;
                    sendResult(a, b);
                    break;
                }
            }
        }

        List<Player> newList = new ArrayList<>();
        for (int i = 0; i < players.size(); i ++ ) {
            if(!used[i]) {
                newList.add(players.get(i));
            }
        }
        players = newList;
    }

    private boolean checkMatched(Player a, Player b) {
        int scoreDiff = Math.abs(a.getScore() - b.getScore());
        int waitTime = Math.min(a.getWaitTime(), b.getWaitTime());
        return scoreDiff <= waitTime * 10;
    }

    private void sendResult(Player a, Player b) {
        System.out.println("matching success: " + "player_a: " + a + " " + "player_b: " + b);
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("aId", a.getId().toString());
        data.add("a_bot_id", a.getBotId().toString());
        data.add("bId", b.getId().toString());
        data.add("b_bot_id", b.getBotId().toString());
        restTemplate.postForObject(sendResultUrl, data, String.class);
    }

    @Override
    public void run() {
        while(true) {
            try {
                Thread.sleep(1000);
                lock.lock();
                try {
                    didWait();
                    matchPlayers();
                }finally {
                    lock.unlock();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
    }
}

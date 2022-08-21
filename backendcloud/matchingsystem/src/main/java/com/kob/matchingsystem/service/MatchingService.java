package com.kob.matchingsystem.service;

public interface MatchingService {
    String addPlayer(Integer userId, Integer score, Integer botId);
    String removePlayer(Integer userId);
}

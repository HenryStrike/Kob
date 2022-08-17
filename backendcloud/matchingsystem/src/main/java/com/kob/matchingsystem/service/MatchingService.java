package com.kob.matchingsystem.service;

public interface MatchingService {
    String addPlayer(Integer userId, Integer score);
    String removePlayer(Integer userId);
}

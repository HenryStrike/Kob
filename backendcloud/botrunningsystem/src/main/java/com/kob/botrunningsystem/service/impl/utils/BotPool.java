package com.kob.botrunningsystem.service.impl.utils;

import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class BotPool extends Thread{
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition condition = lock.newCondition();
    private final Queue<Bot> bots = new LinkedList<>();

    public void addBot(Integer userId, String botCode, String input) {
        lock.lock();
        try {
            bots.add(new Bot(userId, botCode, input));
            condition.signal();
        }finally {
            lock.unlock();
        }
    }

    private void consume(Bot bot) {
        JavaRunner javaRunner = new JavaRunner();
        javaRunner.startTimeOut(2000, bot);
    }

    @Override
    public void run() {
        while(true) {
            lock.lock();
            if(bots.isEmpty()) {
                try {
                    // automate unlock
                    condition.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    lock.unlock();
                    break;
                }
            }else {
                Bot bot = bots.remove();
                lock.unlock();
                consume(bot);
            }
        }
    }
}

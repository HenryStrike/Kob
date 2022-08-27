package com.kob.backend.consumer.utils.Games.Snake;

import com.alibaba.fastjson.JSONObject;
import com.kob.backend.consumer.WebSocketServer;
import com.kob.backend.pojo.Bot;
import com.kob.backend.pojo.Record;
import com.kob.backend.pojo.User;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.*;
import java.util.concurrent.locks.ReentrantLock;

public class Game extends Thread {
    private final Integer rows;
    private final Integer cols;
    private final Integer inner_walls_count;
    private final int[][] g;
    private final static int[] dx = {1, 0, -1, 0}, dy = {0, -1, 0, 1};
    private final Player playerA;
    private final Player playerB;
    private Integer nextStepA = null;
    private Integer nextStepB = null;
    private ReentrantLock lock = new ReentrantLock();
    private String status = "playing"; // playing => finished
    private String loser = ""; // all, a, b
    private final static String addBotUrl = "http://127.0.0.1:8082/bot/add/";

    public Game(
            Integer rows,
            Integer cols,
            Integer inner_walls_count,
            Integer idA,
            Bot aBot,
            Integer idB,
            Bot bBot
    ) {
        this.rows = rows;
        this.cols = cols;
        this.inner_walls_count = inner_walls_count;
        this.g = new int[rows][cols];

        Integer aBotId = -1, bBotId = -1;
        String aBotCode = "", bBotCode = "";
        if(aBot != null) {
            aBotId = aBot.getId();
            aBotCode = aBot.getContent();
        }
        if(bBot != null) {
            bBotId = bBot.getId();
            bBotCode = bBot.getContent();
        }

        this.playerA = new Player(idA, aBotId, aBotCode, rows - 2, 1, new ArrayList<>());
        this.playerB = new Player(idB, bBotId, bBotCode, 1, cols - 2, new ArrayList<>());
    }

    public Player getPlayerA() {
        return playerA;
    }

    public Player getPlayerB() {
        return playerB;
    }

    public int[][] getGampMap() {
        return g;
    }

    private String getMapString() {
        StringBuilder res = new StringBuilder();
        for (int i = 0; i < rows; i ++ ) {
            for (int j = 0; j < cols; j ++ ) {
                res.append(g[i][j]);
            }
        }
        return res.toString();
    }

    public JSONObject getGameResp() {
        JSONObject respGame = new JSONObject();
        respGame.put("a_id", getPlayerA().getId());
        respGame.put("a_sx", getPlayerA().getSx());
        respGame.put("a_sy", getPlayerA().getSy());
        respGame.put("b_id", getPlayerB().getId());
        respGame.put("b_sx", getPlayerB().getSx());
        respGame.put("b_sy", getPlayerB().getSy());
        respGame.put("game_map", getGampMap());
        return respGame;
    }

    private String getInput(Player player) {
        // encode current game information
        Player me, you;
        if(player.getId().equals(playerA.getId())) {
            me = playerA;
            you = playerB;
        }else {
            me = playerB;
            you = playerA;
        }
        // format "mapString + me.sx + me.sy + {me.op (maybe empty)} + you.sx + you.sy + {you.op}"
        return getMapString() + "#"
                + me.getSx() + "#"
                + me.getSy() + "#["
                + me.getStepsString() + "]#"
                + you.getSx() + "#"
                + you.getSy() + "#["
                + you.getStepsString() + "]#";
    }

    public void setNextStepA(Integer nextStepA) {
        // 加锁防止多用户同时读写
        lock.lock();
        try {
            this.nextStepA = nextStepA;
        } finally {
            lock.unlock();
        }
    }

    public void setNextStepB(Integer nextStepB) {
        lock.lock();
        try {
            this.nextStepB = nextStepB;
        } finally {
            lock.unlock();
        }
    }

    public void createGameMap() {
        for (int i = 0; i < 1000; i ++) {
            if(drawGameMap()) {
                break;
            }
        }
    }

    private boolean drawGameMap() {
        for (int i = 0; i < rows; i ++ ) {
            for (int j = 0; j < cols; j ++ ) {
                if(i == 0 || i == rows - 1 || j == 0 || j == cols - 1){
                    g[i][j] = 1;
                }else{
                    g[i][j] = 0;
                }
            }
        }

        Random random = new Random();
        for(int i = 0, t = 0; i < inner_walls_count / 2 && t < 10000; i ++) {
            int row = random.nextInt(rows - 2) + 1;
            int col = random.nextInt(cols - 2) + 1;

            if(g[row][col] == 1 || g[rows - 1 - row][cols - 1 - col] == 1){
                i --;
                t ++;
            }else if ((row == rows - 2 && col == 1) || (row == 1 && col == cols - 2)) {
                i --;
                t ++;
            }else{
                g[row][col] = g[rows - 1 - row][cols - 1 - col] = 1;
            }
        }

        return checkConnection(rows - 2, 1, 1, cols - 2);
    }

    private boolean checkConnection(int sx, int sy, int tx, int ty) {
        if(sx == tx && sy == ty){
            return true;
        }
        g[sx][sy] = 1;

        for(int i = 0; i < 4; i ++ ) {
            int x = sx + dx[i], y = sy + dy[i];
            if(x < 0 || x >= rows || y < 0 || y >=  cols || g[x][y] == 1) continue;
            if(checkConnection(x, y, tx, ty)) {
                g[sx][sy] = 0;
                return true;
            }
        }

        g[sx][sy] = 0;
        return false;
    }

    private boolean nextStep() {
        // at least wait a unit time -- 200ms
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        // if the player use bot, update next step move
        sendBotCode(playerA);
        sendBotCode(playerB);

        // wait for next user or bot command up to 5 seconds
        for(int i = 0; i < 50; i ++) {
            try {
                Thread.sleep(100);
                lock.lock();
                try {
                    if(nextStepA != null && nextStepB != null) {
                        playerA.getSteps().add(nextStepA);
                        playerB.getSteps().add(nextStepB);
                        return true;
                    }
                } finally {
                    lock.unlock();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    private boolean check_valid(List<Cell> cellsA, List<Cell> cellsB) {
        int n = cellsA.size();
        Cell cell = cellsA.get(n - 1);
        if(g[cell.x][cell.y] == 1) return false;

        for (int i = 0; i < n - 1; i ++ ) {
            if(Objects.equals(cellsA.get(i).x, cell.x) && Objects.equals(cellsA.get(i).y, cell.y)) return false;
        }

        for (int i = 0; i < n - 1; i ++ ) {
            if(Objects.equals(cellsB.get(i).x, cell.x) && Objects.equals(cellsB.get(i).y, cell.y)) return false;
        }

        return true;
    }

    private void judge() {
        // update result and loser
        List<Cell> cellsA = playerA.getCells();
        List<Cell> cellsB = playerB.getCells();
        boolean validA = check_valid(cellsA, cellsB);
        boolean validB = check_valid(cellsB, cellsA);
        if(!validA || !validB) {
            status = "finished";
            if(!validA && !validB) loser = "all";
            else if(!validA) loser = "a";
            else loser = "b";
        }
    }

    private void sendBotCode(Player player) {
        if(player.getBotId() == -1) return;
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("user_id", player.getId().toString());
        data.add("bot_code", player.getBotCode());
        data.add("input", getInput(player));
        WebSocketServer.restTemplate.postForObject(addBotUrl, data, String.class);
    }

    private void sendToAll(String message) {
        if(WebSocketServer.users.get(playerA.getId()) != null)
            WebSocketServer.users.get(playerA.getId()).sendMessage(message);
        if(WebSocketServer.users.get(playerB.getId()) != null)
            WebSocketServer.users.get(playerB.getId()).sendMessage(message);
    }

    private void sendMove() {
        lock.lock();
        try {
            JSONObject resp = new JSONObject();
            resp.put("event", "move");
            resp.put("a_direction", nextStepA);
            resp.put("b_direction", nextStepB);
            sendToAll(resp.toJSONString());
            nextStepA = nextStepB = null;
        } finally {
            lock.unlock();
        }
    }

    private void updateUserScore(Player player, Integer score) {
        User user = WebSocketServer.userMapper.selectById(player.getId());
        user.setScore(score);
        WebSocketServer.userMapper.updateById(user);
    }

    private void saveToDataBase() {
        Integer scoreA = WebSocketServer.userMapper.selectById(playerA.getId()).getScore();
        Integer scoreB = WebSocketServer.userMapper.selectById(playerB.getId()).getScore();

        if("a".equals(loser)) {
            updateUserScore(playerA, scoreA - 2);
            updateUserScore(playerB, scoreB + 5);
        } else if("b".equals(loser)) {
            updateUserScore(playerA, scoreA + 5);
            updateUserScore(playerB, scoreB - 2);
        } else {
            updateUserScore(playerA, scoreA + 2);
            updateUserScore(playerB, scoreB + 2);
        }

        Record record = new Record(
                null,
                playerA.getId(),
                playerA.getSx(),
                playerA.getSy(),
                playerB.getId(),
                playerB.getSx(),
                playerB.getSy(),
                playerA.getStepsString(),
                playerB.getStepsString(),
                getMapString(),
                loser,
                new Date()
        );

        WebSocketServer.recordMapper.insert(record);
    }

    private void sendResult() {
        // send result to two clients
        JSONObject resp = new JSONObject();
        resp.put("event", "result");
        resp.put("loser", loser);
        sendToAll(resp.toJSONString());
        saveToDataBase();
    }

    @Override
    public void run() {
        // at most run 1000 times
        for(int i = 0; i < 1000; i ++) {
            // if ready for next step
            if(nextStep()) {
                judge();
                if(status.equals("playing")) {
                    sendMove();
                } else {
                    sendResult();
                    break;
                }
            } else {
                status = "finished";
                lock.lock();
                try {
                    if(nextStepA == null && nextStepB == null) {
                        loser = "all";
                    } else if(nextStepA == null) {
                        loser = "a";
                    }else {
                        loser = "b";
                    }
                } finally {
                    lock.unlock();
                }
                sendResult();
                break;
            }
        }
    }
}

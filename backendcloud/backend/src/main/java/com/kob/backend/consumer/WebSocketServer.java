package com.kob.backend.consumer;

import com.alibaba.fastjson.JSONObject;
import com.kob.backend.consumer.utils.Games.Snake.Game;
import com.kob.backend.consumer.utils.JwtAuthentication;
import com.kob.backend.mapper.RecordMapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@ServerEndpoint("/websocket/{token}")
public class WebSocketServer {

    private Session session = null;
    private User user;
    // thread safe: hash and set
    public final static ConcurrentHashMap<Integer, WebSocketServer> users = new ConcurrentHashMap<>();
    private static UserMapper userMapper;
    public static RecordMapper recordMapper;
    private static RestTemplate restTemplate;
    private Game game = null;
    private final static String addPlayerUrl = "http://127.0.0.1:8081/player/add/";
    private final static String removePlayerUrl = "http://127.0.0.1:8081/player/remove/";

    @Autowired
    private void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
    }
    @Autowired
    private void setRecordMapper(RecordMapper recordMapper) {
        WebSocketServer.recordMapper = recordMapper;
    }
    @Autowired
    private void setRestTemplate(RestTemplate restTemplate) {
        WebSocketServer.restTemplate = restTemplate;
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) throws IOException {
        // start connection with clients
        this.session = session;
        int userId = JwtAuthentication.getUserId(token);
        this.user = userMapper.selectById(userId);
        if(this.user != null) {
            users.put(userId, this);
        } else {
            this.session.close();
        }
    }

    @OnClose
    public void onClose() {
        // close connection
        if(this.user != null) {
            users.remove(this.user.getId());
        }
    }

    public static void startGame(Integer aId, Integer bId) {
        // controlled by matching system
        User a = userMapper.selectById(aId);
        User b = userMapper.selectById(bId);

        Game game = new Game(13, 14, 20, a.getId(), b.getId());
        game.createGameMap();
        if(users.get(a.getId()) != null)
            users.get(a.getId()).game = game;
        if(users.get(b.getId()) != null)
            users.get(b.getId()).game = game;

        // create a new game thread
        game.start();

        JSONObject respGame = game.getGameResp();
        if(users.get(a.getId()) != null) {
            JSONObject respA = new JSONObject();
            respA.put("event", "match_success");
            respA.put("opponent_username", b.getUsername());
            respA.put("opponent_photo", b.getPhoto());
            respA.put("game", respGame);
            users.get(a.getId()).sendMessage(respA.toJSONString());
        }
        if(users.get(b.getId()) != null) {
            JSONObject respB = new JSONObject();
            respB.put("event", "match_success");
            respB.put("opponent_username", a.getUsername());
            respB.put("opponent_photo", a.getPhoto());
            respB.put("game", respGame);
            users.get(b.getId()).sendMessage(respB.toJSONString());
        }
    }


    private void startMatching () {
        // send players info to matching system
        System.out.println("start matching");
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("userId", this.user.getId().toString());
        data.add("score", this.user.getScore().toString());
        restTemplate.postForObject(addPlayerUrl, data, String.class);
    }

    private void stopMatching () {
        System.out.println("stop matching");
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("userId", this.user.getId().toString());
        restTemplate.postForObject(removePlayerUrl, data, String.class);
    }

    private void move(int direction) {
        if(game.getPlayerA().getId().equals(user.getId())) {
            game.setNextStepA(direction);
        } else if(game.getPlayerB().getId().equals(user.getId())) {
            game.setNextStepB(direction);
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("received message");
        // receive message from client
        JSONObject data = JSONObject.parseObject(message);
        String event = data.getString("event");
        if("start_matching".equals(event)) {
            startMatching();
        } else if ("stop_matching".equals(event)){
            stopMatching();
        } else if("move".equals(event)) {
            move(data.getInteger("direction"));
        }
    }

    public void sendMessage(String message) {
        // send message to client
        synchronized (this.session) {
            // add a lock
            try {
                this.session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }
}

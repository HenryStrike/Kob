package com.kob.backend.controller.user.friend;

import com.kob.backend.service.user.friend.AddFriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AddFriendController {
    @Autowired
    AddFriendService addFriendService;

    @PostMapping("/api/user/friend/add/")
    public Map<String, String> addFriend(@RequestParam Map<String, String> data) {
        return addFriendService.addFriend(data);
    }
}

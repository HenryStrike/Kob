package com.kob.backend.controller.user.friend;

import com.kob.backend.service.user.friend.DeleteFriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DeleteFriendController {
    @Autowired
    DeleteFriendService deleteFriendService;

    @PostMapping("/api/user/friend/delete/")
    public Map<String, String> deleteFriend(@RequestParam Map<String, String> data) {
        return deleteFriendService.deleteFriend(data);
    }
}

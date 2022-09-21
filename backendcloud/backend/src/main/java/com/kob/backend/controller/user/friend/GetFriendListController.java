package com.kob.backend.controller.user.friend;

import com.kob.backend.pojo.User;
import com.kob.backend.service.user.friend.GetFriendListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GetFriendListController {
    @Autowired
    GetFriendListService getFriendListService;

    @GetMapping("/user/friend/list/")
    public List<User> getList() {
        return getFriendListService.getList();
    }
}
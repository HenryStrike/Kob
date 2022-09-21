package com.kob.backend.service.impl.user.friend;

import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.user.database.utils.UserDetailsImpl;
import com.kob.backend.service.user.friend.GetFriendListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GetFriendListServiceImpl implements GetFriendListService {
    @Autowired
    UserMapper userMapper;

    @Override
    public List<User> getList() {
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        List<User> friends = new ArrayList<>();
        String[] friendList = user.getFriend().split("#");
        for(int i = 1; i < friendList.length; i ++ ) {
            User friend = userMapper.selectById(Integer.parseInt(friendList[i]));
            friend.setPassword("");
            friends.add(friend);
        }

        return friends;
    }
}

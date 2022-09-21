package com.kob.backend.service.impl.user.friend;

import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.user.database.utils.UserDetailsImpl;
import com.kob.backend.service.user.friend.DeleteFriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DeleteFriendServiceImpl implements DeleteFriendService {
    @Autowired
    UserMapper userMapper;

    @Override
    public Map<String, String> deleteFriend(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        Map<String, String> map = new HashMap<>();
        String friendId = data.get("user_id");
        User friend = userMapper.selectById(friendId);
        if(friend == null) {
            map.put("runtime_message", "user does not exist");
            return map;
        }

        String newList = "-1";
        String[] oldList = user.getFriend().split("#");
        for(int i = 1; i < oldList.length; i ++ ) {
            if (!oldList[i].equals(friendId)) newList += "#" + oldList[i];
        }
        user.setFriend(newList);
        userMapper.updateById(user);

        newList = "-1";
        oldList = friend.getFriend().split("#");
        for(int i = 1; i < oldList.length; i ++ ) {
            if (!oldList[i].equals(user.getId().toString())) newList += "#" + oldList[i];
        }
        friend.setFriend(newList);
        userMapper.updateById(friend);

        map.put("runtime_message", "deleteFriend success");
        return map;
    }
}

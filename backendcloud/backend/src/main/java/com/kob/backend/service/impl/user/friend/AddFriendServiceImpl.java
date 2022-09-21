package com.kob.backend.service.impl.user.friend;

import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.user.database.utils.UserDetailsImpl;
import com.kob.backend.service.user.friend.AddFriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AddFriendServiceImpl implements AddFriendService {
    @Autowired
    UserMapper userMapper;

    @Override
    public Map<String, String> addFriend(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        Map<String, String> map = new HashMap<>();

        String friendId = data.get("user_id");
        User friend = userMapper.selectById(Integer.parseInt(friendId));
        if(friend == null) {
            map.put("runtime_message", "user does not exist");
            return map;
        } else if (friendId.equals(user.getId().toString())) {
            map.put("runtime_message", "you cannot add yourself");
            return map;
        }

        String myfriends = user.getFriend();
        String[] oldList = myfriends.split("#");
        for(int i = 1; i < oldList.length; i ++ ) {
            if(oldList[i].equals(friendId)) {
                map.put("runtime_message", "you have added this friend");
                return map;
            }
        }

        String yourfriends = friend.getFriend();
        myfriends += "#" + friendId;
        yourfriends += "#" + user.getId();

        user.setFriend(myfriends);
        friend.setFriend(yourfriends);
        userMapper.updateById(user);
        userMapper.updateById(friend);
        map.put("runtime_messgae", "addFriend success");
        return map;
    }
}

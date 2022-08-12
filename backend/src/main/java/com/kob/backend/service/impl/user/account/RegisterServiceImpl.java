package com.kob.backend.service.impl.user.account;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import com.kob.backend.service.user.account.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RegisterServiceImpl implements RegisterService {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Map<String, String> register(String username, String password, String confirmedPassword) {
        Map<String, String> map = new HashMap<>();
        if(username == null) {
            map.put("runtime_message", "User name cannot be empty");
            return map;
        }
        if(password == null || confirmedPassword == null) {
            map.put("runtime_message", "Password cannot be empty");
            return map;
        }

        username = username.trim();
        if(username.length() == 0) {
            map.put("runtime_message", "User name cannot be empty");
            return map;
        }
        if(password.length() == 0 || confirmedPassword.length() == 0) {
            map.put("runtime_message", "Password cannot be empty");
            return map;
        }
        if(username.length() > 30) {
            map.put("runtime_message", "User name cannot be longer than 30");
            return map;
        }
        if(password.length() > 100 || confirmedPassword.length() > 100) {
            map.put("runtime_message", "Password cannot be longer than 100");
            return map;
        }

        if(!password.equals(confirmedPassword)) {
            map.put("runtime_message", "Two passwords do not match");
            return map;
        }

        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        User existedUser = userMapper.selectOne(queryWrapper);
        if(existedUser != null) {
            map.put("runtime_message", "User name exists");
            return map;
        }

        String encodedPassword = passwordEncoder.encode(password);
        String photo = "https://cdn.acwing.com/media/user/profile/photo/139138_lg_7c35dc7a54.jpg";
        User user = new User(null, username, encodedPassword, photo);
        userMapper.insert(user);

        map.put("runtime_message", "register success");
        return map;
    }
}

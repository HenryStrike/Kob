package com.kob.backend.service.impl.rank;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import com.kob.backend.service.rank.GetRankListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetRankListServiceImpl implements GetRankListService {
    @Autowired
    UserMapper userMapper;

    @Override
    public JSONObject getList(Integer page) {
        IPage<User> userIPage = new Page<>(page, 10);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("score");
        List<User> users = userMapper.selectPage(userIPage, queryWrapper).getRecords();

        for(User user : users) {
            user.setPassword("");
        }

        JSONObject resp = new JSONObject();
        resp.put("users", users);
        resp.put("users_cnt", userMapper.selectCount(null));
        return resp;
    }
}

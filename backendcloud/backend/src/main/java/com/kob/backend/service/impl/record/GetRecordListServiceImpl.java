package com.kob.backend.service.impl.record;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.kob.backend.mapper.RecordMapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.Record;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.user.database.utils.UserDetailsImpl;
import com.kob.backend.service.record.GetRecordListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GetRecordListServiceImpl implements GetRecordListService {
    @Autowired
    private RecordMapper recordMapper;
    @Autowired
    private UserMapper userMapper;

    @Override
    public JSONObject getList(Integer page) {
        UsernamePasswordAuthenticationToken authenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        IPage<Record> recordIPage = new Page<>(page, 10);
        QueryWrapper<Record> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("id").eq("a_id", user.getId()).or().eq("b_id", user.getId());
        List<Record> records = recordMapper.selectPage(recordIPage, queryWrapper).getRecords();

        JSONObject resp = new JSONObject();
        List<JSONObject> items = new ArrayList<>();
        for(Record record : records) {
            User userA = userMapper.selectById(record.getAId());
            User userB = userMapper.selectById(record.getBId());
            JSONObject item = new JSONObject();
            item.put("a_username", userA.getUsername());
            item.put("a_photo", userA.getPhoto());
            item.put("b_username", userB.getUsername());
            item.put("b_photo", userB.getPhoto());

            String res = "Both win";
            if("a".equals(record.getLoser())) {
                if(userA.getId().equals(user.getId())) res = "You lose";
                else res = "You win";
            } else if("b".equals(record.getLoser())) {
                if(userB.getId().equals(user.getId())) res = "You lose";
                else res = "You win";
            }

            item.put("result", res);
            item.put("record", record);
            items.add(item);
        }
        resp.put("records", items);
        resp.put("records_cnt", recordMapper.selectCount(null));

        return resp;
    }
}

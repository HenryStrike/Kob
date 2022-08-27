package com.kob.backend.service.rank;

import com.alibaba.fastjson.JSONObject;

public interface GetRankListService {
    public JSONObject getList(Integer page);
}

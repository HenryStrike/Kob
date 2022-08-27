package com.kob.backend.service.impl.user.bot;

import com.kob.backend.mapper.BotMapper;
import com.kob.backend.pojo.Bot;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.user.database.utils.UserDetailsImpl;
import com.kob.backend.service.user.bot.RemoveBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RemoveBotServiceImpl implements RemoveBotService {
    @Autowired
    BotMapper botMapper;

    @Override
    public Map<String, String> removeBot(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        int bot_id = Integer.parseInt(data.get("bot_id"));
        Bot bot = botMapper.selectById(bot_id);

        Map<String, String> map = new HashMap<>();
        if (bot == null) {
            map.put("runtime_message", "Bot does not exist");
        } else if (!bot.getUserId().equals(user.getId())) {
            map.put("runtime_message", "No permission to remove");
        } else {
            botMapper.deleteById(bot_id);
            map.put("runtime_message", "removeBot success");
        }

        return map;
    }
}

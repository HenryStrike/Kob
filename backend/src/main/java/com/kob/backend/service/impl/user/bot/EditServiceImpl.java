package com.kob.backend.service.impl.user.bot;

import com.kob.backend.mapper.BotMapper;
import com.kob.backend.pojo.Bot;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.user.database.utils.UserDetailsImpl;
import com.kob.backend.service.user.bot.EditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class EditServiceImpl implements EditService {
    @Autowired
    private BotMapper botMapper;

    @Override
    public Map<String, String> editBot(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        int bot_id = Integer.parseInt(data.get("bot_id"));
        Bot bot = botMapper.selectById(bot_id);

        Map<String, String> map = new HashMap<>();
        if(bot == null) {
            map.put("runtime_message", "Bot does not exist");
            return map;
        }
        if(!bot.getUserId().equals(user.getId())){
            map.put("runtime_message", "No permission to edit");
            return map;
        }

        String title = data.get("title");
        String description = data.get("description");
        String content = data.get("content");

        if(title == null) {
            map.put("runtime_message", "Title cannot be empty");
            return map;
        }

        title = title.trim();
        if(title.length() == 0) {
            map.put("runtime_message", "Title cannot be empty");
            return map;
        } else if (title.length() > 50) {
            map.put("runtime_message", "Title is too long");
            return map;
        }

        if(description == null || description.length() == 0) {
            description = "Nothing here ~";
        } else if (description.length() > 300) {
            map.put("runtime_message", "Description is too long");
            return map;
        }

        if(content == null || content.length() == 0) {
            map.put("runtime_message", "Code cannot be empty");
            return map;
        } else if (content.length() > 10000) {
            map.put("runtime_message", "Code is too long");
            return map;
        }

        Bot new_bot = new Bot(
                bot_id,
                user.getId(),
                title,
                description,
                content,
                bot.getScore(),
                bot.getCreateTime(),
                new Date()
        );
        botMapper.updateById(new_bot);

        map.put("runtime_message", "editBot success");
        return map;
    }
}

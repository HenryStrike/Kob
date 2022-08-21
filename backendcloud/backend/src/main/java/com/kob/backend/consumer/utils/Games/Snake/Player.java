package com.kob.backend.consumer.utils.Games.Snake;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Player {
    private Integer id;
    private Integer botId;
    private String botCode;
    private Integer sx;
    private Integer sy;
    private List<Integer> steps;

    public boolean check_tail_increment(int steps) {
        // whether snake length need to increase
        if(steps <= 10) return true;
        return steps % 3 == 1;
    }

    public List<Cell> getCells() {
        List<Cell> list = new ArrayList<>();

        int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};

        int x = sx, y = sy, step = 0;
        list.add(new Cell(x, y));
        for(int d : steps) {
            x += dx[d];
            y += dy[d];
            list.add(new Cell(x, y));
            if(!check_tail_increment(++ step)) {
                list.remove(0);
            }
        }
        return list;
    }

    public String getStepsString() {
        StringBuilder res = new StringBuilder();
        for(int d : steps) {
            res.append(d);
        }
        return res.toString();
    }
}

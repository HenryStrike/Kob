package com.kob.botrunningsystem.utils;

// format of bot code
// user can only override the nextMove function

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class BotInterfaceImpl implements java.util.function.Supplier<Integer> {
    public static class Cell {
        Integer x;
        Integer y;
        public Cell(Integer x, Integer y) {
            this.x = x;
            this.y = y;
        }
    }

    public static int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};

    public boolean check_tail_increment(int steps) {
        // whether snake length need to increase
        if(steps <= 10) return true;
        return steps % 3 == 1;
    }

    public List<Cell> getCells(int sx, int sy, String steps) {
        List<Cell> list = new ArrayList<>();

        int x = sx, y = sy, step = 0;
        list.add(new Cell(x, y));
        for(int i = 0; i < steps.length(); i ++ ) {
            if(steps.charAt(i) == '[' || steps.charAt(i) == ']') continue;
            int d = steps.charAt(i) - '0';
            x += dx[d];
            y += dy[d];
            list.add(new Cell(x, y));
            if(!check_tail_increment(++ step)) {
                list.remove(0);
            }
        }
        return list;
    }

    public Integer nextMove(String input) {
        // format "mapString + me.sx + me.sy + [me.op] + you.sx + you.sy + [you.op]", split by '#'
        String[] data = input.split("#");
        int[][] g = new int[13][14];
        for(int i = 0, k = 0; i < 13; i ++ ) {
            for(int j = 0; j < 14; j ++, k ++ ) {
                if(data[0].charAt(k) == '1') {
                    g[i][j] = 1;
                }
            }
        }

        int aSx = Integer.parseInt(data[1]), aSy = Integer.parseInt(data[2]);
        int bSx = Integer.parseInt(data[4]), bSy = Integer.parseInt(data[5]);
        List<Cell> aCells = getCells(aSx, aSy, data[3]);
        List<Cell> bCells = getCells(bSx, bSy, data[6]);
        for(Cell c : aCells) g[c.x][c.y] = 1;
        for(Cell c : bCells) g[c.x][c.y] = 1;

        int x = aCells.get(aCells.size() - 1).x, y = aCells.get(aCells.size() - 1).y;
        List<Integer> options = new ArrayList<>();
        for(int i = 0; i < 4; i ++ ) {
            int a = x + dx[i], b = y + dy[i];
            if(a >= 13 || b >= 14 || a < 0 || b < 0 || g[a][b] == 1) continue;
            options.add(i);
        }
        if(!options.isEmpty()) {
            return options.get((int)(Math.random() * options.size()));
        }
        return 0;
    }

    @Override
    public Integer get() {
        File file = new File("input.txt");
        try {
            Scanner sc = new Scanner(file);
            return nextMove(sc.next());
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}

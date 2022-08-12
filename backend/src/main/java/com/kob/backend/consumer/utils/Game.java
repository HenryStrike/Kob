package com.kob.backend.consumer.utils;

import java.util.Random;

public class Game {
    final private Integer rows;
    final private Integer cols;
    final private Integer inner_walls_count;
    final private int[][] g;
    final private static int[] dx = {1, 0, -1, 0}, dy = {0, -1, 0, 1};

    public Game(Integer rows, Integer cols, Integer inner_walls_count) {
        this.rows = rows;
        this.cols = cols;
        this.inner_walls_count = inner_walls_count;
        this.g = new int[rows][cols];
    }

    public int[][] getGampMap() {
        return g;
    }

    private boolean drawGameMap() {
        for (int i = 0; i < this.rows; i ++ ) {
            for (int j = 0; j < this.cols; j ++ ) {
                if(i == 0 || i == this.rows - 1 || j == 0 || j == this.cols - 1){
                    g[i][j] = 1;
                }else{
                    g[i][j] = 0;
                }
            }
        }

        Random random = new Random();

        for(int i = 0, t = 0; i < this.inner_walls_count / 2 && t < 10000; i ++) {
            int row = random.nextInt(this.rows - 2) + 1;
            int col = random.nextInt(this.cols - 2) + 1;

            if(g[row][col] == 1 || g[this.rows - 1 - row][this.cols - 1 - col] == 1){
                i --;
                t ++;
            }else if ((row == this.rows - 2 && col == 1) || (row == 1 && col == this.cols - 2)) {
                i --;
                t ++;
            }else{
                g[row][col] = g[this.rows - 1 - row][this.cols - 1 - col] = 1;
            }
        }

        return checkConnection(this.rows - 2, 1, 1, this.cols - 2);
    }

    private boolean checkConnection(int sx, int sy, int tx, int ty) {
        if(sx == tx && sy == ty){
            return true;
        }
        g[sx][sy] = 1;

        for(int i = 0; i < 4; i ++ ) {
            int x = sx + dx[i], y = sy + dy[i];
            if(x < 0 || x >= this.rows || y < 0 || y >= this.cols || g[x][y] == 1) continue;
            if(checkConnection(x, y, tx, ty)) {
                g[sx][sy] = 0;
                return true;
            }
        }

        g[sx][sy] = 0;
        return false;
    }

    public void createGameMap() {
        for (int i = 0; i < 1000; i ++) {
            if(drawGameMap()) {
                break;
            }
        }
    }

}

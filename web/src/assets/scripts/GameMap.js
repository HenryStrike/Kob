import { GameObejct } from "./GameObject";
import { WallGenerator } from './WallGenerator';

export class GameMap extends GameObejct{
    constructor(ctx, root){
        super();

        this.ctx = ctx;
        this.root = root;

        // number of grids
        this.rows = 13;
        this.cols = 13;

        // save all the wall objects
        this.walls = [];
        this.inner_walls_count = 20;
    }

    check_connection(g, sx, sy, tx, ty) {
        //dfs search path
        if(sx === tx && sy === ty){
            return true;
        }
        g[sx][sy] = true;

        let dx = [0, 1, 0, -1], dy = [-1, 0, 1, 0];
        for(let i = 0; i < 4; i ++) {
            let a = sx + dx[i], b = sy + dy[i];
            if(!g[a][b] && this.check_connection(g, a, b, tx, ty)){
                return true;
            }
        }

        return false;
    }

    create_walls() {
        const st = [];

        // initialize the state matrix and fill the boarder
        for(let i = 0; i < this.rows; i ++) {
            st[i] = [];
            for(let j = 0; j < this.cols; j ++) {
                if(i === 0 || i === this.rows - 1 || j === 0 || j === this.cols - 1){
                    st[i][j] = true;
                }else{
                    st[i][j] = false;
                }
            }
        }

        // create random inner walls
        for(let i = 0, t = 0; i < this.inner_walls_count / 2 && t < 1000; i ++) {
            let row = parseInt(Math.random() * (this.rows - 2)) + 1;
            let col = parseInt(Math.random() * (this.cols - 2)) + 1;

            if(st[row][col] || (row === this.rows - 2 && col === 1) || (row === 1 && col === this.cols - 2)){
                i --;
                t ++;
                continue;
            }else{
                st[row][col] = st[col][row] = true;
            }
        }

        for(let i = 0; i < this.rows; i ++) {
            for(let j = 0; j < this.cols; j ++) {
                if(st[i][j]){
                    this.walls.push(new WallGenerator(i, j, this));
                }
            }
        }

        // obtain a copy of state matrix
        const copy_st = JSON.parse(JSON.stringify(st));

        return this.check_connection(copy_st, this.rows - 2, 1, 1, this.cols - 2);
    }

    start() {
        for(let t = 0; t < 1000; t ++) {
            if(this.create_walls()) break;
        }
    }

    update_window_size() {
        this.L = parseInt(Math.min(this.root.clientWidth / this.cols, this.root.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {
        this.update_window_size();
        this.render();
    }

    render() {
        let color_odd = '#AAD751';
        let color_even = '#A2D149';
        for(let i = 0; i < this.cols; i ++){
            for(let j = 0; j < this.rows; j ++){
                if((i + j) % 2 === 0){
                    this.ctx.fillStyle = color_even;
                }else{
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(i * this.L, j * this.L, this.L, this.L);
            }
        }
    }
}
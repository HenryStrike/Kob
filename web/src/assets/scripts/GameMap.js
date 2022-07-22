import { GameObejct } from "./GameObject";
import { Wall } from './Wall';
import { Snake } from './Snake';

export class GameMap extends GameObejct{
    constructor(ctx, root){
        super();

        this.ctx = ctx;
        this.root = root;

        // number of grids
        this.rows = 13;
        this.cols = 14;

        // save all the wall objects
        this.walls = [];
        this.inner_walls_count = 20;

        // create snakes
        this.snakes = [
            new Snake({id : 0, color : '#4876EC', row : this.rows - 2, col : 1}, this),
            new Snake({id : 1, color : '#F94848', row : 1, col : this.cols - 2}, this),
        ];
    }

    check_ready_to_move() {
        // whether the snakes can move 
        for(const snake of this.snakes) {
            if(snake.direction === -1) return false;
            if(snake.status !== 'idle') return false;
        }
        return true;
    }

    check_valid(cell) {
        for(const wall of this.walls) {
            if(cell.row === wall.row && cell.col === wall.col){
                return false;
            }
        }

        for(const snake of this.snakes) {
            let len = snake.cells.length;
            // when tail will move, no need to check
            if(!snake.check_tail_increment()) {
                len --;
            }

            for(let i = 0; i < len; i ++) {
                if(cell.row === snake.cells[i].row && cell.col === snake.cells[i].col) {
                    return false;
                }
            }

            return true;
        }
    }

    next_step() {
        for(const snake of this.snakes){
            snake.start_move();
        }
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
        for(let i = 0; i < this.cols; i ++) {
            st[i] = [];
            for(let j = 0; j < this.rows; j ++) {
                if(i === 0 || i === this.cols - 1 || j === 0 || j === this.rows - 1){
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

            if(st[col][row] || (row === this.rows - 2 && col === 1) || (row === 1 && col === this.cols - 2)){
                i --;
                t ++;
                continue;
            }else{
                st[col][row] = st[this.cols - 1 - col][this.rows - 1 - row] = true;
            }
        }

        for(let i = 0; i < this.cols; i ++) {
            for(let j = 0; j < this.rows; j ++) {
                if(st[i][j]){
                    this.walls.push(new Wall(i, j, this));
                }
            }
        }

        // obtain a copy of state matrix
        const copy_st = JSON.parse(JSON.stringify(st));

        return this.check_connection(copy_st, 1, this.rows - 2, this.cols - 2, 1);
    }
    
    // temporary input
    add_listener_event() {
        this.ctx.canvas.focus();

        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener('keydown', (e)=>{
            if(e.key === 'w') snake0.set_direction(0);
            else if(e.key === 'd') snake0.set_direction(1);
            else if(e.key === 's') snake0.set_direction(2);
            else if(e.key === 'a') snake0.set_direction(3);
            else if(e.key === 'ArrowUp') snake1.set_direction(0);
            else if(e.key === 'ArrowRight') snake1.set_direction(1);
            else if(e.key === 'ArrowDown') snake1.set_direction(2);
            else if(e.key === 'ArrowLeft') snake1.set_direction(3);
        });
    }

    start() {
        for(let t = 0; t < 1000; t ++) {
            if(this.create_walls()) break;
        }

        this.add_listener_event();
    }

    update_window_size() {
        this.L = parseInt(Math.min(this.root.clientWidth / this.cols, this.root.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {
        this.update_window_size();
        if(this.check_ready_to_move()) {
            this.next_step();
        }
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
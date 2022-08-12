import { GameObejct } from "./GameObject";
import { Wall } from './Wall';
import { Snake } from './Snake';

export class GameMap extends GameObejct{
    constructor(ctx, root, game_map){
        super();

        this.ctx = ctx;
        this.root = root;

        // number of grids
        this.rows = 13;
        this.cols = 14;

        // save all the wall objects
        this.walls = [];

        // create snakes
        this.snakes = [
            new Snake({id : 0, color : '#4876EC', row : this.rows - 2, col : 1}, this),
            new Snake({id : 1, color : '#F94848', row : 1, col : this.cols - 2}, this),
        ];

        this.game_map = game_map;
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

    create_walls() {
        const g = this.game_map;
        for(let i = 0; i < this.rows; i ++) {
            for(let j = 0; j < this.cols; j ++) {
                if(g[i][j]){
                    this.walls.push(new Wall(i, j, this));
                }
            }
        }
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
        this.create_walls();
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
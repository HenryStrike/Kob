import { GameObejct } from "./GameObject";
import { Wall } from './Wall';
import { Snake } from './Snake';

export class GameMap extends GameObejct{
    constructor(ctx, root, game_map, socket){
        super();

        this.ctx = ctx;
        this.root = root;
        this.socket = socket;

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

    set_directions(data) {
        const [snake0, snake1] = this.snakes;
        snake0.set_direction(data.a_direction);
        snake1.set_direction(data.b_direction);
    }

    set_status(data) {
        const [snake0, snake1] = this.snakes;
        if(data.loser === "all" || data.loser === "a") {
            snake0.status = "dead";
        }
        if(data.loser === "all" || data.loser === "b"){
            snake1.status = "dead";
        }
    }
    
    // temporary input
    add_listener_event() {
        this.ctx.canvas.focus();
        this.ctx.canvas.addEventListener('keydown', (e)=>{
            let d = -1;
            if(e.key === 'w') d = 0;
            else if(e.key === 'd') d = 1;
            else if(e.key === 's') d = 2;
            else if(e.key === 'a') d = 3;

            if (d >= 0) {
                this.socket.send(JSON.stringify({
                    event : "move",
                    direction : d,
                }))
            }
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
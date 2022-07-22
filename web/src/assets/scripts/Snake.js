import { GameObejct } from "./GameObject";
import { Cell } from './Cell';

export class Snake extends GameObejct {
    constructor(info, gamemap) {
        super();
        
        this.id = info.id;
        this.color = info.color;
        this.eye_direction = info.id === 0 ? 0 : 2;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.col, info.row)];
        // next turn target
        this.next_cell_target = null;

        this.speed = 3;
        // -1 -> no command; 0, 1, 2, 3 -> up right down left 4 directions;
        this.direction = -1;
        this.status = 'idle';

        // row and column move matrix
        this.dr = [-1, 0, 1, 0];
        this.dc = [0, 1, 0, -1];

        // game cycle count
        this.step = 0;
        this.tolerance = 1e-2;

        // eye position offset
        this.eye_dx = [
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];
        this.eye_dy = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ];
    }

    start() {

    }

    set_direction(d) {
        this.direction = d;
    }

    check_tail_increment() {
        // whether snake length need to increase
        if(this.step <= 10) {
            return true;
        }else if(this.step % 3 === 1){
            return true;
        }else{
            return false;
        }
    }

    start_move() {
        const d = this.direction;
        this.eye_direction = d;
        // set move target
        this.next_cell_target = new Cell(this.cells[0].col + this.dc[d], this.cells[0].row + this.dr[d]);
        // unset the move direction
        this.direction = -1;
        this.status = 'moving';
        this.step ++;

        // add a virtual cell in the front
        const cell_cnt = this.cells.length;
        for(let i = cell_cnt; i > 0; i --) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }

        if(!this.gamemap.check_valid(this.next_cell_target)) {
            this.status = 'dead'
        }
    }

    update_move() {
        const dx = this.next_cell_target.x - this.cells[0].x;
        const dy = this.next_cell_target.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < this.tolerance){
            this.status = 'idle';
            this.cells[0] = this.next_cell_target;
            this.next_cell_target = null;

            if(!this.check_tail_increment()){
                this.cells.pop();
            }
        }else{
            //need to move
            const move_distance = this.speed * this.time_delta / 1000;
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;
            
            // tail move
            if(!this.check_tail_increment()) {
                const len = this.cells.length;
    
                const tail = this.cells[len - 1];
                const tail_target = this.cells[len - 2];
    
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
    
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    update() {
        if(this.status === 'moving'){
            this.update_move();
        }
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;
        const size_ratio = 0.8;
        const eye_offset_ratio = 0.15;

        ctx.fillStyle = this.color;
        if(this.status === 'dead'){
            ctx.fillStyle = 'white';
        } 

        // snake cells
        for(const cell of this.cells){
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2 * size_ratio, 0, 2 * Math.PI);
            ctx.fill();
        }

        // snake shell
        for(let i = 1; i < this.cells.length; i ++) {
            const a = this.cells[i - 1], b = this.cells[i];
            if(Math.abs(a.x - b.x) < this.tolerance && Math.abs(a.y - b.y) < this.tolerance){
                continue;
            }
            // vertical
            if(Math.abs(a.x - b.x) < this.tolerance){
                ctx.fillRect((a.x - 0.5 + (1 - size_ratio) / 2) * L, Math.min(a.y, b.y) * L, L * size_ratio, Math.abs(a.y - b.y) * L);
            }
            // horizontal
            else{
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.5 + (1 - size_ratio) / 2) * L, Math.abs(a.x - b.x) * L, L * size_ratio)
            }
        }

        // snake eyes
        ctx.fillStyle = 'black';
        for(let i = 0; i < 2; i ++) {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * eye_offset_ratio) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * eye_offset_ratio) * L;
            ctx.beginPath();
            ctx.arc(eye_x, eye_y, 0.08 * L, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}
import { GameObejct } from "./GameObject";

export class Cell extends GameObejct{
    constructor(col, row) {
        super();

        this.row = row;
        this.col = col;
        this.x = this.col + 0.5;
        this.y = this.row + 0.5;
    }
}
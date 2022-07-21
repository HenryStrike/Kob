const GAME_OBJECT = [];

export class GameObejct{
    constructor(){
        GAME_OBJECT.push(this);
        this.time_delta = 0;
        this.has_started = false;
    }

    start() {
        
    }

    update() {

    }

    on_destroy() {

    }

    destroy() {
        this.on_destroy();
        for(let i in GAME_OBJECT){
            const obj = GAME_OBJECT[i];
            if(obj === this){
                GAME_OBJECT.splice(i);
                break;
            }
        }
    }
    
}

let last_time = 0;
const step = (time_stamp) => {
    for(let obj of GAME_OBJECT){
        if(!obj.has_started){
            obj.has_started = true; 
            obj.start();
        }else{
            obj.time_delta = time_stamp - last_time;
            obj.update();
        }
    }
    last_time = time_stamp;
    requestAnimationFrame(step);
}

requestAnimationFrame(step);
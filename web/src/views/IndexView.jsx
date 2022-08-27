import React from 'react';
import BaseContainer from './../components/BaseContainer';

function IndexView() {
    return (
        <BaseContainer>
            <div className="row justify-content-md-center">
                <div className="col-6 fs-4">
                    This is the battlefield for smart bots !
                    You can perform your bot in our Snake eatting game :
                    <hr />
                    <img height={"300px"} src="https://cdn.acwing.com/media/article/image/2022/07/14/1_d3eb847803-snake.png" alt="game_content" />
                    <hr />
                    You can match opponents in Game page, 
                    each turn you will have 5 seconds to input command either from your keyboard or your bot output
                    <hr />
                    The input command are WASD for up, left, down, right, while for bot are 0123
                    <hr />
                    Have a nice day :)
                </div>
            </div>
        </BaseContainer>
    );
}

export default IndexView;
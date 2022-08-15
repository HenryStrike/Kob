import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

function MatchGround() {
    const match_btn = useRef(null);

    const myphoto = useSelector((state) => (state.user.photo));
    const myname = useSelector((state) => (state.user.username));
    const yourphoto = useSelector((state) => (state.snakeGame.opponent_photo));
    const yourname = useSelector((state) => (state.snakeGame.opponent_username));
    const socket = useSelector((state) => (state.snakeGame.socket));

    const handleMatchClick = () => {
        if (match_btn.current.innerHTML === "Match") {
            match_btn.current.innerHTML = "Cancel";
            socket.send(JSON.stringify({
                event : "start_matching"
            }));
        } else {
            match_btn.current.innerHTML = "Match";
            socket.send(JSON.stringify({
                event : "stop_matching"
            }));
        }
    }

    return (
        <div className="matchground">
            <div className="row justify-content-md-center">
                <div className="col-md-5">
                    <div className="user_photo_pk">
                        <img src={myphoto} alt="myphoto" />
                    </div>
                    <div className="username">
                        {myname}
                    </div>
                </div>
                <div className="col-md-2 vs_icon">
                    <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/310/vs-button_1f19a.png" alt="vs" />
                </div>
                <div className="col-md-5">
                    <div className="user_photo_pk">
                        <img src={yourphoto} alt="yourphoto" />
                    </div>
                    <div className="username">
                        {yourname}
                    </div>
                </div>
                <div className="col-md-12 match_btn">
                    <button onClick={handleMatchClick} ref={match_btn} type="button" className="btn btn-warning btn-lg">Match</button>
                </div>
            </div>
        </div>
    );
}

export default MatchGround;
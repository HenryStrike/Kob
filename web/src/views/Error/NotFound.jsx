import React from 'react';
import BaseContainer from './../../components/BaseContainer';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <BaseContainer>
            <div className="row justify-content-md-center">
                <div className="col-sm-4 text-center">
                    <h2 className='mt-5'>Ops...</h2>
                    <h4 className='mt-5' style={{ color: "gray" }}>The page you found does not exist</h4>
                </div>
                <div className="col-sm-4 text-center">
                    <img src="https://zhstatic.zhihu.com/assets/error/liukanshan_wire.svg" alt="404" />
                </div>
            </div>
            <div className='text-center mt-5'>
                <button onClick={() => navigate("/")} type="button" className="btn btn-primary" style={{ float: "center" }}>Return to home page</button>
            </div>
        </BaseContainer>
    );
}

export default NotFound;
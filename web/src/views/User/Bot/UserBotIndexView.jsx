import React from 'react';
import BaseContainer from '../../../components/BaseContainer';
import { useSelector, useDispatch } from 'react-redux';
import botACTIONS from '../../../actions/botActions';
import BotCard from '../../../components/BotCard';

function UserBotIndexView() {
    const token = useSelector((state) => (state.user.token));
    const botList = useSelector((state) => (state.bot.bot_list));
    const dispatch = useDispatch();

    dispatch(botACTIONS.getList({
        token,
        success() { },
        error() { },
    }));

    return (
        <BaseContainer>
            <div className="row justify-content-md-center">
                <div className="col-md-3">
                    <BaseContainer>
                        userprofile
                    </BaseContainer>
                </div>
                <div className="col-md-6">
                    {botList.map(item => (
                        <BotCard
                            key={item.id}
                            title={item.title}
                            score={item.score}
                            description={item.description}
                        />
                    ))}
                </div>
                <div className="col-md-3">
                    <BaseContainer>
                        post
                    </BaseContainer>
                </div>
            </div>
        </BaseContainer>
    );
}

export default UserBotIndexView;
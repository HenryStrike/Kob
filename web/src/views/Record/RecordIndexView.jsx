import React, { Component } from 'react';
import BaseContainer from '../../components/BaseContainer';
import { connect } from 'react-redux';
import { getList, updateSteps, updateIsRecord, updateRecordLoser } from '../../reducers/recordSlice';
import { updateGame } from '../../reducers/snakeGameSlice';
import { Navigate } from 'react-router-dom';

class RecordIndexView extends Component {
    state = {
        current_page : 1,
        max_pages : 1,
        pages : [],
        navigated: false,
    }

    stringTo2D(mapString) {
        let g = [];
        for (let i = 0, k = 0; i < 13; i++) {
            let line = [];
            for (let j = 0; j < 14; j++, k++) {
                if (mapString[k] === '0') line.push(0);
                else line.push(1);
            }
            g.push(line);
        }
        return g;
    }

    updatePages = (total_record) => {
        let max_pages = parseInt(Math.ceil(total_record / 10));
        let new_pages = [];
        for(let i = this.state.current_page - 2; i <= this.state.current_page + 2; i ++ ){
            if(i >= 1 && i <= max_pages) {
                new_pages.push({
                    num : i,
                    is_active : i === this.state.current_page ? " active" : "",
                });
            }
        }
        this.setState({
            pages : new_pages,
            max_pages,
        });
    }

    handleOpenPlayback(record) {
        this.props.updateIsRecord(true);
        this.props.updateSteps({
            a_steps: record.asteps,
            b_steps: record.bsteps,
        });
        this.props.updateRecordLoser(record.loser);
        this.props.updateGame({
            game_map: this.stringTo2D(record.gameMap),
            a_id: record.aid,
            a_sx: record.asx,
            a_sy: record.asy,
            b_id: record.bid,
            b_sx: record.bsx,
            b_sy: record.bsy,
        });
        this.setState({
            navigated: true,
        });
    }

    handleClickPage(pageNum) {
        if(pageNum === -2) pageNum = this.state.current_page - 1;
        else if(pageNum === -1) pageNum = this.state.current_page + 1;
        if(pageNum >= 1 && pageNum <= this.state.max_pages) {
            this.props.getList({
                page: pageNum,
                token: this.props.token,
                updatePages : this.updatePages,
            });
            this.setState({
                current_page : pageNum,
            })
        }
    }

    componentDidMount() {
        this.props.updateIsRecord(false);
        this.props.getList({
            page: this.state.current_page,
            token: this.props.token,
            updatePages : this.updatePages,
        });
    }

    render() {
        return (
            <BaseContainer>
                <table className="table table-striped table-hover" style={{ "textAlign": "center" }}>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Players</th>
                            <th scope="col">Start time</th>
                            <th scope="col">Result</th>
                            <th scope="col">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.record_list.map((item, i) => (
                            <tr key={item.record.id}>
                                <th scope="row">{i + 1 + (this.state.current_page - 1) * 10}</th>
                                <td>
                                    <img className='user_photo_record' src={item.a_photo} alt="a" />
                                    &nbsp;
                                    <span className='username_record'>{item.a_username}</span>
                                    <span className='vs_record ms-3 me-3'>VS</span>
                                    <img className='user_photo_record' src={item.b_photo} alt="b" />
                                    &nbsp;
                                    <span className='username_record'>{item.b_username}</span>
                                </td>
                                <td>{item.record.createTime}</td>
                                <td>{item.result}</td>
                                <td>
                                    <button onClick={() => this.handleOpenPlayback(item.record)} type="button" className="btn btn-outline-primary btn-sm">Playback</button>
                                    {this.state.navigated && <Navigate to={"/record/" + item.record.id + "/"} replace={true} />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav aria-label="Page navigation example" style={{"float" : "right"}}>
                    <ul className="pagination">
                        <li className="page-item" onClick={() => this.handleClickPage(-2)}>
                            <a className="page-link" href='#' aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {this.state.pages.map(item => (
                            <li className={"page-item" + item.is_active} key={item.num} onClick={() => this.handleClickPage(item.num)}>
                                <a className="page-link" href='#'>{item.num}</a>
                            </li>
                        ))}
                        <li className="page-item" onClick={() => this.handleClickPage(-1)}>
                            <a className="page-link" href='#' aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </BaseContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.user.token,
        id: state.user.id,
        record_list: state.record.record_list,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getList: (data) => dispatch(getList(data)),
        updateSteps: (payload) => dispatch(updateSteps(payload)),
        updateIsRecord: (payload) => dispatch(updateIsRecord(payload)),
        updateRecordLoser: (payload) => dispatch(updateRecordLoser(payload)),
        updateGame: (data) => dispatch(updateGame(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordIndexView);
import React, { Component } from 'react';
import BaseContainer from './../../components/BaseContainer';
import { connect } from 'react-redux';
import { getList } from '../../reducers/rankSlice';

class RankIndexView extends Component {
    state = {
        current_page: 1,
        max_pages: 1,
        pages: [],
    }

    updatePages = (total_record) => {
        let max_pages = parseInt(Math.ceil(total_record / 10));
        let new_pages = [];
        for (let i = this.state.current_page - 2; i <= this.state.current_page + 2; i++) {
            if (i >= 1 && i <= max_pages) {
                new_pages.push({
                    num: i,
                    is_active: i === this.state.current_page ? " active" : "",
                });
            }
        }
        this.setState({
            pages: new_pages,
            max_pages,
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
        this.props.getList({
            token: this.props.token,
            page: this.state.current_page,
            updatePages: this.updatePages,
        })
    }

    render() {
        return (
            <BaseContainer>
                <table className="table table-striped table-hover" style={{ "textAlign": "center" }}>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Players</th>
                            <th scope="col">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.rank_list.map((item, i) => (
                            <tr key={item.id}>
                                <th scope="row">{i + 1 + (this.state.current_page - 1) * 10}</th>
                                <td>
                                    <img className='user_photo_record' src={item.photo} alt="a" />
                                    &nbsp;
                                    <span className='username_record'>{item.username}</span>
                                </td>
                                <td>{item.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav aria-label="Page navigation example" style={{ "float": "right" }}>
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
        rank_list: state.rank.rank_list,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getList: (data) => dispatch(getList(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RankIndexView);
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { getFriendList, deleteFriend } from '../../../reducers/friendSlice';
import { Modal } from 'bootstrap/dist/js/bootstrap';
import UserProfileCard from './../../../components/UserProfileCard';

class UserFriendIndexView extends Component {
    constructor() {
        super();

        this.remove_modal = createRef();
    }

    componentDidMount() {
        this.props.getFriendList({
            token : this.props.token,
        });

        this.remove_modal.current.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const id = button.getAttribute('data-bs-id');
            this.remove_modal.current.setAttribute('current-id', id);
        });
    }

    handleDeleteFriend(id) {
        this.props.deleteFriend({
            token : this.props.token,
            id,
            success() {
                Modal.getInstance("#delete_friend_warning").hide();
            }
        });
    }

    render() {
        return (
            <div className="container pt-5">
                <div className="row justify-content-md-center">
                    <div className="col-md-3">
                        <UserProfileCard />
                    </div>
                    <div className="col-md-9">
                        <div className="card mt-3">
                            <div className="card-header">
                                <span style={{ "fontSize": "130%" }}>My Friend</span>
                            </div>
                            <div className="card-body">
                                <table className="table table-striped table-hover" style={{ "textAlign": "center" }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Username</th>
                                            <th scope="col">Score</th>
                                            <th scope="col">Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.friend_list.map((item, i) => (
                                            <tr key={item.id}>
                                                <th scope="row">{i + 1}</th>
                                                <td>
                                                    <img className='user_photo_record' src={item.photo} alt="a" />
                                                    &nbsp;
                                                    <span className='username_record'>{item.username}</span>
                                                </td>
                                                <td>{item.score}</td>
                                                <td>
                                                    <button type="button" className="btn btn-outline-secondary btn-sm me-1" >Chat</button>
                                                    <button type="button" className="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#delete_friend_warning" data-bs-id={item.id} >Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Modal */}
                                <div ref={this.remove_modal} className="modal fade" id="delete_friend_warning" tabIndex="-1" aria-labelledby="delete_warning_label" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="delete_warning_label">Warning</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                Are you sure to delete this friend?
                                            </div>
                                            <div className="modal-footer">
                                                <button onClick={() => this.handleDeleteFriend(this.remove_modal.current.getAttribute('current-id'))} type="button" className="btn btn-danger">Delete</button>
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.user.token,
        friend_list: state.friend.friend_list,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getFriendList: (data) => dispatch(getFriendList(data)),
        deleteFriend: (data) =>dispatch(deleteFriend(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFriendIndexView);
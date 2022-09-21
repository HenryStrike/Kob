import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import AceEditor from "react-ace";
import ace from 'ace-builds/src-noconflict/ace';
import { getList, addBot, removeBot, editBot } from '../../../reducers/botSlice';
import { Modal } from 'bootstrap/dist/js/bootstrap';
import UserProfileCard from '../../../components/UserProfileCard';

class UserBotIndexView extends Component {
    constructor() {
        super();

        this.title = createRef();
        this.description = createRef();
        this.content = createRef();
        this.message = createRef();

        this.bot_title = createRef();
        this.bot_description = createRef();
        this.bot_content = createRef();
        this.bot_message = createRef();
        this.edit_modal = createRef();
        this.remove_modal = createRef();

        ace.config.set(
            "basePath",
            "https://cdn.jsdelivr.net/npm/ace-builds@" + require('ace-builds').version + "/src-noconflict/");
    }

    state = {
        initial_funtion : 
        "/*\nInput format : \nmapString + me.sx + me.sy + [me.op] + you.sx + you.sy + [you.op], split by '#'\n\n" + 
        "Command : \n0 : Up, 1 : Right, 2 : Down, 3 : Left\n\n" +
        "Header : \npublic class BotInterfaceImpl implements BotInterface\n" +
        "*/\n\n" +
        "@Override\n" + 
        "public Integer nextMove(String input) {\n" +  
        "   \n" + 
        "}",
    }

    handleAddBot() {
        const setTitle = (title) => {
            this.title.current.value = title;
        }
        const setDescription = (description) => {
            this.description.current.value = description;
        }
        const setContent = (content) => {
            this.content.current.editor.setValue(content);
        }
        const setMessage = (message) => {
            this.message.current.innerHTML = message;
        };

        setMessage("");
        this.props.addBot({
            token : this.props.token,
            bot: {
                title: this.title.current.value,
                description: this.description.current.value,
                content: this.content.current.editor.getValue(),
            },
            success() {
                setTitle("");
                setDescription("");
                setContent("");
                Modal.getInstance("#add_bot_btn").hide();
            },
            error(resp) {
                setMessage(resp.runtime_message);
            }
        });
    }

    handleRemoveBot(bot_id) {
        this.props.removeBot({
            token : this.props.token,
            id: bot_id,
            success() {
                Modal.getInstance("#delete_bot_warning").hide();
            },
            error() { },
        });
    }

    handleEditBot(bot_id) {
        const setMessage = (message) => {
            this.bot_message.current.innerHTML = message;
        };

        setMessage("");
        this.props.editBot({
            token : this.props.token,
            bot: {
                id: bot_id,
                title: this.bot_title.current.value,
                description: this.bot_description.current.value,
                content: this.bot_content.current.editor.getValue(),
            },
            success() {
                Modal.getInstance("#edit_bot_btn").hide();
            },
            error(resp) {
                setMessage(resp.runtime_message);
            },
        });
    }

    componentDidMount() {
        this.props.getList({
            token : this.props.token,
            error() {}
        });

        this.edit_modal.current.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const title = button.getAttribute('data-bs-title');
            const description = button.getAttribute('data-bs-description');
            const content = button.getAttribute('data-bs-content');
            const id = button.getAttribute('data-bs-id');
            this.bot_title.current.value = title;
            this.bot_description.current.value = description;
            this.bot_content.current.editor.setValue(content);
            this.edit_modal.current.setAttribute('current-id', id);
        });

        this.remove_modal.current.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const id = button.getAttribute('data-bs-id');
            this.remove_modal.current.setAttribute('current-id', id);
        });
    }

    render() {
        return (
            <div className="container pt-5">
                <div className="row justify-content-md-center">
                    <div className="col-md-3">
                        <UserProfileCard/>
                    </div>
                    <div className="col-md-9">
                        <div className="card mt-3">
                            <div className="card-header">
                                <span style={{ "fontSize": "130%" }}>My Bot</span>
                                <button type="button" className="btn btn-primary float-end btn-sm" data-bs-toggle="modal" data-bs-target="#add_bot_btn">
                                    Add Bot
                                </button>
                                {/* Modal */}
                                <div className="modal fade" id="add_bot_btn" tabIndex="-1" aria-labelledby="add_bot_label" aria-hidden="true">
                                    <div className="modal-dialog modal-xl">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id='add_bot_label'>Add a new bot</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="mb-3">
                                                    <label htmlFor="bot_name" className="form-label">Bot name</label>
                                                    <input ref={this.title} type="email" className="form-control" id="bot_name" placeholder="Please enter bot name" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="bot_description" className="form-label">Description</label>
                                                    <textarea ref={this.description} className="form-control" id="bot_description" rows="3" placeholder="Please enter bot description"></textarea>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="code" className="form-label">Code {"( Java Only )"}</label>
                                                    <AceEditor
                                                        ref={this.content}
                                                        height="300px"
                                                        width='100%'
                                                        mode="c_cpp"
                                                        theme="textmate"
                                                        fontSize='14px'
                                                        value={this.state.initial_funtion}
                                                    />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <div className='text-danger' ref={this.message}></div>
                                                <button onClick={() => this.handleAddBot()} type="button" className="btn btn-primary">Add bot</button>
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table table-striped table-hover" style={{"textAlign" : "center"}}>
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Bot name</th>
                                            <th scope="col">Create time</th>
                                            <th scope="col">Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.botList.map((item, i) => (
                                            <tr key={item.id}>
                                                <th scope="row">{i + 1}</th>
                                                <td>{item.title}</td>
                                                <td>{item.createTime}</td>
                                                <td>
                                                    <button type="button" className="btn btn-outline-secondary btn-sm me-1" data-bs-toggle="modal" data-bs-target="#edit_bot_btn"
                                                        data-bs-title={item.title} data-bs-description={item.description} data-bs-content={item.content} data-bs-id={item.id}
                                                    >Edit</button>
                                                    <button type="button" className="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#delete_bot_warning"
                                                        data-bs-id={item.id}
                                                    >Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Modal */}
                                <div ref={this.edit_modal} className="modal fade" id="edit_bot_btn" tabIndex="-1" aria-labelledby="edit_bot_label" aria-hidden="true">
                                    <div className="modal-dialog modal-xl">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id='edit_bot_label'>Edit bot</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="mb-3">
                                                    <label htmlFor="bot_name" className="form-label">Bot name</label>
                                                    <input ref={this.bot_title} type="email" className="form-control" id="bot_name" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="bot_description" className="form-label">Description</label>
                                                    <textarea ref={this.bot_description} className="form-control" id="bot_description" rows="3"></textarea>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="code" className="form-label">Code</label>
                                                    <AceEditor
                                                        ref={this.bot_content}
                                                        height="300px"
                                                        width='100%'
                                                        mode="c_cpp"
                                                        theme="textmate"
                                                        fontSize='14px'
                                                    />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <div className='text-danger' ref={this.bot_message}></div>
                                                <button onClick={() => this.handleEditBot(this.edit_modal.current.getAttribute('current-id'))} type="button" className="btn btn-primary">Save changes</button>
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Modal */}
                                <div ref={this.remove_modal} className="modal fade" id="delete_bot_warning" tabIndex="-1" aria-labelledby="delete_warning_label" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="delete_warning_label">Warning</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                Are you sure to delete this bot?
                                            </div>
                                            <div className="modal-footer">
                                                <button onClick={() => this.handleRemoveBot(this.remove_modal.current.getAttribute('current-id'))} type="button" className="btn btn-danger">Delete</button>
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
        botList: state.bot.bot_list,
        photo: state.user.photo,
        username: state.user.username,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getList: (data) => dispatch(getList(data)),
        addBot: (data) => dispatch(addBot(data)),
        removeBot : (data) => dispatch(removeBot(data)),
        editBot : (data) => dispatch(editBot(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserBotIndexView);
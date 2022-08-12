import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'bootstrap/dist/js/bootstrap';
import {getList, addBot, removeBot, editBot} from '../../../reducers/botSlice';
import AceEditor from "react-ace";
import ace from 'ace-builds/src-noconflict/ace';

function UserBotIndexView() {
    const token = useSelector((state) => (state.user.token));
    const botList = useSelector((state) => (state.bot.bot_list));
    const photo = useSelector((state) => (state.user.photo));
    const username = useSelector((state) => (state.user.username));
    const dispatch = useDispatch();

    const title = useRef(null);
    const description = useRef(null);
    const content = useRef(null);
    const message = useRef(null);

    const bot_title = useRef(null);
    const bot_description = useRef(null);
    const bot_content = useRef(null);
    const bot_message = useRef(null);
    const edit_modal = useRef(null);
    const remove_modal = useRef(null);

    ace.config.set(
        "basePath", 
        "https://cdn.jsdelivr.net/npm/ace-builds@" + require('ace-builds').version + "/src-noconflict/");

    useEffect(() => {
        dispatch(getList({
            token,
            success() { },
            error() { },
        }));

        edit_modal.current.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const title = button.getAttribute('data-bs-title');
            const description = button.getAttribute('data-bs-description');
            const content = button.getAttribute('data-bs-content');
            const id = button.getAttribute('data-bs-id');
            bot_title.current.value = title;
            bot_description.current.value = description;
            bot_content.current.editor.setValue(content);
            edit_modal.current.setAttribute('current-id', id);
        });

        remove_modal.current.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const id = button.getAttribute('data-bs-id');
            remove_modal.current.setAttribute('current-id', id);
        });
    }, [dispatch, token]);

    function handleAddBot() {
        const data = {
            token,
            bot: {
                title: title.current.value,
                description: description.current.value,
                content: content.current.editor.getValue(),
            },
            success() {
                title.current.value = "";
                description.current.value = "";
                content.current.editor.setValue("");
                Modal.getInstance("#add_bot_btn").hide();
            },
            error(resp) {
                message.current.innerHTML = resp.runtime_message;
            }
        }
        message.current.innerHTML = "";
        dispatch(addBot(data));
    }

    function handleRemoveBot(bot_id) {
        const data = {
            token,
            id: bot_id,
            success() {
                Modal.getInstance("#delete_bot_warning").hide();
            },
            error() { },
        }
        dispatch(removeBot(data));
    }

    function handleEditBot(bot_id) {
        const data = {
            token,
            bot: {
                id: bot_id,
                title: bot_title.current.value,
                description: bot_description.current.value,
                content: bot_content.current.editor.getValue(),
            },
            success() {
                Modal.getInstance("#edit_bot_btn").hide();
            },
            error(resp) {
                bot_message.current.value = resp.runtime_message;
            },
        }
        bot_message.current.value = "";
        dispatch(editBot(data));
    }

    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-md-3">
                    <div className="card mt-3">
                        <img src={photo} className="card-img-top" alt="user_icon" style={{ width: "100%" }} />
                        <div className="card-body">
                            <h5 className="card-title">{username}</h5>
                            <p className="card-text">user profile</p>
                        </div>
                    </div>
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
                                                <input ref={title} type="email" className="form-control" id="bot_name" placeholder="Please enter bot name" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="bot_description" className="form-label">Description</label>
                                                <textarea ref={description} className="form-control" id="bot_description" rows="3" placeholder="Please enter bot description"></textarea>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="code" className="form-label">Code</label>
                                                <AceEditor
                                                    ref={content}
                                                    height="300px"
                                                    width='100%'
                                                    mode="c_cpp"
                                                    theme="textmate"
                                                    fontSize='14px'
                                                />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <div className='text-danger' ref={message}></div>
                                            <button onClick={handleAddBot} type="button" className="btn btn-primary">Add bot</button>
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Bot name</th>
                                        <th scope="col">Create time</th>
                                        <th scope="col">Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {botList.map((item, i) => (
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
                            <div ref={edit_modal} className="modal fade" id="edit_bot_btn" tabIndex="-1" aria-labelledby="edit_bot_label" aria-hidden="true">
                                <div className="modal-dialog modal-xl">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id='edit_bot_label'>Edit bot</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="bot_name" className="form-label">Bot name</label>
                                                <input ref={bot_title} type="email" className="form-control" id="bot_name" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="bot_description" className="form-label">Description</label>
                                                <textarea ref={bot_description} className="form-control" id="bot_description" rows="3"></textarea>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="code" className="form-label">Code</label>
                                                <AceEditor
                                                    ref={bot_content}
                                                    height="300px"
                                                    width='100%'
                                                    mode="c_cpp"
                                                    theme="textmate"
                                                    fontSize='14px'
                                                />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <div className='text-danger' ref={bot_message}></div>
                                            <button onClick={() => handleEditBot(edit_modal.current.getAttribute('current-id'))} type="button" className="btn btn-primary">Save changes</button>
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Modal */}
                            <div ref={remove_modal} className="modal fade" id="delete_bot_warning" tabIndex="-1" aria-labelledby="delete_warning_label" aria-hidden="true">
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
                                            <button onClick={() => handleRemoveBot(remove_modal.current.getAttribute('current-id'))} type="button" className="btn btn-danger">Delete</button>
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

export default UserBotIndexView;
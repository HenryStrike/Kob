import React, { Component } from 'react';
import PlayGround from '../../components/PlayGround';
import { connect } from 'react-redux';
import { updateIsRecord } from '../../reducers/recordSlice';

class RecordContentView extends Component {
    componentWillUnmount() {
        this.props.updateIsRecord(false);
    }

    render() {
        return (
            <div className='container pt-5'>
                <div className='playground'>
                    <PlayGround />
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateIsRecord: (payload) => dispatch(updateIsRecord(payload)),
    }
}

export default connect(null, mapDispatchToProps)(RecordContentView);
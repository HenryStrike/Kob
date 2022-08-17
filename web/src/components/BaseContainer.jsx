import React, { Component } from 'react';

class BaseContainer extends Component {
    state = {  } 
    render() { 
        return (
            <div className="container pt-5">
                <div className="card mt-3 mb-3">
                    <div className="card-body">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
 
export default BaseContainer;
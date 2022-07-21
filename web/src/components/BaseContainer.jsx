import React, { Component } from 'react';

class BaseContainer extends Component {
    state = {  } 
    render() { 
        return (
            <div className="container">
                <div className="card mt-3">
                    <div className="card-body">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
 
export default BaseContainer;
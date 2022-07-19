import React, { Component } from 'react';
import $ from 'jquery';


class HomePageView extends Component {
    constructor(props){
        super(props);
        this.bot_name = React.createRef();
    }

    componentDidMount(){
        $.ajax({
            url : "http://127.0.0.1:8080/pk/getinfo/",
            type : "get",
            success : resp => {
                this.bot_name.current.innerText = resp.bot_name;
            }
        })
    }

    render() { 
        return (
            <React.Fragment>
                <div>Bot name: 
                    <span ref={this.bot_name}></span>
                </div>
                <div>Bot number: </div>
            </React.Fragment>
        );
    }
}
 
export default HomePageView;
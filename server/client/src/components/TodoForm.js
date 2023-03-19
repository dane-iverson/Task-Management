import React from "react";
import shortid from "shortid";  //3rd party library

export default class TodoForm extends React.Component {

    state = {
        text: ''
    }

    //updates state upon typing
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    
    handleSubmit = event => {
        event.preventDefault();
        console.log('text:', this.state.text);
        this.props.onSubmit({
            // id: shortid.generate(), //generates unique id
            text: this.state.text,
            complete: false
        });
        this.setState({
            text: ''
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    name="text"
                    value={this.state.text}
                    onChange={this.handleChange}
                    placeholder="To-Do"
                />
                <button onClick={this.handleSubmit}> Add </button>
            </form>
        )
    }
}
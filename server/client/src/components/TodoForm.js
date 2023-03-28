import React from "react";

export default class TodoForm extends React.Component {

    state = {
        text: '',
        deadline: ''
    }

    

    //updates state upon typing
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    // padTo2Digits = (num) => {
    //     return num.toString().padStart(2, '0');
    // }

    // formatDate = (date) => {
    //     return [
    //       date.getFullYear(),
    //       this.padTo2Digits(date.getMonth() + 1),
    //       this.padTo2Digits(date.getDate()),
    //     ].join('-');
    // }

    
    handleSubmit = event => {
        event.preventDefault();
        console.log('text:', this.state.text);
        console.log('deadline:', this.state.deadline);
        this.props.onSubmit({
            // id: shortid.generate(), //generates unique id
            text: this.state.text,
            deadline: this.state.deadline,
            complete: false
        });
        this.setState({
            text: '',
            deadline: ''
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    name="text"
                    value={this.state.text}
                    onChange={this.handleChange}
                    placeholder="Task"
                />
                <input
                    type="date"
                    name="deadline"
                    value={this.state.deadline}
                    onChange={this.handleChange}
                />
                <button onClick={this.handleSubmit}> Add </button>
            </form>
        )
    }
}
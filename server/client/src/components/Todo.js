import React from "react";

const Todo = (props) => {
    const handleDelete = () => {
        props.onDelete(props.todo._id);
    }

    return (
        <p style={{display: 'flex', justifyContent: 'center'}}>
            {props.todo.text}
            <button onClick={handleDelete}>
                X
            </button>
        </p>
    )
}

export default Todo;

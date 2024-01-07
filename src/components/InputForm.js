import React from "react";

const Form = (props)=>{
    const savemovie = (event) =>{
        event.preventDefault()
        const obj = {
            title: event.target.title.value,
            openingText:event.target.Openingtext.value,
            date:new Date(event.target.date.value)
        }
        props.addmovie(obj)
    }
    return (
        <form onSubmit={savemovie}>
            <label htmlFor="title">Tilte:</label>
            <input type="text" id="title"/><br/>
            <label htmlFor="Openingtext">Openeing Text:</label>
            <input type="text" id="Openingtext"/>
            <label htmlFor="date">Release Date:</label>
            <input type="date" id="date"/>
            <button type="submit">Add Movie</button>
        </form>
    )
}

export default Form
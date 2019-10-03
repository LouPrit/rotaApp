import React from "react";
import EngineerMenu from "./EngineerMenu";

function EventForm(props) {
    let engineers = props.engineers;
    return (
        <form className="popupForm" onSubmit={props.saveEvent}>
            <h2>Add Entry</h2>
            <label>Name</label>
            <EngineerMenu engineers={engineers} />
            <label>Start Date</label>
            <input type="text" id="startDate" onClick={props.setDate} required></input>
            <p className="inputInfo">Click above and then use mouse to drag select date range</p>
            <label>End Date</label>
            <input type="text" id="endDate" required></input>
            <button type="submit" className="formButtons">Save</button>
            <input type="button" value="Close" className="formButtons" onClick={props.closeForm} id="eventForm" />
        </form>
    );
}

export default EventForm;
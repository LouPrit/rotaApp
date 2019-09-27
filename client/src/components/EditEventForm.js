import React from "react";

function EditEventForm(props) {
    return (
            <form className="popupForm" onSubmit={props.editEvent}>
                <h2>Edit Entry</h2>
                <label>Start Date</label>
                <input type="text" id="editStartDate"></input>
                <label>End Date</label>
                <input type="text" id="editEndDate"></input>
                <button type="submit">Save</button>
                <input type="button" value="Delete" onClick={props.deleteEvent} />
                <input type="button" value="Close" id="editEventForm" onClick={props.closeForm} />
            </form>
    );
}

export default EditEventForm;
import React from "react";

function EditEventForm(props) {
    return (
            <form className="popupForm" onSubmit={props.editEvent}>
                <h2>Edit Entry</h2>
                <label>Start Date</label>
                <input type="text" id="editStartDate"></input>
                <label>End Date</label>
                <input type="text" id="editEndDate"></input>
                <button type="submit" className="formButtons">Save</button>
                <input type="button" value="Delete" className="formButtons" onClick={props.deleteEvent} />
                <input type="button" value="Close" className="formButtons" id="editEventForm" onClick={props.closeForm} />
            </form>
    );
}

export default EditEventForm;
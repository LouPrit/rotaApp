import React from "react";
import axios from 'axios';

let saveEngineer = (e) => {
    e.preventDefault();
    const engineer = {
      engineerName: e.target.engineerName.value,
      engineerTelNum: e.target.engineerTelNum.value
    }

    axios.post('http://localhost:3001/engineer/', engineer)
      .then(alert("Team created successfully"))
      .catch((error) => {
        console.error(error)
      })

    document.getElementById("newTeamForm").style.display = "none";
  }

function NewEngineerForm(props) {  
    return (
        <form className="popupForm" onSubmit={saveEngineer}>
        <h2>Add New Engineer</h2>
        <label>Engineer Name</label>
        <input type="text" id="engineerName" required></input>
        <label>Engineer Tel Num</label>
        <input type="number" id="engineerTelNum" required></input>
        <button type="submit">Save</button>
        <input type="button" value="Close" onClick={props.closeForm} id="newTeamForm" />
      </form>
    );
  }

  export default NewEngineerForm;
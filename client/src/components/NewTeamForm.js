import React from "react";
import axios from 'axios';

let saveTeam = (e) => {
    e.preventDefault();
    const team = {
      teamName: e.target.teamName.value,
      teamTelNum: e.target.teamTelNum.value
    }

    axios.post('http://localhost:3001/team/', team)
      .then(reply => {
        if (reply.data.exists) {
          alert("A team with this name already exists.");
        } else {
          alert("Team created successfully");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error)
      })

    document.getElementById("newTeamForm").style.display = "none";
  }

function NewTeamForm(props) {  
    return (
        <form className="popupForm" onSubmit={saveTeam}>
        <h2>Add New Team</h2>
        <label>Team Name</label>
        <input type="text" id="teamName" required></input>
        <label>Team Tel Num</label>
        <input type="number" id="teamTelNum" required></input>
        <button type="submit" className="formButtons">Save</button>
        <input type="button" value="Close" className="formButtons" onClick={props.closeForm} id="newTeamForm" />
      </form>
    );
  }

  export default NewTeamForm;
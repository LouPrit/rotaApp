import React from "react";
import axios from 'axios';


function NewEngineerForm(props) {

  let saveEngineer = (e) => {
    e.preventDefault();
    if (props.teamName) {
      const engineer = {
        engineerName: e.target.engineerName.value,
        engineerTelNum: e.target.engineerTelNum.value,
        colour: e.target.engineerColour.value,
        teamName: props.teamName
      }

      axios.post('http://localhost:3001/engineer/', engineer)
        .then(reply => {
          if (reply.data.exists) {
            alert(`An engineer with this name already exists in team ${props.teamName}.`);
          } else {
            alert("Engineer created successfully");
            //This clicks the 'Get Rota' button in order to grab the updated list of engineers.. this seems like a 'hacky' way of achieving this outcome
            //another way to achieve this would be moving this function into App.js and using setState or perhaps using Redux.
            document.getElementById("getRota").click(); 
          }
        })
        .catch((error) => {
          console.error(error)
        })

      document.getElementById("newEngineerForm").style.display = "none";
    } else {
      alert("Please select a team and then click 'Get Rota' first")
      document.getElementById("newEngineerForm").style.display = "none";
    }
  }

  return (
    <form className="popupForm" onSubmit={saveEngineer}>
      <h2>Add New Engineer</h2>
      <label>Engineer Name</label>
      <input type="text" id="engineerName" required></input>
      <label>Engineer Tel Num</label>
      <input type="number" id="engineerTelNum" required></input>
      <label>Colour</label>
      <input type="text" id="engineerColour" required></input>
      <button type="submit">Save</button>
      <input type="button" value="Close" onClick={props.closeForm} id="newEngineerForm" />
    </form>
  );
}

export default NewEngineerForm;
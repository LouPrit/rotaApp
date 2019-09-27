import React from "react";

function TeamMenu(props) {
    let teams = props.teams;
    
    return (
      <select id="teamSelection">
        <option value="" defaultValue hidden>Choose team</option>
        {teams.map((team, index) => <option key={index} value={team.teamName}>{team.teamName}</option>)}
      </select>
    );
  }

  export default TeamMenu;
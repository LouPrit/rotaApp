import React from "react";

function TeamMenu(props) {
    let teams = props.teams;
    return (
      <form onSubmit={props.getRota}>
      <select id="teamSelection">
        <option value="" defaultValue hidden>Choose team</option>
        {teams.map((team, index) => <option key={index} value={team.teamName}>{team.teamName}</option>)}
      </select>
      <button type="submit">Get Rota</button>
      </form>
    );
  }

  export default TeamMenu;
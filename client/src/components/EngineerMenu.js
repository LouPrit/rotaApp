import React from "react";

function EngineerMenu(props) {
  let engineers = props.engineers;
  return (
    <select id="title">
      <option value="" defaultValue hidden>Choose engineer</option>
      {engineers.map((item, index) => <option key={index} value={item.engineerName}>{item.engineerName}</option>)}
    </select>
  );
}

  export default EngineerMenu;
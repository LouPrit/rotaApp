import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import './App.css';
import helper from './helperFuncs';
import Calendar from 'rc-year-calendar';

import TeamMenu from "./components/TeamMenu";
import EventForm from './components/EventForm';
import EditEventForm from './components/EditEventForm';
import NewTeamForm from './components/NewTeamForm';
import NewEngineerForm from './components/NewEngineerForm';

const server = 'http://localhost:3001/';

let editIndex; //A value is assigned to this when a user clicks an event, we then use this value to know which event the user wants to edit 

class App extends Component {
  constructor(props) {
    super(props);

    /**
     * The state holds an array of our event objects which look something like:
        {
         id:"2019-09-19T09:01:59.402Z",
         startDate:"09/02/2019 00:00:00",
         endDate:"09/08/2019 23:59:59",
         name:"Test",
         color:"40f5d7"
        }
     */
    this.state = {
      teams: [], //Populated automatically when component mounts, used for drop down team selection menu
      engineers: [], //TODO: grab configured engineers for selected team and put them here
      teamName: "", //Populated when user clicks 'Get Rota' button
      teamTelNum: "", //Populated when user clicks 'Get Rota' button
      events: [] //Each event that is created ends up here
    }
  }

  componentDidMount() {
    axios.get(`${server}team/`) //Retrieves the configured teams to allow them to be displayed in the drop down selector
      .then(reply => {
        if (reply.data.length > 0) {
          this.setState(
            {
              teams: reply.data
            }
          );
        } else {
          console.log("No teams have been configured");
        }
      })
      .catch(error => console.log(error));
  }

  /**
   * This is fired when a user clicks on an event in the calendar, it finds the index of the event the user clicked
   * inside the state 'events' array and assigns it to 'editIndex' variable for future use.
   * It then displays the start / end date of the event the user clicked inside the input fields of the edit event form.
   */
  onSelectEvent = ({ date, events }) => {
    editIndex = this.state.events.findIndex(event => event.id === events[0].id); //This is so we can edit the correct event inside the state 'events' array 
    document.getElementById("editStartDate").value = moment(this.state.events[editIndex].startDate).format("L HH:mm:ss");
    document.getElementById("editEndDate").value = moment(this.state.events[editIndex].endDate).format("L HH:mm:ss");

    document.getElementById("editEventForm").style.display = "flex";
    console.log(editIndex);
  }

  /**
   * This is fired when a user selects a date range by dragging the mouse across the calendar,
   * it will populate the 'event form' with the date range the user selected.
   */
  onSelectSlot = ({ startDate, endDate }) => {
    if (document.getElementById("title").value !== "") { //Prevents the 'add event' form from displaying if no 'name' has been typed into form
      let startDatez = document.getElementById("startDate");
      let endDatez = document.getElementById("endDate");

      startDatez.value = moment(startDate).format("L HH:mm:ss");
      endDatez.value = moment(endDate).add(23.9999, 'hours').format("L HH:mm:ss");
      document.getElementById("eventForm").style.display = "flex";
    }
  }

  saveEvent = (e) => {
    e.preventDefault();
    if (this.state.teamName) {
      const title = e.target.title.value; //Engineer name
      const engIndex = this.state.engineers.findIndex(engineer => engineer.engineerName === title);

      this.setState({
        events: [...this.state.events,
        {
          id: new Date(),
          startDate: moment(e.target.startDate.value),
          endDate: moment(e.target.endDate.value),
          name: title,
          telNum: this.state.engineers[engIndex].engineerTelNum,
          color: this.state.engineers[engIndex].colour
        }
        ]
      });
      document.getElementById("eventForm").style.display = "none";
      document.getElementById("startDate").value = "";
      document.getElementById("endDate").value = "";
    } else {
      document.getElementById("eventForm").style.display = "none";
      alert("Please select a team and then click 'Get Rota' first");
    }
  }

  editEvent = (e) => {
    e.preventDefault();
    let stateEventsCopy = [...this.state.events];
    console.log(JSON.stringify(stateEventsCopy));
    stateEventsCopy[editIndex].startDate = moment(e.target.editStartDate.value);
    stateEventsCopy[editIndex].endDate = moment(e.target.editEndDate.value);
    console.log(JSON.stringify(stateEventsCopy));

    this.setState({
      events: stateEventsCopy
    });
    document.getElementById("editEventForm").style.display = "none";
  }

  deleteEvent = () => {
    let stateEventsCopy = [...this.state.events];
    stateEventsCopy.splice(editIndex, 1);

    this.setState({
      events: stateEventsCopy
    });
    document.getElementById("editEventForm").style.display = "none";
  }

  saveRota = () => {
    if (this.state.teamName) {
      const rotaObject = {
        teamName: this.state.teamName,
        teamTelNum: this.state.teamTelNum,
        events: this.state.events
      };

      axios.post(`${server}rota/`, rotaObject)
        .then(alert(`Rota saved successfully`))
        .catch(error => console.log(error));
    } else {
      alert("Please select a team and then click 'Get Rota' first");
    }
  }

  getRota = (e) => {
    e.preventDefault();
    const teamName = e.target.teamSelection.value;
    if (teamName) {
      const teamNum = this.state.teams[this.state.teams.findIndex(team => team.teamName === teamName)].teamTelNum;

      axios.get(`${server}rota/${teamName}`)
        .then(reply => {
          if (reply.data.rota.length > 0) {
            let newArray = reply.data.rota[0].events.map(event => ({
              id: event.id,
              startDate: moment(event.startDate),
              endDate: moment(event.endDate),
              name: event.name,
              color: event.color
            }));
            this.setState({
              teamName: teamName,
              teamTelNum: teamNum,
              events: newArray,
              engineers: reply.data.engineers
            });
          } else {
            this.setState({
              teamName: teamName,
              teamTelNum: teamNum,
              engineers: reply.data.engineers
            }, alert(`No Rota found for ${teamName}, please now add entries to the calendar`));
          }
        })
        .catch(error => console.log(error));
    } else {
      alert("Please select a team first");
    }
  }

  setDate = () => {
    if (document.getElementById("startDate").value === "") {
      document.getElementById("eventForm").style.display = "none";
    }
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <div className="teamSelector">
            <TeamMenu teams={this.state.teams} getRota={this.getRota} />
            <input type="button" value="Save Rota" id="formButtons" onClick={this.saveRota} />
          </div>
        </header>

        <main className="main">
          <div className="modal" id="eventForm">
            <EventForm engineers={this.state.engineers} saveEvent={this.saveEvent} setDate={this.setDate} closeForm={helper.closeForm} />
          </div>
          <div className="modal" id="editEventForm">
            <EditEventForm editEvent={this.editEvent} deleteEvent={this.deleteEvent} closeForm={helper.closeForm} />
          </div>
          <div className="modal" id="newTeamForm">
            <NewTeamForm closeForm={helper.closeForm} />
          </div>
          <div className="modal" id="newEngineerForm">
            <NewEngineerForm closeForm={helper.closeForm} teamName={this.state.teamName} />
          </div>
          <Calendar
            enableContextMenu={true}
            enableRangeSelection={true}
            allowOverlap={false}
            contextMenuItems={[
              { text: "Close" }
            ]}
            onDayClick={this.onSelectEvent}
            onRangeSelected={this.onSelectSlot}
            dataSource={this.state.events}
          />
        </main>

        <div className="side">
          <input type="button" value="Add Entry to Calendar" className="addEventButton" id="eventForm" onClick={helper.openForm} teamname={this.state.teamName} />
          <input type="button" value="Add Engineer to Team" className="addEventButton" id="newEngineerForm" onClick={helper.openForm} teamname={this.state.teamName} />
          <input type="button" value="Create New Team" className="addEventButton" id="newTeamForm" teamname="PLACEHOLDER" onClick={helper.openForm} />
        </div>
      </div>
    );
  }
}

export default App;
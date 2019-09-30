import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import './App.css';
import "react-big-calendar/lib/css/react-big-calendar.css";
import helper from './helperFuncs';

import TeamMenu from "./components/TeamMenu";
import EventForm from './components/EventForm';
import EditEventForm from './components/EditEventForm';
import NewTeamForm from './components/NewTeamForm';

/**
 * Sets the locale of our Calendar to en-GB and then makes sure 
 * our calendar starts each week with Monday rather than Sunday
 */
moment.locale('en-gb', {
  week: {
    dow: 1,
    doy: 1,
  },
});

const server = 'http://localhost:3001/';
const localizer = momentLocalizer(moment);

let engineers = [
  {
    name: "Louis Pritchard",
    team: "Team 1",
    telNum: "07777777771",
    colour: "ebd534"
  },
  {
    name: "Mike Baker",
    team: "Team 11",
    telNum: "07777777772",
    colour: "48c920"
  },
  {
    name: "Richard Fry",
    team: "Team 1",
    telNum: "07777777773",
    colour: "29b6d6"
  }
];

let editIndex; //A value is assigned to this when a user clicks an event, we then use this value to know which event the user wants to edit 

class App extends Component {
  constructor(props) {
    super(props);

    /**
     * The state holds an array of our event objects which look something like:
        {
         id:"2019-09-19T09:01:59.402Z",
         start:"09/02/2019 00:00:00",
         end:"09/08/2019 23:59:59",
         title:"Test",
         hexColor:"40f5d7"
        }
     */
    this.state = {
      teams: [], //Populated automatically when component mounts, used for drop down team selection menu
      engineers: [], //TODO: grab configured engineers for selected team and put them here
      teamName: "", //Populated when user clicks 'Get Rota' button
      teamTelNum: "", //Populated when user clicks 'Get Rota' button
      events: [] //Each event that is created ends up here
    }
    this.getActive = this.getActive.bind(this);
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
  onSelectEvent = ({ start, end, id }) => {
    editIndex = this.state.events.findIndex(event => event.id === id); //This is so we can edit the correct event inside the state 'events' array 
    document.getElementById("editStartDate").value = start;
    document.getElementById("editEndDate").value = end;

    document.getElementById("editEventForm").style.display = "flex";
  }

  /**
   * This is fired when a user selects a date range by dragging the mouse across the calendar,
   * it will populate the 'event form' with the date range the user selected.
   */
  onSelectSlot = ({ start, end }) => {
    if (document.getElementById("title").value !== "") { //Prevents the 'add event' form from displaying if no 'name' has been typed into form
      let startDate = document.getElementById("startDate");
      let endDate = document.getElementById("endDate");

      startDate.value = moment(start).format("L HH:mm:ss");
      endDate.value = moment(end).add(23.9999, 'hours').format("L HH:mm:ss");
      document.getElementById("eventForm").style.display = "flex";
    }
  }

  saveEvent = (e) => {
    e.preventDefault();
    if (this.state.teamName) {
      const title = e.target.title.value; //Engineer name
      const engIndex = engineers.findIndex(engineer => engineer.name === title);

      this.setState({
        events: [...this.state.events,
        {
          id: new Date(),
          start: moment(e.target.startDate.value).format("L HH:mm:ss"),
          end: moment(e.target.endDate.value).format("L HH:mm:ss"),
          title: title,
          telNum: engineers[engIndex].telNum,
          hexColor: engineers[engIndex].colour
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
    stateEventsCopy[editIndex].start = e.target.editStartDate.value;
    stateEventsCopy[editIndex].end = e.target.editEndDate.value;

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

  /**
   * 'eventStyleGetter' is how we style each of our individual events on the calendar
   * the 'hexColor' is taken from the event and added to a style object which is then returned to the Calendar component.
   */
  eventStyleGetter = ({ hexColor }) => {
    var backgroundColor = '#' + hexColor;
    var style = {
      backgroundColor: backgroundColor,
      color: 'black',
      fontSize: '25px'
    };
    return {
      style: style
    };
  }

  getActive = () => {
    let active = this.state.events.filter(event => {
      let today = moment(new Date()).format("L HH:mm:ss");
      if (today > event.start && today < event.end) {
        return event;
      } else {
        return false;
      }
    });
    console.log(JSON.stringify(active));
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
          if (reply.data.length > 0) {
            this.setState({
              teamName: teamName,
              teamTelNum: teamNum,
              events: reply.data[0].events
            });
          } else {
            this.setState({
              teamName: teamName,
              teamTelNum: teamNum
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
            <input type="button" value="Save Rota" onClick={this.saveRota} />
          </div>
        </header>

        <main className="main">
          <div className="modal" id="eventForm">
            <EventForm engineers={engineers} saveEvent={this.saveEvent} setDate={this.setDate} closeForm={helper.closeForm} />
          </div>
          <div className="modal" id="editEventForm">
            <EditEventForm editEvent={this.editEvent} deleteEvent={this.deleteEvent} closeForm={helper.closeForm} />
          </div>
          <div className="modal" id="newTeamForm">
            <NewTeamForm closeForm={helper.closeForm} />
          </div>
          <Calendar
            defaultDate={new Date()}
            defaultView="month"
            events={this.state.events}
            localizer={localizer}
            views={['month']}
            onSelectEvent={this.onSelectEvent}
            selectable
            onSelectSlot={this.onSelectSlot}
            eventPropGetter={(this.eventStyleGetter)}
          />
        </main>

        <div className="side">
          <input type="button" value="Add Entry to Calendar" className="addEventButton" id="eventForm" onClick={helper.openForm} />
          <input type="button" value="Add Engineer to Team" className="addEventButton" />
          <input type="button" value="Create New Team" className="addEventButton" id="newTeamForm" onClick={helper.openForm} />
        </div>
      </div>
    );
  }
}

export default App;
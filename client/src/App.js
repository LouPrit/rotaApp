import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './App.css';
import "react-big-calendar/lib/css/react-big-calendar.css";

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

const localizer = momentLocalizer(moment);

const teams = ['Team 1', 'Team 2', 'Team 3'];

let engineers = [
  {
    name: "Louis Pritchard",
    team: "Team 1",
    telNum: "07777777777",
    colour: "ebd534"
  },
  {
    name: "Mike Baker",
    team: "Team 11",
    telNum: "07777777777",
    colour: "48c920"
  },
  {
    name: "Richard Fry",
    team: "Team 1",
    telNum: "07777777777",
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
      events: [
      ]
    }
    this.getActive = this.getActive.bind(this);
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
    let title = document.getElementById("title").value;
    let hexColor = engineers[engineers.findIndex(engineer => engineer.name === title)].colour;

    this.setState({
      events: [...this.state.events,
      {
        id: new Date(),
        start: moment(document.getElementById("startDate").value).format("L HH:mm:ss"),
        end: moment(document.getElementById("endDate").value).format("L HH:mm:ss"),
        title: title,
        hexColor: hexColor
      }
      ]
    });
    document.getElementById("eventForm").style.display = "none";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
  }

  editEvent = () => {
    let stateEventsCopy = [...this.state.events];
    stateEventsCopy[editIndex].start = document.getElementById("editStartDate").value
    stateEventsCopy[editIndex].end = document.getElementById("editEndDate").value

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

  openForm = () => {
    document.getElementById("eventForm").style.display = "flex";
  }

  setDate = () => {
    if (document.getElementById("startDate").value === "") {
      document.getElementById("eventForm").style.display = "none";
    }
  }

  closeForm = () => {
    document.getElementById("eventForm").style.display = "none";
    document.getElementById("editEventForm").style.display = "none";
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <div className="teamSelector">
            <TeamMenu />
            <input type="button" value="Get Rota" />
          </div>
        </header>

        <main className="main">
          <form className="popupForm" id="eventForm" onSubmit={this.saveEvent}>
            <h2>Add Entry</h2>
            <label>Name</label>
            <EngineerMenu />
            <label>Start Date</label>
            <input type="text" id="startDate" onClick={this.setDate} required></input>
            <p className="inputInfo">Click above and then use mouse to drag select date range</p>
            <label>End Date</label>
            <input type="text" id="endDate" required></input>
            <button type="submit">Save</button>
            <input type="button" value="Close" onClick={this.closeForm} />
          </form>
          <form className="popupForm" id="editEventForm">
            <h2>Edit Entry</h2>
            <label>Start Date</label>
            <input type="text" id="editStartDate"></input>
            <label>End Date</label>
            <input type="text" id="editEndDate"></input>
            <input type="button" value="Save" onClick={this.editEvent} />
            <input type="button" value="Delete" onClick={this.deleteEvent} />
            <input type="button" value="Close" onClick={this.closeForm} />
          </form>
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
          <input type="button" value="Add Entry to Calendar" className="addEventButton" onClick={this.openForm} />
          <input type="button" value="Add Engineer to Team" className="addEventButton" />
        </div>

      </div>
    );
  }
}

function TeamMenu() {
  return (
    <select id="teamSelection">
      <option value="" defaultValue hidden>Choose team</option>
      {teams.map((team, index) => <option key={index} value={team}>{team}</option>)}
    </select>
  );
}

function EngineerMenu() {
  return (
    <select id="title">
      <option value="" defaultValue hidden>Choose engineer</option>
      {engineers.map((item, index) => <option key={index} value={item.name}>{item.name}</option>)}
    </select>
  );
}

export default App;
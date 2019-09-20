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

  onSelectEvent = ({ start, end, id }) => {
    let index = this.state.events.findIndex(event => event.id === id);
    alert(`${JSON.stringify(this.state.events[index])}`);
  }

  onSelectSlot = ({ start, end }) => {
    let startDate = document.getElementById("startDate");
    let endDate = document.getElementById("endDate");

    startDate.value = moment(start).format("L HH:mm:ss");
    endDate.value = moment(end).add(23.9999, 'hours').format("L HH:mm:ss");
    document.getElementById("eventForm").style.display = "flex";
  }

  saveEvent = () => {
    let startDate = moment(document.getElementById("startDate").value).format("L HH:mm:ss");
    let endDate = moment(document.getElementById("endDate").value).format("L HH:mm:ss");
    let title = document.getElementById("title").value;
    let hexColor = document.getElementById("hexColor").value;

    this.setState({
      events: [...this.state.events,
      {
        id: new Date(),
        start: startDate,
        end: endDate,
        title: title,
        hexColor: hexColor
      }
      ]
    }, );
    document.getElementById("eventForm").style.display = "none";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
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
    if(document.getElementById("startDate").value === "") {
      document.getElementById("eventForm").style.display = "none";
    }
  }

  closeForm = () => {
    document.getElementById("eventForm").style.display = "none";
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
          <form className="popupForm" id="eventForm">
            <label>Engineer: <input type="text" id="title"></input></label>
            <label>Start Date: <input type="text" id="startDate" onClick={this.setDate}></input></label>
            <label>End Date: <input type="text" id="endDate"></input></label>
            <label>Color: <input type="text" id="hexColor"></input></label>
            <input type="button" value="Save" onClick={this.saveEvent} />
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
  return(
    <select>
      <option value="" selected disabled hidden>Choose team</option>
      {teams.map(team => <option value={team}>{team}</option>)}
    </select>
  );
}

export default App;

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
    }, this.getActive);
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
    let active = this.state.events.filter(event => event.title === "test");
    console.log(JSON.stringify(active));
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <form>
            <label>Title: <input type="text" id="title"></input></label>
            <label>Start: <input type="text" id="startDate" readOnly></input></label>
            <label>End: <input type="text" id="endDate" readOnly></input></label>
            <label>Hex Color: <input type="text" id="hexColor"></input></label>
            <input type="button" value="Save" onClick={this.saveEvent} />
          </form>
        </header>

        <main className="main">
          <Calendar
            defaultDate={new Date()}
            defaultView="month"
            events={this.state.events}
            localizer={localizer}
            views={['month']}
            onSelectEvent={this.onSelectEvent}
            resizable
            selectable
            onSelectSlot={this.onSelectSlot}
            eventPropGetter={(this.eventStyleGetter)}
          />
        </main>

        <div className="side">

        </div>

      </div>
    );
  }
}

export default App;

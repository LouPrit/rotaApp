import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import './App.css';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale('en-gb', {
  week: {
    dow: 1,
    doy: 1,
  },
});

let formats = {
  dateFormat: 'DD'
}

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

class App extends Component {
  state = {
    events: [
      {
        start: new Date(),
        end: new Date(moment().add(1, "days")),
        title: "Some title"
      },
      {
        start: new Date(),
        end: new Date(moment().add(2, "days")),
        title: "Some titles"
      }
    ]
  };

  onEventResize = ({ start, end }) => {
    console.log(this.state.events[1].start);
    this.setState(state => {
      state.events[1].start = start;
      state.events[1].end = end;
      return { events: state.events };
    });
  };

  onEventDrop = ({ event, start, end, allDay }) => {
    console.log(this.state.events[1].end);
  };

  onSelectEvent = ({ event, start, end, allDay }) => {
    console.log(`Start: ${start}
End: ${end}`);
  }

  render() {
    return (
      <div className="App">
        <header className="header">

        </header>

        <main className="main">
        <DnDCalendar
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          localizer={localizer}
          onEventDrop={this.onEventDrop}
          onEventResize={this.onEventResize}
          onDoubleClickEvent={this.onSelectEvent}
          resizable
          formats={formats}
        />
        </main>

        <div className="side">

        </div>

      </div>
    );
  }
}

export default App;

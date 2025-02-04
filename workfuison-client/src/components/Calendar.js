import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';  // Import the Calendar component and localizer
import 'react-big-calendar/lib/css/react-big-calendar.css';  // Import the necessary CSS
import moment from 'moment';  // Import Moment.js to use as a localizer

// Localizer for react-big-calendar to work with moment.js
const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const buttonStyle = {
    marginLeft:" 7px", 
    marginBottom:"8px", 
    padding: "2px 4px",  
    fontSize: "10px",    
    color: 'white',        
    backgroundColor: "#19394D", 
    border: "none",       
    borderRadius: "5px",  
    cursor: "pointer",     
    transition: "background-color 0.3s ease"
  };

  // Sample data: Events that you want to display on the calendar
  const [events, setEvents] = useState([
    {
      title: 'Meeting with Client',
      start: new Date(2024, 11, 10, 10, 0),  // Event start date (Dec 10, 2024, 10:00 AM)
      end: new Date(2024, 11, 10, 11, 0),    // Event end date (Dec 10, 2024, 11:00 AM)
      description: 'Discuss project updates with the client.',
    },
    {
      title: 'Team Lunch',
      start: new Date(2024, 11, 11, 12, 30), // Event start date (Dec 11, 2024, 12:30 PM)
      end: new Date(2024, 11, 11, 13, 30),   // Event end date (Dec 11, 2024, 1:30 PM)
      description: 'Monthly team bonding lunch.',
    },
  ]);

  // Function to handle event creation (when user clicks on a time slot on the calendar)
  const handleSelectSlot = ({ start, end }) => {
    const title = prompt('Enter the title for the event:');  // Prompt the user for the event title
    if (title) {
      setEvents([...events, { title, start, end }]);  // Add the new event to the state
    }
  };

  // Function to handle event updates (when user clicks an event on the calendar)
  const handleSelectEvent = (event) => {
    const newTitle = prompt('Edit the event title:', event.title);  // Prompt the user to edit the title
    if (newTitle) {
      const updatedEvents = events.map((existingEvent) =>
        existingEvent === event ? { ...existingEvent, title: newTitle } : existingEvent
      );
      setEvents(updatedEvents);  // Update the event title in the state
    }
  };

  // Function to handle event deletion (when user clicks the delete button)
  const handleDeleteEvent = (event) => {
    const confirmed = window.confirm('Are you sure you want to delete this event?');  // Confirm deletion
    if (confirmed) {
      const updatedEvents = events.filter((existingEvent) => existingEvent !== event);  // Remove the event from state
      setEvents(updatedEvents);  // Update the state with the new events list
    }
  };

  return (
    <div>
      <h2>My Schedule</h2>
      {/* Calendar component */}
      <Calendar
        localizer={localizer}  // Set the localizer for the calendar (using moment.js)
        events={events}  // Pass the events data to the calendar
        startAccessor="start"  // Specify the key for event start date
        endAccessor="end"      // Specify the key for event end date
        style={{ height: 500 }}  // Set the height of the calendar
        selectable={true}  // Allow selecting time slots on the calendar
        onSelectSlot={handleSelectSlot}  // Handle the event when a user clicks a time slot
        onSelectEvent={handleSelectEvent}  // Handle the event when a user clicks an existing event
        eventPropGetter={(event) => ({
          style: {backgroundColor: '#3174ad', color: 'white', borderRadius: '5px'}, // Style the events with custom colors
        })}
        components={{
          event: ({ event }) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',flex:'1'}}>
                {event.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the event click from triggering
                  handleDeleteEvent(event);
                }}
                style={buttonStyle}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default MyCalendar;

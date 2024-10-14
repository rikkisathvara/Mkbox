import React, { useState, useEffect } from "react";
import './App.css'; // Ensure your CSS styles are imported here

// Function to generate time options (5-minute intervals)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const time = `${hour}:${minute.toString().padStart(2, '0')} ${minute < 30 ? 'AM' : 'PM'}`;
      times.push(time);
    }
  }
  return times;
};

// Function to sort entries based on box number
const sortEntries = (entries) => {
  return entries.sort((a, b) => (a.boxNumber > b.boxNumber ? 1 : -1));
};

function App() {
  const getInitialEntries = () => {
    const storedEntries = localStorage.getItem("entries");
    return storedEntries ? JSON.parse(storedEntries) : [
      { id: 1, name: "John Doe", date: "15-10-2024", timeSlot: "10:00 AM - 11:00 AM", boxNumber: "1" },
      { id: 2, name: "Jane Smith", date: "16-10-2024", timeSlot: "11:00 AM - 12:00 PM", boxNumber: "2" },
      { id: 3, name: "Michael Lee", date: "17-10-2024", timeSlot: "1:00 PM - 2:00 PM", boxNumber: "1" },
    ];
  };

  const [entries, setEntries] = useState(getInitialEntries());
  const [newEntry, setNewEntry] = useState({ id: null, name: "", date: "", timeStart: "", timeEnd: "", boxNumber: "" });
  const [isEditing, setIsEditing] = useState(false);
  const timeOptions = generateTimeOptions();

  useEffect(() => {
    const sortedEntries = sortEntries(entries);
    localStorage.setItem("entries", JSON.stringify(sortedEntries));
    setEntries(sortedEntries); // Update state with sorted entries
  }, [entries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const addEntry = () => {
    if (newEntry.name && newEntry.date && newEntry.timeStart && newEntry.timeEnd && newEntry.boxNumber) {
      if (newEntry.timeStart >= newEntry.timeEnd) {
        alert("Start time must be less than end time.");
        return;
      }

      const updatedEntries = [
        ...entries,
        {
          ...newEntry,
          id: entries.length + 1,
          timeSlot: `${newEntry.timeStart} - ${newEntry.timeEnd}`,
        },
      ];

      // Sort entries after adding a new one
      setEntries(sortEntries(updatedEntries));
      setNewEntry({ id: null, name: "", date: "", timeStart: "", timeEnd: "", boxNumber: "" });
    }
  };

  const editEntry = (id) => {
    const entryToEdit = entries.find((entry) => entry.id === id);
    setNewEntry({
      ...entryToEdit,
      timeStart: entryToEdit.timeSlot.split(" - ")[0],
      timeEnd: entryToEdit.timeSlot.split(" - ")[1],
    });
    setIsEditing(true);
  };

  const saveEdit = () => {
    const updatedEntries = entries.map((entry) =>
      entry.id === newEntry.id
        ? {
          ...newEntry,
          timeSlot: `${newEntry.timeStart} - ${newEntry.timeEnd}`,
        }
        : entry
    );

    if (newEntry.timeStart >= newEntry.timeEnd) {
      alert("Start time must be less than end time.");
      return;
    }

    // Sort entries after editing
    setEntries(sortEntries(updatedEntries));
    setNewEntry({ id: null, name: "", date: "", timeStart: "", timeEnd: "", boxNumber: "" });
    setIsEditing(false);
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    // Sort entries after deletion
    setEntries(sortEntries(updatedEntries));
  };

  return (
    <div className="App">
      <h1>Booking Slot</h1>

      <div className="form-container">
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newEntry.name}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="number"
            name="mobile"
            max={10}
            placeholder="Mobile Number"
            value={newEntry.mobile}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="date"
            name="date"
            value={newEntry.date}
            onChange={handleInputChange}
            className="input-field"
          />
          <select name="timeStart" value={newEntry.timeStart} onChange={handleInputChange} className="input-field">
            <option value="">Start Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <select name="timeEnd" value={newEntry.timeEnd} onChange={handleInputChange} className="input-field">
            <option value="">End Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <select name="boxNumber" value={newEntry.boxNumber} onChange={handleInputChange} className="input-field">
            <option value="">Select Box Number</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <button onClick={isEditing ? saveEdit : addEntry} className="add-button">{isEditing ? 'Save' : 'Add'}</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Name</th>
            <th>Mobile Number</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Box Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.id}>
              <td>{index + 1}</td>
              <td>{entry.name}</td>
              <td>{entry.mobile}</td>
              <td>{entry.date}</td>
              <td>{entry.timeSlot}</td>
              <td>{entry.boxNumber}</td>
              <td>
                <button className="button" onClick={() => editEntry(entry.id)}>Edit</button>
                <button className="delete-button" onClick={() => deleteEntry(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

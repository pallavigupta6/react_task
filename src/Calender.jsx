import React, { useState } from "react";
import moment from "moment-timezone";
import SCHEDULED_TIMES from "./scheduledTime.json";

const TIMEZONES = [
  { label: "UTC", value: "UTC" },
  { label: "Indian Standard Time (IST)", value: "Asia/Kolkata" },
];

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(moment.utc().startOf("week"));
  const [selectedTimeZone, setSelectedTimeZone] = useState("UTC");
  const previousTimezone = React.useRef(selectedTimeZone);

  const handlePreviousWeek = () => {
    setSelectedDate(selectedDate.clone().subtract(1, "weeks"));
  };

  const handleNextWeek = () => {
    setSelectedDate(selectedDate.clone().add(1, "weeks"));
  };

  const handleTimeZoneChange = (event) => {
    previousTimezone.current = selectedTimeZone;
    setSelectedTimeZone(event.target.value);
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 1; i <= 5; i++) {
      days.push(selectedDate.clone().add(i, "days"));
    }

    return days;
  };

  const getTimeSlots = (day) => {
    console.info("getTimeSlots", previousTimezone.current, selectedTimeZone);
    const times = [];
    for (let i = 8; i <= 23; i++) {
      times.push(moment(day).clone().set({ hour: i, minute: 0 }).tz(selectedTimeZone));
      if (i < 23) {
        times.push(moment(day).clone().set({ hour: i, minute: 30 }).tz(selectedTimeZone));
      }
    }
    return times;
  };

  const selectedTimeSlots = SCHEDULED_TIMES.map((time) => `${time.date} ${time.time}`);

  return (
    <div className='calendar '>
      {/* Week heading with selected date */}
      <div className='calendar-heading'>Week of {selectedDate.format("YYYY-MM-DD")}</div>

      {/* Swipe buttons */}
      <div className='swipe-buttons d-flex justify-content-between'>
        <button onClick={handlePreviousWeek}>Previous Week</button>
        <button onClick={handleNextWeek}>Next Week</button>
      </div>

      {/* Time zone selection */}
      <div className='time-zone '>
        <select value={selectedTimeZone} onChange={handleTimeZoneChange}>
          {TIMEZONES.map((timezone) => (
            <option key={timezone.value} value={timezone.value}>
              {timezone.label}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar grid with two columns */}
      <div className='col-12'>
        {getWeekDays().map((day) => (
          <div className='row d-flex mb-4' key={day.format()} style={{}}>
            <div className='day col-2'>
              <div className='day-header' style={{ display: "flex", flexDirection: "column" }}>
                <span>{moment.tz(day, selectedTimeZone).format("dddd")}</span>
                <span>{moment.tz(day, selectedTimeZone).format("M/DD")}</span>
              </div>
            </div>
            <div className=' col-8 d-flex flex-wrap' style={{ gap: " 8px 24px" }}>
              {day.isSameOrAfter(moment(), "day") ? (
                getTimeSlots(day).map((time) => (
                  <div className='d-flex flex-shrink-0' key={time.format()} style={{ gap: "4px" }}>
                    <input
                      checked={selectedTimeSlots.includes(time.format("YYYY-MM-DD HH:mm"))}
                      type='checkbox'
                    />
                    <label style={{ marginLeft: "5px" }}>{time.format("hh:mm A")}</label>
                  </div>
                ))
              ) : (
                <div>PAST</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Calendar;

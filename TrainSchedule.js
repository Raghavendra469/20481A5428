import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrainSchedule = () => {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    const fetchTrainSchedule = async () => {
      try {
        const response = await axios.get('http://104.211.219.98/train/trains');
        const trainsData = response.data;
        const currentTime = new Date();
        const next12Hours = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000);

        const filteredTrains = trainsData.filter((train) => {
          const departureTime = new Date();
          departureTime.setHours(train.departureTime.Hours);
          departureTime.setMinutes(train.departureTime.Minutes);
          departureTime.setSeconds(train.departureTime.Seconds);
          const isDepartingInNext12Hours =
            departureTime >= currentTime && departureTime <= next12Hours;
          const isDepartingInNext30Minutes = departureTime <= new Date();

          return isDepartingInNext12Hours && !isDepartingInNext30Minutes;
        });

        const sortedTrains = filteredTrains.sort((a, b) => {
          if (a.price.AC === b.price.AC) {
            if (a.price.sleeper === b.price.sleeper) {
              return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
            }
            return a.price.sleeper - b.price.sleeper;
          }
          return a.price.AC - b.price.AC;
        });

        setTrains(sortedTrains);
      } catch (error) {
        console.error('Failed to fetch train schedule:', error.message);
      }
    };

    fetchTrainSchedule();
  }, []);

  return (
    <div>
      <h2>Train Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Train Name</th>
            <th>Train Number</th>
            <th>Departure Time</th>
            <th>Sleeper Availability</th>
            <th>AC Availability</th>
            <th>Sleeper Price</th>
            <th>AC Price</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train) => (
            <tr key={train.trainNumber}>
              <td>{train.trainName}</td>
              <td>{train.trainNumber}</td>
              <td>
                {train.departureTime.Hours}:{train.departureTime.Minutes}:
                {train.departureTime.Seconds}
              </td>
              <td>{train.seatsAvailable.sleeper}</td>
              <td>{train.seatsAvailable.AC}</td>
              <td>{train.price.sleeper}</td>
              <td>{train.price.AC}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainSchedule;

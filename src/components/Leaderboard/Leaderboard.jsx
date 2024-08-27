import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ entries }) => {
  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      <ul>
        {entries.map((entry, index) => (
          <li key={index}>
            <span>{index + 1}. </span>
            <span>{entry.score} points</span>
            <span> - {entry.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;

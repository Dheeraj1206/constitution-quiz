
import React from 'react';
import './QuizPopup.css';

const QuizPopup = ({ question, options, onAnswer, showPlayMore, onPlayMore, isExpanded, onCancel, score }) => {
  return (
    <div className={`quiz-popup ${isExpanded ? 'expanded' : ''}`}>
      <div className="quiz-content">
        {isExpanded && <p className="score">Score: {score}</p>}  
        <p>{question}</p>
        <div className="options">
          {options.map((option, index) => (
            <button key={index} onClick={() => onAnswer(option)}>
              {option}
            </button>
          ))}
        </div>
        {showPlayMore && !isExpanded && (
          <button className="play-more" onClick={onPlayMore}>
            Play More
          </button>
        )}
        {isExpanded && (
          <button className="cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPopup;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBox from './components/SearchBox/SearchBox';
import QuizPopup from './components/QuizPopup/QuizPopup';
import Leaderboard from './components/Leaderboard/Leaderboard';
import './App.css';

const App = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlayMore, setShowPlayMore] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);  // Leaderboard state
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (showPopup && !isExpanded) {
      const id = setTimeout(() => {
        setShowPopup(false);
      }, 10000);
      setTimeoutId(id);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showPopup, isExpanded]);

  const fetchQuestion = async (query) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: `Generate a very easy question about ${query} with 2 multiple-choice options.`,
          max_tokens: 50,
          n: 1,
          stop: null,
          temperature: 0.5,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `sk-Wcli9aFXxOQLfv6ef-llVXdGDF_d0HJmbV2p3aaXj0T3BlbkFJwAuqSHhEwK436LRNGwq8wVIJ7M-DIQys1q4_ui9w0A`,
          },
        }
      );

      const aiResponse = response.data.choices[0].text.trim();
      const [q, ...opts] = aiResponse.split('\n').filter((line) => line);
      const correctAnswer = opts[0].split(':')[1].trim();

      setQuestion(q);
      setOptions(opts.map((opt) => opt.split(':')[1].trim()));
      setAnswer(correctAnswer);
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion('What is the first article of the constitution?');
      setOptions(['Preamble', 'Article 1']);
      setAnswer('Article 1');
    }
  };

  const handleSearch = (query) => {
    if (query.toLowerCase().includes('constitution')) {
      fetchQuestion(query);
      setShowPopup(true);
    }
  };

  const handleAnswer = (selectedOption) => {
    if (selectedOption === answer) {
      alert('Correct!');
      setScore(score + 2); 
    } else {
      alert(`Wrong! The correct answer is: ${answer}`);
    }
    setShowPlayMore(true);
    if (timeoutId) clearTimeout(timeoutId);
  };

  const handlePlayMore = () => {
    setIsExpanded(true);
    setShowPlayMore(false);
    fetchQuestion('constitution'); 
  };

  const handleCancel = () => {
    setShowPopup(false);
    setIsExpanded(false);
    updateLeaderboard(score);  
    setScore(0);  
  };

  const updateLeaderboard = (newScore) => {
    const newEntry = { score: newScore, date: new Date().toLocaleString() };
    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 5);
    setLeaderboard(updatedLeaderboard);
  };

  return (
    <div className="App">
      <SearchBox onSearch={handleSearch} />
      {showPopup && (
        <QuizPopup
          question={question}
          options={options}
          onAnswer={handleAnswer}
          showPlayMore={showPlayMore}
          onPlayMore={handlePlayMore}
          isExpanded={isExpanded}
          onCancel={handleCancel}
          score={score}  
        />
      )}
      <Leaderboard entries={leaderboard} />
    </div>
  );
};

export default App;

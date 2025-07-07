import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TestMenu.css';
import { TestItem } from '../models/Question';

export default function TestMenu() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/tests/test-list.json')
      .then((res) => res.json())
      .then(setTests);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < tests.length) {
          navigate(`/test/${idx + 1}`);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tests, navigate]);

  return (
    <div className="test-menu">
      <h1>Available Tests</h1>
      <div className="test-cards">
        {tests.map((test) => (
          <div
            key={test.id}
            className={`test-card ${test.difficulty}`}
            onClick={() => navigate(`/test/${test.id + 1}`)}
          >
            <h2>{test.name}</h2>
            <p>Difficulty: <b>{test.difficulty}</b></p>
          </div>
        ))}
      </div>
    </div>
  );
}

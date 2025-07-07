import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TestMenu.css';

interface TestItem {
  id: number;
  name: string;
  filename: string;
  difficulty: string;
}

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
      if (/^[0-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10);
        navigate(`/test/${idx}`);
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
            onClick={() => navigate(`/test/${test.id}`)}
          >
            <h2>{test.name}</h2>
            <p>Difficulty: <b>{test.difficulty}</b></p>
          </div>
        ))}
      </div>
    </div>
  );
}

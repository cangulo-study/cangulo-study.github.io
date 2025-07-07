import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Question, AnsweredQuestion } from '../Models/Question';

export default function TestReview() {
  const location = useLocation();
  const navigate = useNavigate();
  // Use a local TestReviewState interface for state
  interface TestReviewState {
    questions: Question[];
    answers: AnsweredQuestion[];
    testnumber?: string;
  }
  const state = location.state as TestReviewState | undefined;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (state && state.testnumber) {
          navigate(`/test/${state.testnumber}`);
        } else {
          navigate('/');
        }
      } else if (e.key === 'Enter') {
        navigate('/result', { state });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, state]);

  if (!state) {
    return <div>No review data. <button onClick={() => navigate('/')}>Back to Menu</button></div>;
  }

  const { questions, answers, testnumber } = state;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2>Review your answers</h2>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <button onClick={() => testnumber ? navigate(`/test/${testnumber}`) : navigate('/')}>Back to Test</button>
        <button onClick={() => navigate('/result', { state })}>Send the answers</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Q#</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>A#</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Question Text</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Answer Selected</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>To Review?</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, idx) => {
            const answer = answers[idx];
            return (
              <tr key={question.id}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{idx + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{answer ? answer.selectedOption.toUpperCase() : '-'}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{question.question}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{answer ? question.options[answer.selectedOption] : '-'}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{answer && answer.toReview ? 'yes 🔎' : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ color: '#888', fontSize: 14, marginTop: 16 }}>Press <b>Esc</b> to go back, <b>Enter</b> to send</div>
    </div>
  );
}

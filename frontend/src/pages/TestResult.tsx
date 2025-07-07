import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TestResultState } from '../models/Question';


export default function TestResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as TestResultState | undefined;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        navigate('/');
      } else if (e.key.toLowerCase() === 'r') {
        if (state && state.testnumber) {
          navigate(`/test/${state.testnumber}`);
        } else {
          navigate('/');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, state]);


  if (!state) {
    return <div>No result data. <button onClick={() => navigate('/')}>Back to Menu</button></div>;
  }

  const { questions, answers } = state;
  const total = questions.length;
  // Calculate score from AnsweredQuestion[]
  const score = questions.reduce((acc, q, idx) => acc + (answers[idx]?.selectedOption === q.correctOption ? 1 : 0), 0);
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  // Find mistakes
  const mistakes = questions
    .map((q, idx) => {
      const answer = answers[idx];
      return {
        idx,
        question: q.question,
        yourAnswer: answer ? q.options[answer.selectedOption] : '-',
        correct: q.options[q.correctOption],
        isCorrect: answer && answer.selectedOption === q.correctOption,
        toReview: answer && answer.toReview
      };
    })
    .filter(row => !row.isCorrect);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2>Test Result</h2>
      <div style={{ fontSize: 20, margin: '1rem 0' }}>
        <b>Score:</b> {score} / {total} <br />
        <b>Mark:</b> {percent}%
      </div>
      {mistakes.length > 0 && (
        <>
          <h3 style={{ color: '#c00', marginTop: 32 }}>❌ Errors</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>Q#</th>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>Q text</th>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>Your answer</th>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>Correct answer</th>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>Marked for review?</th>
              </tr>
            </thead>
            <tbody>
              {mistakes.map(row => (
                <tr key={row.idx}>
                  <td style={{ border: '1px solid #ccc', padding: 8 }}>{row.idx + 1}</td>
                  <td style={{ border: '1px solid #ccc', padding: 8 }}>{row.question}</td>
                  <td style={{ border: '1px solid #ccc', padding: 8 }}>{row.yourAnswer}</td>
                  <td style={{ border: '1px solid #ccc', padding: 8 }}>{row.correct}</td>
                  <td style={{ border: '1px solid #ccc', padding: 8 }}>{row.toReview ? 'yes' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
        <button onClick={() => navigate('/')}>Back to Menu</button>
        <button onClick={() => navigate(`/test/${state.testnumber}`)}>Retry Test</button>
      </div>
    </div>
  );
}

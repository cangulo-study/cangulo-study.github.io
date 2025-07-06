import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TestData, AnsweredQuestion } from '../Models/Question';

export default function TestPage() {
  const { testnumber } = useParams<{ testnumber: string }>();
  const [test, setTest] = useState<TestData | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  // const [filename, setFilename] = useState<string | null>(null);
  // Removed showPopup and reviewMode
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch test-list.json to map testnumber to filename
    if (testnumber) {
      fetch('/tests/test-list.json')
        .then(res => res.json())
        .then((list) => {
          const idx = parseInt(testnumber, 10) - 1;
          if (idx >= 0 && idx < list.length) {
            // setFilename(list[idx].filename);
            fetch(`/tests/${list[idx].filename}`)
              .then((res) => res.json())
              .then(setTest);
          }
        });
    }
  }, [testnumber]);

  // ESC to go back to menu, a/b/c/d to select option and auto-next
  const q = test ? test.questions[current] : null;
  useEffect(() => {
    if (!test || !q) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
      if (selected === null && ['a','b','c','d'].includes(e.key.toLowerCase())) {
        const key = e.key.toLowerCase();
        setSelected(key);
        setAnswers((prev) => {
          const copy = [...prev];
          copy[current] = {
            id: q.id,
            selectedOption: key,
            toReview: prev[current]?.toReview || false,
          };
          return copy;
        });
        if (key === q.correctOption) setScore((s) => s + 1);
        if (current + 1 < test.questions.length) {
          setCurrent((c) => c + 1);
          setSelected(null);
        } else {
          // Navigate directly to review page
          navigate('/review', { state: { questions: test.questions, answers: [...answers.slice(0, current), { id: q.id, selectedOption: key, toReview: answers[current]?.toReview || false }], testnumber } });
        }
      } else if (e.key.toLowerCase() === 'r') {
        // Mark/unmark for review
        setAnswers((prev) => {
          const copy = [...prev];
          copy[current] = {
            id: q.id,
            selectedOption: prev[current]?.selectedOption || '',
            toReview: !prev[current]?.toReview,
          };
          return copy;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, selected, current, test, q, answers, testnumber]);

  if (!test || (!q && !finished)) return <div>Loading...</div>;
  if (finished && test) {
    // Navigate to result page with state
    navigate('/result', { state: { questions: test.questions, answers, score, testnumber } });
    return null;
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}>
      <button
        style={{ position: 'absolute', left: 24, top: 24, background: '#f5f5f5', border: '1px solid #ccc', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500 }}
        onClick={() => navigate('/')}
      >
        ← Back to Test List
      </button>
      {/* Show Test Set Number in the top right */}
      {testnumber && (
        <div style={{ position: 'absolute', right: 24, top: 24, fontWeight: 600, fontSize: 16, color: '#555' }}>
          Test Set #{testnumber}
        </div>
      )}
      <h2 style={{ marginTop: 40 }}>Question {current + 1} of {test.questions.length}</h2>
      {q && <>
        <p style={{ fontWeight: 500 }}>{q.question}</p>
        <div style={{ margin: '1rem 0' }}>
          {Object.entries(q.options).map(([key, value]) => (
            <button
              key={key}
              style={{
                display: 'block',
                width: '100%',
                margin: '0.5rem 0',
                padding: '0.75rem',
                borderRadius: 8,
                border: selected === key ? '2px solid #007bff' : '1px solid #ccc',
                background: selected === key ? '#e7f1ff' : '#f9f9f9',
                cursor: 'pointer',
                fontWeight: 500
              }}
              onClick={() => {
                setSelected(key);
                setAnswers((prev) => {
                  const copy = [...prev];
                  copy[current] = {
                    id: q.id,
                    selectedOption: key,
                    toReview: prev[current]?.toReview || false,
                  };
                  return copy;
                });
                if (key === q.correctOption) setScore((s) => s + 1);
                if (current + 1 < test.questions.length) {
                  setCurrent((c) => c + 1);
                  setSelected(null);
                } else {
                  // Navigate directly to review page
                  navigate('/review', { state: { questions: test.questions, answers: [...answers.slice(0, current), { id: q.id, selectedOption: key, toReview: answers[current]?.toReview || false }], testnumber } });
                }
              }}
              disabled={selected !== null}
            >
              {key.toUpperCase()}: {value}
            </button>
          ))}
        </div>
        {selected !== null && (
          <button
            style={{ marginTop: 16 }}
            onClick={() => {
              if (q && selected === q.correctOption) setScore((s) => s + 1);
              if (current + 1 < test.questions.length) {
                setCurrent((c) => c + 1);
                setSelected(null);
              } else {
                setFinished(true);
                setSelected(null);
              }
            }}
          >
            {current + 1 < test.questions.length ? 'Next' : 'Finish'}
          </button>
        )}
        {/* Mark for review indicator and instructions */}
        <div style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
          <span>Press <b>R</b> to mark/unmark this question for review. {answers[current]?.toReview ? <b style={{ color: '#c00' }}>Marked for review</b> : ''}</span>
        </div>
      </>}
    </div>
  );
}

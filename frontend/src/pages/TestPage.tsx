import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnsweredQuestion, Question } from '../Models/Question';

export default function TestPage() {
  const { setId } = useParams<{ setId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (setId) {
      fetch('/tests/test-list.json')
        .then(res => res.json())
        .then((list) => {
          const idx = parseInt(setId, 10) - 1;
          if (idx >= 0 && idx < list.length) {
            fetch(`/tests/${list[idx].filename}`)
              .then((res) => res.json())
              .then((data) => {
                setQuestions(data.questions);
              });
          }
        });
    }
  }, [setId]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!questions[current]) return;
    const q = questions[current];

    if (e.key === 'Escape') {
      navigate('/');
    } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
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
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        navigate('/review', { state: { questions, answers, setId } });
      }
    } else if (e.key.toLowerCase() === 'r') {
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [questions, current, navigate]);

  if (!questions) return <div>Loading...</div>;

  const q = questions[current];

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}>
      <button
        style={{ position: 'absolute', left: 24, top: 24, background: '#f5f5f5', border: '1px solid #ccc', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500 }}
        onClick={() => navigate('/')}
      >
        ← Back to Test List
      </button>
      {setId && (
        <div style={{ position: 'absolute', right: 24, top: 24, fontWeight: 600, fontSize: 16, color: '#555' }}>
          Test Set #{setId}
        </div>
      )}
      <h2 style={{ marginTop: 40 }}>Question {current + 1} of {questions.length}</h2>
      {q && (
        <>
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
                  if (current + 1 < questions.length) {
                    setCurrent((c) => c + 1);
                    setSelected(null);
                  } else {
                    navigate('/review', { state: { questions, answers, setId } });
                  }
                }}
                disabled={selected !== null}
              >
                {key.toUpperCase()}: {value}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
            <span>Press <b>r</b> to mark/unmark this question for review. {answers[current]?.toReview ? <b style={{ color: '#c00' }}>Marked for review</b> : ''}</span>
          </div>
        </>
      )}
    </div>
  );
}

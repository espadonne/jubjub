// src/App.jsx
import { useEffect, useState } from 'react';
import { Markov } from './markov';

export default function App() {
  const [markov, setMarkov] = useState(null);
  const [word, setWord] = useState('');
  const [order, setOrder] = useState(2);
  const [length, setLength] = useState(8);
  const [temperature, setTemperature] = useState(1.0);
  const [seed, setSeed] = useState('');
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    fetch('/corpus.txt')
      .then(res => {
        console.log('Corpus fetch status:', res.status);
        return res.text();
      })
      .then(text => {
        const lines = text.split(/\r?\n/).filter(Boolean);
        console.log('Loaded corpus lines:', lines.length);
        const mk = new Markov(order);
        mk.train(lines);
        setMarkov(mk);
      })
      .catch(err => console.error('Failed to load corpus:', err));
  }, []);

  const generate = () => {
    if (!markov) return;
    setIsBouncing(true);
    setWord(markov.generate(length, seed, temperature));
    setTimeout(() => setIsBouncing(false), 500);
  };

  return (
    <>
    <div className='title'>
      <h1>JubJubWord</h1>
      <h2>powered by a jub jub bird</h2>
    </div>
    <div className="container">
      <div className="controls">
        <label>
          Order:
          <input
            type="number"
            min="1" max="6"
            value={order}
            onChange={e => setOrder(Number(e.target.value))}
          />
        </label>
        <label>
          Length:
          <input
            type="number"
            min="3" max="20"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
          />
        </label>

        <label>
          Temperature:
          <input
            type="number"
            step="0.05" min="0.5" max="2.0"
            value={temperature}
            onChange={e => setTemperature(Number(e.target.value))}
          />
        </label>

        <label>
          Seed:
          <input
            type="text"
            placeholder="(optional)"
            value={seed}
            onChange={e => setSeed(e.target.value)}
          />
        </label>

        <button onClick={generate}>Generate</button>
      </div>

      <button
        className={`bird ${isBouncing ? 'bounce' : ''}`}
        onClick={generate}
        aria-label="Generate"
      >
        🐦
      </button>

      {word && <h2 className="word">{word}</h2>}
    </div>
    </>
  );
}
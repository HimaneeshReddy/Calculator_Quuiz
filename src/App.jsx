import { useState, useEffect } from "react";
import "./App.css";

/* ---------- GAME LOGIC ---------- */
function getQuestion(level) {
  const max = level * 10;
  const a = Math.floor(Math.random() * max);
  const b = Math.floor(Math.random() * max);
  const ops = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let answer;
  if (op === "+") answer = a + b;
  if (op === "-") answer = a - b;
  if (op === "*") answer = a * b;

  return { a, b, op, answer };
}

/* ---------- MAIN APP ---------- */
function App() {
  const [mode, setMode] = useState("calculator");

  /* Calculator state */
  const [display, setDisplay] = useState("");

  /* Game state */
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(10);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [q, setQ] = useState(getQuestion(1));

  /* ---------- GAME TIMER ---------- */
  useEffect(() => {
    if (mode !== "game" || gameOver) return;

    if (time === 0) {
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, mode, gameOver]);

  /* ---------- CALCULATOR ---------- */
  const calcClick = (val) => setDisplay(display + val);
  const calcClear = () => setDisplay("");
  const calcResult = () => {
    try {
      setDisplay(eval(display).toString());
    } catch {
      setDisplay("Error");
    }
  };

  /* ---------- GAME ---------- */
  const checkAnswer = () => {
    if (Number(input) === q.answer) {
      setScore(score + 1);
      setLevel(level + 1);
      setTime(10);
      setQ(getQuestion(level + 1));
    }
    setInput("");
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setTime(10);
    setGameOver(false);
    setQ(getQuestion(1));
  };

  /* ---------- UI ---------- */
  if (mode === "game") {
    return (
      <div className="container">
        <button className="back" onClick={() => setMode("calculator")}>
          ⬅ Back to Calculator
        </button>

        <div className="game">
          {gameOver ? (
            <>
              <h2>Game Over 😢</h2>
              <p>Score: {score}</p>
              <button onClick={restartGame}>Play Again</button>
            </>
          ) : (
            <>
              <h2>Math Game 🎮</h2>

              <div className="stats">
                <span>Level: {level}</span>
                <span>Score: {score}</span>
                <span>Time: {time}s</span>
              </div>

              <div className="question">
                {q.a} {q.op} {q.b} = ?
              </div>

              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Answer"
              />

              <button onClick={checkAnswer}>Submit</button>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ---------- CALCULATOR UI ---------- */
  return (
    <div className="calculator">
      <h2>Calculator</h2>

      <input className="display" value={display} readOnly />

      <div className="buttons">
        <button onClick={() => calcClick("7")}>7</button>
        <button onClick={() => calcClick("8")}>8</button>
        <button onClick={() => calcClick("9")}>9</button>
        <button onClick={() => calcClick("/")}>÷</button>

        <button onClick={() => calcClick("4")}>4</button>
        <button onClick={() => calcClick("5")}>5</button>
        <button onClick={() => calcClick("6")}>6</button>
        <button onClick={() => calcClick("*")}>×</button>

        <button onClick={() => calcClick("1")}>1</button>
        <button onClick={() => calcClick("2")}>2</button>
        <button onClick={() => calcClick("3")}>3</button>
        <button onClick={() => calcClick("-")}>−</button>

        <button onClick={() => calcClick("0")}>0</button>
        <button onClick={calcClear}>C</button>
        <button onClick={calcResult}>=</button>
        <button onClick={() => calcClick("+")}>+</button>
      </div>

      <button className="game-btn" onClick={() => setMode("game")}>
        🎮 Play Math Game
      </button>
    </div>
  );
}

export default App;

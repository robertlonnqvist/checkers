import React, { useState } from "react";
import "./App.css";

enum BoardProp {
  NONE,
  RED_QUEEN,
  RED_KING,
  BLACK_QUEEN,
  BLACK_KING,
  SUGGESTION,
}

enum Turn {
  RED,
  BLACK,
}

function App() {
  // prettier-ignore
  const [board, setBoard] = useState<BoardProp[]>([
    0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    3, 0, 3, 0, 3, 0, 3, 0,
    0, 3, 0, 3, 0, 3, 0, 3,
    3, 0, 3, 0, 3, 0, 3, 0,
  ]);
  const [turn, setTurn] = useState<Turn>(Turn.RED);
  const [active, setActive] = useState<number>(-1);

  const isTurn = (cell: BoardProp) => {
    switch (turn) {
      case Turn.RED:
        return cell === BoardProp.RED_QUEEN || cell === BoardProp.RED_KING;
      case Turn.BLACK:
        return cell === BoardProp.BLACK_QUEEN || cell === BoardProp.BLACK_KING;
    }
  };

  const isOther = (cell: BoardProp) => {
    switch (turn) {
      case Turn.RED:
        return cell === BoardProp.BLACK_QUEEN || cell === BoardProp.BLACK_KING;
      case Turn.BLACK:
        return cell === BoardProp.RED_QUEEN || cell === BoardProp.RED_KING;
    }
  };

  const isNotEdge = (index: number, x: 7 | 9) => {
    switch (turn) {
      case Turn.RED:
        return (x === 7 && index % 8 !== 0) || (x === 9 && index % 8 !== 7);
      case Turn.BLACK:
        return (x === 9 && index % 8 !== 0) || (x === 7 && index % 8 !== 7);
    }
  };

  const isNotJumpEdge = (index: number, x: 7 | 9) => {
    switch (turn) {
      case Turn.RED:
        return (
          (x === 7 && index % 8 !== 0 && index % 8 !== 1) ||
          (x === 9 && index % 8 !== 7 && index % 8 !== 6)
        );
      case Turn.BLACK:
        return (
          (x === 9 && index % 8 !== 0 && index % 8 !== 1) ||
          (x === 7 && index % 8 !== 7 && index % 8 !== 6)
        );
    }
  };

  const setBoardProp = (
    index: number,
    prop: BoardProp,
    expected: BoardProp | null = null
  ) => {
    if (index < board.length - 1) {
      if (expected === null || board[index] === expected) {
        board[index] = prop;
      }
    }
  };

  const setSuggestions = (index: number, x: 7 | 9) => {
    const multiplier = Turn.RED === turn ? 1 : -1;
    const target = board[index + x * multiplier];

    if (target === BoardProp.NONE) {
      if (isNotEdge(index, x)) {
        setBoardProp(
          index + x * multiplier,
          BoardProp.SUGGESTION,
          BoardProp.NONE
        );
      }
    } else if (isOther(target)) {
      if (isNotJumpEdge(index, x)) {
        setBoardProp(
          index + 2 * x * multiplier,
          BoardProp.SUGGESTION,
          BoardProp.NONE
        );
      }
    }
  };

  const resetSuggestions = () => {
    for (const key in board) {
      if (board[key] === BoardProp.SUGGESTION) {
        board[key] = BoardProp.NONE;
      }
    }
  };

  const onClick = (cell: BoardProp, index: number) => {
    if (index === active) {
      console.log("reset");
      setActive(-1);
      resetSuggestions();
      setBoard([...board]);
      return;
    }

    if (isTurn(cell)) {
      console.log("turn");
      setActive(index);
      setSuggestions(index, 7);
      setSuggestions(index, 9);
      setBoard([...board]);
      return;
    }

    if (active === -1) {
      return;
    }

    if (cell === BoardProp.SUGGESTION) {
      const diff = active - index;

      if (Math.abs(diff) === 14 || Math.abs(diff) === 18) {
        setBoardProp(index + diff / 2, BoardProp.NONE);
      }

      board[index] = board[active];
      board[active] = BoardProp.NONE;
      resetSuggestions();
      setBoard([...board]);
      setTurn(turn === Turn.RED ? Turn.BLACK : Turn.RED);
      setActive(-1);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Checkers</p>
      </header>

      <div className="App-wrapper">
        {board.map((cell, index) => (
          <div
            onClick={() => onClick(cell, index)}
            key={`${index}-${cell}`}
            className={`App-box ${
              cell === BoardProp.SUGGESTION ? "App-suggestion" : ""
            }${active === index ? "App-active" : ""} App-player${cell}`}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

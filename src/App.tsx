import { useState } from "react";
import "./App.css";

enum BoardProp {
  NONE,
  ONE_QUEEN,
  ONE_KING,
  TWO_QUEEN,
  TWO_KING,
  SUGGESTION,
}

enum Turn {
  ONE,
  TWO,
}

type PossibleMove = 7 | 9 | -7 | -9;

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
  const [turn, setTurn] = useState<Turn>(Turn.ONE);
  const [active, setActive] = useState<number>(-1);

  const onClick = (cell: BoardProp, index: number) => {
    const setBoardProp = (
      index: number,
      prop: BoardProp,
      expected: BoardProp | null = null
    ) => {
      if (
        index < board.length - 1 &&
        (expected === null || board[index] === expected)
      ) {
        board[index] = prop;
      }
    };

    const isPlayerTurn = (cell: BoardProp) => {
      if (turn === Turn.ONE) {
        return cell === BoardProp.ONE_QUEEN || cell === BoardProp.ONE_KING;
      }
      return cell === BoardProp.TWO_QUEEN || cell === BoardProp.TWO_KING;
    };

    const isOtherPlayer = (cell: BoardProp) => {
      if (turn === Turn.ONE) {
        return cell === BoardProp.TWO_QUEEN || cell === BoardProp.TWO_KING;
      }
      return cell === BoardProp.ONE_QUEEN || cell === BoardProp.ONE_KING;
    };

    const isNotEdge = (index: number, x: PossibleMove) => {
      if (turn === Turn.ONE) {
        return (
          (x === 7 && index % 8 !== 0) ||
          (x === 9 && index % 8 !== 7) ||
          (x === -9 && index % 8 !== 0) ||
          (x === -7 && index % 8 !== 7)
        );
      }
      return (
        (x === 9 && index % 8 !== 0) ||
        (x === 7 && index % 8 !== 7) ||
        (x === -7 && index % 8 !== 0) ||
        (x === -9 && index % 8 !== 7)
      );
    };

    const isNotJumpEdge = (index: number, x: PossibleMove) => {
      if (turn === Turn.ONE) {
        return (
          (x === 7 && index % 8 !== 0 && index % 8 !== 1) ||
          (x === 9 && index % 8 !== 7 && index % 8 !== 6) ||
          (x === -9 && index % 8 !== 0 && index % 8 !== 1) ||
          (x === -7 && index % 8 !== 7 && index % 8 !== 6)
        );
      }
      return (
        (x === 9 && index % 8 !== 0 && index % 8 !== 1) ||
        (x === 7 && index % 8 !== 7 && index % 8 !== 6) ||
        (x === -7 && index % 8 !== 0 && index % 8 !== 1) ||
        (x === -9 && index % 8 !== 7 && index % 8 !== 6)
      );
    };
    const resetSuggestions = () => {
      for (const key in board) {
        if (board[key] === BoardProp.SUGGESTION) {
          board[key] = BoardProp.NONE;
        }
      }
    };

    const setSuggestions = (index: number, x: PossibleMove) => {
      const multiplier = Turn.ONE === turn ? 1 : -1;
      const target = board[index + x * multiplier];

      if (target === BoardProp.NONE) {
        if (isNotEdge(index, x)) {
          setBoardProp(
            index + x * multiplier,
            BoardProp.SUGGESTION,
            BoardProp.NONE
          );
        }
      } else if (isOtherPlayer(target)) {
        if (isNotJumpEdge(index, x)) {
          setBoardProp(
            index + 2 * x * multiplier,
            BoardProp.SUGGESTION,
            BoardProp.NONE
          );
        }
      }
    };

    if (index === active) {
      setActive(-1);
      resetSuggestions();
      setBoard([...board]);
      return;
    }

    if (isPlayerTurn(cell)) {
      setActive(index);
      setSuggestions(index, 7);
      setSuggestions(index, 9);
      if (cell === BoardProp.ONE_KING || cell === BoardProp.TWO_KING) {
        setSuggestions(index, -7);
        setSuggestions(index, -9);
      }
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
      if (turn === Turn.ONE ? index >= 56 : index <= 7) {
        board[index] =
          turn === Turn.ONE ? BoardProp.ONE_KING : BoardProp.TWO_KING;
      }

      board[active] = BoardProp.NONE;
      resetSuggestions();
      setBoard([...board]);
      setTurn(turn === Turn.ONE ? Turn.TWO : Turn.ONE);
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
            className={
              "App-box" +
              (cell === BoardProp.SUGGESTION ? " App-suggestion" : "") +
              (active === index ? " App-active" : "") +
              ` App-player${cell}`
            }
          />
        ))}
      </div>
    </div>
  );
}

export default App;

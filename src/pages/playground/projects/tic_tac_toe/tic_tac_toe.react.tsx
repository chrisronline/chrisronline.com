import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import './tic_tac_toe.scss';

const SIZE = 3;
const TURNS = SIZE * SIZE;
enum Players {
  X = 'X',
  O = 'O',
}
type GameBoard = Map<number, Map<number, Players | null>>;

function getIconForPlayer(player: Players) {
  switch (player) {
    case Players.O:
      return solid('o');
    case Players.X:
      return solid('xmark');
  }
}

function createEmptyGameBoard() {
  const emptyBoard = new Map();
  for (let i = 0; i < SIZE; i++) {
    const row = new Map();
    for (let x = 0; x < SIZE; x++) {
      row.set(x, null);
    }
    emptyBoard.set(i, row);
  }
  return emptyBoard;
}

function isSamePlayerInArray(arr: Players[]) {
  return arr[0] !== null && arr.every((player) => player === arr[0]);
}

function getWinner(board: GameBoard): Players {
  // same player in board[0][0], board[0][1], board[0][2]
  for (let i = 0; i < SIZE; i++) {
    const playersInRow = Array.from(board.get(i).values());
    if (isSamePlayerInArray(playersInRow)) {
      return playersInRow[0];
    }
  }

  // same player in board[0][0], board[1][0], board[2][0]
  for (let i = 0; i < SIZE; i++) {
    const column: Players[] = [];
    for (let x = 0; x < SIZE; x++) {
      column.push(Array.from(board.get(x).values())[i]);
    }
    if (isSamePlayerInArray(column)) {
      return column[0];
    }
  }

  // same player in board[0][0], board[1][1], board[2][2]
  const diagonals = [];
  for (let i = 0; i < SIZE; i++) {
    diagonals.push(board.get(i).get(i));
  }
  if (isSamePlayerInArray(diagonals)) {
    return diagonals[0];
  }

  // same player in board[0][2], board[1][1], board[2][0]
  const otherDiagonals = [];
  for (let i = 0; i < SIZE; i++) {
    otherDiagonals.push(board.get(i).get(SIZE - i - 1));
  }
  if (isSamePlayerInArray(otherDiagonals)) {
    return otherDiagonals[0];
  }

  return null;
}

export const TicTacToeReact = () => {
  const [moves, setMoves] = useState(0);
  const [turn, setTurn] = useState<Players>(Players.X);
  const [winner, setWinner] = useState<Players | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [board, setBoard] = useState<GameBoard>(createEmptyGameBoard());

  function click({ row, col }: { row: number; col: number }) {
    if (!isActive) return;
    const newBoard = new Map(board);
    newBoard.get(row).set(col, turn);
    setBoard(newBoard);
    setTurn(turn === Players.X ? Players.O : Players.X);
    setMoves(moves + 1);
  }

  function reset() {
    setBoard(createEmptyGameBoard());
    setTurn(Players.X);
    setMoves(0);
    setIsActive(true);
  }

  useEffect(() => {
    const _winner = getWinner(board);
    if (!winner && _winner) {
      setIsActive(false);
    }
    setWinner(_winner);
  }, [board]);

  useEffect(() => {
    if (moves >= TURNS) {
      setIsActive(false);
    }
  }, [moves]);

  return (
    <article className="ttt-container">
      <header>
        <h3 className="ttt-status">
          {isActive
            ? `Game is ongoing`
            : winner
            ? `Winner is ${winner}`
            : `Game ended in a tie`}
        </h3>
        <h4 className="ttt-turn">
          {isActive ? (
            `${turn}'s turn`
          ) : (
            <button className="ttt-reset" onClick={reset}>
              Reset
            </button>
          )}
        </h4>
      </header>
      <div className="ttt-grid">
        {Array(SIZE)
          .fill(0)
          .map((_, row) => (
            <div className="ttt-row" key={row}>
              {Array(SIZE)
                .fill(0)
                .map((_2, col) => {
                  const clickHandler = click.bind(this, { row, col });
                  return (
                    <div className="ttt-col" key={col} onClick={clickHandler}>
                      {board.get(row).get(col) !== null ? (
                        <span
                          className={`ttl-player-${board.get(row).get(col)}`}
                        >
                          <FontAwesomeIcon
                            icon={getIconForPlayer(board.get(row).get(col))}
                            size="4x"
                          />
                        </span>
                      ) : null}
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
    </article>
  );
};

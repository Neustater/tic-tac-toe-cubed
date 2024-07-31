import { useState } from "react";
// Partial Support for additional board dimmentions (css requires manual adjustment)
let boardDimentions = 3;

// Manages the combined instance of 6 tic-tac-toe boards.
export default function CubeBoard(){
  const [xIsNext, setXIsNext] = useState(true);
  
  return(
    <div className="container">
      <div className="cube">
        <div className="face top"><Board xIsNext={xIsNext} setXIsNext={setXIsNext}></Board></div>
        <div className="face bottom"><Board xIsNext={xIsNext} setXIsNext={setXIsNext}></Board></div>
        <div className="face right"><Board xIsNext={xIsNext} setXIsNext={setXIsNext}></Board></div>
        <div className="face left"><Board xIsNext={xIsNext} setXIsNext={setXIsNext}></Board></div>
        <div className="face front"><Board xIsNext={xIsNext} setXIsNext={setXIsNext}></Board></div>
        <div className="face back"><Board xIsNext={xIsNext} setXIsNext={setXIsNext}></Board></div>
      </div>
    </div>
  );
}

// Board component manages a single tic-tac-toe board instance.
function Board({xIsNext, setXIsNext}) {
  const [squares, setSquares] = useState(Array(boardDimentions**2).fill(null));
  let hasWon = checkSideWinner(squares);
  let winnerElement = hasWon === "X" ? (<div className="result x-result"><p>X</p></div>) : 
    hasWon === "O" ? (<div className="result o-result"><p>O</p></div>) : 
    hasWon === "draw" ? (<div className="result draw-result"><p>✽</p></div>) : null;

  function handleClick(i) {
    if (squares[i] || hasWon) {
      return;
    }
    const nextSquares = squares.slice();
    xIsNext ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function renderBoard() {
    const boardElement = [];
    for (let i = 0; i < boardDimentions * boardDimentions; i++) {
      boardElement.push(
        <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
      );
    }
    return boardElement;
  }

  let gridTemplateRowsAndColumnds = "1fr ".repeat(boardDimentions);
  
  return (
    <>
      <div className="board" style={{gridTemplateColumns: gridTemplateRowsAndColumnds, gridTemplateRows: gridTemplateRowsAndColumnds}}>
        {renderBoard()}
      </div>
      {winnerElement}
    </>
  );
}

// Square component represents a single square in the tic-tac-toe board.
function Square({ value, onSquareClick }) {
  return (
    <button className="square" style={{fontSize: (32/boardDimentions) + "dvh"}} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function checkSideWinner(squares){
  if(squares.every(square => square)){
    return "draw";
  }
  // Check for winner in row
  for (let i=0; i<squares.length; i+=boardDimentions){
    if (!squares[i]){continue;}
    for (let j=i+1; j<i+boardDimentions; j+=1){
      if (!squares[j] || squares[j] !== squares[j-1]){
        break;
      }else if (j === i+boardDimentions-1){
        console.log("Winner in row");
        return squares[j];
      }
    }
  }
  
  // Check for winner in column
  for (let i=0; i<boardDimentions; i+=1){
    if (!squares[i]){continue;}
    for (let j=i+boardDimentions; j<= i + (boardDimentions * (boardDimentions-1)) ; j+=boardDimentions){
      if (!squares[j] || squares[j] !== squares[j-boardDimentions]){
        break;
      }else if (j === i + (boardDimentions * (boardDimentions-1))){
        console.log("Winner in column");
        return squares[j];
      }
    }
  }
  
  // Check for winner in diagonal
  for(let i=boardDimentions+1; i<squares.length; i+=boardDimentions+1){
    if (!squares[i] || squares[i] !== squares[i-boardDimentions-1]){
      break;
    }else if (i === squares.length-1){
      console.log("Winner in diagonal");
      return squares[i];
    }
  }
  // Check for winner in counter-diagonal
  for(let i=boardDimentions*2-2; i<squares.length; i+=boardDimentions-1){
    if (!squares[i] || squares[i] !== squares[i-boardDimentions+1]){
      break;
    }else if (i === boardDimentions**2 - boardDimentions){
      console.log("Winner in counter-diagonal");
      return squares[i];
    }
  }
  return null;
}

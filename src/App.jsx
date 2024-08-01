import { useState } from "react";
// Partial Support for additional board dimmentions (css requires manual adjustment)
let boardDimentions = 3;

// Square component represents a single square in the tic-tac-toe board.
function Square({ value, onSquareClick }) {
  return (
    <button className="square" style={{fontSize: (45/boardDimentions) + "dvh"}} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board component manages a single tic-tac-toe board instance.
function Board({boardInd, board, onSquareClick, sideResult}) {
  let winnerElement = sideResult === "X" ? (<div className="result x-result"><p>X</p></div>) : 
  sideResult === "O" ? (<div className="result o-result"><p>O</p></div>) : 
  sideResult === "draw" ? (<div className="result draw-result"><p>✽</p></div>) : null;

  function renderBoard() {
    const boardElement = [];
    for (let squareInd = 0; squareInd < boardDimentions * boardDimentions; squareInd++) {
      boardElement.push(
        <Square key={squareInd} value={board[squareInd]} onSquareClick={() => onSquareClick(boardInd, squareInd)} />
      );
    }
    return boardElement;
  }

  let gridTemplateRowsAndColumnds = "1fr ".repeat(boardDimentions);
  
  return (
    <>
      <div className="board" style={{gridTemplateColumns: gridTemplateRowsAndColumnds, gridTemplateRows: gridTemplateRowsAndColumnds}}>
        {renderBoard(boardInd)}
      </div>
      {winnerElement}
    </>
  );
}

// Manages the combined instance of 6 tic-tac-toe boards.
export default function CubeBoard(){
  const [xIsNext, setXIsNext] = useState(true);
  const [CubeBoard, setCubeBoard] = useState(Array(6).fill(Array(boardDimentions**2).fill(null)));
  const [sideResults, setsideResults] = useState(Array(6).fill(false));

  function handleClick(boardInd,squareInd) {
    if (sideResults[boardInd] || CubeBoard[boardInd][squareInd]) return;
    
    const nextCubeBoard = CubeBoard.map(board => board.slice());
    nextCubeBoard[boardInd][squareInd] = xIsNext ? "X" : "O";

    const checkResult = checkSideWinner(nextCubeBoard[boardInd]);
    const nextSideResults = sideResults.slice();

    if (checkResult) {
      nextSideResults[boardInd] = checkResult;
    }

    setCubeBoard(nextCubeBoard);
    setsideResults(nextSideResults);
    setXIsNext(!xIsNext);
    
  }

  let currentWinner = sideResults.filter(side => side === "X").length - sideResults.filter(side => side === "O").length;

  return(
    <div className="parent">
      <div className="container">
        <div className="cube">
          <div className="face top"><Board boardInd={0} board={CubeBoard[0]} onSquareClick={handleClick} sideResult={sideResults[0]}></Board></div>
          <div className="face bottom"><Board boardInd={1} board={CubeBoard[1]} onSquareClick={handleClick} sideResult={sideResults[1]}></Board></div>
          <div className="face right"><Board boardInd={2} board={CubeBoard[2]} onSquareClick={handleClick} sideResult={sideResults[2]}></Board></div>
          <div className="face left"><Board boardInd={3} board={CubeBoard[3]} onSquareClick={handleClick} sideResult={sideResults[3]}></Board></div>
          <div className="face front"><Board boardInd={4} board={CubeBoard[4]} onSquareClick={handleClick} sideResult={sideResults[4]}></Board></div>
          <div className="face back"><Board boardInd={5} board={CubeBoard[5]} onSquareClick={handleClick} sideResult={sideResults[5]}></Board></div>
        </div>
      </div>
      <h1>{sideResults.filter(side => side).length == 6 ? "Game Over!" : xIsNext ? "X's turn" : "O's turn"}</h1>
      <h2>{currentWinner > 0 ? "X is Winning!" : currentWinner < 0 ? "O is Winning!" : "The Game is Tied!"}</h2>
    </div>
  );
}

function checkSideWinner(board){
  if(board.every(square => square)){
    return "draw";
  }
  // Check for winner in row
  for (let i=0; i<board.length; i+=boardDimentions){
    if (!board[i]){continue;}
    for (let j=i+1; j<i+boardDimentions; j+=1){
      if (!board[j] || board[j] !== board[j-1]){
        break;
      }else if (j === i+boardDimentions-1){
        console.log("Winner in row");
        return board[j];
      }
    }
  }
  
  // Check for winner in column
  for (let i=0; i<boardDimentions; i+=1){
    if (!board[i]){continue;}
    for (let j=i+boardDimentions; j<= i + (boardDimentions * (boardDimentions-1)) ; j+=boardDimentions){
      if (!board[j] || board[j] !== board[j-boardDimentions]){
        break;
      }else if (j === i + (boardDimentions * (boardDimentions-1))){
        console.log("Winner in column");
        return board[j];
      }
    }
  }
  
  // Check for winner in diagonal
  for(let i=boardDimentions+1; i<board.length; i+=boardDimentions+1){
    if (!board[i] || board[i] !== board[i-boardDimentions-1]){
      break;
    }else if (i === board.length-1){
      console.log("Winner in diagonal");
      return board[i];
    }
  }
  // Check for winner in counter-diagonal
  for(let i=boardDimentions*2-2; i<board.length; i+=boardDimentions-1){
    if (!board[i] || board[i] !== board[i-boardDimentions+1]){
      break;
    }else if (i === boardDimentions**2 - boardDimentions){
      console.log("Winner in counter-diagonal");
      return board[i];
    }
  }
  return null;
}

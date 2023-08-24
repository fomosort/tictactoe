//Gameboard module
const gameBoard = (() => {
  const board = [
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"],
  ];

  const updateBoard = (row, column, pieceXO) => {
    const boardSquare = board[row][column];
    boardSquare === "_"
      ? (board[row][column] = pieceXO)
      : console.log("Square is occupied");
  };

  return { board, updateBoard };
})();

const displayController = ((board) => {
  const boardElem = document.getElementById("board");
  const allSquares = document.querySelectorAll(".square");
  const initBoardHTML = (board) => {
    for (i = 0; i < allSquares.length; i++) {
      allSquares[i].textContent = board.flat()[i];
    }
  };

  const updateBoardHTML = (row, column, pieceXO) => {
    const selectedSquare = boardElem.querySelector(
      `.square[row="${row}"][col="${column}"]`
    );
    selectedSquare.textContent === "_"
      ? (selectedSquare.textContent = pieceXO)
      : console.log("Square is occupied");
  };

  const takePlayerInput = (player) => {
    allSquares.forEach((square) =>
      square.addEventListener("click", function(){
    const positionToMove = [this.getAttribute("row"),this.getAttribute("col")]
        currentPlayer.playPiece(positionToMove);
        changeCurrentPlayer()
      })
    );
  };
  return { boardElem, initBoardHTML, updateBoardHTML, takePlayerInput };
})(board);

const Player = (piece) => {
  const info = {
    score: 0,
    pieceType: piece,
  };

  const playPiece = (playPosition) => {
    gameBoard.updateBoard(...playPosition,info.pieceType);
    displayController.updateBoardHTML(...playPosition, info.pieceType)
  };

  return { info, playPiece };
};

// const mainGame = (() =>{
//Create players
const humanPlayer = Player("X");
const cpuPlayer = Player("O");
let currentPlayer = humanPlayer;
const changeCurrentPlayer = () =>{
    currentPlayer = currentPlayer === humanPlayer ? cpuPlayer : humanPlayer 
    console.log(currentPlayer);
}

// })()

// console.log(document.querySelector(`.square[row="1"][col="1"]`));

displayController.initBoardHTML(gameBoard.board);
displayController.updateBoardHTML(0, 2, "O");
displayController.updateBoardHTML(0, 1, "X");
displayController.takePlayerInput(humanPlayer);

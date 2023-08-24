//Gameboard module
const gameBoard = (() => {
  const board = [
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"],
  ];

  const updateBoard = (row, column, pieceXO) => {
    board[row][column] = pieceXO;
  };

  //TODO:use an alternative logic to check if empty
  const checkOccupied = (row, column) => {
    const isOkayToMove = board[row][column] === "_"
    return isOkayToMove
  };

  return { board, updateBoard, checkOccupied };
})();

const displayController = ((board) => {
  const boardElem = document.getElementById("board");
  const allSquares = document.querySelectorAll(".square");
  const messageElem = document.getElementById("message");
  const turnElem = document.getElementById("player-turn");
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
      : console.trace("Square is occupied");
  };

  const updateMessage = (target,message) => {
    target.textContent = message;
    // messageElem.textContent = message;
  };

  //Event Listeners


  // #region Event Handler Functions
  const clickToAddPiece = function () {
    const positionToMove = [this.getAttribute("row"), this.getAttribute("col")];

    if (gameBoard.checkOccupied(...positionToMove)) {
      currentPlayer.playPiece(positionToMove);
      changeCurrentPlayer();
      updateMessage(turnElem,
        `${currentPlayer.info.playerName}'s turn : ${currentPlayer.info.pieceType}`
      );
      updateMessage(messageElem," ")

    }else{
        updateMessage(messageElem,"Square is occupied")
        console.log("Square is occupied");
    }
  };
  // #endregion


  // #region Event Listeners
  allSquares.forEach((square) =>
    square.addEventListener("click", clickToAddPiece)
  );
  // #endregion


  return { boardElem, initBoardHTML, updateBoardHTML, clickToAddPiece };
})(board);

const Player = (piece, playerName) => {
  const info = {
    playerName,
    score: 0,
    pieceType: piece,
  };

  const playPiece = (playPosition) => {
    gameBoard.updateBoard(...playPosition, info.pieceType);
    displayController.updateBoardHTML(...playPosition, info.pieceType);
  };

  return { info, playPiece };
};

// const mainGame = (() =>{
//Create players
const humanPlayer = Player("X", "human");
const cpuPlayer = Player("O", "computer");
let currentPlayer = humanPlayer;
const changeCurrentPlayer = () => {
  currentPlayer = currentPlayer === humanPlayer ? cpuPlayer : humanPlayer;
  console.log(currentPlayer);
};

// })()

// console.log(document.querySelector(`.square[row="1"][col="1"]`));

displayController.initBoardHTML(gameBoard.board);
gameBoard.updateBoard(0, 2, "O")
gameBoard.updateBoard(0, 1, "X")
displayController.updateBoardHTML(0, 2, "O");
displayController.updateBoardHTML(0, 1, "X");
// displayController.clickToAddPiece(currentPlayer);

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
    const isOkayToMove = board[row][column] === "_";
    return isOkayToMove;
  };

  return { board, updateBoard, checkOccupied };
})();

const displayController = ((board) => {
  const boardElem = document.getElementById("board");
  const allSquares = document.querySelectorAll(".square");
  const messageElem = document.getElementById("message");
  const turnDisplayElem = document.getElementById("player-turn");
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

  const updateMessage = (target, message) => {
    target.textContent = message;
    // messageElem.textContent = message;
  };

  //Event Listeners

  // #region Event Handler Functions
  const clickHandlerAddPiece = function () {
    const positionToMove = [this.getAttribute("row"), this.getAttribute("col")]
    gameController.makePlayerPlayPiece(positionToMove);
  };
  // #endregion

  // #region Event Listeners
  allSquares.forEach((square) =>
    square.addEventListener("click", clickHandlerAddPiece)
  );
  // #endregion

  return {
    boardElem,
    initBoardHTML,
    updateBoardHTML,
    updateMessage,
    allSquares,
    messageElem,
    turnDisplayElem
  };
})(board);

const gameController = (() => {
    displayController.initBoardHTML(gameBoard.board);
  const maxTurns = gameBoard.board.flat().length;


  const Player = (piece, playerName) => {
    const info = {
      playerName,
      score: 0,
      pieceType: piece,
    };

    const playPiece = (playPosition) => {
      if (gameBoard.checkOccupied(...playPosition)) {
        gameBoard.updateBoard(...playPosition, info.pieceType);
        displayController.updateBoardHTML(...playPosition, info.pieceType);
      } else {
        displayController.updateMessage(displayController.messageElem, "Square is occupied");
        console.log("Square is occupied");
      }
    };
    return { info, playPiece };
  };

  //Create players
  const humanPlayer = Player("X", "human");
  const cpuPlayer = Player("O", "computer");
  let currentPlayer = humanPlayer;
  const changeCurrentPlayer = () => {
    currentPlayer = currentPlayer === humanPlayer ? cpuPlayer : humanPlayer;
    console.log(currentPlayer);
  };

  const makePlayerPlayPiece = (position) => {
    currentPlayer.playPiece(position);
    changeCurrentPlayer();
    displayController.updateMessage(
        displayController.turnDisplayElem,
      `${currentPlayer.info.playerName}'s turn : ${currentPlayer.info.pieceType}`
    );
    displayController.updateMessage(displayController.messageElem, " ");
  };
  return {makePlayerPlayPiece}
})();

// const checkWinner = (board) => {
const testBoard = board;
//Given an array, check if every item in the array is the same
const allSquaresMatch = (arrayToCompare) => {
  const match = arrayToCompare.every((item) => item === arrayToCompare[0]);
  return match ? arrayToCompare[0] : false;
};

const horizontal = (testBoard) => {
  testBoard.forEach((row) => {
    const result = allSquaresMatch(row);
    console.log(result);
    if (result) return result;
  });
  return false;
};

const vertical = (testBoard) => {
  for (i = 0; i < testBoard[0].length; i++) {
    const arrayToCompare = testBoard.map((row) => row[i]);
    const result = allSquaresMatch(arrayToCompare);
    if (result) return result;
  }
  return false;
};
const diagonal = (testBoard) => {
  const leftToRightArray = testBoard.map((row, rowIndex) => row[rowIndex]);
  const rightToLeftArray = testBoard.map(
    (row, rowIndex) => row[row.length - 1 - rowIndex]
  );

  return (
    allSquaresMatch(leftToRightArray) ||
    allSquaresMatch(rightToLeftArray) ||
    false
  );
};

//   return horizontal(testBoard) || vertical(testBoard) || diagonal (testBoard) || 'false'
// };

//Test boards
const testBoard1 = [
  ["X", "O", "X"],
  ["X", "X", "O"],
  ["X", "O", "O"],
];

const testBoard2 = [
  ["X", "X", "X"],
  ["O", "X", "O"],
  ["X", "O", "X"],
];

const testBoard3 = [
  ["X", "O", "O"],
  ["O", "X", "O"],
  ["X", "O", "O"],
];
const testBoard4AllFail = [
  ["X", "O", "O"],
  ["O", "X", "X"],
  ["X", "O", "O"],
];

// checkWinner()
// console.log(horizontal(testBoard2));

// console.log(document.querySelector(`.square[row="1"][col="1"]`));

// gameBoard.updateBoard(0, 2, "O");
// gameBoard.updateBoard(0, 1, "X");
// displayController.updateBoardHTML(0, 2, "O");
// displayController.updateBoardHTML(0, 1, "X");

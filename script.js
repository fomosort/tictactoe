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
    const positionToMove = [this.getAttribute("row"), this.getAttribute("col")];
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
    turnDisplayElem,
  };
})(board);

const gameController = (() => {
  displayController.initBoardHTML(gameBoard.board);
  const maxTurns = gameBoard.board.flat().length;
    let currentTurn = 1
  const Player = (piece, playerName) => {
    const info = {
      playerName,
      score: 0,
      pieceType: piece,
    };

    //Returns true if piece is played, false if not played
    const playPiece = (playPosition) => {
      if (gameBoard.checkOccupied(...playPosition)) {
        gameBoard.updateBoard(...playPosition, info.pieceType);
        displayController.updateBoardHTML(...playPosition, info.pieceType);

        displayController.updateMessage(displayController.messageElem, " ");
        return true;
      } else {
        displayController.updateMessage(
          displayController.messageElem,
          "Square is occupied"
        );
        console.log("Square is occupied");
        return false;
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
    // console.log(currentPlayer);
    displayController.updateMessage(
      displayController.turnDisplayElem,
      `${currentPlayer.info.playerName}'s turn : ${currentPlayer.info.pieceType}`
    );
  };

  const makePlayerPlayPiece = (position) => {
    const currentPiece = currentPlayer.info.pieceType;
    const wasPlaySuccessful = currentPlayer.playPiece(position);
    if (currentTurn >= maxTurns) endGame("Draw")
    if (wasPlaySuccessful) {
      checkWinner(gameBoard.board, currentPiece) === currentPiece
        ? endGame(currentPiece)
        : changeCurrentPlayer();
        currentTurn++
    }

    // currentPlayer.info.pieceType
    //if checkWinner returns false, keep playing
  };
  
  const endGame = (gameResult) =>{
    // const gameResult = gameResult
    if (gameResult === "Draw") {displayController.updateMessage(displayController.messageElem, "Draw")}
    else displayController.updateMessage(displayController.messageElem, `${gameResult} wins!`)
    //TODO: freeze all game functions
    //TODO: ask if should reset game
}
    const resetGame = () =>{}

  return { makePlayerPlayPiece };
})();

const checkWinner = (board, currentPiece) => {
  const testBoard = board;
  //Given an array, check if every item in the array is the same
  const allSquaresMatch = (arrayToCompare) => {
    // console.log(arrayToCompare);
    const match = arrayToCompare.every((item) => item === currentPiece);
    // const match = arrayToCompare.every((item) => item === arrayToCompare[0]);
    return match;
  };

  const horizontal = (testBoard) => {
    return testBoard.some((row) => allSquaresMatch(row));
  };

  const vertical = (testBoard) => {
    for (i = 0; i < testBoard[0].length; i++) {
      const arrayToCompare = testBoard.map((row) => row[i]);
      const result = allSquaresMatch(arrayToCompare);
      //   console.log("vertical:" + result);

      if (result) return result;
    }
    return false;
  };
  const diagonal = (testBoard) => {
    const leftToRightArray = testBoard.map((row, rowIndex) => row[rowIndex]);
    const rightToLeftArray = testBoard.map(
      (row, rowIndex) => row[row.length - 1 - rowIndex]
    );
    const result =
      allSquaresMatch(leftToRightArray) || allSquaresMatch(rightToLeftArray);

    if (result) return result;
    return false;
  };

  const resultHorizontal = horizontal(testBoard);
  const resultVertical = vertical(testBoard);
  const resultDiagonal = diagonal(testBoard);

  //If any of the patterns match, return the winner's piece
  return (
    [resultHorizontal, resultVertical, resultDiagonal].some(
      (result) => result
    ) && currentPiece
  );
};

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

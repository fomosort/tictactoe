//Gameboard module
const gameBoard = (() => {
  let board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  const updateBoard = (row, column, pieceXO) => {
    board[row][column] = pieceXO;
    console.log(board);
  };

  const resetBoard = () => {
    board = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
  };

  const checkOccupied = (row, column, piece1, piece2) => {
    const isOkayToMove =
      board[row][column] !== piece1 && board[row][column] !== piece2;
    return isOkayToMove;
  };

  return { board, updateBoard, checkOccupied, resetBoard };
})();

const displayController = (() => {
  const boardElem = document.getElementById("board");
  const allSquares = document.querySelectorAll(".square");
  const messageElem = document.getElementById("message");
  const turnDisplayElem = document.getElementById("player-turn");
  const buttonReset = document.querySelector("button#reset");
  const buttonStart = document.querySelector("button#start");
  const playerName = document.querySelector("input#player-name");
  const cpuName = document.querySelector("input#cpu-name");

  const initBoardHTML = (board) => {
    for (i = 0; i < allSquares.length; i++) {
      allSquares[i].textContent = board.flat()[i];
    }
  };

  const updateBoardHTML = (row, column, pieceXO) => {
    const selectedSquare = boardElem.querySelector(
      `.square[row="${row}"][col="${column}"]`
    );
    selectedSquare.textContent === " "
      ? (selectedSquare.textContent = pieceXO)
      : console.trace("Square is occupied");
  };

  const updateMessage = (target, message) => {
    target.textContent = message;
  };

  //Event Listeners

  // #region Event Handler Functions
  const clickHandlerAddPiece = function () {
    const positionToMove = [this.getAttribute("row"), this.getAttribute("col")];
    gameController.makePlayerPlayPiece(positionToMove);
  };

  const resetGame = () => {
    playerName.value = "player";
    cpuName.value = "cpu";
    messageElem.textContent = "";
    turnDisplayElem.textContent = "";
    gameController.resetGame();
    updateBoardHTML()
  };
  const startGame = () => {
    gameController.initGame(playerName.value, cpuName.value);
  };

  // #endregion

  // #region Event Listeners
  const initEventListeners = () => {
    allSquares.forEach((square) =>
      square.addEventListener("click", clickHandlerAddPiece)
    );

    buttonReset.addEventListener("click", resetGame);
    buttonStart.addEventListener("click", startGame);
  };

  // #endregion

  return {
    boardElem,
    initBoardHTML,
    updateBoardHTML,
    updateMessage,
    allSquares,
    messageElem,
    turnDisplayElem,
    initEventListeners,
  };
})();

const gameController = (() => {
  let maxTurns;
  let currentTurn;
  let humanPlayer;
  let cpuPlayer;
  let currentPlayer;

  const initGame = (playerName = "player", cpuName = "cpu") => {
    
    displayController.initBoardHTML(gameBoard.board);
    maxTurns = gameBoard.board.flat().length;
    currentTurn = 1;
    humanPlayer = Player("X", playerName);
    cpuPlayer = Player("O", cpuName);
    console.log(humanPlayer);
    currentPlayer = humanPlayer;
  };

  const Player = (piece, playerName) => {
    const info = {
      playerName,
      score: 0,
      pieceType: piece,
    };

    const playPiece = (playPosition) => {
      if (
        gameBoard.checkOccupied(
          ...playPosition,
          humanPlayer.info.pieceType,
          cpuPlayer.info.pieceType
        )
      ) {
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
  //Attach all event listeners
  displayController.initEventListeners();

  const changeCurrentPlayer = () => {
    currentPlayer = currentPlayer === humanPlayer ? cpuPlayer : humanPlayer;
    displayController.updateMessage(
      displayController.turnDisplayElem,
      `${currentPlayer.info.playerName}'s turn : ${currentPlayer.info.pieceType}`
    );
  };

  const makePlayerPlayPiece = (position) => {
    const currentPiece = currentPlayer.info.pieceType;
    const wasPlaySuccessful = currentPlayer.playPiece(position);
    if (currentTurn >= maxTurns) endGame("Draw");
    if (wasPlaySuccessful) {
      checkWinner(gameBoard.board, currentPiece) === currentPiece
        ? endGame(currentPiece)
        : changeCurrentPlayer();
      currentTurn++;
    }

  };

  const endGame = (gameResult) => {
    if (gameResult === "Draw") {
      displayController.updateMessage(displayController.messageElem, "Draw");
    } else
      displayController.updateMessage(
        displayController.messageElem,
        `${gameResult} wins!`
      );

  };
  const resetGame = () => {
    gameBoard.resetBoard();
    initGame();
  };

  return { makePlayerPlayPiece, resetGame, initGame };
})();

const checkWinner = (board, currentPiece) => {
  console.log("checkWinner started");
  console.log(gameBoard.board);
  const testBoard = board;
  //Given an array, check if every item in the array is the same
  const allSquaresMatch = (arrayToCompare) => {
    const match = arrayToCompare.every((item) => item === currentPiece);
    return match;
  };

  const horizontal = (testBoard) => {
    return testBoard.some((row) => allSquaresMatch(row));
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
    const result =
      allSquaresMatch(leftToRightArray) || allSquaresMatch(rightToLeftArray);

    if (result) return result;
    return false;
  };

  const resultHorizontal = horizontal(testBoard);
  const resultVertical = vertical(testBoard);
  const resultDiagonal = diagonal(testBoard);
console.log(resultHorizontal,resultVertical,resultDiagonal);
  //If any of the patterns match, return the winner's piece
  return (
    [resultHorizontal, resultVertical, resultDiagonal].some(
      (result) => result
    ) && currentPiece
  );
};

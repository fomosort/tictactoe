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
    const selectedSquare = boardElem.querySelector(`.row${row}.col${column}`);
    selectedSquare.textContent === "_"
      ? (selectedSquare.textContent = pieceXO)
      : console.log("Square is occupied");
  };
  return { initBoardHTML, updateBoardHTML };
})(board);

displayController.initBoardHTML(gameBoard.board);
displayController.updateBoardHTML(0, 2, "O");
displayController.updateBoardHTML(0, 1, "X");

import blackPawn from "../../../../../img/chessPieces/blackPawn.png";
import blackBishop from "../../../../../img/chessPieces/blackBishop.png";
import blackHorse from "../../../../../img/chessPieces/blackHorse.png";
import blackRook from "../../../../../img/chessPieces/blackRook.png";
import blackQueen from "../../../../../img/chessPieces/blackQueen.png";
import blackKing from "../../../../../img/chessPieces/blackKing.png";
import whitePawn from "../../../../../img/chessPieces/whitePawn.png";
import whiteBishop from "../../../../../img/chessPieces/whiteBishop.png";
import whiteHorse from "../../../../../img/chessPieces/whiteHorse.png";
import whiteRook from "../../../../../img/chessPieces/whiteRook.png";
import whiteQueen from "../../../../../img/chessPieces/whiteQueen.png";
import whiteKing from "../../../../../img/chessPieces/whiteKing.png";

const rows = [8, 7, 6, 5, 4, 3, 2, 1]
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"]
const desk = rows.map(i => columns.map(j => `${j}${i}`))

const colors = {
  WHITE: "WHITE",
  BLACK: "BLACK"
}
const figures = {
  PAWN: "PAWN",
  HORSE: "HORSE",
  BISHOP: "BISHOP",
  ROOK: "ROOK",
  QUEEN: "QUEEN",
  KING: "KING",
}
const sides = {
  OPPONENT: "OPPONENT",
  ME: "ME"
}

const getCell = (boardState, x, y) => {
  if (x < 0 || x > 7 || y < 0 || y > 7) return

  return boardState[x][y]
}

const getImg = (figureColor) => {
  switch (figureColor) {
    case (figures.PAWN + colors.BLACK):
      return blackPawn;
    case (figures.BISHOP + colors.BLACK):
      return blackBishop;
    case (figures.HORSE + colors.BLACK):
      return blackHorse;
    case (figures.ROOK + colors.BLACK):
      return blackRook;
    case (figures.QUEEN + colors.BLACK):
      return blackQueen;
    case (figures.KING + colors.BLACK):
      return blackKing;
    case (figures.PAWN + colors.WHITE):
      return whitePawn;
    case (figures.BISHOP + colors.WHITE):
      return whiteBishop;
    case (figures.HORSE + colors.WHITE):
      return whiteHorse;
    case (figures.ROOK + colors.WHITE):
      return whiteRook;
    case (figures.QUEEN + colors.WHITE):
      return whiteQueen;
    case (figures.KING + colors.WHITE):
      return whiteKing;
  }
}

const getAttackingPawns = (boardState, cell, i, j) => {
  const moves = [
    getCell(boardState, i - 1, j - 1),
    getCell(boardState, i - 1, j + 1)
  ]

  return moves.filter(move => move && move.figure === figures.PAWN && move.side === sides.OPPONENT)
}

const getAttackingHorses = (boardState, cell, i, j) => {
  const moves = getPossibleMovesForHorse(boardState, cell, i, j)
  return moves.filter(i => i.figure === figures.HORSE)
}

const getAttackingBishopsOrQueens = (boardState, cell, i, j) => {
  const moves = getPossibleMovesForBishop(boardState, cell, i, j)
  return moves.filter(i => i.figure === figures.BISHOP || i.figure === figures.QUEEN)
}

const getAttackingRooksOrQueens = (boardState, cell, i, j) => {
  const moves = getPossibleMovesForRook(boardState, cell, i, j)
  return moves.filter(i => i.figure === figures.ROOK || i.figure === figures.QUEEN)
}

const isUnderAttack = (boardState, cell) => {
  const i = rows.indexOf(Number(cell.y))
  const j = columns.indexOf(cell.x)
  const attackingPieces = []
  attackingPieces.push(...getAttackingPawns(boardState, cell, i, j))
  attackingPieces.push(...getAttackingHorses(boardState, cell, i, j))
  attackingPieces.push(...getAttackingBishopsOrQueens(boardState, cell, i, j))
  attackingPieces.push(...getAttackingRooksOrQueens(boardState, cell, i, j))
  return attackingPieces.length > 0
}

const prepareCellInitialState = (i) => {
  const [x, y] = i.split("")
  let figure;
  let side;
  let color;
  if (["1", "2"].includes(y)) {
    // if (["1"].includes(y)) {
    side = sides.ME
    color = colors.WHITE
  }
  if (["7", "8"].includes(y)) {
    // if (["8"].includes(y)) {
    side = sides.OPPONENT
    color = colors.BLACK
  }
  if (y === "2" || y === "7") {
    figure = figures.PAWN
  }
  if (["a1", "h1", "a8", "h8"].includes(i)) {
    figure = figures.ROOK
  }
  if (["b1", "g1", "b8", "g8"].includes(i)) {
    figure = figures.HORSE
  }
  if (["c1", "f1", "c8", "f8"].includes(i)) {
    figure = figures.BISHOP
  }
  if (["d1", "d8"].includes(i)) {
    figure = figures.QUEEN
  }
  if (["e1", "e8"].includes(i)) {
    figure = figures.KING
  }
  return {
    x,
    y,
    figure,
    side,
    color,
    possibleMove: false
  }
}

const getPossibleMovesForWhitePawn = (boardState, previousMove, cell, i, j) => {
  const activeCells = []

  const oneForward = getCell(boardState, i - 1, j)
  if (!oneForward.figure) {
    activeCells.push(oneForward)

    if (cell.y === "2") {
      const twoForward = getCell(boardState, i - 2, j)
      if (!twoForward.figure) activeCells.push(twoForward)
    }
  }

  const [left, right] = [getCell(boardState, i - 1, j - 1), getCell(boardState, i - 1, j + 1)]
  if (left && left.figure && left.side === sides.OPPONENT) activeCells.push(left)
  if (right && right.figure && right.side === sides.OPPONENT) activeCells.push(right)

  if (!previousMove.to) return activeCells

  if (previousMove.to.y === "5" && previousMove.from.y === "7" && cell.y === "5") {
    const [enPassantLeft, enPassantRight] = [getCell(boardState, i, j - 1), getCell(boardState, i, j + 1)]

    if (previousMove.to.x === enPassantLeft.x) {
      activeCells.push(getCell(boardState, i - 1, j - 1))
    }
    if (previousMove.to.x === enPassantRight.x) {
      activeCells.push(getCell(boardState, i - 1, j + 1))
    }
  }

  return activeCells
}

const getPossibleMovesForBlackPawn = (boardState, previousMove, cell, i, j) => {
  const activeCells = []

  const oneForward = getCell(boardState, i + 1, j)
  if (!oneForward.figure) {
    activeCells.push(oneForward)

    if (cell.y === "7") {
      const twoForward = getCell(boardState, i + 2, j)
      if (!twoForward.figure) activeCells.push(twoForward)
    }
  }

  const [left, right] = [getCell(boardState, i + 1, j - 1), getCell(boardState, i + 1, j + 1)]
  if (left && left.figure && left.side === sides.OPPONENT) activeCells.push(left)
  if (right && right.figure && right.side === sides.OPPONENT) activeCells.push(right)

  if (!previousMove.to) return activeCells


  if (previousMove.to.y === "4" && previousMove.from.y === "2" && cell.y === "4") {
    const [enPassantLeft, enPassantRight] = [getCell(boardState, i, j - 1), getCell(boardState, i, j + 1)]

    if (previousMove.to.x === enPassantLeft.x) {
      activeCells.push(getCell(boardState, i + 1, j - 1))
    }
    if (previousMove.to.x === enPassantRight.x) {
      activeCells.push(getCell(boardState, i + 1, j + 1))
    }
  }

  return activeCells
}

const getPossibleMovesForPawn = (boardState, previousMove, cell, i, j) => {
  const activeCells = []

  if (cell.color === colors.WHITE) {
    activeCells.push(...getPossibleMovesForWhitePawn(boardState, previousMove, cell, i, j))
  } else if (cell.color === colors.BLACK) {
    activeCells.push(...getPossibleMovesForBlackPawn(boardState, previousMove, cell, i, j))
  }


  if (previousMove.figure === figures.PAWN &&
    (cell.y === "5" && cell.color === colors.WHITE) ||
    (cell.y === "6" && cell.color === colors.BLACK)) {
  }

  // TODO if king on the same diagonal
  // TODO and if queen or bishop on the same diagonal
  // TODO if king on the same row/line
  // TODO and if queen or rook on the same row/line
  // TODO if two true than can't move
  // TODO else if can take that queen/rook/bishop return only that cell
  // TODO else if queen or rook up and king down/queen or rook down and king up = can move
  // TODO else can't move

  return activeCells
}

const getPossibleMovesForHorse = (boardState, cell, i, j) => {
  const horseMoves = [
    getCell(boardState, i - 2, j + 1),
    getCell(boardState, i - 2, j - 1),
    getCell(boardState, i + 2, j + 1),
    getCell(boardState, i + 2, j - 1),
    getCell(boardState, i + 1, j - 2),
    getCell(boardState, i - 1, j - 2),
    getCell(boardState, i + 1, j + 2),
    getCell(boardState, i - 1, j + 2),
  ]

  // TODO if king on the same diagonal
  // TODO and if queen or bishop on the same diagonal
  // TODO if king on the same row/line
  // TODO and if queen or rook on the same row/line
  // TODO if any true can't move

  return horseMoves.filter(i => {
    return i && (!i.figure || i.side === sides.OPPONENT)
  })
}

const getPossibleMovesForRook = (boardState, cell, i, j) => {
  const activeCells = []
  let cursorX = i
  let cursorY = j
  while (true) {
    cursorX++
    let gotCell = getCell(boardState, cursorX, cursorY)
    if (gotCell) {
      if (!gotCell.figure) activeCells.push(gotCell)
      else if (gotCell.side === sides.OPPONENT) {
        activeCells.push(gotCell)
        break
      } else{
        break
      }
    }
    else break;
  }
  cursorX = i
  cursorY = j
  while (true) {
    cursorX--
    let gotCell = getCell(boardState, cursorX, cursorY)
    if (gotCell) {
      if (!gotCell.figure) activeCells.push(gotCell)
      else if (gotCell.side === sides.OPPONENT) {
        activeCells.push(gotCell)
        break
      } else{
        break
      }
    }
    else break;
  }
  cursorX = i
  cursorY = j
  while (true) {
    cursorY++
    let gotCell = getCell(boardState, cursorX, cursorY)
    if (gotCell) {
      if (!gotCell.figure) activeCells.push(gotCell)
      else if (gotCell.side === sides.OPPONENT) {
        activeCells.push(gotCell)
        break
      } else{
        break
      }
    }
    else break;
  }
  cursorX = i
  cursorY = j
  while (true) {
    cursorY--
    let gotCell = getCell(boardState, cursorX, cursorY)
    if (gotCell) {
      if (!gotCell.figure) activeCells.push(gotCell)
      else if (gotCell.side === sides.OPPONENT) {
        activeCells.push(gotCell)
        break
      } else{
        break
      }
    }
    else break;
  }

  // TODO if king on the same diagonal
  // TODO and if queen or bishop on the same diagonal = can't move
  // TODO if king on the same row/line
  // TODO and if queen or rook on the same row/line
  // TODO can move on that row/line

  return activeCells
}

const getPossibleMovesForBishop = (boardState, cell, i, j) => {
  const activeCells = []
  let cursorX = i
  let cursorY = j
  while (true) {
    cursorX++
    cursorY++
    let gotCell = getCell(boardState, cursorX, cursorY)
    if (gotCell) {
      if (!gotCell.figure) activeCells.push(gotCell)
      else if (gotCell.side === sides.OPPONENT) {
        activeCells.push(gotCell)
        break
      } else{
        break
      }
    }
    else break;
  }
  cursorX = i
  cursorY = j
  while (true) {
    cursorX--
    cursorY--
    let gotCell = getCell(boardState, cursorX, cursorY)
    if (gotCell) {
      if (!gotCell.figure) activeCells.push(gotCell)
      else if (gotCell.side === sides.OPPONENT) {
        activeCells.push(gotCell)
        break
      } else{
        break
      }
    }
    else break;
  }
  cursorX = i
  cursorY = j
  while (true) {
    cursorY++
    cursorX--
    let gotCell = getCell(boardState, cursorX, cursorY)
    if (gotCell) {
      if (!gotCell.figure) activeCells.push(gotCell)
      else if (gotCell.side === sides.OPPONENT) {
        activeCells.push(gotCell)
        break
      } else{
        break
      }
    }
    else break;
  }
  cursorX = i
  cursorY = j
  while (true) {
    cursorY--
    cursorX++
    let gotCell = getCell(boardState, cursorX, cursorY)
    if (gotCell) {
      if (!gotCell.figure) activeCells.push(gotCell)
      else if (gotCell.side === sides.OPPONENT) {
        activeCells.push(gotCell)
        break
      } else{
        break
      }
    }
    else break;
  }
  // TODO if king on the same row/line
  // TODO and if queen or rook on the same row/line = can't move
  // TODO if king on the same diagonal
  // TODO and if queen or bishop on the same diagonal
  // TODO can move on that diagonal

  return activeCells
}

const getPossibleMovesForQueen = (boardState, cell, i, j) => {
  const activeCells = []
  activeCells.push(...getPossibleMovesForRook(boardState, cell, i, j))
  activeCells.push(...getPossibleMovesForBishop(boardState, cell, i, j))

  // TODO if king on the same row/line
  // TODO and if queen or rook on the same row/line
  // TODO can move on that row/line break;
  // TODO if king on the same diagonal
  // TODO and if queen or bishop on the same diagonal
  // TODO can move on that diagonal

  return activeCells
}

const getCastlingMoveWhite = (boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved) => {
  const activeCells = []
  if (!kingMoved) {
    if (!shortRookMoved) {
      const moves = [
        getCell(boardState, i, j + 1),
        getCell(boardState, i, j + 2),
      ]
      const movesWithoutFigures = moves.filter(move => move && !move.figure)
      const movesNotUnderAttack = movesWithoutFigures.filter(move => move && !isUnderAttack(boardState, move))

      if (movesNotUnderAttack.length === 2) {
        activeCells.push(getCell(boardState, i, j + 2))
      }
    }
    if (!longRookMoved) {
      const moves = [
        getCell(boardState, i, j - 1),
        getCell(boardState, i, j - 2),
        getCell(boardState, i, j - 3),
      ]
      const movesWithoutFigures = moves.filter(move => move && !move.figure)
      const movesNotUnderAttack = movesWithoutFigures.filter(move => move && !isUnderAttack(boardState, move))

      if (movesNotUnderAttack.length === 3) {
        activeCells.push(getCell(boardState, i, j - 2))
      }
    }
  }
  return activeCells
}

const getCastlingMoveBlack = (boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved) => {
  const activeCells = []
  if (!kingMoved) {
    if (!shortRookMoved) {
      const moves = [
        getCell(boardState, i - 1, j),
        getCell(boardState, i - 2, j),
      ]
      const movesNotUnderAttack = moves.filter(i => isUnderAttack(boardState, cell))
      if (!movesNotUnderAttack.length) {
        activeCells.push(getCell(boardState, i - 2, j))
      }
    }
    if (!longRookMoved) {
      const moves = [
        getCell(boardState, i + 1, j),
        getCell(boardState, i + 2, j),
        getCell(boardState, i + 3, j),
      ]
      const movesNotUnderAttack = moves.filter(i => isUnderAttack(boardState, cell))
      if (!movesNotUnderAttack.length) {
        activeCells.push(getCell(boardState, i + 3, j))
      }
    }
  }
  return activeCells
}

const getPossibleMovesForKing = (boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved) => {
  let kingMoves = [
    getCell(boardState, i - 1, j),
    getCell(boardState, i + 1, j),

    getCell(boardState, i, j + 1),
    getCell(boardState, i, j - 1),

    getCell(boardState, i + 1, j + 1),
    getCell(boardState, i - 1, j + 1),

    getCell(boardState, i + 1, j - 1),
    getCell(boardState, i - 1, j - 1),
  ]
  // TODO check if cell is under attack

  kingMoves = kingMoves.filter(move => {
    return move && (!move.figure || move.side === sides.OPPONENT) && !isUnderAttack(boardState, move)
  })

  if (cell.color === colors.WHITE) {
    kingMoves.push(...getCastlingMoveWhite(boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved))
  } else if (cell.color === colors.BLACK) {
    kingMoves.push(...getCastlingMoveBlack(boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved))
  }

  return kingMoves
}


const getPossibleMoves = (boardState, previousMove, cell, kingMoved, shortRookMoved, longRookMoved) => {
  let activeCells = []
  const i = rows.indexOf(Number(cell.y))
  const j = columns.indexOf(cell.x)

  // TODO if check
  // TODO check attackers
  // TODO if 0 attackers = no check
  // TODO if 1 attacker = get Get all moves that block check or take a piece
  // TODO if 2 or more attackers = no move can block
  // TODO Check for escape squares
  // const possibleMovesThatPreventCheck = getMovesThatPreventCheck()

  switch (cell.figure) {
    case (figures.PAWN):
      activeCells.push(...getPossibleMovesForPawn(boardState, previousMove, cell, i, j))
      break;
    case (figures.BISHOP):
      activeCells.push(...getPossibleMovesForBishop(boardState, cell, i, j))
      break;
    case (figures.HORSE):
      activeCells.push(...getPossibleMovesForHorse(boardState, cell, i, j))
      break;
    case (figures.ROOK):
      activeCells.push(...getPossibleMovesForRook(boardState, cell, i, j))
      break;
    case (figures.QUEEN):
      activeCells.push(...getPossibleMovesForQueen(boardState, cell, i, j))
      break;
    case (figures.KING):
      activeCells.push(...getPossibleMovesForKing(boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved))
      break;
  }

  return activeCells
}

export {
  getCell,
  prepareCellInitialState,
  getPossibleMoves,
  getImg,
  desk,
  sides,
  colors,
  figures,
  rows,
  columns
}

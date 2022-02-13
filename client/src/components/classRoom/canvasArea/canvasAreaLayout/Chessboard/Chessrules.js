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

const getAttackingKings = (boardState, cell, i, j) => {
  const moves = getAllMovesForKing(boardState, cell, i, j)
  return moves.filter(i => i.figure === figures.KING && i.side === sides.OPPONENT)
}

const isUnderAttack = (boardState, cell) => {
  const i = rows.indexOf(Number(cell.y))
  const j = columns.indexOf(cell.x)
  const attackingPieces = []
  attackingPieces.push(...getAttackingPawns(boardState, cell, i, j))
  attackingPieces.push(...getAttackingHorses(boardState, cell, i, j))
  attackingPieces.push(...getAttackingBishopsOrQueens(boardState, cell, i, j))
  attackingPieces.push(...getAttackingRooksOrQueens(boardState, cell, i, j))
  attackingPieces.push(...getAttackingKings(boardState, cell, i, j))
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

const getDiagonalCells = (boardState, start, end) => {
  const startI = rows.indexOf(Number(start.y))
  const startJ = columns.indexOf(start.x)

  const endI = rows.indexOf(Number(end.y))
  const endJ = columns.indexOf(end.x)

  if (Math.max(startI, endI) - Math.min(startI, endI) !== Math.max(startJ, endJ) - Math.min(startJ, endJ)) {
    return []
  }

  const cells = []

  let modI = startI < endI ? 1 : -1
  let modJ = startJ < endJ ? 1 : -1

  for (let i = endI, j = endJ; i !== startI && j !== startJ; i -= modI, j -= modJ) {
    cells.push(getCell(boardState, i, j))
  }
  return cells
}

const getHorizontalCells = (boardState, start, end) => {
  const startI = rows.indexOf(Number(start.y))
  const startJ = columns.indexOf(start.x)

  const endI = rows.indexOf(Number(end.y))
  const endJ = columns.indexOf(end.x)

  const cells = []

  if (startI === endI) {
    if (startJ < endJ) {
      for (let i = startJ + 1; i <= endJ; i++) {
        cells.push(getCell(boardState, startI, i))
      }
    } else if (startJ > endJ) {
      for (let i = endJ; i < startJ; i++) {
        cells.push(getCell(boardState, startI, i))
      }
    }
  } else if (startJ === endJ) {
    if (startI < endI) {
      for (let i = startI + 1; i <= endI; i++) {
        cells.push(getCell(boardState, i, startJ))
      }
    } else if (startI > endI) {
      for (let i = endI; i < startI; i++) {
        cells.push(getCell(boardState, i, startJ))
      }
    }
  } else {
    return []
  }
  return cells
}

const getPossibleMovesForAllPawn = (boardState, previousMove, cell, i, j) => {
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

  // TODO make universal
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

const getPossibleMovesForPawn = (boardState, previousMove, cell, i, j, king) => {
  const activeCells = []

  activeCells.push(...getPossibleMovesForAllPawn(boardState, previousMove, cell, i, j))

  let attackingBishopsOrQueens = getAttackingBishopsOrQueens(boardState, cell, i, j)
  if (attackingBishopsOrQueens.length) {
    attackingBishopsOrQueens = attackingBishopsOrQueens.filter(attacker => getDiagonalCells(boardState, king, attacker).length)
    if (attackingBishopsOrQueens.length) {
      const attackersCoordinates = attackingBishopsOrQueens.map(i => i.x + i.y)
      return activeCells.filter(aCell => attackersCoordinates.includes(aCell.x + aCell.y))
    }
  }

  let attackingRooksOrQueens = getAttackingRooksOrQueens(boardState, cell, i, j)
  if (attackingRooksOrQueens.length) {
    attackingRooksOrQueens = attackingRooksOrQueens.filter(attacker => getHorizontalCells(boardState, king, attacker).length)

    for (let i = 0; i < attackingRooksOrQueens.length; i++) {
      let attacker = attackingRooksOrQueens[i]
      if (attacker.y === cell.y) {
        return []
      } else if (attacker.x === cell.x) {
        return activeCells.filter(aCell => aCell.x === cell.x)
      }
    }
  }

  return activeCells
}

const getPossibleMovesForHorse = (boardState, cell, i, j, king = null) => {
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

  if (!king) {
    return horseMoves.filter(i => {
      return i && (!i.figure || i.side === sides.OPPONENT)
    })
  }

  let attackingBishopsOrQueens = getAttackingBishopsOrQueens(boardState, cell, i, j)
  if (attackingBishopsOrQueens.length) {
    attackingBishopsOrQueens = attackingBishopsOrQueens.filter(attacker => getDiagonalCells(boardState, king, attacker).length)
    if (attackingBishopsOrQueens.length) return []
  }

  let attackingRooksOrQueens = getAttackingRooksOrQueens(boardState, cell, i, j)
  if (attackingRooksOrQueens.length) {
    attackingRooksOrQueens = attackingRooksOrQueens.filter(attacker => getHorizontalCells(boardState, king, attacker).length)
    if (attackingRooksOrQueens.length) return []
  }
  return horseMoves.filter(i => {
    return i && (!i.figure || i.side === sides.OPPONENT)
  })
}

const getPossibleMovesForBishop = (boardState, cell, i, j, king = null) => {
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
      } else {
        break
      }
    } else break;
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
      } else {
        break
      }
    } else break;
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
      } else {
        break
      }
    } else break;
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
      } else {
        break
      }
    } else break;
  }

  if (!king)
    return activeCells

  let attackingBishopsOrQueens = getAttackingBishopsOrQueens(boardState, cell, i, j)
  if (attackingBishopsOrQueens.length) {
    attackingBishopsOrQueens = attackingBishopsOrQueens.filter(attacker => getDiagonalCells(boardState, king, attacker).length)
    if (attackingBishopsOrQueens.length) {
      const attacker = attackingBishopsOrQueens[0]
      const cellCoordinate = cell.x + cell.y
      return getDiagonalCells(boardState, king, attacker).filter(i => i.x + i.y !== cellCoordinate)
    }
  }

  let attackingRooksOrQueens = getAttackingRooksOrQueens(boardState, cell, i, j)
  if (attackingRooksOrQueens.length) {
    attackingRooksOrQueens = attackingRooksOrQueens.filter(attacker => getHorizontalCells(boardState, king, attacker).length)
    if (attackingRooksOrQueens.length) return []
  }
  return activeCells
}

const getPossibleMovesForRook = (boardState, cell, i, j, king = null) => {
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
      } else {
        break
      }
    } else break;
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
      } else {
        break
      }
    } else break;
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
      } else {
        break
      }
    } else break;
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
      } else {
        break
      }
    } else break;
  }

  if (!king)
    return activeCells

  let attackingBishopsOrQueens = getAttackingBishopsOrQueens(boardState, cell, i, j)
  if (attackingBishopsOrQueens.length) {
    attackingBishopsOrQueens = attackingBishopsOrQueens.filter(attacker => getDiagonalCells(boardState, king, attacker).length)
    if (attackingBishopsOrQueens.length) return []

  }

  let attackingRooksOrQueens = getAttackingRooksOrQueens(boardState, cell, i, j)
  if (attackingRooksOrQueens.length) {
    attackingRooksOrQueens = attackingRooksOrQueens.filter(attacker => getHorizontalCells(boardState, king, attacker).length)
    if (attackingRooksOrQueens.length) {
      const attacker = attackingRooksOrQueens[0]
      const cellCoordinate = cell.x + cell.y
      return getHorizontalCells(boardState, king, attacker).filter(i => i.x + i.y !== cellCoordinate)
    }
  }
  return activeCells
}

const getPossibleMovesForQueen = (boardState, cell, i, j, kingCell) => {
  const activeCells = []
  activeCells.push(...getPossibleMovesForRook(boardState, cell, i, j, kingCell))
  activeCells.push(...getPossibleMovesForBishop(boardState, cell, i, j, kingCell))
  return activeCells
}

const getCastlingMoves = (boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved) => {
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

const getAllMovesForKing = (boardState, cell, i, j) => {
  return [
    getCell(boardState, i - 1, j),
    getCell(boardState, i + 1, j),

    getCell(boardState, i, j + 1),
    getCell(boardState, i, j - 1),

    getCell(boardState, i + 1, j + 1),
    getCell(boardState, i - 1, j + 1),

    getCell(boardState, i + 1, j - 1),
    getCell(boardState, i - 1, j - 1),
  ].filter(move => !!move)

}

const getPossibleMovesForKing = (boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved) => {
  let kingMoves = getAllMovesForKing(boardState, cell, i, j)
  const boardStateWithNoKing = boardState.map(_ => _.map(i => {
    if (i.figure === figures.KING && i.side === sides.ME) {
      return {
        ...i,
        figure: undefined,
        side: undefined,
        color: undefined
      }

    }
    return i
  }))
  kingMoves = kingMoves.filter(move => {
    return (!move.figure || move.side === sides.OPPONENT) && !isUnderAttack(boardStateWithNoKing, move)
  })

  kingMoves.push(...getCastlingMoves(boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved))

  return kingMoves
}

const getKing = (boardState) => {
  let kingCell
  boardState.forEach(_ => _.forEach(cell => {
    if (cell.figure === figures.KING && cell.side === sides.ME) {
      kingCell = cell
    }
  }))
  return kingCell
}

const getAttackers = (boardState, kingCell) => {
  const i = rows.indexOf(Number(kingCell.y))
  const j = columns.indexOf(kingCell.x)
  const attackers = []
  attackers.push(...getAttackingPawns(boardState, kingCell, i, j))
  attackers.push(...getAttackingHorses(boardState, kingCell, i, j))
  attackers.push(...getAttackingBishopsOrQueens(boardState, kingCell, i, j))
  attackers.push(...getAttackingRooksOrQueens(boardState, kingCell, i, j))
  return attackers
}

const getLegalMovesDuringCheck = (boardState, kingCell, attackers) => {
  const legalMoves = []

  if (attackers.length === 1) {
    const attacker = attackers[0]
    if (attacker.figure === figures.PAWN || attacker.figure === figures.HORSE) {
      legalMoves.push(attacker)
    } else {
      legalMoves.push(...getDiagonalCells(boardState, kingCell, attacker))
      legalMoves.push(...getHorizontalCells(boardState, kingCell, attacker))
    }
  }

  return legalMoves
}

const getPossibleMoves = (boardState, previousMove, cell, kingMoved, shortRookMoved, longRookMoved) => {
  let activeCells = []
  const i = rows.indexOf(Number(cell.y))
  const j = columns.indexOf(cell.x)
  const kingCell = getKing(boardState)
  const isCheck = isUnderAttack(boardState, kingCell)

  switch (cell.figure) {
    case (figures.PAWN):
      activeCells.push(...getPossibleMovesForPawn(boardState, previousMove, cell, i, j, kingCell))
      break;
    case (figures.HORSE):
      activeCells.push(...getPossibleMovesForHorse(boardState, cell, i, j, kingCell))
      break;
    case (figures.BISHOP):
      activeCells.push(...getPossibleMovesForBishop(boardState, cell, i, j, kingCell))
      break;
    case (figures.ROOK):
      activeCells.push(...getPossibleMovesForRook(boardState, cell, i, j, kingCell))
      break;
    case (figures.QUEEN):
      activeCells.push(...getPossibleMovesForQueen(boardState, cell, i, j, kingCell))
      break;
    case (figures.KING):
      activeCells.push(...getPossibleMovesForKing(boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved))
      break;
  }

  if (isCheck) {
    const attackers = getAttackers(boardState, kingCell)
    const legalMovesDuringCheck = getLegalMovesDuringCheck(boardState, kingCell, attackers)
    const legalMovesCoordinates = legalMovesDuringCheck.map(i => i.x + i.y)

    if (cell.figure !== figures.KING) {
      activeCells = activeCells.filter(aCell => legalMovesCoordinates.includes(aCell.x + aCell.y))
    }

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

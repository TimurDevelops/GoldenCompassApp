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

class ChessLogic {
  static colors = {
    WHITE: "WHITE",
    BLACK: "BLACK"
  }
  static figures = {
    PAWN: "PAWN",
    HORSE: "HORSE",
    BISHOP: "BISHOP",
    ROOK: "ROOK",
    QUEEN: "QUEEN",
    KING: "KING",
  }
  static sides = {
    OPPONENT: "OPPONENT",
    ME: "ME"
  }

  constructor(rows, columns) {
    this.rows = rows
    this.columns = columns
  }

  // *** MAIN METHODS *** //

  getCell(boardState, x, y) {
    if (x < 0 || x > 7 || y < 0 || y > 7) return

    return boardState[x][y]
  }

  getKing(boardState) {
    let kingCell
    boardState.forEach(_ => _.forEach(cell => {
      if (cell.figure === ChessLogic.figures.KING && cell.side === ChessLogic.sides.ME) {
        kingCell = cell
      }
    }))
    return kingCell
  }

  getImg(figureColor) {
    switch (figureColor) {
      case (ChessLogic.figures.PAWN + ChessLogic.colors.BLACK):
        return blackPawn;
      case (ChessLogic.figures.BISHOP + ChessLogic.colors.BLACK):
        return blackBishop;
      case (ChessLogic.figures.HORSE + ChessLogic.colors.BLACK):
        return blackHorse;
      case (ChessLogic.figures.ROOK + ChessLogic.colors.BLACK):
        return blackRook;
      case (ChessLogic.figures.QUEEN + ChessLogic.colors.BLACK):
        return blackQueen;
      case (ChessLogic.figures.KING + ChessLogic.colors.BLACK):
        return blackKing;
      case (ChessLogic.figures.PAWN + ChessLogic.colors.WHITE):
        return whitePawn;
      case (ChessLogic.figures.BISHOP + ChessLogic.colors.WHITE):
        return whiteBishop;
      case (ChessLogic.figures.HORSE + ChessLogic.colors.WHITE):
        return whiteHorse;
      case (ChessLogic.figures.ROOK + ChessLogic.colors.WHITE):
        return whiteRook;
      case (ChessLogic.figures.QUEEN + ChessLogic.colors.WHITE):
        return whiteQueen;
      case (ChessLogic.figures.KING + ChessLogic.colors.WHITE):
        return whiteKing;
    }
  }

  prepareCellInitialState = (i, isPlayingAsWhite) => {
    const [x, y] = i.split("")
    let figure;
    let side;
    let color;
    if (["1", "2"].includes(y)) {
      side = isPlayingAsWhite ? ChessLogic.sides.ME : ChessLogic.sides.OPPONENT
      color = ChessLogic.colors.WHITE
    }
    if (["7", "8"].includes(y)) {
      side = isPlayingAsWhite ? ChessLogic.sides.OPPONENT : ChessLogic.sides.ME
      color = ChessLogic.colors.BLACK
    }
    if (y === "2" || y === "7") {
      figure = ChessLogic.figures.PAWN
    }
    if (["a1", "h1", "a8", "h8"].includes(i)) {
      figure = ChessLogic.figures.ROOK
    }
    if (["b1", "g1", "b8", "g8"].includes(i)) {
      figure = ChessLogic.figures.HORSE
    }
    if (["c1", "f1", "c8", "f8"].includes(i)) {
      figure = ChessLogic.figures.BISHOP
    }
    if (["d1", "d8"].includes(i)) {
      figure = ChessLogic.figures.QUEEN
    }
    if (["e1", "e8"].includes(i)) {
      figure = ChessLogic.figures.KING
    }
    return {
      x,
      y,
      figure: figure ? figure : null,
      side: side ? side : null,
      color: color ? color : null,
      possibleMove: false
    }
  }

  // *** MAIN METHODS END *** //

  // *** GET ATTACKERS METHODS *** //

  getAttackingPawns(boardState, cell, i, j) {
    const moves = [
      this.getCell(boardState, i - 1, j - 1),
      this.getCell(boardState, i - 1, j + 1)
    ]

    return moves.filter(move => move && move.figure === ChessLogic.figures.PAWN && move.side === ChessLogic.sides.OPPONENT)
  }

  getAttackingHorses(boardState, cell, i, j) {
    const moves = this.getPossibleMovesForHorse(boardState, cell, i, j)
    return moves.filter(i => i.figure === ChessLogic.figures.HORSE)
  }

  getAttackingBishopsOrQueens(boardState, cell, i, j) {
    const moves = this.getPossibleMovesForBishop(boardState, cell, i, j)
    return moves.filter(i => i.figure === ChessLogic.figures.BISHOP || i.figure === ChessLogic.figures.QUEEN)
  }

  getAttackingRooksOrQueens(boardState, cell, i, j) {
    const moves = this.getPossibleMovesForRook(boardState, cell, i, j)
    return moves.filter(i => i.figure === ChessLogic.figures.ROOK || i.figure === ChessLogic.figures.QUEEN)
  }

  getAttackingKings(boardState, cell, i, j) {
    const moves = this.getAllMovesForKing(boardState, cell, i, j)
    return moves.filter(i => i.figure === ChessLogic.figures.KING && i.side === ChessLogic.sides.OPPONENT)
  }

  isUnderAttack(boardState, cell) {
    const i = this.rows.indexOf(Number(cell.y))
    const j = this.columns.indexOf(cell.x)
    const attackingPieces = []
    attackingPieces.push(...this.getAttackingPawns(boardState, cell, i, j))
    attackingPieces.push(...this.getAttackingHorses(boardState, cell, i, j))
    attackingPieces.push(...this.getAttackingBishopsOrQueens(boardState, cell, i, j))
    attackingPieces.push(...this.getAttackingRooksOrQueens(boardState, cell, i, j))
    attackingPieces.push(...this.getAttackingKings(boardState, cell, i, j))
    return attackingPieces.length > 0
  }

  getAttackers(boardState, kingCell) {
    const i = this.rows.indexOf(Number(kingCell.y))
    const j = this.columns.indexOf(kingCell.x)
    const attackers = []
    attackers.push(...this.getAttackingPawns(boardState, kingCell, i, j))
    attackers.push(...this.getAttackingHorses(boardState, kingCell, i, j))
    attackers.push(...this.getAttackingBishopsOrQueens(boardState, kingCell, i, j))
    attackers.push(...this.getAttackingRooksOrQueens(boardState, kingCell, i, j))
    return attackers
  }

  // *** GET ATTACKERS METHODS END *** //

  // *** GET DIAGONAL/HORIZONTAL METHODS *** //

  getDiagonalCells(boardState, start, end) {
    const startI = this.rows.indexOf(Number(start.y))
    const startJ = this.columns.indexOf(start.x)

    const endI = this.rows.indexOf(Number(end.y))
    const endJ = this.columns.indexOf(end.x)

    if (Math.max(startI, endI) - Math.min(startI, endI) !== Math.max(startJ, endJ) - Math.min(startJ, endJ)) {
      return []
    }

    const cells = []

    let modI = startI < endI ? 1 : -1
    let modJ = startJ < endJ ? 1 : -1

    for (let i = endI, j = endJ; i !== startI && j !== startJ; i -= modI, j -= modJ) {
      cells.push(this.getCell(boardState, i, j))
    }
    return cells
  }

  getHorizontalCells(boardState, start, end) {
    const startI = this.rows.indexOf(Number(start.y))
    const startJ = this.columns.indexOf(start.x)

    const endI = this.rows.indexOf(Number(end.y))
    const endJ = this.columns.indexOf(end.x)

    const cells = []

    if (startI === endI) {
      if (startJ < endJ) {
        for (let i = startJ + 1; i <= endJ; i++) {
          cells.push(this.getCell(boardState, startI, i))
        }
      } else if (startJ > endJ) {
        for (let i = endJ; i < startJ; i++) {
          cells.push(this.getCell(boardState, startI, i))
        }
      }
    } else if (startJ === endJ) {
      if (startI < endI) {
        for (let i = startI + 1; i <= endI; i++) {
          cells.push(this.getCell(boardState, i, startJ))
        }
      } else if (startI > endI) {
        for (let i = endI; i < startI; i++) {
          cells.push(this.getCell(boardState, i, startJ))
        }
      }
    } else {
      return []
    }
    return cells
  }

  // *** GET DIAGONAL/HORIZONTAL METHODS END *** //

  // *** GET MOVES FOR FIGURES METHODS *** //

  getAllMovesForPawn(boardState, previousMove, cell, i, j) {
    const activeCells = []

    const oneForward = this.getCell(boardState, i - 1, j)
    if (!oneForward.figure) {
      activeCells.push(oneForward)

      if (i === 6) {
        const twoForward = this.getCell(boardState, i - 2, j)
        if (!twoForward.figure) activeCells.push(twoForward)
      }
    }

    const [left, right] = [this.getCell(boardState, i - 1, j - 1), this.getCell(boardState, i - 1, j + 1)]
    if (left && left.figure && left.side === ChessLogic.sides.OPPONENT) activeCells.push(left)
    if (right && right.figure && right.side === ChessLogic.sides.OPPONENT) activeCells.push(right)

    if (!previousMove.to) return activeCells

    const prevToI = this.rows.indexOf(Number(previousMove.to.y))
    const prevFromI = this.rows.indexOf(Number(previousMove.from.y))
    if (prevToI === 3 && prevFromI === 1 && i === 3) {
      const [enPassantLeft, enPassantRight] = [this.getCell(boardState, i, j - 1), this.getCell(boardState, i, j + 1)]

      if (previousMove.to.x === enPassantLeft.x) {
        activeCells.push(this.getCell(boardState, i - 1, j - 1))
      }
      if (previousMove.to.x === enPassantRight.x) {
        activeCells.push(this.getCell(boardState, i - 1, j + 1))
      }
    }

    return activeCells
  }

  getPossibleMovesForPawn(boardState, previousMove, cell, i, j, king) {
    const activeCells = []

    activeCells.push(...this.getAllMovesForPawn(boardState, previousMove, cell, i, j))

    let attackingBishopsOrQueens = this.getAttackingBishopsOrQueens(boardState, cell, i, j)
    if (attackingBishopsOrQueens.length) {
      attackingBishopsOrQueens = attackingBishopsOrQueens.filter(attacker => this.getDiagonalCells(boardState, king, attacker).length)
      if (attackingBishopsOrQueens.length) {
        const attackersCoordinates = attackingBishopsOrQueens.map(i => i.x + i.y)
        return activeCells.filter(aCell => attackersCoordinates.includes(aCell.x + aCell.y))
      }
    }

    let attackingRooksOrQueens = this.getAttackingRooksOrQueens(boardState, cell, i, j)
    if (attackingRooksOrQueens.length) {
      attackingRooksOrQueens = attackingRooksOrQueens.filter(attacker => this.getHorizontalCells(boardState, king, attacker).length)

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

  getPossibleMovesForHorse(boardState, cell, i, j, king = null) {
    const horseMoves = [
      this.getCell(boardState, i - 2, j + 1),
      this.getCell(boardState, i - 2, j - 1),
      this.getCell(boardState, i + 2, j + 1),
      this.getCell(boardState, i + 2, j - 1),
      this.getCell(boardState, i + 1, j - 2),
      this.getCell(boardState, i - 1, j - 2),
      this.getCell(boardState, i + 1, j + 2),
      this.getCell(boardState, i - 1, j + 2),
    ]

    if (!king) {
      return horseMoves.filter(i => {
        return i && (!i.figure || i.side === ChessLogic.sides.OPPONENT)
      })
    }

    let attackingBishopsOrQueens = this.getAttackingBishopsOrQueens(boardState, cell, i, j)
    if (attackingBishopsOrQueens.length) {
      attackingBishopsOrQueens = attackingBishopsOrQueens.filter(attacker => this.getDiagonalCells(boardState, king, attacker).length)
      if (attackingBishopsOrQueens.length) return []
    }

    let attackingRooksOrQueens = this.getAttackingRooksOrQueens(boardState, cell, i, j)
    if (attackingRooksOrQueens.length) {
      attackingRooksOrQueens = attackingRooksOrQueens.filter(attacker => this.getHorizontalCells(boardState, king, attacker).length)
      if (attackingRooksOrQueens.length) return []
    }
    return horseMoves.filter(i => {
      return i && (!i.figure || i.side === ChessLogic.sides.OPPONENT)
    })
  }

  getPossibleMovesForBishop(boardState, cell, i, j, king = null) {
    const activeCells = []
    let cursorX = i
    let cursorY = j
    while (true) {
      cursorX++
      cursorY++
      let gotCell = this.getCell(boardState, cursorX, cursorY)
      if (gotCell) {
        if (!gotCell.figure) activeCells.push(gotCell)
        else if (gotCell.side === ChessLogic.sides.OPPONENT) {
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
      let gotCell = this.getCell(boardState, cursorX, cursorY)
      if (gotCell) {
        if (!gotCell.figure) activeCells.push(gotCell)
        else if (gotCell.side === ChessLogic.sides.OPPONENT) {
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
      let gotCell = this.getCell(boardState, cursorX, cursorY)
      if (gotCell) {
        if (!gotCell.figure) activeCells.push(gotCell)
        else if (gotCell.side === ChessLogic.sides.OPPONENT) {
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
      let gotCell = this.getCell(boardState, cursorX, cursorY)
      if (gotCell) {
        if (!gotCell.figure) activeCells.push(gotCell)
        else if (gotCell.side === ChessLogic.sides.OPPONENT) {
          activeCells.push(gotCell)
          break
        } else {
          break
        }
      } else break;
    }

    if (!king)
      return activeCells

    let attackingBishopsOrQueens = this.getAttackingBishopsOrQueens(boardState, cell, i, j)
    if (attackingBishopsOrQueens.length) {
      attackingBishopsOrQueens = attackingBishopsOrQueens.filter(attacker => this.getDiagonalCells(boardState, king, attacker).length)
      if (attackingBishopsOrQueens.length) {
        const attacker = attackingBishopsOrQueens[0]
        const cellCoordinate = cell.x + cell.y
        return this.getDiagonalCells(boardState, king, attacker).filter(i => i.x + i.y !== cellCoordinate)
      }
    }

    let attackingRooksOrQueens = this.getAttackingRooksOrQueens(boardState, cell, i, j)
    if (attackingRooksOrQueens.length) {
      attackingRooksOrQueens = attackingRooksOrQueens.filter(attacker => this.getHorizontalCells(boardState, king, attacker).length)
      if (attackingRooksOrQueens.length) return []
    }
    return activeCells
  }

  getPossibleMovesForRook(boardState, cell, i, j, king = null) {
    const activeCells = []
    let cursorX = i
    let cursorY = j
    while (true) {
      cursorX++
      let gotCell = this.getCell(boardState, cursorX, cursorY)
      if (gotCell) {
        if (!gotCell.figure) activeCells.push(gotCell)
        else if (gotCell.side === ChessLogic.sides.OPPONENT) {
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
      let gotCell = this.getCell(boardState, cursorX, cursorY)
      if (gotCell) {
        if (!gotCell.figure) activeCells.push(gotCell)
        else if (gotCell.side === ChessLogic.sides.OPPONENT) {
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
      let gotCell = this.getCell(boardState, cursorX, cursorY)
      if (gotCell) {
        if (!gotCell.figure) activeCells.push(gotCell)
        else if (gotCell.side === ChessLogic.sides.OPPONENT) {
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
      let gotCell = this.getCell(boardState, cursorX, cursorY)
      if (gotCell) {
        if (!gotCell.figure) activeCells.push(gotCell)
        else if (gotCell.side === ChessLogic.sides.OPPONENT) {
          activeCells.push(gotCell)
          break
        } else {
          break
        }
      } else break;
    }

    if (!king)
      return activeCells

    let attackingBishopsOrQueens = this.getAttackingBishopsOrQueens(boardState, cell, i, j)
    if (attackingBishopsOrQueens.length) {
      attackingBishopsOrQueens = attackingBishopsOrQueens.filter(attacker => this.getDiagonalCells(boardState, king, attacker).length)
      if (attackingBishopsOrQueens.length) return []

    }

    let attackingRooksOrQueens = this.getAttackingRooksOrQueens(boardState, cell, i, j)
    if (attackingRooksOrQueens.length) {
      attackingRooksOrQueens = attackingRooksOrQueens.filter(attacker => this.getHorizontalCells(boardState, king, attacker).length)
      if (attackingRooksOrQueens.length) {
        const attacker = attackingRooksOrQueens[0]
        const cellCoordinate = cell.x + cell.y
        return this.getHorizontalCells(boardState, king, attacker).filter(i => i.x + i.y !== cellCoordinate)
      }
    }
    return activeCells
  }

  getPossibleMovesForQueen = (boardState, cell, i, j, kingCell) => {
    const activeCells = []
    activeCells.push(...this.getPossibleMovesForRook(boardState, cell, i, j, kingCell))
    activeCells.push(...this.getPossibleMovesForBishop(boardState, cell, i, j, kingCell))
    return activeCells
  }

  getCastlingMovesWhite(boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved) {
    let sign
    if (cell.color === ChessLogic.colors.WHITE) {
      sign = 1
    } else {
      sign = -1
    }

    const activeCells = []
    if (!kingMoved) {
      if (!shortRookMoved) {
        const moves = [
          this.getCell(boardState, i, j + (sign)),
          this.getCell(boardState, i, j + (2 * sign)),
        ]
        const movesWithoutFigures = moves.filter(move => move && !move.figure)
        const movesNotUnderAttack = movesWithoutFigures.filter(move => move && !this.isUnderAttack(boardState, move))

        if (movesNotUnderAttack.length === 2) {
          activeCells.push(this.getCell(boardState, i, j + (2 * sign)))
        }
      }
      if (!longRookMoved) {
        const moves = [
          this.getCell(boardState, i, j - (sign)),
          this.getCell(boardState, i, j - (2 * sign)),
          this.getCell(boardState, i, j - (3 * sign)),
        ]
        const movesWithoutFigures = moves.filter(move => move && !move.figure)
        const movesNotUnderAttack = movesWithoutFigures.filter(move => move && !this.isUnderAttack(boardState, move))

        if (movesNotUnderAttack.length === 3) {
          activeCells.push(this.getCell(boardState, i, j - (2 * sign)))
        }
      }
    }
    return activeCells
  }

  getAllMovesForKing(boardState, cell, i, j) {
    return [
      this.getCell(boardState, i - 1, j),
      this.getCell(boardState, i + 1, j),

      this.getCell(boardState, i, j + 1),
      this.getCell(boardState, i, j - 1),

      this.getCell(boardState, i + 1, j + 1),
      this.getCell(boardState, i - 1, j + 1),

      this.getCell(boardState, i + 1, j - 1),
      this.getCell(boardState, i - 1, j - 1),
    ].filter(move => !!move)

  }

  getPossibleMovesForKing(boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved) {
    let kingMoves = this.getAllMovesForKing(boardState, cell, i, j)
    const boardStateWithNoKing = boardState.map(_ => _.map(i => {
      if (i.figure === ChessLogic.figures.KING && i.side === ChessLogic.sides.ME) {
        return {
          ...i,
          figure: null,
          side: null,
          color: null
        }

      }
      return i
    }))
    kingMoves = kingMoves.filter(move => {
      return (!move.figure || move.side === ChessLogic.sides.OPPONENT) && !this.isUnderAttack(boardStateWithNoKing, move)
    })

    kingMoves.push(...this.getCastlingMovesWhite(boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved))

    return kingMoves
  }

  // *** GET MOVES FOR FIGURES METHODS END *** //

  // *** GET POSSIBLE MOVES METHODS *** //

  getLegalMovesDuringCheck(boardState, kingCell, attackers) {
    const legalMoves = []

    if (attackers.length === 1) {
      const attacker = attackers[0]
      if (attacker.figure === ChessLogic.figures.PAWN || attacker.figure === ChessLogic.figures.HORSE) {
        legalMoves.push(attacker)
      } else {
        legalMoves.push(...this.getDiagonalCells(boardState, kingCell, attacker))
        legalMoves.push(...this.getHorizontalCells(boardState, kingCell, attacker))
      }
    }

    return legalMoves
  }

  getPossibleMoves(boardState, previousMove, cell, kingMoved, shortRookMoved, longRookMoved) {
    let activeCells = []
    const i = this.rows.indexOf(Number(cell.y))
    const j = this.columns.indexOf(cell.x)
    const kingCell = this.getKing(boardState)
    const isCheck = this.isUnderAttack(boardState, kingCell)

    switch (cell.figure) {
      case (ChessLogic.figures.PAWN):
        activeCells.push(...this.getPossibleMovesForPawn(boardState, previousMove, cell, i, j, kingCell))
        break;
      case (ChessLogic.figures.HORSE):
        activeCells.push(...this.getPossibleMovesForHorse(boardState, cell, i, j, kingCell))
        break;
      case (ChessLogic.figures.BISHOP):
        activeCells.push(...this.getPossibleMovesForBishop(boardState, cell, i, j, kingCell))
        break;
      case (ChessLogic.figures.ROOK):
        activeCells.push(...this.getPossibleMovesForRook(boardState, cell, i, j, kingCell))
        break;
      case (ChessLogic.figures.QUEEN):
        activeCells.push(...this.getPossibleMovesForQueen(boardState, cell, i, j, kingCell))
        break;
      case (ChessLogic.figures.KING):
        activeCells.push(...this.getPossibleMovesForKing(boardState, cell, i, j, kingMoved, shortRookMoved, longRookMoved))
        break;
    }

    if (isCheck) {
      const attackers = this.getAttackers(boardState, kingCell)
      const legalMovesDuringCheck = this.getLegalMovesDuringCheck(boardState, kingCell, attackers)
      const legalMovesCoordinates = legalMovesDuringCheck.map(i => i.x + i.y)

      if (cell.figure !== ChessLogic.figures.KING) {
        activeCells = activeCells.filter(aCell => legalMovesCoordinates.includes(aCell.x + aCell.y))
      }

    }

    return activeCells
  }

  // *** GET POSSIBLE MOVES METHODS END *** //

  // *** CHECK MOVES METHODS END *** //

  checkCastlingMoves(boardState, from, to) {
    let fromTwo, toTwo
    const fromJ = this.columns.indexOf(from.x)
    const toI = this.rows.indexOf(Number(to.y))
    const toJ = this.columns.indexOf(to.x)
    const rules = new ChessLogic(this.rows, this.columns)

    if (from.figure === ChessLogic.figures.KING) {
      if (fromJ - toJ === -2) {
        fromTwo = rules.getCell(boardState, toI, 7)
        toTwo = rules.getCell(boardState, toI, fromJ + 1)
      } else if (fromJ - toJ === 2) {
        fromTwo = rules.getCell(boardState, toI, 0)
        toTwo = rules.getCell(boardState, toI, toJ + 1)
      }
    }

    return [fromTwo, toTwo]
  }

  checkAnPassant(boardState, from, to) {
    const i = this.rows.indexOf(Number(to.y))
    const j = this.columns.indexOf(to.x)
    if (from.figure === ChessLogic.figures.PAWN && from.x !== to.x && !to.figure) {
      return new ChessLogic(this.rows, this.columns).getCell(boardState, i + 1, j)
    }
  }


}

export {
  ChessLogic
}

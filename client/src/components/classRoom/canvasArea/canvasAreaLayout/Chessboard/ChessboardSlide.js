import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Chessboard from "./Chessboard";
import {ChessLogic} from "./ChessLogic";

import './Chessboard.scss'

const ChessboardSlide = ({room, visible}) => {
  const [whiteKingMoved, setWhiteKingMoved] = useState(false)
  const [blackKingMoved, setBlackKingMoved] = useState(false)
  const [whiteShortRookMoved, setWhiteShortRookMoved] = useState(false)
  const [blackShortRookMoved, setBlackShortRookMoved] = useState(false)
  const [whiteLongRookMoved, setWhiteLongRookMoved] = useState(false)
  const [blackLongRookMoved, setBlackLongRookMoved] = useState(false)

  const [isPlayingAsWhite, setIsPlayingAsWhite] = useState(true)
  const [isWhiteTurn, setIsWhiteTurn] = useState(true)
  const [activeSwitch, setActiveSwitch] = useState(false)

  const [rows, setRows] = useState([8, 7, 6, 5, 4, 3, 2, 1])
  const [columns, setColumns] = useState(["a", "b", "c", "d", "e", "f", "g", "h"])
  const [desk, setDesk] = useState(rows.map(i => columns.map(j => `${j}${i}`)))

  const [previousMoves, setPreviousMoves] = useState([])
  const [takenBackMoves, setTakenBackMoves] = useState([])

  useEffect(() => {
    if (!activeSwitch) {
      setActiveSwitch(true)
      return
    }
    const oldRows = [...rows]
    const oldColumns = [...columns]
    const newRows = rows.reverse()
    const newColumns = columns.reverse()
    const oldState = boardState
    const newDesk = newRows.map(i => newColumns.map(j => `${j}${i}`))

    setBoardState(newDesk.map(_ => _.map(field => {
      const [x, y] = field.split("")

      const i = oldRows.indexOf(Number(y))
      const j = oldColumns.indexOf(x)
      const logic = new ChessLogic(rows, columns)

      const cell = logic.getCell(oldState, i, j)


      let side
      if (isPlayingAsWhite) {
        if (cell.color === ChessLogic.colors.WHITE) {
          side = ChessLogic.sides.ME
        }
        if (cell.color === ChessLogic.colors.BLACK) {
          side = ChessLogic.sides.OPPONENT
        }
      } else {
        if (cell.color === ChessLogic.colors.WHITE) {
          side = ChessLogic.sides.OPPONENT
        }
        if (cell.color === ChessLogic.colors.BLACK) {
          side = ChessLogic.sides.ME
        }
      }

      return {
        ...cell,
        side: side
      }
    })))

    setRows(newRows)
    setColumns(newColumns)
    setDesk(newDesk)

  }, [isPlayingAsWhite])

  const [boardState, setBoardState] = useState(desk.map(_ => _.map(i => {
    return new ChessLogic(rows, columns).prepareCellInitialState(i, isPlayingAsWhite)
  })))

  const checkCastlingRights = (from) => {
    if (from.figure === ChessLogic.figures.KING) {
      if (from.color === ChessLogic.colors.WHITE) {
        setWhiteKingMoved(true)
      } else {
        setBlackKingMoved(true)
      }
    }
    if (from.figure === ChessLogic.figures.ROOK && from.x === "a") {
      if (from.color === ChessLogic.colors.WHITE) {
        setWhiteShortRookMoved(true)
      } else {
        setBlackShortRookMoved(true)
      }
    }
    if (from.figure === ChessLogic.figures.ROOK && from.x === "h") {
      if (from.color === ChessLogic.colors.WHITE) {
        setWhiteLongRookMoved(true)
      } else {
        setBlackLongRookMoved(true)
      }
    }
  }

  const hideMoves = () => {
    setBoardState(boardState.map(_ => _.map(i => {
      i.possibleMove = false;
      return i
    })))
  }

  const makeMove = (from, to) => {
    const logic = new ChessLogic(rows, columns)
    // socket.emit("chess-make-move", {room, from, to});
    const [fromTwo, toTwo] = logic.checkCastlingMoves(boardState, from, to)
    checkCastlingRights(from)
    const anPassant = logic.checkAnPassant(boardState, from, to)
    setPreviousMoves([...previousMoves, {
      from,
      to,
      figure: from.figure,
      anPassant,
      fromTwo,
      toTwo,
      isCastle: !!fromTwo,
      isAnPassant: !!anPassant
    }])
    hideMoves()
    setStateMakeMove(from, to, fromTwo, toTwo, anPassant)
    setIsWhiteTurn(from.color === ChessLogic.colors.BLACK)
  }

  const setStateMakeMove = (from, to, fromTwo, toTwo, anPassant) => {
    setBoardState(boardState.map(_ => _.map(i => {
      if (i.x === from.x && i.y === from.y) return {...i, figure: undefined, side: undefined, color: undefined}
      if (i.x === to.x && i.y === to.y) return {...i, figure: from.figure, side: from.side, color: from.color}
      if (fromTwo && i.x === fromTwo.x && i.y === fromTwo.y)
        return {
          ...i,
          figure: undefined,
          side: undefined,
          color: undefined
        }
      if (toTwo && i.x === toTwo.x && i.y === toTwo.y)
        return {
          ...i,
          figure: fromTwo.figure,
          side: fromTwo.side,
          color: fromTwo.color
        }
      if (anPassant && i.x === anPassant.x && i.y === anPassant.y)
        return {
          ...i,
          figure: undefined,
          side: undefined,
          color: undefined
        }
      return i
    })))
  }

  const startNewGame = () => {
    setBoardState(desk.map(_ => _.map(i => {
      return new ChessLogic(rows, columns).prepareCellInitialState(i, isPlayingAsWhite)
    })))
  }

  const switchSides = () => {
    setIsPlayingAsWhite(!isPlayingAsWhite)
  }

  const takeMoveBack = () => {
    if (previousMoves.length === 0) return
    const previousMove = previousMoves[previousMoves.length - 1]
    const WHITE = ChessLogic.colors.WHITE
    const BLACK = ChessLogic.colors.BLACK
    const ME = ChessLogic.sides.ME
    const OPPONENT = ChessLogic.sides.OPPONENT

    if (previousMove.isCastle) {
      if (previousMove.fromTwo.color === WHITE) {
        setWhiteKingMoved(false)
      } else {
        setBlackKingMoved(false)
      }
      if (previousMove.fromTwo.x === "h") {
        if (previousMove.fromTwo.color === WHITE) {
          setWhiteShortRookMoved(false)
        } else {
          setBlackShortRookMoved(false)
        }
      } else {
        if (previousMove.fromTwo.color === WHITE) {
          setWhiteLongRookMoved(false)
        } else {
          setBlackLongRookMoved(false)
        }
      }
    }

    setBoardState(boardState.map(_ => _.map(i => {
      if (i.x === previousMove.from.x && i.y === previousMove.from.y) {
        let color = previousMove.from.color
        let side = (color === WHITE && isPlayingAsWhite) || (color === BLACK && !isPlayingAsWhite) ? ME : OPPONENT
        side = color ? side : undefined
        return {...i, figure: previousMove.from.figure, side: side, color: previousMove.from.color}
      }
      if (i.x === previousMove.to.x && i.y === previousMove.to.y){
        let color = previousMove.to.color
        let side = (color === WHITE && isPlayingAsWhite) || (color === BLACK && !isPlayingAsWhite) ? ME : OPPONENT
        side = color ? side : undefined
        return {...i, figure: previousMove.to.figure, side: side, color: previousMove.to.color}
      }
      if (previousMove.isCastle && i.x === previousMove.fromTwo.x && i.y === previousMove.fromTwo.y){
        let color = previousMove.fromTwo.color
        let side = (color === WHITE && isPlayingAsWhite) || (color === BLACK && !isPlayingAsWhite) ? ME : OPPONENT
        side = color ? side : undefined
        return {...i, figure: previousMove.fromTwo.figure, side: side, color: previousMove.fromTwo.color}
      }
      if (previousMove.isCastle && i.x === previousMove.toTwo.x && i.y === previousMove.toTwo.y){
        let color = previousMove.toTwo.color
        let side = (color === WHITE && isPlayingAsWhite) || (color === BLACK && !isPlayingAsWhite) ? ME : OPPONENT
        side = color ? side : undefined
        return {...i, figure: previousMove.toTwo.figure, side: side, color: previousMove.toTwo.color}
      }
      if (previousMove.isAnPassant && i.x === previousMove.anPassant.x && i.y === previousMove.anPassant.y){
        let color = previousMove.anPassant.color
        let side = (color === WHITE && isPlayingAsWhite) || (color === BLACK && !isPlayingAsWhite) ? ME : OPPONENT
        side = color ? side : undefined
        return {...i, figure: previousMove.anPassant.figure, side: side, color: previousMove.anPassant.color}
      }
      return i
    })))

    setIsWhiteTurn(previousMove.from.color === ChessLogic.colors.WHITE)
    setPreviousMoves(previousMoves.slice(0, -1))
    setTakenBackMoves([...takenBackMoves, previousMove])
  }

  const unTakeMoveBack = () => {
    if (takenBackMoves.length === 0) return
    const logic = new ChessLogic(rows, columns)
    const previousMove = takenBackMoves[takenBackMoves.length - 1]

    const fromJ = columns.indexOf(previousMove.from.x)
    const fromI = rows.indexOf(Number(previousMove.from.y))
    const toJ = columns.indexOf(previousMove.to.x)
    const toI = rows.indexOf(Number(previousMove.to.y))

    const fromCell = logic.getCell(boardState, fromI, fromJ)
    const toCell = logic.getCell(boardState, toI, toJ)

    makeMove(fromCell, toCell)
    setTakenBackMoves(takenBackMoves.slice(0, -1))
  }

  return (
    <div className={`chess-slide ${!visible ? 'hidden' : ''}`}>
      <div className={"chess-buttons"}>
        <button onClick={() => startNewGame()}>Новая игра</button>
        <button onClick={() => switchSides()}>Поменять стороны</button>
        <button onClick={() => takeMoveBack()}>Отменить ход</button>
        <button onClick={() => unTakeMoveBack()}>Отменить отмену</button>
      </div>
      <Chessboard
        room={room}
        boardState={boardState}
        setBoardState={setBoardState}
        makeMove={makeMove}
        hideMoves={hideMoves}
        rows={rows}
        columns={columns}
        isPlayingAsWhite={isPlayingAsWhite}
        isWhiteTurn={isWhiteTurn}
        previousMove={previousMoves.length > 0 ? previousMoves[previousMoves.length - 1] : {}}
        castingInfo={{
          whiteKingMoved,
          blackKingMoved,
          whiteShortRookMoved,
          blackShortRookMoved,
          whiteLongRookMoved,
          blackLongRookMoved
        }}
      />
    </div>
  );
}

ChessboardSlide.propTypes = {
  room: PropTypes.string.isRequired,
  visible: PropTypes.bool,
}

export default ChessboardSlide;
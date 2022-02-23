import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import Chessboard from "./Chessboard";
import {ChessLogic} from "./ChessLogic";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowsRotate, faRepeat, faLeftLong, faRightLong} from '@fortawesome/free-solid-svg-icons'

import './Chessboard.scss'
import {useUser} from "../../../../../hooks/useUser";
import {useSocket} from "../../../../../hooks/useSocket";

const ChessboardSlide = ({room, visible}) => {
  const {user: {type: usertype}} = useUser();

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

  const [boardState, setBoardState] = useState(desk.map(_ => _.map(i => {
    return new ChessLogic(rows, columns).prepareCellInitialState(i, isPlayingAsWhite)
  })))

  const stateRef = useRef(boardState);
  React.useEffect(() => {
    stateRef.current = boardState;
  }, [boardState]);

  const previousMovesRef = useRef(previousMoves);
  React.useEffect(() => {
    previousMovesRef.current = previousMoves;
  }, [previousMoves]);

  const takenBackMovesRef = useRef(takenBackMoves);
  React.useEffect(() => {
    takenBackMovesRef.current = takenBackMoves;
  }, [takenBackMoves]);

  const isPlayingAsWhiteRef = useRef(isPlayingAsWhite);
  React.useEffect(() => {
    isPlayingAsWhiteRef.current = isPlayingAsWhite;
  }, [isPlayingAsWhite]);

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
        } else if (cell.color === ChessLogic.colors.BLACK) {
          side = ChessLogic.sides.OPPONENT
        } else {
          side = null
        }
      } else {
        if (cell.color === ChessLogic.colors.WHITE) {
          side = ChessLogic.sides.OPPONENT
        } else if (cell.color === ChessLogic.colors.BLACK) {
          side = ChessLogic.sides.ME
        } else {
          side = null
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

  const {socket} = useSocket();

  useEffect(() => {
    socket.on("move-made", ({from, to}) => {
      moveMade(from, to)
    })

    socket.on("sides-switched", ({isWhite}) => {
      setIsPlayingAsWhite(isWhite)
    })

    socket.on("new-game-started", ({isPlayingAsWhite: isWhite}) => {
      setIsPlayingAsWhite(isWhite)
      newGameStarted(isWhite)
    })

    socket.on("move-taken-back", ({previousMove: pMove}) => {
      moveTakenBack(pMove)
    })

    startNewGame()
  }, [])

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

  const hideMoves = (state) => {
    setBoardState(state.map(_ => _.map(i => {
      i.possibleMove = false;
      return i
    })))
  }

  const makeMove = (from, to) => {
    socket.emit("chess-make-move", {room, from, to});
  }

  const moveMade = (from, to) => {
    const state = stateRef.current
    const pMoves = previousMovesRef.current
    const logic = new ChessLogic(rows, columns)
    const [fromTwo, toTwo] = logic.checkCastlingMoves(state, from, to)
    const isQueen = logic.checkQueen(state, from, to)
    checkCastlingRights(from)
    const anPassant = logic.checkAnPassant(state, from, to)
    setPreviousMoves([...pMoves, {
      from,
      to,
      figure: from.figure,
      anPassant,
      fromTwo,
      toTwo,
      isCastle: !!fromTwo,
      isAnPassant: !!anPassant
    }])
    hideMoves(state)
    setStateMakeMove(from, to, fromTwo, toTwo, anPassant, state, isQueen)
    setIsWhiteTurn(from.color === ChessLogic.colors.BLACK)
  }

  const setStateMakeMove = (from, to, fromTwo, toTwo, anPassant, state, isQueen) => {
    const isWhite = isPlayingAsWhiteRef.current;
    const toFigure = isQueen ? ChessLogic.figures.QUEEN : from.figure
    const WHITE = ChessLogic.colors.WHITE
    const BLACK = ChessLogic.colors.BLACK
    const ME = ChessLogic.sides.ME
    const OPPONENT = ChessLogic.sides.OPPONENT

    setBoardState(state.map(_ => _.map(i => {
      if (i.x === from.x && i.y === from.y) return {...i, figure: null, side: null, color: null}
      if (i.x === to.x && i.y === to.y) {
        let color = from.color
        let side = (color === WHITE && isWhite) || (color === BLACK && !isWhite) ? ME : OPPONENT
        return {...i, figure: toFigure, side: side, color: from.color}
      }
      if (fromTwo && i.x === fromTwo.x && i.y === fromTwo.y) return {...i, figure: null, side: null, color: null}
      if (toTwo && i.x === toTwo.x && i.y === toTwo.y){
        let color = fromTwo.color
        let side = (color === WHITE && isWhite) || (color === BLACK && !isWhite) ? ME : OPPONENT
        return {...i, figure: fromTwo.figure, side: side, color: fromTwo.color}
      }
      if (anPassant && i.x === anPassant.x && i.y === anPassant.y)
        return {...i, figure: null, side: null, color: null}

      return i
    })))
  }

  const startNewGame = () => {
    socket.emit("start-new-game", {room, isPlayingAsWhite});
  }

  const newGameStarted = (isWhite) => {
    let newRows
    let newColumns
    if (isWhite) {
      newRows = [8, 7, 6, 5, 4, 3, 2, 1]
      newColumns = ["a", "b", "c", "d", "e", "f", "g", "h"]
    } else {
      newRows = [8, 7, 6, 5, 4, 3, 2, 1].reverse()
      newColumns = ["a", "b", "c", "d", "e", "f", "g", "h"].reverse()
    }
    const newDesk = newRows.map(i => newColumns.map(j => `${j}${i}`))

    setBoardState(newDesk.map(_ => _.map(i => {
      return new ChessLogic(newRows, newColumns).prepareCellInitialState(i, isWhite)
    })))
    setIsWhiteTurn(true)
  }

  const switchSides = () => {
    socket.emit("switch-sides", {room, isPlayingAsWhite: !isPlayingAsWhite});
  }

  const takeMoveBack = () => {
    if (previousMoves.length === 0) return
    const previousMove = previousMoves[previousMoves.length - 1]
    socket.emit("take-move-back", {room, previousMove, state: boardState, previousMoves, takenBackMoves});
  }

  const moveTakenBack = (pMove) => {
    const state = stateRef.current
    const pMoves = previousMovesRef.current
    const tbMoves = takenBackMovesRef.current
    const WHITE = ChessLogic.colors.WHITE
    const BLACK = ChessLogic.colors.BLACK
    const ME = ChessLogic.sides.ME
    const OPPONENT = ChessLogic.sides.OPPONENT

    if (pMove.isCastle) {
      if (pMove.fromTwo.color === WHITE) {
        setWhiteKingMoved(false)
      } else {
        setBlackKingMoved(false)
      }
      if (pMove.fromTwo.x === "h") {
        if (pMove.fromTwo.color === WHITE) {
          setWhiteShortRookMoved(false)
        } else {
          setBlackShortRookMoved(false)
        }
      } else {
        if (pMove.fromTwo.color === WHITE) {
          setWhiteLongRookMoved(false)
        } else {
          setBlackLongRookMoved(false)
        }
      }
    }

    setBoardState(state.map(_ => _.map(i => {
      if (i.x === pMove.from.x && i.y === pMove.from.y) {
        let color = pMove.from.color
        let side = (color === WHITE && isPlayingAsWhite) || (color === BLACK && !isPlayingAsWhite) ? ME : OPPONENT
        side = color ? side : null
        return {...i, figure: pMove.from.figure, side: side, color: pMove.from.color}
      }
      if (i.x === pMove.to.x && i.y === pMove.to.y) {
        let color = pMove.to.color
        let side = (color === WHITE && isPlayingAsWhite) || (color === BLACK && !isPlayingAsWhite) ? ME : OPPONENT
        side = color ? side : null
        return {...i, figure: pMove.to.figure, side: side, color: pMove.to.color}
      }
      if (pMove.isCastle && i.x === pMove.fromTwo.x && i.y === pMove.fromTwo.y) {
        let color = pMove.fromTwo.color
        let side = (color === WHITE && isPlayingAsWhite) || (color === BLACK && !isPlayingAsWhite) ? ME : OPPONENT
        side = color ? side : null
        return {...i, figure: pMove.fromTwo.figure, side: side, color: pMove.fromTwo.color}
      }
      if (pMove.isCastle && i.x === pMove.toTwo.x && i.y === pMove.toTwo.y) {
        let color = pMove.toTwo.color
        let side = (color === WHITE && isPlayingAsWhite) || (color === BLACK && !isPlayingAsWhite) ? ME : OPPONENT
        side = color ? side : null
        return {...i, figure: pMove.toTwo.figure, side: side, color: pMove.toTwo.color}
      }
      if (pMove.isAnPassant && i.x === pMove.anPassant.x && i.y === pMove.anPassant.y) {
        let color = pMove.anPassant.color
        let side = (color === WHITE && isPlayingAsWhite) || (color === BLACK && !isPlayingAsWhite) ? ME : OPPONENT
        side = color ? side : null
        return {...i, figure: pMove.anPassant.figure, side: side, color: pMove.anPassant.color}
      }
      return i
    })))

    setIsWhiteTurn(pMove.from.color === ChessLogic.colors.WHITE)
    setPreviousMoves(pMoves.slice(0, -1))
    setTakenBackMoves([...tbMoves, pMove])
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
      {usertype && <div className={"chess-buttons"}>
        <div className={"chess-button"} title="Новая игра" onClick={() => startNewGame()}><FontAwesomeIcon
          icon={faArrowsRotate}/></div>
        <div className={"chess-button"} title="Поменять стороны" onClick={() => switchSides()}><FontAwesomeIcon
          icon={faRepeat}/></div>
        <div className={"chess-button"} title="Отменить предыдущий ход" onClick={() => takeMoveBack()}><FontAwesomeIcon
          icon={faLeftLong}/></div>
        <div className={"chess-button"} title="Повторить отмененный ход" onClick={() => unTakeMoveBack()}>
          <FontAwesomeIcon icon={faRightLong}/></div>
      </div>}

      <Chessboard
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
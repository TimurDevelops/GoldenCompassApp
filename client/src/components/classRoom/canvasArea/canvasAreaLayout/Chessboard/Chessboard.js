import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

import {columns, desk, figures, getCell, getImg, getPossibleMoves, prepareCellInitialState, rows} from "./Chessrules";
import {useSocket} from "../../../../../hooks/useSocket";

import './Chessboard.scss'

// const Chessboard = ({room}) => {
const Chessboard = () => {
  // TODO Save previous move
  // TODO Did king move
  // TODO Did rook move

  const [isPlayingAsWhite, setIsPlayingAsWhite] = useState(true)
  const [kingMoved, setKingMoved] = useState(false)
  const [shortRookMoved, setShortRookMoved] = useState(false)
  const [longRookMoved, setLongRookMoved] = useState(false)
  const [isMyTurn, setIsMyTurn] = useState(true)
  const [clickedCell, setClickedCell] = useState(null)
  const [previousMove, setPreviousMove] = useState({})
  const [boardState, setBoardState] = useState(desk.map(_ => _.map(i => {
    return prepareCellInitialState(i)
  })))

  const {socket} = useSocket();

  useEffect(() => {
    socket.on("move-made", ({from, to}) => {
      setPreviousMove({from, to, figure: from.figure})
      hideMoves()
      setBoardState(boardState.map(_ => _.map(i => {
        if (i.x === from.x && i.y === from.y) {
          return {...i, figure: undefined, side: undefined, color: undefined}
        }
        if (i.x === to.x && i.y === to.y) {
          return {...i, figure: from.figure, side: from.side, color: from.color}
        }
        return i
      })))
      setIsMyTurn(!isMyTurn)
    })
  }, [])


  // TODO catch move
  // TODO update state of the board
  // TODO switch is my turn
  // TODO check if you put opponent in check
  // TODO check if you put opponent in mate
  // TODO check if you are in check
  // TODO check if you are in mate

  // TODO catch new game

  // const newGame = () => {
  //   // TODO emmit new game
  // }

  // const switchSides = () => {
  //   // TODO emmit switch sides
  // }

  const checkCastlingRights = (from) => {
    if (from.figure === figures.KING) {
      setKingMoved(true)
    }
    if (from.figure === figures.ROOK && from.x === "a") {
      setShortRookMoved(true)
    }
    if (from.figure === figures.ROOK && from.x === "h") {
      setLongRookMoved(true)
    }
  }

  const checkCastlingMoves = (from, to) => {
    let fromTwo, toTwo
    const fromJ = columns.indexOf(from.x)
    const toI = rows.indexOf(Number(to.y))
    const toJ = columns.indexOf(to.x)

    if (from.figure === figures.KING) {
      if (fromJ - toJ === -2) {
        fromTwo = getCell(boardState, toI, 7)
        toTwo = getCell(boardState, toI, fromJ + 1)
      } else if (fromJ - toJ === 2) {
        fromTwo = getCell(boardState, toI, 0)
        toTwo = getCell(boardState, toI, toJ + 1)
      }
    }

    return [fromTwo, toTwo]
  }

  const checkAnPassant = (from, to) => {
    const i = rows.indexOf(Number(to.y))
    const j = columns.indexOf(to.x)
    if (from.figure === figures.PAWN && from.x !== to.x && !to.figure) {
      return getCell(boardState, i + 1, j)
    }
  }

  const makeMove = (from, to) => {
    // socket.emit("chess-make-move", {room, from, to});
    const [fromTwo, toTwo] = checkCastlingMoves(from, to)
    checkCastlingRights(from)
    const anPassant = checkAnPassant(from, to)
    setPreviousMove({from, to, figure: from.figure})
    hideMoves()
    setStateMakeMove(from, to, fromTwo, toTwo, anPassant)

    // setIsMyTurn(!isMyTurn)
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
  // const findKing = () => {
  //   const allCells = []
  //   boardState.forEach(_ => _.forEach(i => allCells.push(i)))
  //   return allCells.find(i => i.figure && i.side === sides.ME)
  // }

  // const getMovesThatPreventCheck = () => {
  //   const kingCell = findKing()
  //   // getAllMovesThatStopRooksOrQueensFromAttackingMyKing()
  //   // getAllMovesThatStopBishopsOrQueensFromAttackingMyKing()
  //   // getAllMovesThatStopPawnsFromAttackingMyKing()
  //   // getAllMovesThatStopHorsesFromAttackingMyKing()
  //
  //   //  TODO get possibleCells for all types, if
  // }

  const showPossibleMoves = (cell) => {
    const activeCells = getPossibleMoves(boardState, previousMove, cell, kingMoved, shortRookMoved, longRookMoved)
    const activeCellsCoordinates = activeCells.map(i => i.x + i.y)

    setBoardState(boardState.map(_ => _.map(i => {
      i.possibleMove = activeCellsCoordinates.includes(i.x + i.y);
      return i
    })))
  }

  const hideMoves = () => {
    setBoardState(boardState.map(_ => _.map(i => {
      i.possibleMove = false;
      return i
    })))
  }

  const handleClick = (cell) => {
    if (cell.possibleMove) {
      if (isMyTurn) {
        makeMove(clickedCell, cell)
      }
    } else {
      // if (cell.figure && cell.side === sides.ME) {
      if (cell.figure) {
        setClickedCell(cell)
        showPossibleMoves(cell)
      } else {
        setClickedCell(null)
        hideMoves()
      }
    }
  }

  let isBlack = true;

  return (
    <div className={"chessboard-holder"}>
      {
        boardState.map(i => {
          isBlack = !isBlack
          return i.map(cell => {

            const img = getImg(cell.figure + cell.color)

            let el = (
              <div onClick={() => handleClick(cell)} key={cell.x + cell.y}
                   className={`chessboard-cell ${isBlack ? "black" : "white"}`}>
                {img && <img className={"chess-piece-img"} src={img} alt=""/>}
                <span className={`point ${cell.possibleMove ? "active" : ""}`}/>
              </div>
            )
            isBlack = !isBlack
            return el
          })
        })
      }
    </div>
  );
}

Chessboard.propTypes = {
  room: PropTypes.string.isRequired,
}

export default Chessboard;
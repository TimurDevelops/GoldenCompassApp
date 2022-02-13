import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

import {ChessLogic} from "./ChessLogic";
import {useSocket} from "../../../../../hooks/useSocket";

import './Chessboard.scss'

const Chessboard = ({
                      room,
                      boardState,
                      setBoardState,
                      makeMove,
                      hideMoves,
                      rows,
                      columns,
                      isPlayingAsWhite,
                      isWhiteTurn,
                      previousMove,
                      castingInfo: {
                        whiteKingMoved,
                        blackKingMoved,
                        whiteShortRookMoved,
                        blackShortRookMoved,
                        whiteLongRookMoved,
                        blackLongRookMoved
                      }
                    }) => {

  const [clickedCell, setClickedCell] = useState(null)

  const {socket} = useSocket();

  useEffect(() => {
    socket.on("move-made", ({from, to}) => {

    })
  }, [])

  const showPossibleMoves = (cell) => {
    const kingMoved = cell.color === ChessLogic.colors.WHITE ? whiteKingMoved : blackKingMoved
    const shortRookMoved = cell.color === ChessLogic.colors.WHITE ? whiteShortRookMoved : blackShortRookMoved
    const longRookMoved = cell.color === ChessLogic.colors.WHITE ? whiteLongRookMoved : blackLongRookMoved
    const activeCells = new ChessLogic(rows, columns).getPossibleMoves(boardState, previousMove, cell, kingMoved, shortRookMoved, longRookMoved)
    const activeCellsCoordinates = activeCells.map(i => i.x + i.y)

    setBoardState(boardState.map(_ => _.map(i => {
      i.possibleMove = activeCellsCoordinates.includes(i.x + i.y);
      return i
    })))
  }

  const handleClick = (cell) => {
    if (cell.possibleMove) {
      if ((isWhiteTurn && isPlayingAsWhite) || (!isWhiteTurn && !isPlayingAsWhite)) {
        makeMove(clickedCell, cell)
      }
    } else {
      if (cell.figure && cell.side === ChessLogic.sides.ME) {
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
        boardState.map((i, rowIndex) => {
          isBlack = !isBlack
          return i.map((cell, index) => {
            const img = new ChessLogic(rows, columns).getImg(cell.figure + cell.color)

            let el = (
              <div onClick={() => handleClick(cell)} key={cell.x + cell.y}
                   className={`chessboard-cell ${isBlack ? "black" : "white"}`}>

                <div className={`chess-number ${index === 0 ? "visible" : ""}`}>{cell.y}</div>
                <div className={`chess-letter ${rowIndex === 7 ? "visible" : ""}`}>{cell.x}</div>

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
  boardState: PropTypes.array.isRequired,
  setBoardState: PropTypes.func.isRequired,
  makeMove: PropTypes.func.isRequired,
  hideMoves: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  isPlayingAsWhite: PropTypes.bool.isRequired,
  isWhiteTurn: PropTypes.bool.isRequired,
  previousMove: PropTypes.object.isRequired,
  castingInfo: PropTypes.object.isRequired,
}

export default Chessboard;
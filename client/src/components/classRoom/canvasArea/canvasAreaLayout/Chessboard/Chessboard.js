import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

import {useSocket} from "../../../../../hooks/useSocket";

import './Chessboard.scss'

const rows = [8, 7, 6, 5, 4, 3, 2, 1]
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"]
const desk = rows.map(i => columns.map(j => `${j}${i}`))
const figures = {
  PAWN: "PAWN",
  HORSE: "HORSE",
  BISHOP: "BISHOP",
  ROOK: "ROOK",
  QUEEN: "QUEEN",
  KING: "KING",
}

const Chessboard = ({room}) => {
  const [boardState, setBoardState] = useState(desk.map(_ => _.map(i => {
    const [x, y] = i.split("")
    let figure;
    let side;
    if (["1", "2"].includes(y)){
      side = "ME"
    }
    if (["7", "8"].includes(y)){
      side = "OPPONENT"
    }
    if (x === "2" || x === "7"){
      figure = figures.PAWN
    }
    if (["a1", "h1", "a8", "h8"].includes(i)){
      figure = figures.ROOK
    }
    if (["b1", "g1", "b8", "g8"].includes(i)){
      figure = figures.HORSE
    }
    if (["c1", "f1", "c8", "f8"].includes(i)){
      figure = figures.BISHOP
    }
    if (["d1", "d8"].includes(i)){
      figure = figures.QUEEN
    }
    if (["e1", "e8"].includes(i)){
      figure = figures.KING
    }
    return {
      x, y, figure, side, figureSide: figure+side
    }
  })))
  console.log(boardState)

  const {socket} = useSocket();

  const emmit = (section, number, bead) => {
    // socket.emit("abacus-clicked", {room, section, state});
  }

  useEffect(() => {
    // socket.on("change-abacus", ({section, state}) => {
    //   const setter = section === 'bottom' ? setBottomRow : setUpperRow
    //   try {
    //     setter(state)
    //   } catch (e) {
    //     console.log(e)
    //     console.log('Abacus not open')
    //   }
    //
    // })
  }, [])

  let isBlack = true;

  return (
    <div className={"chessboard-holder"}>
      {
        rows.map(i => {
          isBlack = !isBlack
          return columns.map(j => {
            let el = <div key={`${i}${j}`} className={`chessboard-cell ${isBlack ? "black" : "white"}`}/>
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
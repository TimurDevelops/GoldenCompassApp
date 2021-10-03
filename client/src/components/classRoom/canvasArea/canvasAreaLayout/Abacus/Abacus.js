import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

import {useSocket} from "../../../../../hooks/useSocket";

import './Abacus.scss'

const bottomRowInitial = [
  {current: 0, number: 1, beads: [1, 2, 3, 4]},
  {current: 0, number: 2, beads: [1, 2, 3, 4]},
  {current: 0, number: 3, beads: [1, 2, 3, 4]},
  {current: 0, number: 4, beads: [1, 2, 3, 4]},

  {current: 0, number: 5, beads: [1, 2, 3, 4]},
  {current: 0, number: 6, beads: [1, 2, 3, 4]},
  {current: 0, number: 7, beads: [1, 2, 3, 4]},
  {current: 0, number: 8, beads: [1, 2, 3, 4]},

  {current: 0, number: 9, beads: [1, 2, 3, 4]},
  {current: 0, number: 10, beads: [1, 2, 3, 4]},
  {current: 0, number: 11, beads: [1, 2, 3, 4]},
  {current: 0, number: 12, beads: [1, 2, 3, 4]},

  {current: 0, number: 13, beads: [1, 2, 3, 4]},
  {current: 0, number: 14, beads: [1, 2, 3, 4]},
  {current: 0, number: 15, beads: [1, 2, 3, 4]},
  // {current: 0, number: 16, beads: [1, 2, 3, 4]},

  // {current: 0, number: 17, beads: [1, 2, 3, 4]},
]

const upperRowInitial = [
  {current: 0, number: 1, beads: [1]},
  {current: 0, number: 2, beads: [1]},
  {current: 0, number: 3, beads: [1]},
  {current: 0, number: 4, beads: [1]},
  {current: 0, number: 5, beads: [1]},
  {current: 0, number: 6, beads: [1]},
  {current: 0, number: 7, beads: [1]},
  {current: 0, number: 8, beads: [1]},
  {current: 0, number: 9, beads: [1]},
  {current: 0, number: 10, beads: [1]},
  {current: 0, number: 11, beads: [1]},
  {current: 0, number: 12, beads: [1]},
  {current: 0, number: 13, beads: [1]},
  {current: 0, number: 14, beads: [1]},
  {current: 0, number: 15, beads: [1]},
  // {current: 0, number: 16, beads: [1]},
  // {current: 0, number: 17, beads: [1]},
]

const Abacus = ({room}) => {
  const {socket} = useSocket();
  const [bottomRow, setBottomRow] = useState(bottomRowInitial)
  const [upperRow, setUpperRow] = useState(upperRowInitial)

  const emmit = (section, number, bead) => {
    const previous = section === 'bottom' ? bottomRow : upperRow

    const state = previous.map((row) => {
      if (row.number === number) {
        let current = bead;
        if (row.current >= bead) {
          current = bead - 1
        }

        return {...row, current}
      }
      return row;
    })

    socket.emit("abacus-clicked", {room, section, state});
  }

  useEffect(() => {
    socket.on("change-abacus", ({section, state}) => {
      const setter = section === 'bottom' ? setBottomRow : setUpperRow
      try {
        setter(state)
      } catch (e) {
        console.log(e)
        console.log('Abacus not open')
      }

    })
  }, [])

  return (
    <div className={"abacus-holder"}>
      <div className={'section upper-row'}>
        {upperRow.map((row) =>
          <div key={row.number} className={"spoke"}>
            {row.beads.map(value =>
              <div key={value} onClick={() => emmit('upper', row.number, value)}
                   className={`bead bead-${value} ${value === row.current ? 'active' : ''}`}/>
            )}
          </div>
        )}
      </div>
      <div className={"abacus-divider"}/>
      <div className={'section bottom-row'}>
        {bottomRow.map((row) =>
          <div key={row.number} className={"spoke"}>
            {row.beads.map(value =>
              <div key={value} onClick={() => emmit('bottom', row.number, value)}
                   className={`bead bead-${value} ${value === row.current ? 'active' : ''}`}/>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Abacus.propTypes = {
  room: PropTypes.string.isRequired,
}

export default Abacus;
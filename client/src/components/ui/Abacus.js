import React from "react";
import Draggable from 'react-draggable';
import {FaArrowsAlt} from 'react-icons/fa';

import './Abacus.scss'
// import {useSocket} from "../../hooks/useSocket";

const Abacus = ({onDragStart, onDragStop}) => {

  // const {socket} = useSocket()

  const onStart = () => {
    if (onDragStart) onDragStart()
  }

  // useEffect(() => {
  //   socket.on('abacus-item-moved', ({x, y, item}) => {
  //
  //   })
  // })

  // const onStop = (mouseEvent, target) => {
  const onStop = () => {
    if (onDragStop) onDragStop()
    // console.log(mouseEvent, target)
    // if (target.node.id === 'abacus-holder') {
    //   // socket.emit('abacus-move', {x: mouseEvent.clientX, y: mouseEvent.clientY, target: target});
    // } else {
    //   // socket.emit('abacus-item-move', {x: mouseEvent.clientX, y: mouseEvent.clientY, target: target})
    // }
  }

  const dragHandlers = {onStart, onStop};
  const selector = '#abacus tbody';
  // const grid = [1, 15];

  return (
    <Draggable bounds="parent" handle="strong" {...dragHandlers}>

      <div id="abacus-holder">
        <strong className="cursor">
          <div><FaArrowsAlt/></div>
        </strong>

        <table id="abacus">
          <tbody>
          <tr>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="1"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="2"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="3"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="4"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="5"/>
            </Draggable>
          </tr>
          <tr>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="6"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="7"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="8"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="9"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="10"/>
            </Draggable>
          </tr>
          <tr>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="11"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="12"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="13"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="14"/>
            </Draggable>
            <Draggable bounds={selector} axis="y" {...dragHandlers}>
              <td data-attribute="15"/>
            </Draggable>
          </tr>
          </tbody>
        </table>
      </div>
    </Draggable>

  );
}

export default Abacus;
import React from 'react';
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";

import {useSocket} from "../../../../hooks/useSocket";
// import Abacus from "../../../ui/Abacus";

// const Canvas = ({room, activeTool, drawWidth, drawColor, active, img, hasAbacus}) => {
const Canvas = ({room, activeTool, drawWidth, drawColor, active, img}) => {
  const {socket} = useSocket();


  // const [draggingAbacus, setDraggingAbacus] = useState(false);

  return (

    <div className={'canvas-background'}>

      <div className={'canvas-border'}>

        <img className={'slide-img'} src={img} alt="Картинка для слайда не загрузилась"/>

        <div id='mainCanvas' className={"canvas"}
             style={{backgroundImage: img ? `url(${img})` : 'none'}}>

          {/*{hasAbacus && <Abacus onDragStart={() => setDraggingAbacus(true)}*/}
          {/*        onDragStop={() => setDraggingAbacus(false)}*/}
          {/*        room={room}/>}*/}


          <P5Wrapper
            sketch={sketch}
            socket={socket}
            room={room}

            active={active}
            activeTool={activeTool}
            drawWidth={drawWidth}
            drawColor={drawColor}
          />
        </div>
      </div>
    </div>
  )
}

Canvas.propTypes = {
  room: PropTypes.string.isRequired,
  img: PropTypes.string,
  // hasAbacus: PropTypes.bool,
  active: PropTypes.bool.isRequired,
  activeTool: PropTypes.string.isRequired,
  drawWidth: PropTypes.number.isRequired,
  drawColor: PropTypes.string.isRequired,
}

export default Canvas;


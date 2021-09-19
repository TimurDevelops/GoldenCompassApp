import React, {useState} from 'react';
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";

import {useSocket} from "../../../../hooks/useSocket";
// import Abacus from "../../../ui/Abacus";

// const Canvas = ({room, activeTool, drawWidth, drawColor, active, img, hasAbacus}) => {
const Canvas = ({room, activeTool, drawWidth, drawColor, active, img}) => {
  const {socket} = useSocket();
  const [width, setWidth] = useState('100px');
  const [height, setHeight] = useState('100px');
  const canvasBackground = React.createRef();

  const onImgLoad = ({target: img}) => {
    const maxHeight = canvasBackground.current.offsetHeight;
    const maxWidth = canvasBackground.current.offsetWidth;
    let proportion = 1;

    if (img.height > maxHeight || img.width > maxWidth) {
      if (img.height > maxHeight){
        proportion = img.height / img.width;

        setHeight(`calc(${maxHeight}px  - 4em)`)
        setWidth(`calc((${maxHeight}px - 4em) / ${proportion})`);

      } else {
        proportion = img.width / img.height;

        setWidth(`calc(${maxWidth}px  - 4em)`)
        setHeight(`calc((${maxWidth}px - 4em) / ${proportion})`);
      }
    } else {
      setWidth(img.width);
      setHeight(img.height);
    }

    // const maxHeight = canvasBackground.current.offsetHeight;
    // const maxWidth = canvasBackground.current.offsetWidth;
    //
    // setWidth(`auto`);
    // setHeight(`calc(${maxHeight}px  - 4em)`);

  }

  return (

    <div className={'canvas-background'} ref={canvasBackground}>

      <div className={'canvas-border'}>

        <img className={'slide-img'} src={img} alt="Картинка для слайда не загрузилась" onLoad={onImgLoad}/>

        <div id='mainCanvas' className={"canvas"}
             style={{
               backgroundImage: img ? `url(${img})` : 'none',
               width: width,
               height: height
             }}
        >

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


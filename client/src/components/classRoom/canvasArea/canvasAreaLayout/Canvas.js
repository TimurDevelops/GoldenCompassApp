import React, {useState} from 'react';
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";

import AbacusSlide from "./Abacus/AbacusSlide";
import ChessboardSlide from "./Chessboard/ChessboardSlide";
import {useSocket} from "../../../../hooks/useSocket";
import {useUser} from "../../../../hooks/useUser";

const Canvas = ({room, img, hasChessboard, hasAbacus, activeTool, drawWidth, drawColor, active}) => {
  const {socket} = useSocket();
  const {getUser} = useUser();
  // const [width, setWidth] = useState('100px');
  const [width, setWidth] = useState('800px');
  // const [height, setHeight] = useState('100px');
  const [height, setHeight] = useState('800px');
  const canvasBackground = React.createRef();

  const onImgLoad = ({target: img}) => {
    const maxHeight = canvasBackground.current.offsetHeight;
    const maxWidth = canvasBackground.current.offsetWidth;
    const padding = window.innerWidth > 1300 ? '4em' : '.3em'
    const maxProportion = maxWidth / maxHeight;
    const imageProportion = img.width / img.height;

    let proportion = 1;

    if (img.height > maxHeight || img.width > maxWidth) {
      if (maxProportion >= imageProportion) {
        proportion = img.height / img.width;

        setHeight(`calc(${maxHeight}px - ${padding})`)
        setWidth(`calc((${maxHeight}px - ${padding}) / ${proportion})`);
      } else {
        proportion = img.width / img.height;

        setWidth(`calc(${maxWidth}px - ${padding})`)
        setHeight(`calc((${maxWidth}px - ${padding}) / ${proportion})`);
      }
    } else {
      setWidth(img.width);
      setHeight(img.height);
    }
    const user = getUser();
    socket.emit("image-loaded", {login: user.login});
  }

  return (

    <div className={'canvas-background'} ref={canvasBackground}>

      <div className={`canvas-border ${img ? '' : 'hidden'}`}>

        <img className={'slide-img'} src={img} alt="Картинка для слайда не загрузилась" onLoad={onImgLoad}/>

        <div id='mainCanvas' className={'canvas'}
             style={{
               backgroundImage: img ? `url(${img})` : 'none',
               width: width,
               height: height
             }}
        >
          <AbacusSlide visible={hasAbacus} room={room}/>
          <ChessboardSlide visible={hasChessboard} room={room}/>
          {/*<ChessboardSlide visible={hasChessboard || true} room={room}/>*/}

          <P5Wrapper
            sketch={sketch}
            socket={socket}
            room={room}

            width={parseInt(width)}
            height={parseInt(height)}

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
  slideType: PropTypes.string,
  hasAbacus: PropTypes.bool,
  active: PropTypes.bool.isRequired,
  activeTool: PropTypes.string.isRequired,
  drawWidth: PropTypes.number.isRequired,
  drawColor: PropTypes.string.isRequired,
}

export default Canvas;


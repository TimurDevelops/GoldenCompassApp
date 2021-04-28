import React, {Fragment, useState} from 'react';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './Sketch';
import Header from "../layout/Header";
import useUser from "../../utils/useUser";

const Canvas = () => {
  const {unsetUser} = useUser()
  const [drawWidth, setDrawWidth] = useState(10);

  const logout = () => {
    unsetUser();
  }

  return (
    <Fragment>
      <Header logout={logout}/>
      <div id='mainCanvas' style={{background: '#ccc', width: '50vw', height: '50vh'}}>
        <select value={drawWidth} onChange={e => setDrawWidth(e.target.value)}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={150}>150</option>
        </select>
        <P5Wrapper sketch={sketch} drawWidth={drawWidth}/>
      </div>
    </Fragment>
  )
}


export default Canvas;
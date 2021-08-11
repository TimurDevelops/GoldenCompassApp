import React from "react";
import {useHistory} from "react-router-dom";
import {FaArrowLeft} from 'react-icons/fa';

import "./GoBack.scss"

const GoBack = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack()
  }

  return (
    <div className={"back-btn"}>
      <div className={'back'} onClick={() => goBack()}>
        <FaArrowLeft/>
      </div>
    </div>
  );
}

export default GoBack;
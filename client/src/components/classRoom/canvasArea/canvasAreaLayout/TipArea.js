import React from 'react';
import PropTypes from "prop-types";
import {useUser} from "../../../../hooks/useUser";

const TipArea = ({tip}) => {
  const {user: {type: usertype}} = useUser();

  return (
    <div className={"tip-area"}>
      <div className={"tip-text"}>
        {usertype === 'teacher' ? <p>{tip || ""}</p> : ''}
      </div>
    </div>
  )
}

TipArea.propTypes = {
  tip: PropTypes.string,
}

export default TipArea;
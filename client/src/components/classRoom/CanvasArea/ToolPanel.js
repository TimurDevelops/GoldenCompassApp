import React from 'react';
import PropTypes from "prop-types";

const TipArea = ({setDrawWidth, setDrawColor}) => {

  return (
    <div>
      <select onChange={e => setDrawWidth(e.target.value)}>
        <option defaultChecked={true} value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={150}>150</option>
      </select>

      <select onChange={e => setDrawColor(e.target.value)}>
        <option defaultChecked={true} value={'red'}>Red</option>
        <option value={'white'}>White</option>
        <option value={'black'}>Black</option>
        <option value={'grey'}>Grey</option>
      </select>
    </div>
  )
}

TipArea.propTypes = {
  setDrawWidth: PropTypes.func.isRequired,
  setDrawColor: PropTypes.func.isRequired,
}

export default TipArea;
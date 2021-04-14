import React from 'react';
import { FaCompass } from 'react-icons/fa';

const Logo = () => {

  return (
    <div className='logo-icon' style={{width: '100%', height: '100%'}}>
      <svg width="0" height="0">
        <linearGradient id="my-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor="#555" offset="0%" />
          <stop stopColor="#ee8d5c" offset="100%" />
        </linearGradient>
      </svg>

      <FaCompass style={{fill: "url(#my-gradient)", width: '100%', height: '100%'}}/>
    </div>
  )
}

export default Logo;
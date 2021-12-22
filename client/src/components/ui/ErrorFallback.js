import React from 'react';

import './ErrorFallback.scss';

const ErrorFallback = () => {
  return (
    <div className={"error-wrapper"}>
      <div className={"error-text"}>
        Произошла ошибка, попробуйте обновить страницу
      </div>
    </div>
  )
}

export default ErrorFallback;
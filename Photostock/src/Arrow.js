import React from 'react';

function Arrow (props) {
  let isFirstPage = props.currentPage <= 1 ? true : false;
  return (
    <div className='arrow'>
      <button className='arrow__left' onClick={props.flipPage} disabled={isFirstPage}>Previous</button>
      <button className='arrow__right' onClick={props.flipPage}>Next</button>
    </div>
  )
}

export default Arrow;
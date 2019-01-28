import React from 'react';

function Search (props) {
    return (
        <div className='search'>
            <input 
                type='text'
                placeholder='Type here...'
                className='search__input'
                value={props.value}
                onChange={props.handleChange}
                onKeyDown={props.handleKeyDown}
                autoFocus
            />
            <button 
                className='search__btn'
                onClick={props.handleClick}
            >
                Search
            </button>
        </div>
    )
}


export default Search;
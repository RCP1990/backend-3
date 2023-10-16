import React from 'react';

const Filter = ({ onChange, filtered }) => {
    return (
      <div>
        filter shown with{" "}
        <input id="filter" onChange={onChange} value={filtered} />
      </div>
    );
  };

  export default Filter;
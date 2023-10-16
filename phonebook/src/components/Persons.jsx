import React from 'react';
import Person from './Person';

const Persons = ({ persons, filtered, onClick }) => {
    return (
      <ul>
        {persons
          .filter((x) => {
            if (filtered === "") {
              return x;
            } else if (x.name.toLowerCase().includes(filtered.toLowerCase())) {
              return x;
            }
          })
          .map((person, i) => (
            <Person person={person} key={i} onClick={onClick}/>
          ))}
      </ul>
    );
  };

  export default Persons
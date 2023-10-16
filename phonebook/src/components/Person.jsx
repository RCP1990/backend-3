import React from "react";

const Person = ({ person, index, onClick }) => {
  return (
    <li key={index}>
      <p>{person.name}</p>
      <button onClick={() => onClick(person.id)}>delete</button>
    </li>
  );
};

export default Person;

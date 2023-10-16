import { useState, useEffect } from "react";

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import personService from "./services/persons";


const App = () => {
  const [persons, setPersons] = useState([]);
  const [filtered, setFiltered] = useState("");
  const [notification, setNotification] = useState(null);

  const hook = () => {
    personService
    .getAll()
    .then(response => {
      setPersons(response.data);
    })
    .catch(error => console.error(error));
  };

  useEffect(hook, []);

  const addNewPerson = (e) => {
    e.preventDefault();
    let person = {
      name: document.getElementById("nameField").value,
      phone: document.getElementById("phoneField").value,
    };

    //if (person.name.length > 0 && person.phone.length > 0) {
    if (persons.filter((e) => e.name === person.name).length <= 0) {
      personService.create(person).then((response) => {
        setPersons(persons.concat(response.data));

        setNotification({
          text: `${person.name} added to the phonebook.`,
          type: "notification",
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
    } else {
      const updatePhone = window.confirm(
        `${person.name} is already added to the phonebook, replace the old number with a new one?`
      );

      if (updatePhone) {
        let getId = persons.find((p) => p.name === person.name).id;
        //get id
        personService
          .update(getId, person)
          //else update phone number
          .then((n) => {
            setPersons(persons.map((x) => (x.id !== person.id ? x : n)));
            setNotification({
              text: `${person.name}'s number was updated.`,
              type: "notification",
            });
            setTimeout(() => setNotification(null), 5000);
          })
          .catch((error) =>
            setPersons(persons.filter((x) => x.name !== person.name))
          );
        setNotification({
          text: `${person.name} has already been deleted from the server.`,
          type: "error",
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${person.name}?`
    );

    if (confirmDelete) {
      personService.remove(id).then((x) => {
        persons.map((person) => (person.id !== id ? person : x));
      });
      setPersons(persons.filter((person) => person.id !== id));

      setNotification({
        text: `${person.name} was deleted from the phonebook.`,
        type: "notification",
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const filterItems = (e) => {
    if (e.target.value.length >= 0) {
      setFiltered(e.target.value);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter onChange={filterItems} filtered={filtered} />
      <h2>Add a new</h2>
      <PersonForm onSubmit={addNewPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} filtered={filtered} onClick={deletePerson} />
    </div>
  );
};

export default App;

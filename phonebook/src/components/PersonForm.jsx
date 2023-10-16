import React from 'react'

const PersonForm = ({ onSubmit }) => {
    return (
      <>
        <form onSubmit={onSubmit}>
          <div>
            name: <input id="nameField" />
          </div>
          <div>
            phone: <input id="phoneField" />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
      </>
    );
  };

  export default PersonForm;
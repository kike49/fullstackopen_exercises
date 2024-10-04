import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_PERSONS, CREATE_PERSON } from "../../../backend/queries";


const PersonForm = ({setError}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [ {query: ALL_PERSONS} ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(response.data.addPerson),
        }
      })
    },
  });
  const submit = async (event) => {
    event.preventDefault();
    createPerson({ variables: { name, phone: phone.length > 0 ? phone : undefined, street, city } });
    setName("");
    setPhone("");
    setStreet("");
    setCity("");
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={submit}>
        <div>
          Name{" "}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          Phone{" "}
          <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          Street{" "}
          <input
            value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          City{" "}
          <input
            value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type="submit">Add contact</button>
      </form>
    </div>
  );
};

export default PersonForm;

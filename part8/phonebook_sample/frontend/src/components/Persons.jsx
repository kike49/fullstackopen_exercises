import { useQuery } from "@apollo/client";
import { useState } from "react";
import { FIND_PERSON } from "../../../backend/queries";



const Person = ({ person, onClose }) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} - {person.address.city}
      </div>
      <div>{person.phone ? person.phone : "No phone number registered"}</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const Persons = ({ persons }) => {
  const [nameToSearch, setNameToSearch] = useState(null);
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch // it wont execute the query if nameToSearch has no value
  });
  if (nameToSearch && result.data) {
    return (
      <Person
        person={result.data.findPerson}
        onClose={() => setNameToSearch(null)}
      />
    );
  }

  return (
    <div>
      <h2>Persons</h2>
      {persons.map((p) => (
        <p key={p.id}>
          {p.name} - {p.phone ? p.phone : "No phone number registered"}
          <br />
          <i>id: {p.id}</i>
          <button onClick={() => setNameToSearch(p.name)}>Show details</button>
        </p>
      ))}
    </div>
  );
};

export default Persons;

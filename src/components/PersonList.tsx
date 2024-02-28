import React, { useState } from 'react';
import PersonDetails from './PersonDetails.tsx';
import { Person } from '../dataUtils.ts';
import { ClipLoader } from 'react-spinners';
import './style.css'; // Import the existing styles

interface PersonListProps {
  persons: Person[];
  setPersonsData: React.Dispatch<React.SetStateAction<Person[]>>;
}

const PersonList: React.FC<PersonListProps> = ({ persons, setPersonsData }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);
  const [visiblePersons, setVisiblePersons] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(false); // State to track loading status

  const handlePersonClick = (person: Person) => {
    setSelectedPerson((prevPerson) => (prevPerson === person ? null : person));
    setOpenAccordionId(person.id);
  };

  const handleEdit = async (editedPerson: Person) => {
    try {
      setLoading(true); // Set loading to true when starting the edit

      const response = await fetch(`https://factwise.onrender.com/api/persons/${editedPerson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPerson),
      });

      if (response.ok) {
        setPersonsData((prevPersons) =>
          prevPersons.map((person) => (person.id === editedPerson.id ? editedPerson : person))
        );

        setSelectedPerson(null);
        setOpenAccordionId(null);
      } else {
        console.error('Failed to update person:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating person:', error);
    } finally {
      setLoading(false); // Set loading to false when edit is complete
    }
  };

  const handleDelete = async (personId: number) => {
    try {
      setLoading(true); // Set loading to true when starting the delete

      const response = await fetch(`https://factwise.onrender.com/api/persons/${personId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPersonsData((prevPersons) => prevPersons.filter((person) => person.id !== personId));

        setSelectedPerson(null);
        setOpenAccordionId(null);
      } else {
        console.error('Failed to delete person:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting person:', error);
    } finally {
      setLoading(false); // Set loading to false when delete is complete
    }
  };

  const handleLoadMore = () => {
    setVisiblePersons((prevCount) => prevCount + 8);
  };

  const filteredPersons = persons
    .filter((person) =>
      `${person.first} ${person.last}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, visiblePersons);

    return (
      <div className='person-list'>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ul>
          {filteredPersons.map((person) => (
            <li
              key={person.id}
              className={`person-list-item ${selectedPerson === person ? 'active' : ''}`}
            >
              <div
                onClick={() => handlePersonClick(person)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={person.picture} // Use the 'picture' property for the image
                    alt={`${person.first} ${person.last}`}
                    style={{ marginRight: '10px', borderRadius: '50%', width: '40px', height: '40px' }}
                  />
                  <span>
                    {person.first} {person.last}
                  </span>
                </div>
                <span>{selectedPerson === person ? '▼' : '►'}</span>
              </div>
  
              <div
                className={`accordion-arrow ${openAccordionId === person.id ? 'open' : ''}`}
                onClick={() => setOpenAccordionId(openAccordionId === person.id ? null : person.id)}
              ></div>
              {selectedPerson === person && openAccordionId === person.id && (
                <PersonDetails
                  person={selectedPerson}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(person.id)}
                />
              )}
            </li>
          ))}
        </ul>
        {loading && <ClipLoader color="#00BFFF" loading={loading} size={80} />}
  
        {filteredPersons.length < persons.length && (
          <button className='load-more' onClick={handleLoadMore}>
            Load More
          </button>
        )}
      </div>
    );
  };

  export default PersonList;
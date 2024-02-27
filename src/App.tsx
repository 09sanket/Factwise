import React, { useEffect, useState } from 'react';
import PersonList from './components/PersonList.tsx';
import { Person } from './dataUtils.ts'; // Import the Person type from the correct path

const App: React.FC = () => {
  const [personsData, setPersonsData] = useState<Person[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://factwise.onrender.com/api/persons');
        const data = await response.json();
        setPersonsData(data);
      } catch (error) {
        console.error('Error fetching data :', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className='person-h1'>Celebrities List</h1>
      <PersonList persons={personsData} setPersonsData={setPersonsData} />
    </div>
  );
};

export default App;

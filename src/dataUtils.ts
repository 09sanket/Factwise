// dataUtils.ts
const apiUrl = 'https://factwise.onrender.com/api/persons';

interface Person {
  id: number;
  first: string;
  last: string;
  dob: string;
  gender: string;
  email: string;
  picture: string;
  country: string;
  description: string;
}

const readData = async (): Promise<Person[]> => {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error during data fetch:', error.message);
    throw error;
  }
};

const writeData = async (data: Person[]): Promise<Person[]> => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST', // or 'PUT' for updates
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to write data: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error during data write:', error.message);
    throw error;
  }
};

export { readData, writeData, Person };

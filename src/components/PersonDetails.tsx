import React, { useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { readData, writeData, Person } from '../dataUtils.ts';

interface PersonDetailsProps {
  person: Person;
  onEdit: (editedPerson: Person) => void;
  onDelete: (id: number) => void;
}

interface EditFormState {
  isEditOpen: boolean;
  isDeleteConfirmationOpen: boolean;
  editedPerson: Person;
  isSaveDisabled: boolean;
}

const calculateAge = (dob: string) => {
  const birthYear = new Date(dob).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};

const PersonDetails: React.FC<PersonDetailsProps> = ({ person, onEdit, onDelete }) => {
  const [state, setState] = useState<EditFormState>({
    isEditOpen: false,
    isDeleteConfirmationOpen: false,
    editedPerson: { ...person },
    isSaveDisabled: true,
  });

  const handleEditClick = () => {
    setState((prevState) => ({
      ...prevState,
      isEditOpen: true,
    }));
  };

  const handleDeleteClick = () => {
    setState((prevState) => ({
      ...prevState,
      isDeleteConfirmationOpen: true,
    }));
  };

  const handleDeleteConfirm = async () => {
    setState((prevState) => ({
      ...prevState,
      isDeleteConfirmationOpen: false,
    }));

    const data = await readData();

    if (!Array.isArray(data)) {
      console.error('Invalid data format. Expected an array.');
      return;
    }

    const updatedData = data.filter((p) => p.id !== person.id);

    await writeData(updatedData);

    onDelete(person.id);
  };

  const handleDeleteCancel = () => {
    setState((prevState) => ({
      ...prevState,
      isDeleteConfirmationOpen: false,
    }));
  };

  const handleEditSave = async () => {
    const data = await readData();

    const index = data.findIndex((p) => p.id === state.editedPerson.id);

    data[index] = state.editedPerson;

    await writeData(data);

    setState((prevState) => ({
      ...prevState,
      isEditOpen: false,
      isSaveDisabled: true,
    }));
    onEdit(state.editedPerson);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      editedPerson: {
        ...prevState.editedPerson,
        [name]: value,
      },
      isSaveDisabled: false,
    }));
  };

  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const ageStr = e.target.value;

    if (ageStr.trim() === '') {
      return;
    }

    const age = parseInt(ageStr);

    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;

    const newDOB = new Date(birthYear, 0, 1).toISOString().split('T')[0];

    setState((prevState) => ({
      ...prevState,
      editedPerson: {
        ...prevState.editedPerson,
        age,
        dob: newDOB,
      },
      isSaveDisabled: false,
    }));
  };

  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setState((prevState) => ({
      ...prevState,
      editedPerson: {
        ...prevState.editedPerson,
        gender: value,
      },
      isSaveDisabled: false,
    }));
  };

  return (
    <div className="person-card">
      {!state.isEditOpen && (
        <div className="person-details">
          <h2>{person.first} {person.last}</h2>
          <img src={person.picture} alt={`${person.first} ${person.last}`} />
          <p><strong>Age:</strong> {calculateAge(person.dob)}</p>
          <p>
            <strong>Gender:</strong>{' '}
            {person.gender}
          </p>
          <p><strong>Email:</strong> {person.email}</p>
          <p><strong>Country:</strong> {person.country}</p>
          <p><strong>Description:</strong> {person.description}</p>
        </div>
      )}

      <div className="details-actions">
        {!state.isEditOpen && (
          <span className="edit-icon" onClick={handleEditClick}>
            <FontAwesomeIcon icon={faEdit} />
          </span>
        )}
        <span className="delete-icon" onClick={handleDeleteClick}>
          <FontAwesomeIcon icon={faTrash} />
        </span>
      </div>

      {state.isEditOpen && (
        <div className="edit-form">
          <h3>Edit Details</h3>

          {/* <label>
      Image URL:
      <input
        type="text"
        name="picture"
        value={state.editedPerson.picture}
        onChange={handleInputChange}
      />
    </label> */}
          <label>
            First Name:
            <input
              type="text"
              name="first"
              value={state.editedPerson.first}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="last"
              value={state.editedPerson.last}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={calculateAge(state.editedPerson.dob)}
              onChange={handleAgeChange}
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={state.editedPerson.gender}
              onChange={handleGenderChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Transgender">Transgender</option>
              <option value="Rather not say">Rather not say</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className='country'>
            Country:
            <input
              type="text"
              name="country"
              value={state.editedPerson.country}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={state.editedPerson.description}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleEditSave} disabled={state.isSaveDisabled}>
            Save
          </button>
          <button onClick={() => setState({ ...state, isEditOpen: false })}>
            Cancel
          </button>
        </div>
      )}

      {state.isDeleteConfirmationOpen && (
        <div className="overlay">
          <div className="delete-confirmation">
            <p>Are you sure you want to delete {person.first} {person.last}?</p>
            <button onClick={handleDeleteConfirm}>Confirm</button>
            <button onClick={handleDeleteCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonDetails;

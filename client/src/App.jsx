import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";

import { gql } from "@apollo/client/core";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      age
      name
      isMarried
    }
  }
`;

const GET_USERS_BY_ID = gql`
  query GetUsersById($id: ID!) {
    getUserById(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({});
  const {
    data: getUserData,
    error: getUserError,
    loading: getUserLoading,
  } = useQuery(GET_USERS);

  const {
    data: getUserByIdData,
    error: getUserByIdError,
    loading: getUserByIdLoading,
  } = useQuery(GET_USERS_BY_ID, {
    variables: { id: "2" },
  });

  const [createUser] = useMutation(CREATE_USER);

  if (getUserLoading) return <p>Loading...</p>;
  if (getUserError) return <p>Error: {getUserError.message}</p>;

  const handleCreateUser = async () => {
    createUser({
      variables: {
        name: newUser.name,
        age: Number(newUser.age),
        isMarried: false,
      },
    });
  };

  return (
    <>
      <div>
        <h1>Create User</h1>

        <input
          type="text"
          placeholder="name..."
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="age..."
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: e.target.value }))
          }
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>
      <h1>Choosen User</h1>
      <div>
        {getUserByIdLoading ? (
          <p>Loading...</p>
        ) : getUserByIdError ? (
          <p>Error: {getUserByIdError.message}</p>
        ) : (
          <div>
            <p>Name: {getUserByIdData.getUserById.name}</p>
            <p>Age: {getUserByIdData.getUserById.age}</p>
            <p>
              Married: {getUserByIdData.getUserById.isMarried ? "Yes" : "No"}
            </p>
          </div>
        )}
      </div>

      <h1>Users</h1>

      <div>
        {getUserData.getUsers.map((user) => (
          <div key={user.id}>
            <p>THE INFO OF USER {user.id}</p>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Married: {user.isMarried ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;

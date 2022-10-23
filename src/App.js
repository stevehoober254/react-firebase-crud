import './App.css';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from './config/firebase';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {FaAngleDoubleLeft,FaAngleDoubleRight, FaTrashAlt} from 'react-icons/fa';


function App() {
  const [users, setUsers] = useState([]);
  const [newName, setName] = useState("");
  const [newAge, setAge] = useState(0);

  const userRef = collection(db, "users");
  const createUser = async (e) => {
    e.preventDefault();
    await addDoc(userRef, { name: newName, age: newAge });
    setName("");
    setAge(0);

  }
  const addAge = async (user) => {
    const userDoc = doc(db, "users", user.id)
    await updateDoc(userDoc,{age:user.age+1});
  }
  const reduceAge = async (user) => {
    const userDoc = doc(db, "users", user.id)
    await updateDoc(userDoc,{age:user.age-1});
  }
  const deleteUser = async (user) => {
    const userDoc = doc(db, "users", user.id)
    await deleteDoc(userDoc);
  }
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userRef);
      console.log(data);
      setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }
    getUsers();
  })
  return (
    <div className="container my-5 py-5">
      <h1 className="text-secondary">React Firebase App</h1>
      <section className='my-5 d-flex justify-content-between'>
        <div className="col-lg-5">
          <h2 className="text-warning">Users</h2>
          <ListGroup as="ol" numbered >
            {users.map(user => (
              <ListGroup.Item as="li" key={user.id} className='d-flex justify-content-start'>
                <p className="mx-3">Name: {user.name}<br />Age: {user.age}</p>
                <Button size="sm" variant="outline" className="mx-5" onClick={() => reduceAge(user)}><FaAngleDoubleLeft className='text-primary'/></Button>
                <Button size="sm" variant="outline" className="mx-5" onClick={() => addAge(user)}><FaAngleDoubleRight className='text-primary'/></Button>
                <Button size="sm" variant="outline" className="mx-5" onClick={() => deleteUser(user)}><FaTrashAlt className='text-danger'/></Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <div className="col-lg-5 pt-2">
      <h2>Add New user</h2>
          <Form onSubmit={(event) => createUser(event)}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" value={newName} onChange={(event) => { setName(event.target.value) }} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="age">
              <Form.Label>Age</Form.Label>
              <Form.Control type="number" placeholder="Enter Age" value={newAge} onChange={(event) => { setAge(Number(event.target.value))}} required />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </section>
    </div>
  );
}

export default App;

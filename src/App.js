import React, { useState } from "react";
import { useStudents } from "./hooks/useStudents";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";

function App() {
  const {students,error,createStudent,updateStudent,deleteStudent,searchStudents} = useStudents();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleEdit = (student) => {
    setEditId(student.id);
    setName(student.name);
    setEmail(student.email);
  };

  const handleCancel = () => {
    setEditId(null);
    setName("");
    setEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please enter both name and email");
      return;
    }
    if (editId) {
      await updateStudent(editId, name, email);
      setEditId(null);
    } else {
      await createStudent(name, email);
    }
    setName("");
    setEmail("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id);
      if (editId === id) {
        handleCancel();
      }
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    await searchStudents(value);
  };


  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Students</h1>

      <input
        type="text"
        placeholder="Search students by name or email"
        value={searchKeyword}
        onChange={handleSearchChange}
        style={{ width: "100%", padding: 8, marginBottom: 20 }}
      />
      
      <StudentList students={students} error={error} onEdit={handleEdit} onDelete={handleDelete}/>

      <StudentForm name={name} email={email}
        onNameChange={(e) => setName(e.target.value)}
        onEmailChange={(e) => setEmail(e.target.value)}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={!!editId}
      />
    </div>
  );
}

export default App;

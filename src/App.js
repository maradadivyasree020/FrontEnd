// import React, { useState } from "react";
// import { useStudents } from "./hooks/useStudents";
// import StudentList from "./components/StudentList";
// import StudentForm from "./components/StudentForm";

// function App() {
//   const {students,error,createStudent,updateStudent,deleteStudent,searchStudents} = useStudents();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [searchKeyword, setSearchKeyword] = useState("");

//   const handleEdit = (student) => {
//     setEditId(student.id);
//     setName(student.name);
//     setEmail(student.email);
//   };

//   const handleCancel = () => {
//     setEditId(null);
//     setName("");
//     setEmail("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name || !email) {
//       alert("Please enter both name and email");
//       return;
//     }
//     if (editId) {
//       await updateStudent(editId, name, email);
//       setEditId(null);
//     } else {
//       await createStudent(name, email);
//     }
//     setName("");
//     setEmail("");
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this student?")) {
//       await deleteStudent(id);
//       if (editId === id) {
//         handleCancel();
//       }
//     }
//   };

//   const handleSearchChange = async (e) => {
//     const value = e.target.value;
//     setSearchKeyword(value);
//     await searchStudents(value);
//   };


//   return (
//     <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
//       <h1>Students</h1>

//       <input
//         type="text"
//         placeholder="Search students by name or email"
//         value={searchKeyword}
//         onChange={handleSearchChange}
//         style={{ width: "100%", padding: 8, marginBottom: 20 }}
//       />
      
//       <StudentList students={students} error={error} onEdit={handleEdit} onDelete={handleDelete}/>

//       <StudentForm name={name} email={email}
//         onNameChange={(e) => setName(e.target.value)}
//         onEmailChange={(e) => setEmail(e.target.value)}
//         onSubmit={handleSubmit}
//         onCancel={handleCancel}
//         isEditing={!!editId}
//       />
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { useStudents } from "./hooks/useStudents"; // your existing hook
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";

function App() {
  const { students, error, createStudent, updateStudent, deleteStudent, searchStudents } = useStudents();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // New state for Age Prediction
  const [predictName, setPredictName] = useState("");
  const [predictedAge, setPredictedAge] = useState(null);
  const [ageError, setAgeError] = useState(null);
  const [loadingAge, setLoadingAge] = useState(false);

  // Existing handlers…

  const handlePredictAge = () => {
    if (!predictName) {
      alert("Please enter a name to predict age");
      return;
    }
    setLoadingAge(true);
    setAgeError(null);
    setPredictedAge(null);

    fetch(`http://localhost:8080/age-prediction?name=${encodeURIComponent(predictName)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to get age prediction");
        return res.json();
      })
      .then((data) => {
        setPredictedAge(data);
        setLoadingAge(false);
      })
      .catch((err) => {
        setAgeError(err.message);
        setLoadingAge(false);
      });
  };

  // other handlers

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Students</h1>

      {/* Existing Student CRUD UI */}
      <input
        type="text"
        placeholder="Search students by name or email"
        value={searchKeyword}
        onChange={(e) => {
          setSearchKeyword(e.target.value);
          searchStudents(e.target.value);
        }}
        style={{ width: "100%", padding: 8, marginBottom: 20 }}
      />

      <StudentList students={students} error={error} onEdit={(s) => { setEditId(s.id); setName(s.name); setEmail(s.email); }} onDelete={deleteStudent} />

      <StudentForm
        name={name}
        email={email}
        onNameChange={(e) => setName(e.target.value)}
        onEmailChange={(e) => setEmail(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          if (!name || !email) {
            alert("Please enter both name and email");
            return;
          }
          if (editId) {
            updateStudent(editId, name, email);
            setEditId(null);
          } else {
            createStudent(name, email);
          }
          setName("");
          setEmail("");
        }}
        onCancel={() => {
          setEditId(null);
          setName("");
          setEmail("");
        }}
        isEditing={!!editId}
      />

      <hr style={{ margin: "40px 0" }} />

      {/* New Age Prediction Section */}
      <h2>Predict Age by Name</h2>
      <input
        type="text"
        placeholder="Enter name"
        value={predictName}
        onChange={(e) => setPredictName(e.target.value)}
        style={{ width: "60%", padding: 8, marginRight: 10 }}
      />
      <button onClick={handlePredictAge} style={{ padding: "8px 16px" }}>Predict Age</button>

      {loadingAge && <p>Loading prediction...</p>}
      {ageError && <p style={{ color: "red" }}>Error: {ageError}</p>}
      {predictedAge && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Name:</strong> {predictedAge.name}</p>
          <p><strong>Predicted Age:</strong> {predictedAge.age ?? "Unknown"}</p>
          <p><strong>Sample Count:</strong> {predictedAge.count}</p>
        </div>
      )}
    </div>
  );
}

export default App;

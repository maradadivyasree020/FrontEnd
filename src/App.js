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
import { useStudents } from "./hooks/useStudents";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";

function App() {
  const { students, error, createStudent, updateStudent, deleteStudent, searchStudents } = useStudents();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // New state for external API post data
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(null);

  // Fetch external API data from your backend on mount
  useEffect(() => {
    fetch("http://localhost:8080/students/external-data")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch external data");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setPostLoading(false);
      })
      .catch((err) => {
        setPostError(err.message);
        setPostLoading(false);
      });
  }, []);

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

      <StudentList students={students} error={error} onEdit={handleEdit} onDelete={handleDelete} />

      <StudentForm
        name={name}
        email={email}
        onNameChange={(e) => setName(e.target.value)}
        onEmailChange={(e) => setEmail(e.target.value)}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={!!editId}
      />

      <hr style={{ margin: "40px 0" }} />

      <h2>External Post Data</h2>
      {postLoading && <p>Loading post data...</p>}
      {postError && <p style={{ color: "red" }}>Error: {postError}</p>}
      {post && (
        <div>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <small>User ID: {post.userId}</small>
        </div>
      )}
    </div>
  );
}

export default App;

//GraphQL

// import { useState, useEffect } from "react";

// const API = "http://localhost:8080/graphql";

// export function useStudents() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchStudents = async () => {
//     setLoading(true);
//     setError(null);
//     const query = `
//       query {
//         allStudents {
//           id
//           name
//           email
//         }
//       }
//     `;

//     try {
//       const res = await fetch(API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query }),
//       });

//       const json = await res.json();
//       if (json.errors) {
//         setError(json.errors[0].message);
//       } else {
//         setStudents(json.data.allStudents);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const createStudent = async (name, email) => {
//     const mutation = `
//       mutation {
//         createStudent(name: "${name}", email: "${email}") {
//           id
//           name
//           email
//         }
//       }
//     `;
//     await fetch(API, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query: mutation }),
//     });
//     await fetchStudents();
//   };

//   const updateStudent = async (id, name, email) => {
//     const mutation = `
//       mutation {
//         updateStudent(id: ${id}, name: "${name}", email: "${email}") {
//           id
//           name
//           email
//         }
//       }
//     `;
//     await fetch(API, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query: mutation }),
//     });
//     await fetchStudents();
//   };

//   const deleteStudent = async (id) => {
//     const mutation = `
//       mutation {
//         deleteStudent(id: ${id})
//       }
//     `;
//     await fetch(API, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query: mutation }),
//     });
//     await fetchStudents();
//   };

//   const searchStudents = async (keyword) => {
//     console.log(keyword)
//   if (!keyword) {
//     await fetchStudents();
//     return;
//   }
//   setLoading(true);
//   setError(null);
//   const query = `
//     query {
//       searchStudents(keyword: "${keyword}") {
//         id
//         name
//         email
//       }
//     }
//   `;
//   try {
//     const res = await fetch(API, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query }),
//     });
//     const json = await res.json();
//     if (json.errors) {
//       setError(json.errors[0].message);
//     } else {
//       setStudents(json.data.searchStudents);
//     }
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };


//   return {students,loading,error,createStudent,updateStudent,deleteStudent,fetchStudents,searchStudents};
// }

// REST API

import { useState, useEffect } from "react";

const API = "http://localhost:8080/students";

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New state for predicted ages by student ID
  const [predictedAges, setPredictedAges] = useState({}); // { studentId: { age, error, loading } }

  // Fetch all students (GET /students)
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch students");
      const json = await res.json(); // Array of students
      setStudents(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Create a student (POST /students)
  const createStudent = async (name, email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error("Failed to create student");
      await fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update a student (PUT /students/{id})
  const updateStudent = async (id, name, email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error("Failed to update student");
      await fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a student (DELETE /students/{id})
  const deleteStudent = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete student");
      await fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search students by name or email (GET /students?search=keyword)
  const searchStudents = async (keyword) => {
    setLoading(true);
    setError(null);
    try {
      let url = API;
      if (keyword && keyword.trim() !== "") {
        url += `?search=${encodeURIComponent(keyword)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to search students");
      const json = await res.json();
      setStudents(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Predict age for a student by name with backend call
  const predictAgeForStudent = (studentId, name) => {
    setPredictedAges((prev) => ({
      ...prev,
      [studentId]: { loading: true, error: null, age: null },
    }));

    fetch(`http://localhost:8080/age-prediction?name=${encodeURIComponent(name)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to get age prediction");
        return res.json();
      })
      .then((data) => {
        setPredictedAges((prev) => ({
          ...prev,
          [studentId]: { loading: false, age: data.age, error: null },
        }));
      })
      .catch((err) => {
        setPredictedAges((prev) => ({
          ...prev,
          [studentId]: { loading: false, age: null, error: err.message },
        }));
      });
  };

  return {
    students,
    loading,
    error,
    predictedAges,
    createStudent,
    updateStudent,
    deleteStudent,
    fetchStudents,
    searchStudents,
    predictAgeForStudent,
  };
}

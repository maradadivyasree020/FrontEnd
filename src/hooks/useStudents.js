import { useState, useEffect } from "react";

const GRAPHQL_ENDPOINT = "http://localhost:8080/graphql";

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    const query = `
      query {
        allStudents {
          id
          name
          email
        }
      }
    `;

    try {
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const json = await res.json();
      if (json.errors) {
        setError(json.errors[0].message);
      } else {
        setStudents(json.data.allStudents);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const createStudent = async (name, email) => {
    const mutation = `
      mutation {
        createStudent(name: "${name}", email: "${email}") {
          id
          name
          email
        }
      }
    `;
    await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation }),
    });
    await fetchStudents();
  };

  const updateStudent = async (id, name, email) => {
    const mutation = `
      mutation {
        updateStudent(id: ${id}, name: "${name}", email: "${email}") {
          id
          name
          email
        }
      }
    `;
    await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation }),
    });
    await fetchStudents();
  };

  const deleteStudent = async (id) => {
    const mutation = `
      mutation {
        deleteStudent(id: ${id})
      }
    `;
    await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation }),
    });
    await fetchStudents();
  };

  return {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    fetchStudents,
  };
}

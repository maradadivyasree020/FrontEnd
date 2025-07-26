import React from "react";

export default function StudentList({ students, loading, error, onEdit, onDelete }) {
  if (loading) return <p>Loading students...</p>;

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  if (students.length === 0) {
    return (
      <p style={{ textAlign: "center" }}>
        No students found.
      </p>
    );
  }

  return (
    <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>
              <button onClick={() => onEdit(student)}>Edit</button>{" "}
              <button onClick={() => onDelete(student.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

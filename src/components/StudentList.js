// import React from "react";

// export default function StudentList({ students, loading, error, onEdit, onDelete }) {
//   if (loading) return <p>Loading students...</p>;

//   if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

//   if (students.length === 0) {
//     return (
//       <p style={{ textAlign: "center" }}>
//         No students found.
//       </p>
//     );
//   }

//   return (
//     <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
//       <thead>
//         <tr>
//           <th>ID</th>
//           <th>Name</th>
//           <th>Email</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {students.map((student) => (
//           <tr key={student.id}>
//             <td>{student.id}</td>
//             <td>{student.name}</td>
//             <td>{student.email}</td>
//             <td>
//               <button onClick={() => onEdit(student)}>Edit</button>{" "}
//               <button onClick={() => onDelete(student.id)}>Delete</button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

import React from "react";

const StudentList = ({ students, error, onEdit, onDelete, onPredictAge, predictedAges }) => {
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!students || students.length === 0) return <p>No students found.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {students.map(student => {
        const prediction = predictedAges[student.id] || {};
        return (
          <li key={student.id} style={{ marginBottom: 15, padding: 10, borderBottom: "1px solid #ccc" }}>
            <div>
              <strong>{student.name}</strong> - {student.email}
            </div>
            <div style={{ marginTop: 5 }}>
              <button onClick={() => onEdit(student)} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={() => onDelete(student.id)} style={{ marginRight: 8 }}>Delete</button>
              <button onClick={() => onPredictAge(student.id, student.name)}>Predict Age</button>
            </div>
            <div style={{ marginTop: 5, fontSize: 14, color: "green" }}>
              {prediction.loading && <span>Loading age prediction...</span>}
              {prediction.error && <span style={{ color: "red" }}>Error: {prediction.error}</span>}
              {prediction.age !== null && !prediction.loading && !prediction.error &&
                <span>Predicted Age: {prediction.age}</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default StudentList;

import React from "react";

export default function StudentForm({ name, email, onNameChange, onEmailChange, onSubmit, onCancel, isEditing }) {
  return (
    <>
      <h2>{isEditing ? "Edit Student" : "Add Student"}</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Name:{" "}
            <input
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="Enter name"
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            Email:{" "}
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="Enter email"
              required
            />
          </label>
        </div>
        <button type="submit">{isEditing ? "Update" : "Add"}</button>{" "}
        {isEditing && (
          <button onClick={onCancel} type="button">
            Cancel
          </button>
        )}
      </form>
    </>
  );
}

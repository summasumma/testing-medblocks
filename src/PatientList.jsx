import React, { useState, useEffect } from "react";
import { usePGlite } from "@electric-sql/pglite-react";

function PatientList() {
  const db = usePGlite();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const result = await db.query(
          "SELECT * FROM patients ORDER BY id DESC"
        );
        // Convert Date objects to strings
        const formattedRows = result.rows.map((row) => ({
          ...row,
          date_of_birth:
            row.date_of_birth instanceof Date
              ? row.date_of_birth.toISOString().split("T")[0]
              : row.date_of_birth || "N/A",
        }));
        setRows(formattedRows);
        setError(null);
      } catch (err) {
        setError(err);
        setRows(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
    const interval = setInterval(fetchPatients, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [db]);

  if (loading) {
    return <div>Loading database...</div>;
  }

  if (error) {
    return <div>Error fetching patients: {error.message}</div>;
  }

  if (!rows || rows.length === 0) {
    return <div>No patients found.</div>;
  }

  return (
    <div>
      <h2>Patient List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.date_of_birth}</td>
              <td>{patient.gender}</td>
              <td>{patient.address}</td>
              <td>{patient.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientList;

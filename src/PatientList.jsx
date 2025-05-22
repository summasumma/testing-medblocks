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
          "SELECT * FROM patients ORDER BY registration_date DESC"
        );
        const formattedRows = result.rows.map((row) => ({
          ...row,
          date_of_birth: row.date_of_birth instanceof Date
            ? row.date_of_birth.toISOString().split("T")[0]
            : row.date_of_birth || "N/A",
          registration_date: row.registration_date instanceof Date
            ? row.registration_date.toLocaleString()
            : row.registration_date || "N/A",
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
    const interval = setInterval(fetchPatients, 5000);
    return () => clearInterval(interval);
  }, [db]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Error fetching patients: {error.message}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900">No patients yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          Register a new patient to see them listed here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Patient Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.medical_record_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {patient.first_name} {patient.last_name}
                  </div>
                  <div className="text-sm text-gray-500">{patient.city}, {patient.state}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.date_of_birth}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.phone}</div>
                  <div className="text-sm text-gray-500">{patient.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.registration_date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientList;
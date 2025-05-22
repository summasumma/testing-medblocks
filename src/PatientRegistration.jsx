import React, { useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";

function PatientRegistration() {
  const db = usePGlite();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.query(
        "INSERT INTO patients (name, date_of_birth, gender, address, phone) VALUES ($1, $2, $3, $4, $5)",
        [name, dob, gender, address, phone]
      );
      
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
      notification.textContent = 'Patient registered successfully';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);

      setName("");
      setDob("");
      setGender("");
      setAddress("");
      setPhone("");
    } catch (error) {
      console.error("Error registering patient:", error);
      alert("Failed to register patient");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Register New Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-field"
            rows="3"
            placeholder="Enter full address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Register Patient
        </button>
      </form>
    </div>
  );
}

export default PatientRegistration;
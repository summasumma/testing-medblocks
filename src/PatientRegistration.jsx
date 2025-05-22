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
      alert("Patient registered successfully");
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
    <form onSubmit={handleSubmit}>
      <h2>Register New Patient</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Date of Birth:
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </label>
      <label>
        Gender:
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        />
      </label>
      <label>
        Address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      <label>
        Phone:
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </label>
      <button type="submit">Register</button>
    </form>
  );
}

export default PatientRegistration;

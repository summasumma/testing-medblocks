import React, { useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";

function PatientRegistration() {
  const db = usePGlite();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    medical_record_number: "",
    allergies: "",
    pre_existing_conditions: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    registered_by: "medblocks",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.query(
        `INSERT INTO patients (
          first_name, last_name, date_of_birth, gender, phone, email,
          street_address, city, state, postal_code, medical_record_number,
          allergies, pre_existing_conditions, emergency_contact_name,
          emergency_contact_phone, registered_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        )`,
        [
          formData.first_name,
          formData.last_name,
          formData.date_of_birth,
          formData.gender,
          formData.phone,
          formData.email,
          formData.street_address,
          formData.city,
          formData.state,
          formData.postal_code,
          formData.medical_record_number,
          formData.allergies,
          formData.pre_existing_conditions,
          formData.emergency_contact_name,
          formData.emergency_contact_phone,
          formData.registered_by,
        ]
      );

      const notification = document.createElement("div");
      notification.className =
        "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg";
      notification.textContent = "Patient registered successfully";
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);

      setFormData({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        email: "",
        street_address: "",
        city: "",
        state: "",
        postal_code: "",
        medical_record_number: "",
        allergies: "",
        pre_existing_conditions: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        registered_by: "medblocks",
      });
    } catch (error) {
      console.error("Error registering patient:", error);
      alert("Failed to register patient");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Register New Patient
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Address Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Medical Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Record Number (MRN)
              </label>
              <input
                type="text"
                name="medical_record_number"
                value={formData.medical_record_number}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergies
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="input-field"
                rows="2"
                placeholder="e.g., penicillin, peanuts"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pre-existing Conditions
              </label>
              <textarea
                name="pre_existing_conditions"
                value={formData.pre_existing_conditions}
                onChange={handleChange}
                className="input-field"
                rows="2"
                placeholder="e.g., diabetes, hypertension"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          Register Patient
        </button>
      </form>
    </div>
  );
}

export default PatientRegistration;

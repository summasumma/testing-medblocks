import React, { useState, useEffect } from "react";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live } from "@electric-sql/pglite/live";
import PatientRegistration from "./PatientRegistration";
import PatientList from "./PatientList";
import SqlQuery from "./SqlQuery";

function App() {
  const [pg, setPg] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("main");

  useEffect(() => {
    const initPg = async () => {
      try {
        const worker = new Worker(
          new URL("./pglite-worker.js", import.meta.url),
          { type: "module" }
        );
        const pgInstance = await PGliteWorker.create(worker, {
          dataDir: "idb://patient-db",
          extensions: { live },
        });
        await pgInstance.waitReady;
        setPg(pgInstance);
      } catch (err) {
        console.error("Failed to initialize PGliteWorker:", err);
        setError(err.message);
      }
    };
    initPg();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error initializing database: {error}
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading database...</div>
      </div>
    );
  }

  return (
    <PGliteProvider db={pg}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Medblocks Patient Management
          </h1>

          {/* Tab navigation */}
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "main"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("main")}
            >
              Main
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "sql"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("sql")}
            >
              SQL Query
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "main" && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <PatientRegistration />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <PatientList />
                </div>
              </div>
            </div>
          )}

          {activeTab === "sql" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <SqlQuery />
            </div>
          )}
        </div>
      </div>
    </PGliteProvider>
  );
}

export default App;

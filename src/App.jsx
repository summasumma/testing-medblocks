import React, { useState, useEffect } from "react";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live } from "@electric-sql/pglite/live";
import PatientRegistration from "./PatientRegistration";
import PatientList from "./PatientList";
import SqlQuery from "./SqlQuery";
import "./App.css";

function App() {
  const [pg, setPg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initPg = async () => {
      try {
        const worker = new Worker(
          new URL("./pglite-worker.js", import.meta.url),
          {
            type: "module",
          }
        );
        const pgInstance = await PGliteWorker.create(worker, {
          dataDir: "idb://patient-db",
          extensions: {
            live,
          },
        });
        await pgInstance.waitReady; // Ensure worker is fully initialized
        console.log("PGliteWorker initialized:", pgInstance);
        console.log("Live extension available:", !!pgInstance.live);
        // Test live query in main thread
        await pgInstance.live
          .query("SELECT 1")
          .then((result) => {
            console.log("Main thread live query test result:", result);
          })
          .catch((err) => {
            console.error("Main thread live query test failed:", err);
          });
        setPg(pgInstance);
      } catch (err) {
        console.error("Failed to initialize PGliteWorker:", err);
        setError(err.message);
      }
    };
    initPg();
  }, []);

  if (error) {
    return <div>Error initializing database: {error}</div>;
  }

  if (!pg) {
    return <div>Loading database...</div>;
  }

  return (
    <PGliteProvider db={pg}>
      <div className="container">
        <h1>Patient Registration App</h1>
        <PatientRegistration />
        <PatientList />
        <SqlQuery />
      </div>
    </PGliteProvider>
  );
}

export default App;

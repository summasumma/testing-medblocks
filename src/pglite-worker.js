import { PGlite } from "@electric-sql/pglite";
import { worker } from "@electric-sql/pglite/worker";
import { live } from "@electric-sql/pglite/live";

worker({
  async init(options) {
    console.log("Worker initializing with options:", options);
    const db = new PGlite({
      dataDir: options.dataDir,
      extensions: {
        live,
      },
    });
    console.log("PGlite instance created, live extension:", !!db.live);
    try {
      await db.waitReady; // Ensure database is fully initialized
      await db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name TEXT,
          date_of_birth DATE,
          gender TEXT,
          address TEXT,
          phone TEXT
        );
      `);
      console.log("Patients table created successfully");
      // Verify live query capability
      await db.live
        .query("SELECT 1")
        .then((result) => {
          console.log("Live query test result:", result);
        })
        .catch((err) => {
          console.error("Live query test failed:", err);
        });
    } catch (err) {
      console.error("Error initializing database:", err);
      throw err;
    }
    return db;
  },
});

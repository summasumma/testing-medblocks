import React, { useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";

function SqlQuery() {
  const db = usePGlite();
  const [sql, setSql] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    try {
      const res = await db.query(sql);
      // Convert Date objects in rows to strings
      if (res.rows) {
        res.rows = res.rows.map((row) => {
          const newRow = { ...row };
          for (const key in newRow) {
            if (newRow[key] instanceof Date) {
              newRow[key] = newRow[key].toISOString().split("T")[0];
            }
          }
          return newRow;
        });
      }
      setResult(res);
      setError(null);
    } catch (err) {
      setError(err);
      setResult(null);
    }
  };

  return (
    <div>
      <h2>Run SQL Query</h2>
      <textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        rows={5}
        cols={50}
        placeholder="Enter SQL query"
      />
      <button onClick={handleExecute}>Execute</button>
      {error && <div>Error: {error.message}</div>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default SqlQuery;

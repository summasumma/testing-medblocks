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
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Database Query Console</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SQL Query
          </label>
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={4}
            className="input-field font-mono text-sm"
            placeholder="SELECT * FROM patients WHERE gender = 'Female';"
          />
        </div>
        
        <button onClick={handleExecute} className="btn-primary">
          Execute Query
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700 font-medium">Error</p>
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">Result</p>
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default SqlQuery;
import React, { useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";

function SqlQuery() {
  const db = usePGlite();
  const [sql, setSql] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("json"); // "json" or "table"

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

  const renderTable = () => {
    if (!result?.rows?.length) return null;
    const columns = Object.keys(result.rows[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {result.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row[column]?.toString() || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
        
        <div className="flex items-center justify-between">
          <button 
            onClick={handleExecute} 
            className="btn-primary"
            disabled={!sql.trim()}
          >
            Execute Query
          </button>

          {result?.rows && (
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-600">View as:</label>
              <div className="flex rounded-lg shadow-sm">
                <button
                  onClick={() => setViewMode("json")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    viewMode === "json"
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  JSON
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    viewMode === "table"
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700 font-medium">Error</p>
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">Result</p>
            {result.rows && result.rows.length > 0 ? (
              viewMode === "json" ? (
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                renderTable()
              )
            ) : (
              <div className="text-sm text-gray-600 italic">
                No results found for this query
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SqlQuery;
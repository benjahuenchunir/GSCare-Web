// src/components/TokenTestButton.tsx
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const TokenTestButton: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log("TOKEN:", token);

      const res = await fetch("http://localhost:3000/auth/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Respuesta de /auth/account:", data);
      setResult(data);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Error desconocido");
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-primary text-black font-semibold rounded hover:bg-opacity-80"
      >
        Probar /auth/account
      </button>

      {result && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {error && (
        <p className="mt-4 text-red-600 font-semibold">Error: {error}</p>
      )}
    </div>
  );
};

export default TokenTestButton;

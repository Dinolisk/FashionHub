import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Importera useNavigate

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // <--- Hämta navigate-funktionen

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Lösenorden matchar inte!");
      return;
    }
    if (!email || !password) {
      alert("Fyll i både e-post och lösenord.");
      return;
    }

    console.log('Ska försöka registrera med:', { email, password });

    try {
      // Använd den nya porten om du bytt!
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Försök läsa svar även om det inte är OK, för felmeddelande från servern
      const data = await response.json();

      if (!response.ok) {
        // Använd felmeddelandet från servern om det finns, annars ett generellt
        throw new Error(data.error || `Något gick fel (${response.status})`);
      }

      // ---- Success ----
      alert('Registrering lyckades! Du kan nu logga in.');

      // Rensa fälten
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Navigera till login-sidan
      navigate('/login'); // <--- Skicka användaren till login

    } catch (error) {
      console.error("Registreringsfel:", error);
      // Visa felet från throw new Error() ovan
      alert(`Registrering misslyckades: ${error.message}`);
    }
  };

  // ... resten av din return (...) JSX för formuläret ...
  // Ingen ändring behövs i JSX-delen
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Registrera konto
        </h2>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            E-postadress
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Lösenord
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Bekräfta lösenord
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-150 ease-in-out"
          >
            Registrera
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Importera useNavigate
import { useAuth } from '../context/AuthContext'; // <--- Importera useAuth (antar att filen finns/skapas)

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // <--- Hämta navigate-funktionen
  const { login } = useAuth(); // <--- Hämta login-funktionen från context

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Fyll i både e-post och lösenord.");
      return;
    }

    console.log('Ska försöka logga in med:', { email, password });

    try {
      // Använd den nya porten om du bytt!
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Läs svaret från servern

      if (!response.ok) {
         // Använd felmeddelandet från servern (data.error)
        throw new Error(data.error || `Något gick fel (${response.status})`);
      }

      // ---- Success ----

      // 1. Uppdatera global state (AuthContext)
      // Antag att servern skickar tillbaka { message: '...', user: { id: ..., email: ... } }
      login(data.user); // <--- Skicka användardatat till context

      // 2. Visa bekräftelse (valfritt nu när vi navigerar)
      // alert('Inloggning lyckades!'); // Kan tas bort om navigering sker direkt

      // 3. Rensa fälten
      setEmail('');
      setPassword('');

      // 4. Navigera användaren till startsidan (eller annan sida)
      navigate('/'); // <--- Skicka användaren till startsidan

    } catch (error) {
      console.error("Inloggningsfel:", error);
       // Visa felet från throw new Error() ovan
      alert(`Inloggning misslyckades: ${error.message}`);
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
          Logga In
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
        <div className="mb-6">
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
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-150 ease-in-out"
          >
            Logga In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
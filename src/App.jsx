import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="bg-red-500 text-white p-4">
        Testar Tailwind!
      </div>
    </BrowserRouter>
  );
}
export default App;
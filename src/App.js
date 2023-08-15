import "./styles.css";
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Petroriente from "./pages/Petroriente";


export default function App() {
  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Routes>
            <Route index element = { <Petroriente /> } />
            <Route path="/petroriente" element={<Petroriente />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

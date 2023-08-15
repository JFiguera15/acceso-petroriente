import "./styles.css";
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import ZonaIndustrial from '.pages/ZonaIndustrial';
import Petroriente from "./pages/Petroriente";


export default function App() {
  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Routes>
            <Route index element = { <Petroriente /> } />
            <Route path="/petroriente" element={<Petroriente />} />
            <Route path="/zonaindustrial" element={<ZonaIndustrial />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

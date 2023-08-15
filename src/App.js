import "./styles.css";
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Petroriente from "./pages/Petroriente";
import ZonaIndustrial from "./pages/zonaindustrial";


export default function App() {
  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Routes>
            <Route index element = { <Petroriente /> } />
            <Route path="/zonaindustrial" element = { <ZonaIndustrial />}></Route>
            <Route path="/petroriente" element={<Petroriente />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

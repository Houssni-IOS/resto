import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import UserHome from './components/User/UserHome';
import AdminHome from './components/Admin/AdminHome';
import Header from './components/Header';
import Ville from './components/Ville';
import Zone from './components/Zone';
import restaurant from './components/Restaurant';
import Restaurant from './components/Restaurant';
import Map from './components/Map';




function App() {
  return (
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-page" element={<UserHome />} />
          <Route path="/admin-page" element={<AdminHome />} />
          <Route path="/ville" element={<Ville />} />
          <Route path="/zone" element={<Zone />} />
          <Route path="/restaurant" element={<Restaurant/>} />
          <Route path="/maps" element={<Map/>} />



        </Routes>
      </div>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Search from './pages/Search';
// import Favorites from './pages/Favorites';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/search" element={<Search />} />
        {/* <Route path="/favorites" element={<Favorites />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

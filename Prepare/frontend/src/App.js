import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { useUserStore } from './stores/useUserStore';

function App() {
  const loggedIn = useUserStore((state) => state.loggedIn);

  const ProtectedRoute = ({ element }) => {
    if (!loggedIn) {
      window.location.href = '/login';
    } else {
      return element;
    }
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute element={<Home />} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

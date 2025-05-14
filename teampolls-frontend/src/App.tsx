import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CreatePoll from './pages/CreatePoll';
import PollDetail from './pages/PollDetail';

function App() {
  return (
    <Router>
      <Header />
      <div className="container mx-auto p-4 items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<PollDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

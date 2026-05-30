import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import Home from '../pages/Home';
import Session from '../pages/Session';
import Result from '../pages/Result';
import History from '../pages/History';

/**
 * App Routing Configuration
 * 
 * Declares the page paths using react-router-dom:
 * - "/" => Socratic info homepage (Home)
 * - "/session" => Active chat dialogue workspace (Session)
 * - "/result" => Session conclusion, score breakdowns, and knowledge gaps (Result)
 * - "/history" => List of historical user learnings (History)
 */
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session" element={<Session />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

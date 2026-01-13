import './App.css'
import { Frame } from './Frame'
import { Footer } from './Footer'

import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ServicesPage } from './Services';
import { ContactPage } from './Contact';
import { ProjectsPage } from './Projects';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-container flex flex-col min-h-screen relative">

      <div className="flex-grow">
        {children}
      </div>
      {!isHome && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Frame />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App


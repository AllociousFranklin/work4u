import './App.css'
import { Frame } from './Frame'
import { Footer } from './Footer'

import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ServicesPage } from './Services';
import { ContactPage } from './Contact';
import { ProjectsPage } from './Projects';

import companyLogo from './assets/company_logo.jpg';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-container flex flex-col min-h-screen relative">
      {/* Global Sticky Brand Mark - Bottom Right (Reverted to original subtle size) */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none mix-blend-screen opacity-60 hover:opacity-100 transition-opacity duration-500">
        <img src={companyLogo} alt="Logo" className="w-16 md:w-20 object-contain drop-shadow-2xl" />
      </div>

      {/* Global Sticky Brand Mark - Top Left (Enhanced) */}
      <div className="fixed top-[-60px] left-[15px] z-[9999] mix-blend-screen opacity-100 transition-opacity duration-500">
        <Link to="/" className="cursor-pointer block">
          <img src={companyLogo} alt="Logo" className="w-[100px] md:w-[120px] object-contain drop-shadow-2xl transform scale-125" />
        </Link>
      </div>

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


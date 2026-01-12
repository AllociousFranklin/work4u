import './App.css'
import { Frame } from './Frame'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ServicesPage } from './Services';
import { ContactPage } from './Contact';
import { ProjectsPage } from './Projects';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Frame />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


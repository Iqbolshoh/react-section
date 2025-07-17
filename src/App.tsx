import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './contexts/ProjectContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Preview from './pages/Preview';
import Profile from './pages/Profile';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import Team from './pages/Team';
import Support from './pages/Support';
import TemplateGallery from './pages/TemplateGallery';

function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor/:id" element={<Editor />} />
              <Route path="/preview/:id" element={<Preview />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/team" element={<Team />} />
              <Route path="/support" element={<Support />}/>
              <Route path="/templates" element={<TemplateGallery />} />
            </Routes>
          </div>
        </Router>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;
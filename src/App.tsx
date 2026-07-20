import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import GlobalOverview from './pages/GlobalOverview';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import Employees from './pages/Employees';
import Customers from './pages/Customers';
import Processes from './pages/Processes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<GlobalOverview />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="employees" element={<Employees />} />
          <Route path="customers" element={<Customers />} />
          <Route path="processes" element={<Processes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

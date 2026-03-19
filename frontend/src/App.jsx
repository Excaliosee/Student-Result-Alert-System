import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Subjects from './pages/Subjects'
import Admins from './pages/Admins'
import Results from './pages/Results'
import FailingStudents from './pages/FailingStudents'
import Notifications from './pages/Notifications'

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/admins" element={<Admins />} />
            <Route path="/results" element={<Results />} />
            <Route path="/failing" element={<FailingStudents />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

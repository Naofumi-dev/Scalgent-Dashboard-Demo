import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Overview from './pages/Overview'
import WorkflowBuilder from './pages/WorkflowBuilder'
import Analytics from './pages/Analytics'
import Contacts from './pages/Contacts'
import Tasks from './pages/Tasks'
import Login from './pages/Login'
import { AuthProvider } from './lib/AuthContext'
import PrivateRoute from './lib/PrivateRoute'

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/*"
                        element={
                            <PrivateRoute>
                                <div className="app-shell">
                                    <Sidebar />
                                    <div className="main-area">
                                        <TopBar />
                                        <main className="page-content">
                                            <Routes>
                                                <Route path="/" element={<Navigate to="/overview" replace />} />
                                                <Route path="/overview" element={<Overview />} />
                                                <Route path="/builder" element={<WorkflowBuilder />} />
                                                <Route path="/analytics" element={<Analytics />} />
                                                <Route path="/contacts" element={<Contacts />} />
                                                <Route path="/tasks" element={<Tasks />} />
                                            </Routes>
                                        </main>
                                    </div>
                                </div>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

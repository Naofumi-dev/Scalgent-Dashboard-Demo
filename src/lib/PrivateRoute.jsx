import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8fa8' }}>
                Authenticating...
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

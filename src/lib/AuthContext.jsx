import { createContext, useContext, useEffect, useState } from 'react'
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // Only update if we aren't currently using a guest session
            setUser(prev => {
                if (prev && prev.isGuest) return prev;
                return currentUser;
            })
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

    const loginAsGuest = () => {
        setUser({
            uid: 'demo-guest',
            displayName: 'Demo Visitor',
            email: 'demo@flowsight.app',
            photoURL: 'https://ui-avatars.com/api/?name=Demo+Visitor&background=6366f1&color=fff',
            isGuest: true
        })
    }

    const logout = () => {
        if (user?.isGuest) {
            setUser(null)
            return Promise.resolve()
        }
        return signOut(auth)
    }

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, loginAsGuest, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

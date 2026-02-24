import { createContext, useContext, useEffect, useState } from 'react'
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

    const logout = () => signOut(auth)

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

import { Construction } from 'lucide-react'

export default function ComingSoon({ title = 'Feature in Development' }) {
    return (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, background: 'rgba(168, 85, 247, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)' }}>
                <Construction size={40} color="#a855f7" />
            </div>
            <h1 className="font-black text-3xl" style={{ color: '#fff', marginBottom: 16 }}>{title}</h1>
            <p className="text-secondary text-base" style={{ maxWidth: 400, lineHeight: 1.6 }}>
                This module is currently being built in the v2 roadmap. Stay tuned for updates!
            </p>
        </div>
    )
}

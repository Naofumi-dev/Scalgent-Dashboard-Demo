import ReactFlow, {
    Background, Controls, MiniMap,
    addEdge, useNodesState, useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useCallback, useState, useRef } from 'react'
import { Save, Play, Trash2, GitBranch, CheckCircle } from 'lucide-react'
import './WorkflowBuilder.css'

const NODE_PALETTE = [
    { type: 'input', label: '🔔 GHL Trigger', color: '#e8614a' },
    { type: 'default', label: '🔍 Filter/Condition', color: '#f0b429' },
    { type: 'default', label: '📧 Send Email', color: '#6c5ce7' },
    { type: 'default', label: '💬 Send SMS', color: '#6c5ce7' },
    { type: 'default', label: '⏱ Wait/Delay', color: '#00b894' },
    { type: 'default', label: '🤖 AI Scoring', color: '#a29bfe' },
    { type: 'default', label: '📝 Update CRM', color: '#6c5ce7' },
    { type: 'output', label: '✅ End / Output', color: '#a29bfe' },
]

const INITIAL_NODES = [
    { id: '1', type: 'input', position: { x: 80, y: 80 }, data: { label: '🔔 GHL Trigger' }, style: { background: '#e8614a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 12, padding: '8px 14px' } },
    { id: '2', type: 'default', position: { x: 260, y: 80 }, data: { label: '🔍 Filter Leads' }, style: { background: '#22252a', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 } },
    { id: '3', type: 'default', position: { x: 440, y: 30 }, data: { label: '📧 Send Email' }, style: { background: '#22252a', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 } },
    { id: '4', type: 'default', position: { x: 440, y: 130 }, data: { label: '⏱ Wait 24h' }, style: { background: '#22252a', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 } },
    { id: '5', type: 'output', position: { x: 640, y: 80 }, data: { label: '✅ Lead Scored' }, style: { background: '#6c5ce7', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 12, padding: '8px 14px' } },
]

const INITIAL_EDGES = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#e8614a', strokeWidth: 2 } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#6c5ce7', strokeWidth: 2 } },
    { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#f0b429', strokeWidth: 2 } },
    { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#6c5ce7', strokeWidth: 2 } },
    { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#6c5ce7', strokeWidth: 2 } },
]

let nodeId = 10

export default function WorkflowBuilder() {
    const reactFlowWrapper = useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES)
    const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES)
    const [reactFlowInstance, setReactFlowInstance] = useState(null)

    // UI states
    const [saved, setSaved] = useState(false)
    const [simulating, setSimulating] = useState(false)
    const [simulationStatus, setSimulationStatus] = useState(null)

    const onConnect = useCallback(
        (params) => setEdges(eds => addEdge({ ...params, animated: true, style: { stroke: '#6c5ce7', strokeWidth: 2 } }, eds)),
        [setEdges]
    )

    const onDragStart = (event, item) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(item))
        event.dataTransfer.effectAllowed = 'move'
    }

    const onDragOver = useCallback((event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event) => {
            event.preventDefault()
            if (!reactFlowInstance) return

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            const data = event.dataTransfer.getData('application/reactflow')
            if (!data) return

            const item = JSON.parse(data)

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            })

            const id = String(++nodeId)
            setNodes((nds) => [...nds, {
                id,
                type: item.type,
                position,
                data: { label: item.label },
                style: {
                    background: item.type === 'input' || item.type === 'output' ? item.color : '#22252a',
                    color: item.type === 'input' || item.type === 'output' ? '#fff' : '#f0f0f0',
                    border: item.type === 'input' || item.type === 'output' ? 'none' : `1px solid ${item.color}40`,
                    borderRadius: 10, fontSize: 12
                }
            }])
        },
        [reactFlowInstance, setNodes]
    )

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleSimulate = () => {
        if (simulating) return
        setSimulating(true)
        setSimulationStatus('checking')

        // Highlight all edges to green to simulate active flow
        setEdges(eds => eds.map(e => ({ ...e, animated: true, style: { stroke: '#00b894', strokeWidth: 3 } })))

        // Mock 2.5s simulation timer
        setTimeout(() => {
            setSimulating(false)
            setSimulationStatus('success')
            // Revert edges back
            setEdges(eds => eds.map(e => ({ ...e, animated: true, style: { stroke: '#6c5ce7', strokeWidth: 2 } })))

            // Clear success popup after a few seconds
            setTimeout(() => setSimulationStatus(null), 4000)
        }, 2500)
    }

    const clearNodes = () => {
        if (confirm('Are you sure you want to delete all nodes from the canvas?')) {
            setNodes([])
            setEdges([])
        }
    }

    return (
        <div className="builder-layout">
            {/* Left palette */}
            <aside className="builder-palette">
                <div className="builder-palette-title">
                    <GitBranch size={14} className="text-coral" /> Node Palette
                </div>
                {NODE_PALETTE.map(item => (
                    <div
                        key={item.label}
                        className="palette-node"
                        onDragStart={(event) => onDragStart(event, item)}
                        draggable
                        title="Drag and drop onto canvas"
                        style={{ borderLeftColor: item.color, cursor: 'grab' }}
                    >
                        {item.label}
                    </div>
                ))}
                <div className="builder-palette-title" style={{ marginTop: 16 }}>Templates</div>
                {['Lead Nurture', 'Appointment Flow', 'Churn Prevention', 'Review Request'].map(t => (
                    <button key={t} className="palette-template">{t}</button>
                ))}
            </aside>

            {/* Canvas */}
            <div className="builder-canvas" ref={reactFlowWrapper}>
                {/* Toolbar */}
                <div className="builder-toolbar">
                    <span className="font-semibold text-sm">Lead Nurture Sequence</span>
                    <div className="flex gap-2 items-center">
                        <span className="text-secondary" style={{ fontSize: 11, marginRight: 8, opacity: 0.8 }}>Select node & press Backspace to delete</span>
                        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={handleSave}>
                            <Save size={13} /> {saved ? 'Saved ✓' : 'Save'}
                        </button>
                        <button className="btn btn-coral" style={{ fontSize: 12 }} disabled={simulating} onClick={handleSimulate}>
                            <Play size={13} className={simulating ? 'animate-pulse' : ''} /> {simulating ? 'Running...' : 'Simulate'}
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={clearNodes} title="Clear Canvas">
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                    style={{ background: '#0d0f12' }}
                    deleteKeyCode={['Backspace', 'Delete']}
                >
                    <Background color="rgba(255,255,255,0.04)" gap={24} />
                    <Controls style={{ background: '#1a1c1f', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <MiniMap
                        nodeColor={n => {
                            if (n.style?.background) return n.style.background
                            return '#22252a'
                        }}
                        style={{ background: '#1a1c1f', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                </ReactFlow>

                {simulationStatus === 'success' && (
                    <div style={{
                        position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(0, 184, 148, 0.15)', color: '#00b894',
                        padding: '12px 24px', borderRadius: 99, border: '1px solid rgba(0, 184, 148, 0.3)',
                        display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600,
                        zIndex: 50, backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <CheckCircle size={16} /> Automation simulated successfully! 100% of test leads routed.
                    </div>
                )}
            </div>
        </div>
    )
}

import ReactFlow, {
    Background, Controls, MiniMap,
    addEdge, useNodesState, useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useCallback, useState, useRef } from 'react'
import dagre from 'dagre'
import { Save, Play, Trash2, GitBranch, CheckCircle, Wand2, ArrowDownUp, Lock } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
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

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const isHorizontal = direction === 'LR'
    dagreGraph.setGraph({ rankdir: direction })

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 150, height: 50 })
    })

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id)
        node.targetPosition = isHorizontal ? 'left' : 'top'
        node.sourcePosition = isHorizontal ? 'right' : 'bottom'

        node.position = {
            x: nodeWithPosition.x - 75,
            y: nodeWithPosition.y - 25,
        }
        return node
    })

    return { nodes, edges }
}

let nodeId = 10

export default function WorkflowBuilder() {
    const reactFlowWrapper = useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES)
    const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES)
    const [reactFlowInstance, setReactFlowInstance] = useState(null)
    const { user } = useAuth()
    const isViewer = user?.role === 'Viewer'

    // UI states
    const [saved, setSaved] = useState(false)
    const [simulating, setSimulating] = useState(false)
    const [simulationStatus, setSimulationStatus] = useState(null)
    const [aiOptimizing, setAiOptimizing] = useState(false)
    const [aiMessage, setAiMessage] = useState(null)

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
        if (window.confirm('Are you sure you want to delete all nodes from the canvas?')) {
            setNodes([])
            setEdges([])
        }
    }

    const onLayout = useCallback(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges)
        setNodes([...layoutedNodes])
        setEdges([...layoutedEdges])
    }, [nodes, edges, setNodes, setEdges])

    const handleAIOptimize = () => {
        if (aiOptimizing) return
        setAiOptimizing(true)
        setTimeout(() => {
            setAiOptimizing(false)
            setAiMessage("Gemini Suggests: \"Adding a 'Wait 24h' node before 'Score Lead' could improve tracking accuracy by 14%.\"")
            setTimeout(() => setAiMessage(null), 6000)
        }, 1500)
    }

    const loadTemplate = (name) => {
        let newNodes = []
        let newEdges = []
        if (name === 'Lead Nurture') {
            newNodes = [
                { id: 't1', type: 'input', position: { x: 0, y: 0 }, data: { label: '🔔 GHL Tag added' }, style: { background: '#e8614a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 12, padding: '8px 14px' } },
                { id: 't2', type: 'default', position: { x: 0, y: 0 }, data: { label: '📧 Send Promo 1' }, style: { background: '#22252a', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 } },
                { id: 't3', type: 'default', position: { x: 0, y: 0 }, data: { label: '⏱ Wait 2 days' }, style: { background: '#22252a', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 } },
                { id: 't4', type: 'default', position: { x: 0, y: 0 }, data: { label: '💬 Send SMS Check-in' }, style: { background: '#22252a', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 } },
                { id: 't5', type: 'output', position: { x: 0, y: 0 }, data: { label: '✅ Goal Scored' }, style: { background: '#a29bfe', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 12, padding: '8px 14px' } },
            ]
            newEdges = [
                { id: 'e1', source: 't1', target: 't2', animated: true, style: { stroke: '#6c5ce7', strokeWidth: 2 } },
                { id: 'e2', source: 't2', target: 't3', animated: true, style: { stroke: '#6c5ce7', strokeWidth: 2 } },
                { id: 'e3', source: 't3', target: 't4', animated: true, style: { stroke: '#6c5ce7', strokeWidth: 2 } },
                { id: 'e4', source: 't4', target: 't5', animated: true, style: { stroke: '#6c5ce7', strokeWidth: 2 } },
            ]
        } else {
            newNodes = INITIAL_NODES
            newEdges = INITIAL_EDGES
        }

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges)
        setNodes(layoutedNodes)
        setEdges(layoutedEdges)
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
                        onDragStart={(event) => !isViewer && onDragStart(event, item)}
                        draggable={!isViewer}
                        title={isViewer ? "View-only access" : "Drag and drop onto canvas"}
                        style={{ borderLeftColor: item.color, cursor: isViewer ? 'not-allowed' : 'grab', opacity: isViewer ? 0.5 : 1 }}
                    >
                        {item.label}
                    </div>
                ))}
                <div className="builder-palette-title" style={{ marginTop: 16 }}>Templates</div>
                {['Lead Nurture', 'Appointment Flow', 'Churn Prevention', 'Review Request'].map(t => (
                    <button key={t} className="palette-template" disabled={isViewer} onClick={() => loadTemplate(t)} style={{ opacity: isViewer ? 0.5 : 1 }}>{t}</button>
                ))}
            </aside>

            {/* Canvas */}
            <div className="builder-canvas" ref={reactFlowWrapper}>
                {/* Toolbar */}
                <div className="builder-toolbar">
                    <span className="font-semibold text-sm">Lead Nurture Sequence</span>
                    <div className="flex gap-2 items-center">
                        <span className="text-secondary" style={{ fontSize: 11, marginRight: 8, opacity: 0.8 }}>
                            {isViewer ? <><Lock size={10} style={{ display: 'inline', marginRight: 4 }} /> View-Only Mode</> : 'Select node & press Backspace to delete'}
                        </span>
                        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={onLayout} title="Auto-layout Nodes">
                            <ArrowDownUp size={13} /> Layout
                        </button>
                        <button className="btn btn-ghost" style={{ fontSize: 12, color: 'var(--purple-light)', opacity: isViewer ? 0.5 : 1 }} onClick={handleAIOptimize} disabled={aiOptimizing || isViewer}>
                            <Wand2 size={13} className={aiOptimizing ? 'animate-pulse' : ''} /> {aiOptimizing ? 'Analyzing...' : 'AI Optimize'}
                        </button>
                        <button className="btn btn-ghost" style={{ fontSize: 12, opacity: isViewer ? 0.5 : 1 }} onClick={handleSave} disabled={isViewer}>
                            <Save size={13} /> {saved ? 'Saved ✓' : 'Save'}
                        </button>
                        <button className="btn btn-coral" style={{ fontSize: 12, opacity: isViewer ? 0.5 : 1 }} disabled={simulating || isViewer} onClick={handleSimulate}>
                            <Play size={13} className={simulating ? 'animate-pulse' : ''} /> {simulating ? 'Running...' : 'Simulate'}
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={clearNodes} disabled={isViewer} title="Clear Canvas" style={{ opacity: isViewer ? 0.5 : 1 }}>
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={isViewer ? undefined : onNodesChange}
                    onEdgesChange={isViewer ? undefined : onEdgesChange}
                    onConnect={isViewer ? undefined : onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={isViewer ? undefined : onDrop}
                    onDragOver={onDragOver}
                    nodesDraggable={!isViewer}
                    nodesConnectable={!isViewer}
                    elementsSelectable={!isViewer}
                    fitView
                    style={{ background: '#0d0f12' }}
                    deleteKeyCode={isViewer ? null : ['Backspace', 'Delete']}
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

                {aiMessage && (
                    <div style={{
                        position: 'absolute', bottom: 30, right: 30,
                        background: 'rgba(99, 102, 241, 0.15)', color: '#e2e8f0',
                        padding: '16px 24px', borderRadius: 16, border: '1px solid rgba(99, 102, 241, 0.3)',
                        display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 500,
                        zIndex: 50, backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        maxWidth: 380, animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <Wand2 size={24} className="text-purple-light" style={{ flexShrink: 0 }} />
                        <span style={{ lineHeight: 1.5 }}>{aiMessage}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

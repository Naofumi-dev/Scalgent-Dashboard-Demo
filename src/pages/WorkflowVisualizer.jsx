import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import { useRef, useState } from 'react'
import { mock3DNodes, mock3DEdges, mockWorkflows } from '../lib/mockData'
import { Box, GitBranch, ToggleLeft, ToggleRight, Play } from 'lucide-react'
import './WorkflowVisualizer.css'

const NODE_COLORS = {
    trigger: '#e8614a',
    condition: '#f0b429',
    action: '#6c5ce7',
    delay: '#00b894',
    output: '#a29bfe',
}

function WorkflowNode({ node, onClick, selected }) {
    const mesh = useRef()
    const color = NODE_COLORS[node.type] || '#6c5ce7'

    return (
        <group position={[node.x * 1.4, node.y * 1.4, node.z * 1.4]} onClick={() => onClick(node)}>
            <mesh ref={mesh}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={selected ? 1.2 : 0.4}
                    roughness={0.2}
                    metalness={0.6}
                />
            </mesh>
            {selected && (
                <mesh>
                    <sphereGeometry args={[0.4, 16, 16]} />
                    <meshStandardMaterial color={color} transparent opacity={0.15} />
                </mesh>
            )}
            <Text
                position={[0, -0.45, 0]}
                fontSize={0.18}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                {node.label}
            </Text>
        </group>
    )
}

function WorkflowEdges({ nodes, edges }) {
    return edges.map((edge, i) => {
        const from = nodes.find(n => n.id === edge.from)
        const to = nodes.find(n => n.id === edge.to)
        if (!from || !to) return null
        return (
            <Line
                key={i}
                points={[
                    [from.x * 1.4, from.y * 1.4, from.z * 1.4],
                    [to.x * 1.4, to.y * 1.4, to.z * 1.4]
                ]}
                color="rgba(255,255,255,0.25)"
                lineWidth={1.5}
                dashed
                dashSize={0.1}
                gapSize={0.05}
            />
        )
    })
}

export default function WorkflowVisualizer() {
    const [selected, setSelected] = useState(null)
    const [activeWf, setActiveWf] = useState(mockWorkflows[0])

    return (
        <div className="viz-layout">
            {/* Sidebar panel */}
            <aside className="viz-panel">
                <div className="viz-panel-header">
                    <Box size={16} className="text-coral" />
                    <span className="font-bold text-sm">3D Workflows</span>
                </div>

                <div className="viz-workflows">
                    {mockWorkflows.map(wf => (
                        <button
                            key={wf.id}
                            className={`viz-wf-item${activeWf.id === wf.id ? ' active' : ''}`}
                            onClick={() => setActiveWf(wf)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs">{wf.name}</span>
                                <span className={`badge badge-${wf.status === 'active' ? 'green' : wf.status === 'warning' ? 'amber' : 'coral'}`}>
                                    {wf.status}
                                </span>
                            </div>
                            <div className="flex gap-3" style={{ marginTop: 4 }}>
                                <span className="text-xs text-muted">{wf.nodes} nodes</span>
                                <span className="text-xs text-muted">{wf.successRate}% success</span>
                                <span className="text-xs text-muted">{wf.source}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="viz-legend">
                    {Object.entries(NODE_COLORS).map(([type, color]) => (
                        <div key={type} className="viz-legend-item">
                            <span className="viz-legend-dot" style={{ background: color }} />
                            <span className="text-xs text-secondary" style={{ textTransform: 'capitalize' }}>{type}</span>
                        </div>
                    ))}
                </div>

                {selected && (
                    <div className="viz-detail card">
                        <div className="font-bold text-sm" style={{ color: '#fff', marginBottom: 8 }}>{selected.label}</div>
                        <div className="text-xs text-secondary">Type: <span style={{ color: NODE_COLORS[selected.type] }}>{selected.type}</span></div>
                        <div className="text-xs text-muted" style={{ marginTop: 4 }}>
                            Position: ({(selected.x * 1.4).toFixed(1)}, {(selected.y * 1.4).toFixed(1)}, {(selected.z * 1.4).toFixed(1)})
                        </div>
                        <button className="btn btn-coral" style={{ marginTop: 10, width: '100%', fontSize: 12 }}>
                            <Play size={12} /> Simulate from here
                        </button>
                    </div>
                )}
            </aside>

            {/* 3D Canvas */}
            <div className="viz-canvas-wrap">
                <div className="viz-hint">🖱 Drag to orbit · Scroll to zoom · Click nodes to inspect</div>
                <Canvas
                    camera={{ position: [6, 4, 8], fov: 50 }}
                    style={{ background: '#0d0f12' }}
                >
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={1.2} />
                    <pointLight position={[-10, -10, -10]} intensity={0.4} color="#6c5ce7" />

                    {mock3DNodes.map(node => (
                        <WorkflowNode
                            key={node.id}
                            node={node}
                            selected={selected?.id === node.id}
                            onClick={setSelected}
                        />
                    ))}
                    <WorkflowEdges nodes={mock3DNodes} edges={mock3DEdges} />

                    <OrbitControls enablePan autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>
        </div>
    )
}

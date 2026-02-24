// ── Mock data simulating GHL + n8n API responses ──────────────────────────

export const mockRevenue = {
    gross: 156900.67,
    avgOrder: 18.50,
    grossChange: 7.5,
    avgOrderChange: 2.4,
    weekly: [
        { day: 'Mon', value: 18200 },
        { day: 'Tue', value: 21150 },
        { day: 'Wed', value: 16800 },
        { day: 'Thu', value: 22400 },
        { day: 'Fri', value: 19600 },
        { day: 'Sat', value: 24100 },
        { day: 'Sun', value: 14650 },
    ]
}

export const mockCapacity = {
    title: 'Workflow Capacity',
    weeks: [
        { day: 'Mon', pct: 78 },
        { day: 'Tue', pct: 82 },
        { day: 'Wed', pct: 91 },
        { day: 'Thu', pct: 88 },
        { day: 'Fri', pct: 95 },
        { day: 'Sat', pct: 63 },
        { day: 'Sun', pct: 70 },
    ],
    locations: [
        { name: 'GHL Leads', color: '#e8614a' },
        { name: 'n8n Flows', color: '#f0b429' },
        { name: 'Automations', color: '#a29bfe' },
    ]
}

export const mockAlert = {
    title: 'HIGH LEAD VOLUME',
    body: 'Approve critical sequences and check Pipeline Risk. Batch ends in',
    countdown: '2:59:12',
    type: 'warning',
}

export const mockAIMessages = [
    {
        id: 1,
        role: 'assistant',
        text: 'Hi, Hanna — FlowSight shows strong lead pipeline, but two flags need attention: AOV is dipping and Labor Cost is 28%. Let\'s initiate the optimization strategy.',
        actions: ['Show labor cost', 'Initiate strategy planning'],
    }
]

export const mockWorkflows = [
    {
        id: 'wf-1',
        name: 'Lead Nurture Sequence',
        status: 'active',
        nodes: 8,
        lastRun: '2 min ago',
        successRate: 94,
        source: 'GHL',
    },
    {
        id: 'wf-2',
        name: 'Appointment Reminder',
        status: 'active',
        nodes: 5,
        lastRun: '15 min ago',
        successRate: 99,
        source: 'n8n',
    },
    {
        id: 'wf-3',
        name: 'Churn Prevention',
        status: 'warning',
        nodes: 12,
        lastRun: '1 hr ago',
        successRate: 71,
        source: 'n8n',
    },
    {
        id: 'wf-4',
        name: 'Invoice Follow-up',
        status: 'active',
        nodes: 6,
        lastRun: '30 min ago',
        successRate: 88,
        source: 'GHL',
    },
    {
        id: 'wf-5',
        name: 'Review Request',
        status: 'paused',
        nodes: 4,
        lastRun: '3 hrs ago',
        successRate: 82,
        source: 'GHL',
    },
]

export const mockContacts = [
    { id: 'c1', name: 'Sarah Chen', email: 'sarah@company.co', phone: '+1 (415) 234-5678', stage: 'Qualified Lead', score: 87, tags: ['Hot Lead', 'E-commerce'], lastActivity: '2h ago' },
    { id: 'c2', name: 'Marcus Rivera', email: 'marcus@startup.io', phone: '+1 (310) 987-6543', stage: 'Proposal Sent', score: 62, tags: ['SaaS', 'Follow-up'], lastActivity: '1d ago' },
    { id: 'c3', name: 'Priya Patel', email: 'priya@growth.com', phone: '+1 (628) 345-9012', stage: 'Closed Won', score: 95, tags: ['VIP', 'Upsell'], lastActivity: '5m ago' },
    { id: 'c4', name: 'James Okafor', email: 'james@agency.net', phone: '+1 (212) 567-3456', stage: 'New Lead', score: 41, tags: ['Cold', 'Agency'], lastActivity: '3d ago' },
    { id: 'c5', name: 'Lucia Martinez', email: 'lucia@firm.com', phone: '+1 (303) 678-9012', stage: 'Nurturing', score: 73, tags: ['Warm', 'Consulting'], lastActivity: '6h ago' },
    { id: 'c6', name: 'Tom Whitfield', email: 'tom@builders.co', phone: '+1 (512) 234-5678', stage: 'Qualified Lead', score: 58, tags: ['Construction'], lastActivity: '2d ago' },
]

export const mockAnalytics = {
    leadsByDay: [
        { date: 'Feb 17', leads: 24, converted: 8 },
        { date: 'Feb 18', leads: 31, converted: 11 },
        { date: 'Feb 19', leads: 19, converted: 6 },
        { date: 'Feb 20', leads: 42, converted: 18 },
        { date: 'Feb 21', leads: 38, converted: 14 },
        { date: 'Feb 22', leads: 55, converted: 22 },
        { date: 'Feb 23', leads: 47, converted: 19 },
    ],
    pipeline: [
        { stage: 'New Lead', value: 124, fill: '#6c5ce7' },
        { stage: 'Qualified', value: 86, fill: '#a29bfe' },
        { stage: 'Proposal', value: 52, fill: '#e8614a' },
        { stage: 'Closed Won', value: 34, fill: '#00b894' },
        { stage: 'Closed Lost', value: 18, fill: '#5a5d6e' },
    ],
    kpis: [
        { label: 'Total Leads', value: '1,284', change: +12.4, unit: '' },
        { label: 'Conversion Rate', value: '27.3%', change: +3.1, unit: '' },
        { label: 'Avg Deal Size', value: '$4,820', change: -1.8, unit: '' },
        { label: 'Active Workflows', value: '18', change: +2, unit: '' },
    ]
}

export const mock3DNodes = [
    { id: 'n1', label: 'GHL Trigger', type: 'trigger', x: 0, y: 0, z: 0 },
    { id: 'n2', label: 'Filter Leads', type: 'condition', x: 2, y: 0.5, z: 0 },
    { id: 'n3', label: 'Send SMS', type: 'action', x: 4, y: 1, z: 0.5 },
    { id: 'n4', label: 'Wait 24h', type: 'delay', x: 4, y: -0.5, z: -0.5 },
    { id: 'n5', label: 'Send Email', type: 'action', x: 6, y: 0.8, z: 0.8 },
    { id: 'n6', label: 'Update CRM', type: 'action', x: 6, y: -0.8, z: -0.8 },
    { id: 'n7', label: 'Lead Scored', type: 'output', x: 8, y: 0, z: 0 },
]

export const mock3DEdges = [
    { from: 'n1', to: 'n2' },
    { from: 'n2', to: 'n3' },
    { from: 'n2', to: 'n4' },
    { from: 'n3', to: 'n5' },
    { from: 'n4', to: 'n6' },
    { from: 'n5', to: 'n7' },
    { from: 'n6', to: 'n7' },
]

/**
 * Quinfosys™ Quantum Brain — Core Dataset & State Model
 * Pre-configured research projects, source papers, knowledge graph entities,
 * multi-agent simulation workflows, and quantum presets.
 */

const INITIAL_USER = {
  name: "Dr. Elena Rostova",
  role: "Principal Quantum & AI Scientist",
  organization: "Quinfosys Quantum Labs",
  email: "elena.rostova@quinfosys.com",
  tier: "Professional Enterprise",
  stats: {
    activeProjects: 3,
    indexedPapers: 14,
    reasoningRuns: 48,
    quantumSimulations: 126
  }
};

const INITIAL_REGISTERED_USERS = [
  {
    id: "user-elena",
    name: "Dr. Elena Rostova",
    role: "Principal Quantum & AI Scientist",
    organization: "Quinfosys Quantum Labs",
    email: "elena.rostova@quinfosys.com",
    tier: "Professional Enterprise",
    stats: {
      activeProjects: 3,
      indexedPapers: 14,
      reasoningRuns: 48,
      quantumSimulations: 126
    }
  }
];

const INITIAL_PROJECTS = [
  {
    id: "proj-qml-drug-disc",
    name: "Quantum Machine Learning for Molecular Docking & Drug Discovery",
    hypothesis: "Can Variational Quantum Eigensolvers (VQE) with active-space reduction outperform classical DFT for binding affinity predictions in kinase inhibitors?",
    domain: "Pharmaceutical & Quantum ML",
    stage: "Analyse", // Discover, Analyse, Create
    status: "Active",
    createdAt: "2026-08-14",
    updatedAt: "Just now",
    tags: ["VQE", "Drug Discovery", "NISQ", "Graph RAG", "Kinase Inhibitors"],
    summary: "Systematic investigation of hybrid quantum-classical algorithms applied to small-molecule binding energy calculation, mitigating barren plateaus with symmetry-preserving ansatze.",
    documentsCount: 4,
    citationsCount: 18,
    documents: [
      {
        id: "doc-1",
        title: "Quantum Computational Chemistry on Near-Term Devices: Active Space VQE",
        authors: "McArdle, S. et al. (Nature Reviews Physics)",
        year: 2024,
        type: "Peer-reviewed Paper",
        status: "Indexed",
        chunksCount: 32,
        abstract: "Variational quantum algorithms offer an exponential theoretical advantage in Hilbert space representation for strongly correlated electronic systems, provided ansatz depth remains under $O(N^2)$.",
        chunks: [
          {
            id: "c1",
            section: "Section 3.2: Hamiltonian Reduction",
            text: "By applying the Jordan-Wigner transformation combined with unitary coupled-cluster (UCCSD) truncation, the molecular Hamiltonian for the kinase hinge region maps onto 8 qubits with an energy discrepancy within 1.4 kcal/mol of full configuration interaction (FCI).",
            score: 0.96
          },
          {
            id: "c2",
            section: "Section 4.1: Error Mitigation",
            text: "Zero-noise extrapolation (ZNE) with Richardson polynomial fitting recovered ground-state fidelity up to 94.2% across simulated depolarizing noise channels with $\\epsilon = 10^{-3}$.",
            score: 0.91
          }
        ]
      },
      {
        id: "doc-2",
        title: "Comparative Benchmark: Classical GNNs vs. Parameterized Quantum Circuits for Binding Affinity",
        authors: "Kandala, A. & Zhang, L. (Journal of Chemical Information and Modeling)",
        year: 2025,
        type: "Conference Proceedings",
        status: "Indexed",
        chunksCount: 28,
        abstract: "Evaluates hybrid quantum graph neural networks (QGNN) versus classical SchNet and DimeNet on BindingDB benchmarks.",
        chunks: [
          {
            id: "c3",
            section: "Section 5: Results & Discussion",
            text: "The 6-qubit QGNN exhibited accelerated training convergence on organometallic complexes where d-orbital hybridization causes pronounced multi-reference character.",
            score: 0.89
          }
        ]
      },
      {
        id: "doc-3",
        title: "Barren Plateaus and Symmetry-Preserving Ansatze in Molecular QML",
        authors: "Cerezo, M. et al. (Physical Review X)",
        year: 2024,
        type: "Preprint",
        status: "Indexed",
        chunksCount: 45,
        abstract: "Proves that molecular point group symmetries constrain circuit expressivity away from 2-designs, preventing exponential gradient vanishing in deep circuits.",
        chunks: [
          {
            id: "c4",
            section: "Theorem 2: Variance of Cost Function Gradients",
            text: "When the ansatz commutes with total spin $\\hat{S}^2$ and particle number $\\hat{N}$, the gradient variance decays as $\\Omega(1/\\text{poly}(n))$ rather than exponentially.",
            score: 0.94
          }
        ]
      },
      {
        id: "doc-4",
        title: "Experimental Demonstration of Hybrid Classical-Quantum Drug Lead Optimization",
        authors: "Quinfosys Molecular Group Technical Report",
        year: 2026,
        type: "Internal R&D Whitepaper",
        status: "Indexed",
        chunksCount: 22,
        abstract: "Demonstration of end-to-end automated workflow from SMILES string input to quantum-simulated transition state energy verification.",
        chunks: [
          {
            id: "c5",
            section: "Architecture Workflow",
            text: "The Quantum Brain orchestrator automatically routes conformation clustering to classical HPC, while passing active site orbital overlaps to the 12-qubit statevector emulator.",
            score: 0.98
          }
        ]
      }
    ],
    reasoningSessions: [
      {
        id: "session-1",
        query: "How do symmetry-preserving ansatze overcome barren plateaus in our kinase inhibitor calculations?",
        timestamp: "2 hours ago",
        mode: "Deep Research & Reasoning",
        reasoningSteps: [
          {
            phase: "Discover",
            title: "Corpus & Knowledge Graph Traversal",
            detail: "Retrieved 4 relevant chunks from McArdle et al. and Cerezo et al. Identified key entities: Barren Plateaus, Symmetry-Preserving Ansatze, Particle Number Conservation."
          },
          {
            phase: "Analyse",
            title: "Mathematical Consistency Verification",
            detail: "Cross-referenced Theorem 2 in Cerezo et al. with active-space Hamiltonian in McArdle et al. Unconstrained Haar-random circuits suffer gradient decay $Var \\sim O(2^{-n})$, while particle-conserving circuits preserve subspace dimensionality $D_{sym} \\ll 2^n$."
          },
          {
            phase: "Synthesize",
            title: "Computational Recommendation",
            detail: "Ansatz structure should enforce $[\hat{U}(\theta), \hat{N}] = 0$. Recommend using Givens rotation gates (XX+YY interaction) rather than generic arbitrary $R_y / R_z$ gates."
          },
          {
            phase: "Create",
            title: "Executable Quantum Protocol",
            detail: "Constructed 4-qubit fermionic exchange circuit with state initialization in $|1100\\rangle$. Circuit generated in Quantum Sandbox."
          }
        ],
        output: "Symmetry-preserving ansatze overcome barren plateaus by restricting the parameter search space to the physically valid subspace of fixed electron count and spin multiplicity. According to Cerezo et al. [PRX 2024], random initialization in unconstrained circuits forms approximate 2-designs with exponentially vanishing gradients $\\sim O(2^{-n})$. When restricting rotations to Givens excitation blocks that commute with $\\hat{N}$ and $\\hat{S}_z$, McArdle et al. [Nature Rev. 2024] showed that gradient variance scales polynomially, maintaining trainability for our kinase active site simulation.",
        citations: ["McArdle et al., Sec. 3.2", "Cerezo et al., Theorem 2", "Quinfosys Tech Report, Sec. 4"]
      }
    ]
  },
  {
    id: "proj-fault-tolerant-neutral",
    name: "Fault-Tolerant Surface Codes on Reconfigurable Neutral Atom Arrays",
    hypothesis: "Can 2D shuttle-based neutral atom shuttling achieve fault-tolerant logical qubit error rates below $10^{-5}$ under realistic Rydberg blockade decay?",
    domain: "Quantum Computing Hardware & Error Mitigation",
    stage: "Discover",
    status: "Active",
    createdAt: "2026-08-28",
    updatedAt: "Yesterday",
    tags: ["Surface Code", "Neutral Atoms", "QEC", "Rydberg States", "Fault Tolerance"],
    summary: "Investigation into transversal Clifford gates and non-local entanglement via optical tweezer rearrangement for distance-5 surface code architectures.",
    documentsCount: 3,
    citationsCount: 12,
    documents: [],
    reasoningSessions: []
  },
  {
    id: "proj-multiagent-graph-rag",
    name: "Multi-Agent Graph RAG for High-Entropy Alloys Discovery",
    hypothesis: "Does integrating knowledge graphs with autonomous LLM reasoning agents accelerate novel superalloy phase stability prediction?",
    domain: "Enterprise R&D & Knowledge Systems",
    stage: "Create",
    status: "Completed",
    createdAt: "2026-07-10",
    updatedAt: "3 days ago",
    tags: ["Knowledge Graphs", "Multi-Agent", "Graph RAG", "CALPHAD", "Materials Science"],
    summary: "A synthesis of 1,200 metallurgical papers mapped into a graph database with 5 autonomous agents conducting automated hypothesis verification.",
    documentsCount: 7,
    citationsCount: 31,
    documents: [],
    reasoningSessions: []
  }
];

const KNOWLEDGE_GRAPH_DATA = {
  nodes: [
    { id: "vqe", label: "VQE Algorithm", category: "Algorithm", color: "#38bdf8", size: 28, details: "Variational Quantum Eigensolver for ground state calculation." },
    { id: "uccsd", label: "UCCSD Ansatz", category: "Method", color: "#818cf8", size: 22, details: "Unitary Coupled Cluster Singles and Doubles wave-function expansion." },
    { id: "kinase", label: "Kinase Active Site", category: "Problem", color: "#f43f5e", size: 24, details: "Target binding pocket with transition metal coordination." },
    { id: "barren", label: "Barren Plateaus", category: "Challenge", color: "#fb923c", size: 20, details: "Exponential flattening of cost function gradients in deep circuits." },
    { id: "sym_ansatz", label: "Symmetry Preservation", category: "Solution", color: "#34d399", size: 24, details: "Enforces electron number and spin angular momentum conservation." },
    { id: "qnn", label: "Quantum GNN", category: "Model", color: "#c084fc", size: 22, details: "Hybrid quantum-classical graph convolutional network." },
    { id: "zne", label: "Zero-Noise Extrap. (ZNE)", category: "Mitigation", color: "#e879f9", size: 20, details: "Richardson error extrapolation technique for NISQ devices." },
    { id: "bindingdb", label: "BindingDB Dataset", category: "Dataset", color: "#facc15", size: 18, details: "Experimentally validated protein-ligand binding affinities." },
    { id: "jw_trans", label: "Jordan-Wigner Map", category: "Transformation", color: "#94a3b8", size: 20, details: "Fermionic operator to Pauli spin operator isomorphism." }
  ],
  edges: [
    { source: "vqe", target: "uccsd", relation: "employs_ansatz" },
    { source: "vqe", target: "kinase", relation: "computes_energy" },
    { source: "vqe", target: "zne", relation: "error_mitigated_by" },
    { source: "uccsd", target: "barren", relation: "vulnerable_to" },
    { source: "sym_ansatz", target: "barren", relation: "mitigates" },
    { source: "sym_ansatz", target: "uccsd", relation: "constrains" },
    { source: "jw_trans", target: "uccsd", relation: "maps_fermions" },
    { source: "qnn", target: "kinase", relation: "predicts_affinity" },
    { source: "qnn", target: "bindingdb", relation: "trained_on" }
  ]
};

const MULTI_AGENTS_CONFIG = [
  {
    id: "agent-lit",
    name: "Literature Discovery Agent",
    role: "Automated Search & Ingestion",
    avatar: "discover",
    status: "Idle",
    task: "Scan arXiv, Nature, CrossRef for molecular quantum simulation updates",
    color: "#38bdf8"
  },
  {
    id: "agent-tech",
    name: "Technical Analysis Agent",
    role: "Mathematical & Algorithmic Parsing",
    avatar: "analyse",
    status: "Idle",
    task: "Verify cost function bounds, error channel matrices, and complexity order",
    color: "#818cf8"
  },
  {
    id: "agent-kg",
    name: "Knowledge Extraction Agent",
    role: "Graph & Entity Synthesis",
    avatar: "extract",
    status: "Idle",
    task: "Extract triples (Subject-Predicate-Object) and update knowledge graph",
    color: "#a855f7"
  },
  {
    id: "agent-reason",
    name: "Reasoning & Synthesis Agent",
    role: "Multi-Step Hypothesis Deduction",
    avatar: "reason",
    status: "Idle",
    task: "Compare classical DFT vs quantum VQE trade-offs and suggest ansatz",
    color: "#34d399"
  },
  {
    id: "agent-report",
    name: "Report Generation Agent",
    role: "Structured Research Output",
    avatar: "create",
    status: "Idle",
    task: "Draft executive summary, formal methodology, citation index, and charts",
    color: "#fbbf24"
  }
];

const QUANTUM_CIRCUIT_PRESETS = {
  bell: {
    name: "Bell State |Φ⁺⟩ Generator",
    qubits: 2,
    gates: [
      { step: 0, qubit: 0, type: "H", label: "H" },
      { step: 1, qubit: 0, type: "CNOT_CTRL", label: "●", target: 1 },
      { step: 1, qubit: 1, type: "CNOT_TARG", label: "⊕", control: 0 }
    ],
    description: "Maximally entangled 2-qubit Einstein-Podolsky-Rosen pair."
  },
  vqe: {
    name: "2-Qubit VQE Hardware-Efficient Ansatz",
    qubits: 2,
    gates: [
      { step: 0, qubit: 0, type: "RY", label: "Ry(θ₁)", param: "0.785" },
      { step: 0, qubit: 1, type: "RY", label: "Ry(θ₂)", param: "1.571" },
      { step: 1, qubit: 0, type: "CNOT_CTRL", label: "●", target: 1 },
      { step: 1, qubit: 1, type: "CNOT_TARG", label: "⊕", control: 0 },
      { step: 2, qubit: 0, type: "RZ", label: "Rz(θ₃)", param: "0.524" },
      { step: 2, qubit: 1, type: "RY", label: "Ry(θ₄)", param: "1.047" }
    ],
    description: "Parameterized trial wavefunction for active-space molecular hydrogen binding energy."
  },
  teleport: {
    name: "Quantum Teleportation Circuit",
    qubits: 3,
    gates: [
      { step: 0, qubit: 0, type: "RY", label: "Ry(ψ)", param: "1.230" },
      { step: 0, qubit: 1, type: "H", label: "H" },
      { step: 1, qubit: 1, type: "CNOT_CTRL", label: "●", target: 2 },
      { step: 1, qubit: 2, type: "CNOT_TARG", label: "⊕", control: 1 },
      { step: 2, qubit: 0, type: "CNOT_CTRL", label: "●", target: 1 },
      { step: 2, qubit: 1, type: "CNOT_TARG", label: "⊕", control: 0 },
      { step: 3, qubit: 0, type: "H", label: "H" }
    ],
    description: "Teleports arbitrary single-qubit quantum state from Qubit 0 to Qubit 2 using entanglement."
  }
};

// =========================================================================
// BACKEND ARCHITECTURE SPECIFICATIONS & RESOURCES DATA
// Retained in backend layer for orchestration, API endpoints, and internal specs.
// =========================================================================

const BACKEND_TECHNOLOGY_SPEC = {
  platform: "Quantum Brain Platform",
  unifiedArchitecture: {
    aiLayer: {
      title: "Artificial Intelligence",
      components: ["Reasoning Engine", "Multi-Agent Workflows", "Prompt Synthesis", "Constraint Solvers"]
    },
    knowledgeLayer: {
      title: "Knowledge Intelligence",
      components: ["RAG (Vector Search)", "Knowledge Graphs", "Document Parsing", "Ontology Alignment"]
    },
    quantumLayer: {
      title: "Quantum Intelligence",
      components: ["Variational Quantum Algorithms", "Statevector Simulation", "Hybrid QML", "Noise Mitigation"]
    },
    orchestrationLayer: {
      title: "Research Orchestration Layer",
      pipeline: ["Discover", "Analyse", "Create"]
    },
    outputLayer: {
      title: "Research Intelligence Output",
      formats: ["Structured Markdown", "LaTeX Citations", "Algorithmic Comparison Matrix", "Qubit State Vector"]
    }
  },
  coreTechnologies: [
    "Artificial Intelligence and advanced AI models",
    "Retrieval-Augmented Generation (RAG)",
    "Knowledge Graphs and Knowledge Intelligence",
    "Agentic AI and multi-agent workflows",
    "Quantum Computing Foundations",
    "Quantum Algorithms & Ansatze",
    "Quantum Machine Learning (QML)",
    "Quantum Simulation & Statevectors",
    "Hybrid Quantum–Classical Computing",
    "Research & Multi-step Reasoning Workflows"
  ]
};

const BACKEND_RESOURCES_DATA = {
  documentation: {
    title: "Product Documentation",
    endpoints: ["/api/v1/projects", "/api/v1/documents", "/api/v1/reasoning", "/api/v1/quantum/simulate"],
    guides: ["Getting Started", "Configuring Custom Ansatze", "Knowledge Graph Extraction API"]
  },
  research: {
    title: "Research Benchmarks",
    benchmarks: ["BindingDB Molecular Docking", "Surface Code Thresholds on Neutral Atoms", "Hamiltonian Active Space Mappings"]
  },
  publications: {
    title: "Technical Publications",
    whitepapers: [
      "Quinfosys Quantum Labs: Scalable Hybrid Quantum-Classical Computing (2026)",
      "Symmetry-Preserving Ansatze for Molecular Electronic Structure on NISQ Devices"
    ]
  },
  caseStudies: {
    title: "Enterprise Case Studies",
    items: [
      "Accelerating Kinase Inhibitor Discovery via VQE",
      "Topological Quantum Error Correction with 2D Optical Tweezers"
    ]
  }
};

// Global attachment for zero-dependency standalone file:// mode
window.QB_DATA = {
  INITIAL_USER,
  INITIAL_REGISTERED_USERS,
  INITIAL_PROJECTS,
  KNOWLEDGE_GRAPH_DATA,
  MULTI_AGENTS_CONFIG,
  QUANTUM_CIRCUIT_PRESETS,
  BACKEND_TECHNOLOGY_SPEC,
  BACKEND_RESOURCES_DATA
};

export {
  INITIAL_USER,
  INITIAL_REGISTERED_USERS,
  INITIAL_PROJECTS,
  KNOWLEDGE_GRAPH_DATA,
  MULTI_AGENTS_CONFIG,
  QUANTUM_CIRCUIT_PRESETS,
  BACKEND_TECHNOLOGY_SPEC,
  BACKEND_RESOURCES_DATA
};


import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { DocumentIntelligencePipeline } from "../../js/document-pipeline.js";
import { INITIAL_PROJECTS, KNOWLEDGE_GRAPH_DATA, QUANTUM_CIRCUIT_PRESETS } from "../../js/data.js";
import { QuantumEngine } from "../../js/quantum-engine.js";
import { Button } from "../components/Button.jsx";
import { Card } from "../components/Card.jsx";
import { Loader } from "../components/Loader.jsx";
import { Modal } from "../components/Modal.jsx";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { apiRequest } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";

const pipeline = new DocumentIntelligencePipeline();
const WORKFLOW_DEFAULT = "Assess feasibility of running fault-tolerant VQE on superconducting quantum hardware with active error correction and evaluate barren plateau mitigations.";

const tabs = [
  ["overview", "1. Overview & Roadmap"],
  ["sources", "2. Documents & Sources"],
  ["rag", "3. AI Reasoning & RAG"],
  ["kg", "4. Knowledge Graph"],
  ["agents", "5. Research Workflow & Agents"],
  ["quantum", "6. Quantum Lab"],
  ["output", "7. Research Output"],
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadProjects() {
  const saved = localStorage.getItem("qb_projects");
  if (!saved) return clone(INITIAL_PROJECTS);
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    console.warn("Could not read saved research projects; using the supplied starter projects.", error);
  }
  return clone(INITIAL_PROJECTS);
}

function getUser() {
  try {
    const parsed = JSON.parse(localStorage.getItem("qb_user") || "null");
    return parsed || { name: "Researcher", organization: "Quinfosys Research", stats: {} };
  } catch (error) {
    console.warn("Could not read the saved account profile.", error);
    return { name: "Researcher", organization: "Quinfosys Research", stats: {} };
  }
}

function persistProjects(projects) {
  localStorage.setItem("qb_projects", JSON.stringify(projects));
}

function persistUser(user) {
  localStorage.setItem("qb_user", JSON.stringify(user));
}

function StatCard({ title, value, note, color = "text-cyan-400" }) {
  return (
    <Card className="p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">{title}</div>
      <div className="mt-1 text-3xl font-bold text-white">{value}</div>
      <div className={`mt-1 flex items-center gap-1 font-mono text-[11px] ${color}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />{note}
      </div>
    </Card>
  );
}

function EmptyState({ title, detail, action }) {
  return (
    <Card className="col-span-full space-y-4 py-12 text-center">
      <div className="text-3xl" aria-hidden="true">🔬</div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="mx-auto max-w-sm text-xs text-zinc-400">{detail}</p>
      {action}
    </Card>
  );
}

function ProjectCard({ project, onOpen, onDelete }) {
  const phases = {
    Create: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Analyse: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Discover: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <Card className="group flex flex-col justify-between p-6 transition-all hover:border-white/20">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="badge-pill !py-0.5 !px-2.5 !text-[10px]">{project.domain}</span>
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${phases[project.stage] || phases.Discover}`}>
            {project.stage} Phase
          </span>
        </div>
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-cyan-300">
          {project.name}
        </h3>
        <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-zinc-400">
          {project.hypothesis || project.summary}
        </p>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-zinc-500">
          <span>{project.documents?.length || 0} Sources</span>
          <span>{project.reasoningSessions?.length || 0} Sessions</span>
          <span>{project.updatedAt || "Active"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => onOpen(project.id)} className="glow-btn-secondary flex flex-grow items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold">
            Open Research Workspace <span aria-hidden="true">→</span>
          </Button>
          <Button onClick={() => onDelete(project.id)} className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2.5 text-zinc-400 transition-colors hover:bg-rose-500/20 hover:text-rose-400" title="Delete or archive project" aria-label={`Delete ${project.name}`}>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></svg>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function DashboardHome({ projects, user, onCreate, onOpen, onDelete, backendError }) {
  const documentCount = projects.reduce((total, project) => total + (project.documents?.length || 0), 0);
  return (
    <section className="mx-auto w-full max-w-7xl flex-grow space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">Research Projects Dashboard</h1>
          <p className="mt-1 text-xs text-zinc-400">Manage investigation hypotheses, document collections, reasoning traces, and quantum workflows.</p>
        </div>
        <Button onClick={onCreate} className="glow-btn-primary flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold">
          <span aria-hidden="true">＋</span> New Research Project
        </Button>
      </div>
      {backendError && <ErrorBanner message={`Backend connection unavailable: ${backendError}`} />}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Active Projects" value={projects.length} note="Live Workspace" color="text-emerald-400" />
        <StatCard title="Indexed Sources" value={documentCount} note="PDFs, Preprints & Datasets" />
        <StatCard title="Reasoning Traces" value={user.stats?.reasoningRuns || 48} note="Multi-Step Deductions" color="text-cyan-400" />
        <StatCard title="Quantum Simulations" value={user.stats?.quantumSimulations || 126} note="NISQ & Statevectors" color="text-purple-400" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-400">Current Investigations</h2>
          <span className="font-mono text-xs text-zinc-500">Isolated Project Workspaces</span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.length ? projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={onOpen} onDelete={onDelete} />
          )) : (
            <EmptyState
              title="No active research projects"
              detail="Create a new project workspace to begin exploring literature, multi-agent reasoning, and quantum simulations."
              action={<Button onClick={onCreate} className="glow-btn-primary rounded-xl px-4 py-2 text-xs font-semibold">Create First Project</Button>}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function ErrorBanner({ message }) {
  return <div role="alert" className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">{message}</div>;
}

function Workspace({ project, projects, onBack, onProjectsChange, onUserChange, notify }) {
  const [tab, setTab] = useState("overview");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [queryResult, setQueryResult] = useState(project.reasoningSessions?.[0] || null);
  const [lastWorkflow, setLastWorkflow] = useState(null);
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [circuitKey, setCircuitKey] = useState("bell");
  const [knowledgeGraph, setKnowledgeGraph] = useState(KNOWLEDGE_GRAPH_DATA);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (tab !== "kg") return undefined;
    const controller = new AbortController();
    apiRequest("/api/knowledge-graph", { signal: controller.signal })
      .then(setKnowledgeGraph)
      .catch((error) => {
        if (error.name !== "AbortError") setApiError(error.message);
      });
    return () => controller.abort();
  }, [tab]);

  useEffect(() => {
    setTab("overview");
    setSelectedDocument(null);
    setQueryResult(project.reasoningSessions?.[0] || null);
    setLastWorkflow(null);
  }, [project.id]);

  const updateActiveProject = useCallback((update) => {
    onProjectsChange(projects.map((item) => item.id === project.id ? update(item) : item));
  }, [onProjectsChange, project.id, projects]);

  async function runQuestion(question, mode, lens, selectedDocumentIds = []) {
    setApiError("");
    try {
      const result = await apiRequest("/api/qa/ask", {
        method: "POST",
        body: JSON.stringify({
          question,
          mode,
          analysisLens: lens,
          documentIds: selectedDocumentIds.length
            ? selectedDocumentIds
            : (project.documents || []).map((document) => document.id),
        }),
      });
      setQueryResult(result);
      updateActiveProject((item) => ({
        ...item,
        reasoningSessions: [result, ...(item.reasoningSessions || [])],
      }));
      const user = getUser();
      user.stats = { ...user.stats, reasoningRuns: (user.stats?.reasoningRuns || 48) + 1 };
      persistUser(user);
      onUserChange(user);
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function runWorkflow(objective) {
    setWorkflowRunning(true);
    setApiError("");
    try {
      const result = await apiRequest("/api/workflow/execute", {
        method: "POST",
        body: JSON.stringify({
          objective,
          documentIds: (project.documents || []).map((document) => document.id),
        }),
      });
      setLastWorkflow(result);
      const user = getUser();
      user.stats = { ...user.stats, reasoningRuns: (user.stats?.reasoningRuns || 48) + 1 };
      persistUser(user);
      onUserChange(user);
      notify("Autonomous research workflow executed successfully.");
      return result;
    } catch (error) {
      setApiError(error.message);
      return null;
    } finally {
      setWorkflowRunning(false);
    }
  }

  async function refreshGraph() {
    setApiError("");
    try {
      setKnowledgeGraph(await apiRequest("/api/knowledge-graph"));
    } catch (error) {
      setApiError(error.message);
    }
  }

  return (
    <section className="flex-grow">
      <div className="border-b border-white/10 bg-[#080808] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} className="rounded-lg bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white" aria-label="Back to dashboard">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
            </Button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-pill !py-0 !text-[9.5px]">{project.domain}</span>
                <span className="font-mono text-[11px] text-cyan-400">{project.stage} Stage</span>
              </div>
              <h1 className="mt-0.5 line-clamp-1 font-heading text-lg font-bold tracking-tight text-white sm:text-xl">{project.name}</h1>
            </div>
          </div>
          <span className="hidden font-mono text-xs text-zinc-500 md:inline">Grounding: Backend API Connected</span>
        </div>
      </div>
      <div className="overflow-x-auto border-b border-white/10 bg-[#0a0a0c] px-4 sm:px-8">
        <nav className="mx-auto flex max-w-7xl items-center gap-2 py-2.5" aria-label="Research workspace modules">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`whitespace-nowrap rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all ${
                tab === id
                  ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm"
                  : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-8">
        {apiError && <div className="mb-5"><ErrorBanner message={apiError} /></div>}
        {tab === "overview" && <OverviewTab project={project} onTabChange={setTab} />}
        {tab === "sources" && (
          <SourcesTab
            project={project}
            updateProject={updateActiveProject}
            onDocumentSelect={setSelectedDocument}
            notify={notify}
          />
        )}
        {tab === "rag" && <RagTab project={project} result={queryResult} onAsk={runQuestion} onTabChange={setTab} />}
        {tab === "kg" && <KnowledgeTab graph={knowledgeGraph} onRefresh={refreshGraph} onAsk={(question) => { setTab("rag"); void runQuestion(question, "Deep Deductive Research", "auto"); }} />}
        {tab === "agents" && <AgentsTab running={workflowRunning} onRun={runWorkflow} />}
        {tab === "quantum" && <QuantumTab presetKey={circuitKey} onPresetChange={(key) => {
          setCircuitKey(key);
          const user = getUser();
          user.stats = { ...user.stats, quantumSimulations: (user.stats?.quantumSimulations || 126) + 1 };
          persistUser(user);
          onUserChange(user);
        }} />}
        {tab === "output" && <OutputTab workflow={lastWorkflow} project={project} user={getUser()} />}
      </main>
      {selectedDocument && (
        <DocumentModal document={selectedDocument} onClose={() => setSelectedDocument(null)} />
      )}
    </section>
  );
}

function OverviewTab({ project, onTabChange }) {
  const phases = [
    ["Discover", "text-cyan-400", "Explore literature, index research papers, ingest datasets, and map raw entities."],
    ["Analyse", "text-indigo-400", "Reason over complex constraints, compare algorithmic approaches, and traverse graphs."],
    ["Create", "text-emerald-400", "Develop synthesized solutions, run quantum simulations, and publish structured reports."],
  ];
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-3 font-mono text-xs uppercase tracking-wider text-zinc-400">Research Workflow Stage</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {phases.map(([phase, color, description]) => (
            <div key={phase} className={`rounded-xl border p-4 ${project.stage === phase ? "border-cyan-500/40 bg-cyan-950/20" : "border-white/5 bg-black/30"}`}>
              <div className="mb-1 flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase ${color}`}>{phase}</span>
                <span className="font-mono text-[10px] text-zinc-500">{phase === "Discover" ? `${project.documents?.length || 0} Sources` : phase === project.stage ? "In Progress" : "Next"}</span>
              </div>
              <p className="text-xs text-zinc-400">{description}</p>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="space-y-4 p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">Research Hypothesis &amp; Problem Statement</h2>
          <div className="rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-sm leading-relaxed text-zinc-300">{project.hypothesis || project.summary}</div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Key Research Tags</div>
            <div className="flex flex-wrap gap-2">{(project.tags || []).map((tag) => <span key={tag} className="badge-pill !py-0.5 !text-[10px]">{tag}</span>)}</div>
          </div>
        </Card>
        <Card className="space-y-3 p-6">
          <h2 className="text-base font-bold text-white">Quick Workspace Actions</h2>
          {[
            ["Ask AI Reasoning Query", "rag"],
            ["Upload Research Paper", "sources"],
            ["Simulate Quantum Circuit", "quantum"],
          ].map(([label, destination]) => (
            <Button key={destination} onClick={() => onTabChange(destination)} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-left text-xs font-medium text-white transition-colors hover:bg-white/10">
              {label}<span className="text-zinc-500">→</span>
            </Button>
          ))}
        </Card>
      </div>
    </div>
  );
}

function SourcesTab({ project, updateProject, onDocumentSelect, notify }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const docs = project.documents || [];
  const totalChunks = docs.reduce((total, document) => total + (document.chunksCount || document.chunks?.length || 0), 0);

  async function ingestDocument(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    let content = String(form.get("content") || "").trim();
    let fileName = file instanceof File && file.name ? file.name : "research-document.md";
    let fileSize = file instanceof File && file.size ? `${Math.round(file.size / 1024)} KB` : `${Math.max(1, Math.round(content.length / 1024))} KB`;

    setError("");
    setUploading(true);
    try {
      if (file instanceof File && file.size) {
        fileName = file.name;
        fileSize = `${Math.round(file.size / 1024)} KB`;
        content = await pipeline.extractTextFromFile(file);
      }
      if (!content) throw new Error("Choose a file or provide document text before indexing.");

      const processed = await apiRequest("/api/documents/upload", {
        method: "POST",
        body: JSON.stringify({
          title: String(form.get("title") || ""),
          authors: String(form.get("authors") || ""),
          type: String(form.get("type") || "Peer-reviewed Paper"),
          year: String(form.get("year") || new Date().getFullYear()),
          fileName,
          fileSize,
          content,
        }),
      });
      updateProject((item) => ({
        ...item,
        documents: [processed, ...(item.documents || [])],
        documentsCount: (item.documents?.length || 0) + 1,
        updatedAt: "Just now",
      }));
      setUploadOpen(false);
      notify(`Document "${processed.title}" successfully ingested and indexed.`);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  }

  async function deleteDocument(document) {
    if (!window.confirm(`Remove "${document.title}" from the backend document library?`)) return;
    setError("");
    try {
      if (document.id) await apiRequest(`/api/documents/${encodeURIComponent(document.id)}`, { method: "DELETE" });
      updateProject((item) => ({
        ...item,
        documents: (item.documents || []).filter((entry) => entry.id !== document.id),
      }));
      notify("Document removed from the research project.");
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-card-glass p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-bold text-white">Document Intelligence &amp; Sources</h2>
          <p className="mt-1 text-xs text-zinc-400">Documents are indexed by the existing backend and linked to the knowledge graph.</p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="glow-btn-primary rounded-xl px-4 py-2.5 text-xs font-semibold">＋ Upload Research Paper</Button>
      </div>
      {error && <ErrorBanner message={error} />}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Indexed Sources" value={docs.length} note="Backend indexed" />
        <StatCard title="Semantic Chunks" value={totalChunks} note="Vector grounded" color="text-purple-400" />
        <StatCard title="Research Domain" value={project.domain} note={project.stage + " stage"} color="text-emerald-400" />
        <StatCard title="Project" value={project.name.slice(0, 20) + (project.name.length > 20 ? "…" : "")} note={project.status || "Active"} color="text-cyan-400" />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {docs.length ? docs.map((document) => (
          <Card key={document.id || document.title} className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
            <button type="button" onClick={() => onDocumentSelect(document)} className="min-w-0 text-left">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="badge-pill !py-0.5 !text-[9px]">{document.type || "Research Paper"}</span>
                <span className="font-mono text-[10px] text-emerald-400">{document.status || "Indexed"}</span>
              </div>
              <h3 className="font-semibold text-white hover:text-cyan-300">{document.title}</h3>
              <p className="mt-1 text-xs text-zinc-400">{document.authors || "Research source"} · {document.year || "—"} · {document.chunksCount || document.chunks?.length || 0} chunks</p>
              <p className="mt-2 line-clamp-2 text-xs text-zinc-500">{document.abstract || document.summary || "Select to inspect indexed content."}</p>
            </button>
            <div className="flex shrink-0 gap-2">
              {document.id && (
                <a href={`/api/documents/${encodeURIComponent(document.id)}/download`} className="glow-btn-secondary rounded-lg px-3 py-2 text-xs" download={document.fileName || true}>Download</a>
              )}
              <Button onClick={() => void deleteDocument(document)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:border-rose-500/30 hover:text-rose-300">Remove</Button>
            </div>
          </Card>
        )) : (
          <EmptyState title="No documents in this project yet" detail="Upload or index a research paper to begin building this project's knowledge base." action={<Button onClick={() => setUploadOpen(true)} className="glow-btn-primary rounded-xl px-4 py-2 text-xs">Upload Research Paper</Button>} />
        )}
      </div>
      {uploadOpen && (
        <Modal label="Upload research paper" onClose={() => setUploadOpen(false)}>
          <div className="mb-5 flex items-center justify-between">
            <div><h2 className="text-lg font-bold">Index Research Document</h2><p className="mt-1 text-xs text-zinc-400">Upload text or paste source content for backend ingestion.</p></div>
            <Button onClick={() => setUploadOpen(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-white/10" aria-label="Close">✕</Button>
          </div>
          <form onSubmit={ingestDocument} className="space-y-3">
            <label className="block text-xs text-zinc-400">Title<input name="title" className="form-input mt-1" placeholder="Document title (optional)" /></label>
            <label className="block text-xs text-zinc-400">Authors<input name="authors" className="form-input mt-1" placeholder="Authors (optional)" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-zinc-400">Type<select name="type" className="form-input mt-1"><option>Peer-reviewed Paper</option><option>Preprint</option><option>Dataset</option><option>Technical Whitepaper</option></select></label>
              <label className="block text-xs text-zinc-400">Year<input name="year" type="number" defaultValue={new Date().getFullYear()} className="form-input mt-1" /></label>
            </div>
            <label className="block text-xs text-zinc-400">File<input name="file" type="file" accept=".pdf,.txt,.md,.markdown,.json,.csv" className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-zinc-300" /></label>
            <label className="block text-xs text-zinc-400">Or paste document text<textarea name="content" rows="6" className="form-input mt-1" placeholder="Paste abstract, research text, or complete document content." /></label>
            {error && <ErrorBanner message={error} />}
            <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
              <Button onClick={() => setUploadOpen(false)} className="glow-btn-secondary rounded-xl px-4 py-2 text-xs">Cancel</Button>
              <Button type="submit" disabled={uploading} className="glow-btn-primary rounded-xl px-4 py-2 text-xs font-semibold">{uploading ? "Indexing…" : "Run Pipeline & Index"}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function DocumentModal({ document, onClose }) {
  return (
    <Modal label={document.title} onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="badge-pill !text-[9px]">{document.type || "Research Paper"}</span>
          <h2 className="mt-3 text-lg font-bold text-white">{document.title}</h2>
          <p className="mt-1 text-xs text-zinc-400">{document.authors || "Authors not provided"} · {document.year || "—"}</p>
        </div>
        <Button onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-white/10" aria-label="Close">✕</Button>
      </div>
      <div className="mt-5 max-h-[60vh] space-y-4 overflow-y-auto">
        <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">{document.abstract || document.originalContent || "No abstract or raw content is available."}</p>
        {(document.chunks || []).map((chunk) => (
          <div key={chunk.id} className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="mb-2 flex justify-between gap-2 text-xs text-cyan-300"><span>{chunk.section}</span><span>{chunk.score ? `${Math.round(chunk.score * 100)}% relevance` : ""}</span></div>
            <p className="text-xs leading-relaxed text-zinc-300">{chunk.text}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function RagTab({ project, result, onAsk, onTabChange }) {
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState("Deep Deductive Research");
  const [lens, setLens] = useState("compare");
  const [documentIds, setDocumentIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const docs = project.documents || [];

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const selectedIds = documentIds.length ? documentIds : docs.map((document) => document.id);
      await onAsk(question.trim() || "Compare the main approaches and findings across the indexed research papers.", mode, lens, selectedIds);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6">
        <div className="flex flex-col justify-between gap-4 border-b border-white/5 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-white">AI Deep Research Engine</h2>
            <p className="mt-1 text-xs text-zinc-400">Ask across the indexed project corpus and inspect sourced results.</p>
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400">Reasoning mode
            <select value={mode} onChange={(event) => setMode(event.target.value)} className="rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-zinc-200">
              <option>Deep Deductive Research</option>
              <option>Multi-Document Comparative Synthesis</option>
              <option>Quantum Algorithm &amp; Circuit Optimization</option>
              <option>Error Mitigation &amp; Noise Bounds</option>
            </select>
          </label>
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5 text-xs text-zinc-300">
          Discover → Analyse → Create · cross-examine indexed papers and return backend-grounded reasoning.
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-400">Research scope:</span>
          {docs.map((document) => (
            <label key={document.id || document.title} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-zinc-300">
              <input
                type="checkbox"
                checked={!documentIds.length || documentIds.includes(document.id)}
                onChange={(event) => {
                  const id = document.id;
                  setDocumentIds((current) => {
                    const selected = current.length ? current : docs.map((item) => item.id);
                    return event.target.checked ? [...new Set([...selected, id])] : selected.filter((item) => item !== id);
                  });
                }}
              />
              {document.title.slice(0, 35)}{document.title.length > 35 ? "…" : ""}
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-zinc-400">Analysis lens
          <select value={lens} onChange={(event) => setLens(event.target.value)} className="rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-zinc-200">
            <option value="compare">Comparing Approaches</option>
            <option value="differences">Identifying Differences</option>
            <option value="common_findings">Common Findings &amp; Consensus</option>
            <option value="research_gaps">Research Gaps</option>
            <option value="auto">All-in-One Synthesis</option>
          </select>
        </label>
        <form onSubmit={submit} className="space-y-3">
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} rows="4" className="w-full rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none" placeholder="Ask a research question grounded in the indexed sources…" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => onTabChange("agents")} className="text-xs text-purple-300 hover:text-purple-200">Open autonomous workflow →</button>
            <Button type="submit" disabled={loading} className="glow-btn-primary rounded-xl px-5 py-2.5 text-xs font-semibold">{loading ? "Researching…" : "Run Deep Research"}</Button>
          </div>
        </form>
      </Card>
      {loading && <Card className="p-8 text-center"><Loader label="Searching sources and preparing analysis…" fullScreen={false} /></Card>}
      {result && !loading && <ReasoningResult result={result} />}
    </div>
  );
}

function ReasoningResult({ result }) {
  return (
    <Card className="space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white">Research Result</h3>
        <div className="flex gap-2">
          {result.mode && <span className="badge-pill !text-[9px]">{result.mode}</span>}
          {result.overallGroundednessScore && <span className="badge-pill !text-[9px]">Groundedness {result.overallGroundednessScore}%</span>}
        </div>
      </div>
      {result.question && <p className="text-xs text-cyan-300">{result.question}</p>}
      <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-200">{result.answer || result.output || JSON.stringify(result, null, 2)}</div>
      {result.citations?.length > 0 && (
        <div className="border-t border-white/10 pt-3">
          <h4 className="mb-2 text-xs font-semibold text-zinc-300">Sources</h4>
          <ul className="list-inside list-disc space-y-1 text-xs text-zinc-400">{result.citations.map((citation) => <li key={citation}>{citation}</li>)}</ul>
        </div>
      )}
    </Card>
  );
}

function KnowledgeTab({ graph, onRefresh, onAsk }) {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];
  const categories = ["All", ...new Set(nodes.map((node) => node.category).filter(Boolean))];
  const visible = nodes.filter((node) => category === "All" || node.category === category);
  const coordinates = useMemo(() => new Map(visible.map((node, index) => {
    const angle = (index / Math.max(visible.length, 1)) * Math.PI * 2;
    const radius = Math.min(205, 45 + Math.sqrt(visible.length) * 19);
    return [node.id, { x: 310 + Math.cos(angle) * radius, y: 265 + Math.sin(angle) * radius }];
  })), [visible]);
  const visibleIds = new Set(visible.map((node) => node.id));

  return (
    <div className="space-y-6">
      <Card className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-bold text-white">Project Knowledge Graph &amp; Structured Knowledge Layer</h2><span className="badge-pill !text-[9px]">Backend synchronized</span></div>
          <p className="mt-1 text-xs text-zinc-400">Explore machine-mined entities, relational triples, and source links.</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span><strong className="text-cyan-400">{nodes.length}</strong> Entities</span>
          <span><strong className="text-purple-400">{edges.length}</strong> Relations</span>
          <Button onClick={() => void onRefresh()} className="glow-btn-secondary rounded-xl px-3 py-2 text-xs">Sync with Backend</Button>
        </div>
      </Card>
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => <Button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-3 py-1 text-[11px] ${category === item ? "border-white bg-white text-black" : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"}`}>{item}</Button>)}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className="h-[540px] overflow-hidden bg-black/60 lg:col-span-3">
          {visible.length ? (
            <svg className="h-full w-full" viewBox="0 0 620 530" role="img" aria-label="Interactive research knowledge graph">
              {edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target)).map((edge, index) => {
                const from = coordinates.get(edge.source);
                const to = coordinates.get(edge.target);
                return from && to ? <line key={edge.id || index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(255,255,255,.2)" strokeWidth="1.5" /> : null;
              })}
              {visible.map((node) => {
                const point = coordinates.get(node.id);
                return (
                  <g key={node.id} transform={`translate(${point.x} ${point.y})`} role="button" tabIndex="0" aria-label={`Inspect ${node.label}`} onClick={() => setSelected(node)} onKeyDown={(event) => { if (event.key === "Enter") setSelected(node); }} className="cursor-pointer">
                    <circle r={Math.max(13, Math.min(25, node.size || 18))} fill="#0e0e0e" stroke={node.color || "#38bdf8"} strokeWidth={selected?.id === node.id ? 3 : 2} />
                    <circle r={Math.max(9, Math.min(20, (node.size || 18) - 4))} fill={node.color || "#38bdf8"} opacity=".22" />
                    <text y="4" fill="#f8f8f8" fontSize="9" textAnchor="middle">{(node.label || node.name || node.id).slice(0, 14)}</text>
                    <text y="37" fill="#94a3b8" fontSize="8" textAnchor="middle">{node.category}</text>
                  </g>
                );
              })}
            </svg>
          ) : <div className="flex h-full items-center justify-center"><Loader label="Loading knowledge graph…" fullScreen={false} /></div>}
        </Card>
        <Card className="max-h-[540px] space-y-4 overflow-y-auto p-5">
          <h3 className="border-b border-white/5 pb-2 font-mono text-xs uppercase tracking-wider text-zinc-400">Entity Inspector</h3>
          {selected ? (
            <>
              <span className="badge-pill !text-[9px]">{selected.category}</span>
              <h4 className="text-sm font-bold text-white">{selected.label || selected.name}</h4>
              <p className="text-xs leading-relaxed text-zinc-400">{selected.details || selected.description || "No additional entity details are available."}</p>
              <div className="text-xs text-zinc-500">Connected research sources: {selected.papers?.length || 0}</div>
            </>
          ) : <p className="text-xs leading-relaxed text-zinc-500">Select an entity in the graph to inspect its taxonomy and source context.</p>}
          <div className="space-y-2 border-t border-white/5 pt-3">
            <p className="text-[10px] font-mono uppercase text-zinc-500">Quick inquiries</p>
            {[
              "What does this paper say about kinase docking and accuracy?",
              "How are these methods related: VQE, UCCSD, and Barren Plateaus?",
              "Which papers use this algorithm and what results did they report?",
            ].map((question) => <button key={question} type="button" onClick={() => onAsk(question)} className="block w-full rounded-lg bg-white/5 p-2 text-left text-[10px] text-zinc-300 hover:bg-cyan-500/10">{question}</button>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AgentsTab({ running, onRun }) {
  const [objective, setObjective] = useState(WORKFLOW_DEFAULT);
  const [workflow, setWorkflow] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    let mounted = true;
    apiRequest("/api/workflow/history")
      .then((result) => { if (mounted) setHistory(Array.isArray(result) ? result.slice(0, 5) : []); })
      .catch((error) => { if (mounted) setHistoryError(error.message); });
    return () => { mounted = false; };
  }, [workflow]);

  const stages = workflow?.tasks || [
    { phase: "Formulation", title: "Scope, hypotheses & theoretical parameter boundaries", status: "Pending" },
    { phase: "Discover", title: "Multi-source corpus & knowledge graph discovery", status: "Pending" },
    { phase: "Analyse", title: "Algorithmic & mathematical rigor analysis", status: "Pending" },
    { phase: "Compare", title: "Cross-document comparative synthesis", status: "Pending" },
    { phase: "Gaps", title: "Critical bottleneck & research gap identification", status: "Pending" },
    { phase: "Create", title: "Structured research dossier compilation", status: "Pending" },
  ];

  async function execute() {
    setWorkflow({ objective, tasks: stages.map((task) => ({ ...task, status: "Running" })) });
    const result = await onRun(objective);
    if (result) {
      setWorkflow(result);
    } else {
      setWorkflow({ objective, tasks: stages.map((task) => ({ ...task, status: "Complete" })) });
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-6">
        <div className="flex flex-col justify-between gap-3 border-b border-white/5 pb-4 sm:flex-row sm:items-center">
          <div><h2 className="text-base font-bold text-white">Autonomous Structured Research Workflow</h2><p className="mt-1 text-xs text-zinc-400">Decompose an objective, search sources, analyse findings, identify gaps, and compile a dossier.</p></div>
          <span className="badge-pill !text-[9px]">Discover → Analyse → Compare → Create</span>
        </div>
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300">Research Objective
          <textarea value={objective} onChange={(event) => setObjective(event.target.value)} rows="3" className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 p-3 font-sans text-sm normal-case tracking-normal text-white focus:border-cyan-500/60 focus:outline-none" />
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            WORKFLOW_DEFAULT,
            "Compare topological surface codes vs near-term error mitigation for variational quantum algorithms.",
            "Analyze scaling bottlenecks in syndrome decoding latencies for superconducting qubit architectures.",
          ].map((preset, index) => <Button key={preset} onClick={() => setObjective(preset)} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] text-zinc-300 hover:bg-white/10">{["Fault-Tolerant VQE", "Surface Codes vs ZNE", "Syndrome Decoding"][index]}</Button>)}
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center">
          <span className={`font-mono text-[11px] ${running ? "text-amber-300" : "text-emerald-300"}`}>{running ? "Executing multi-agent task pipeline in backend…" : "Ready to decompose and execute research pipeline."}</span>
          <Button onClick={() => void execute()} disabled={running || !objective.trim()} className="glow-btn-primary rounded-xl px-5 py-2.5 text-xs font-semibold">{running ? "Orchestrating Workflow…" : "Launch Research Workflow"}</Button>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {stages.map((task, index) => <Card key={task.id || task.phase} className="flex items-start gap-3 p-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 font-mono text-xs text-cyan-300">{index + 1}</span>
          <div><div className="flex items-center gap-2"><span className="font-mono text-[10px] uppercase text-cyan-300">{task.phase}</span><span className="text-[10px] text-zinc-500">{task.status}</span></div><h3 className="mt-1 text-xs font-semibold text-white">{task.title}</h3><p className="mt-1 text-[10px] text-zinc-400">{task.description}</p></div>
        </Card>)}
      </div>
      {historyError && <ErrorBanner message={`Workflow history unavailable: ${historyError}`} />}
      {history.length > 0 && <Card className="p-5"><h3 className="mb-3 text-sm font-bold text-white">Recent Workflow Runs</h3><div className="space-y-2">{history.map((entry) => <div key={entry.id} className="flex flex-wrap justify-between gap-2 border-t border-white/5 pt-2 text-xs"><span className="text-zinc-200">{entry.objective || entry.id}</span><span className="font-mono text-zinc-500">{entry.id} · {entry.status || "Complete"}</span></div>)}</div></Card>}
      {workflow?.id && <p className="text-xs text-emerald-300">Latest execution: {workflow.id}</p>}
    </div>
  );
}

function QuantumTab({ presetKey, onPresetChange }) {
  const circuit = QUANTUM_CIRCUIT_PRESETS[presetKey];
  const results = useMemo(() => new QuantumEngine().simulateCircuit(circuit), [circuit]);
  const spacing = 70;
  const startX = 60;
  const startY = 35;
  const steps = Math.max(3, ...circuit.gates.map((gate) => gate.step + 1));
  const width = Math.max(480, startX + steps * spacing + 60);
  const height = startY + circuit.qubits * 45 + 10;

  return (
    <div className="space-y-6">
      <Card className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div><h2 className="text-base font-bold text-white">Quantum Simulation Laboratory</h2><p className="mt-1 text-xs text-zinc-400">Explore circuits, evaluate state vectors, and bridge classical AI with quantum workflows.</p></div>
        <label className="flex items-center gap-2 text-xs text-zinc-400">Preset
          <select value={presetKey} onChange={(event) => onPresetChange(event.target.value)} className="rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-zinc-200">
            <option value="bell">Bell State |Φ⁺⟩</option><option value="vqe">2-Qubit VQE Ansatz</option><option value="teleport">Quantum Teleportation</option>
          </select>
        </label>
      </Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="space-y-4 p-6 lg:col-span-2">
          <div className="flex justify-between border-b border-white/5 pb-2 font-mono text-xs"><span className="uppercase text-zinc-400">{circuit.name}</span><span className="text-cyan-400">{circuit.qubits} Qubits · Depth {steps}</span></div>
          <div className="min-h-[220px] overflow-x-auto rounded-xl border border-white/5 bg-black/70 p-5">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="select-none font-mono" role="img" aria-label={`${circuit.name} circuit diagram`}>
              {Array.from({ length: circuit.qubits }, (_, qubit) => {
                const y = startY + qubit * 45;
                return <g key={qubit}><text x="16" y={y + 4} fill="#94a3b8" fontSize="11">q[{qubit}]</text><line x1={startX - 15} y1={y} x2={width - 30} y2={y} stroke="rgba(255,255,255,.2)" strokeWidth="1.5" /></g>;
              })}
              {circuit.gates.map((gate, index) => {
                const x = startX + gate.step * spacing + spacing / 2;
                const y = startY + gate.qubit * 45;
                if (gate.type === "CNOT_CTRL") return <g key={index}><line x1={x} y1={y} x2={x} y2={startY + gate.target * 45} stroke="#38bdf8" strokeWidth="2" /><circle cx={x} cy={y} r="5" fill="#38bdf8" /></g>;
                if (gate.type === "CNOT_TARG") return <g key={index}><circle cx={x} cy={y} r="11" fill="#080808" stroke="#38bdf8" strokeWidth="2" /><path d={`M${x - 7} ${y}h14m-7-7v14`} stroke="#38bdf8" strokeWidth="2" /></g>;
                return <g key={index}><rect x={x - 16} y={y - 14} width="32" height="28" rx="5" fill="#141414" stroke="#fff" opacity=".95" /><text x={x} y={y + 4} fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">{gate.label}</text></g>;
              })}
            </svg>
          </div>
          <p className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs leading-relaxed text-zinc-300"><span className="font-mono font-semibold text-cyan-400">Circuit Analysis: </span>{circuit.description}</p>
        </Card>
        <Card className="space-y-4 p-6">
          <h3 className="border-b border-white/5 pb-2 font-mono text-xs uppercase tracking-wider text-zinc-400">Measurement State Distribution</h3>
          <div className="space-y-3">{results.probabilities.map((probability) => <div key={probability.basisState} className="space-y-1"><div className="flex justify-between font-mono text-xs"><span className="font-bold text-white">{probability.basisState}</span><span className="text-cyan-400">{(probability.probability * 100).toFixed(1)}%</span></div><div className="h-2 overflow-hidden rounded-full border border-white/5 bg-black/60"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all" style={{ width: `${probability.probability * 100}%` }} /></div></div>)}</div>
          <div className="space-y-2 border-t border-white/5 pt-4 font-mono text-xs">
            <div className="flex justify-between"><span className="text-zinc-400">Entanglement:</span><strong className={results.isEntangled ? "text-emerald-400" : "text-zinc-400"}>{results.isEntangled ? "Entangled" : "Separable"}</strong></div>
            <div className="flex justify-between"><span className="text-zinc-400">Entropy S(ρ):</span><span className="text-white">{results.vonNeumannEntropy} bits</span></div>
            {results.zExpectations.map(({ qubit, value }) => <div className="flex justify-between" key={qubit}><span className="text-zinc-400">Qubit {qubit} ⟨Z⟩:</span><span className="text-cyan-300">{value.toFixed(3)}</span></div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

function OutputTab({ workflow, project, user }) {
  const [loadedWorkflow, setLoadedWorkflow] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (workflow) {
      setLoadedWorkflow(workflow);
      return undefined;
    }
    let mounted = true;
    apiRequest("/api/workflow/history")
      .then((history) => {
        if (mounted && Array.isArray(history) && history.length) {
          setLoadedWorkflow(history[0]);
          setError("");
        }
      })
      .catch((requestError) => { if (mounted) setError(requestError.message); });
    return () => { mounted = false; };
  }, [workflow]);
  const currentWorkflow = workflow || loadedWorkflow;
  const output = currentWorkflow?.structuredResearchOutput;
  const markdown = [
    `# Research Investigation: ${currentWorkflow?.objective || project.name}`,
    "",
    `Author: ${user.name} · ${user.organization}`,
    "",
    "## Executive Summary",
    output?.executiveSummary || currentWorkflow?.answer || "No workflow dossier has been generated for this project yet. Run the autonomous workflow to create a report.",
    ...(currentWorkflow?.tasks || []).flatMap((task) => ["", `## ${task.phase}: ${task.title}`, task.description || task.output || task.status || ""]),
  ].join("\n");
  const download = (content, name, type) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div><h2 className="text-base font-bold text-white">Structured Research Dossier</h2><p className="mt-1 text-xs text-zinc-400">Export the latest workflow findings and research trace.</p></div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigator.clipboard.writeText(markdown).then(() => setError("Report copied to clipboard.")).catch((copyError) => setError(copyError.message))} className="glow-btn-secondary rounded-xl px-3.5 py-2 text-xs">Copy Markdown</Button>
          <Button onClick={() => download(markdown, "research-dossier.md", "text/markdown")} className="glow-btn-primary rounded-xl px-4 py-2 text-xs">Download (.md)</Button>
          <Button onClick={() => download(JSON.stringify(currentWorkflow || { project, user }, null, 2), "research-dossier.json", "application/json")} className="glow-btn-secondary rounded-xl px-3.5 py-2 text-xs">Download (.json)</Button>
        </div>
      </Card>
      {error && <div role="status" className="text-xs text-cyan-300">{error}</div>}
      <Card className="mx-auto max-w-5xl space-y-6 p-6 sm:p-8">
        <div className="border-b border-white/10 pb-5">
          <span className="badge-pill !text-[9px]">Quinfosys™ Quantum Brain Enterprise Research Dossier</span>
          <h3 className="mt-3 font-heading text-2xl font-bold leading-tight text-white">{workflow?.objective || project.name}</h3>
          <div className="mt-3 flex flex-wrap gap-3 font-mono text-xs text-zinc-400"><span>Author: <strong className="text-zinc-200">{user.name}</strong></span><span>Organization: <strong className="text-zinc-200">{user.organization}</strong></span>          <span>Run: <strong className="text-cyan-400">{currentWorkflow?.id || "Not yet generated"}</strong></span></div>
        </div>
        <div className="space-y-3"><h4 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-400">Executive Summary &amp; Scientific Synthesis</h4><div className="whitespace-pre-line rounded-xl border border-white/5 bg-black/40 p-4 text-xs leading-relaxed text-zinc-200">{output?.executiveSummary || currentWorkflow?.answer || "Start a workflow from the Research Workflow & Agents tab to generate the structured research dossier."}</div></div>
        {(currentWorkflow?.tasks || []).length > 0 && <div className="space-y-3"><h4 className="font-mono text-sm font-bold uppercase text-cyan-400">Research Execution Trace</h4><div className="space-y-2">{currentWorkflow.tasks.map((task, index) => <div key={task.id || index} className="rounded-xl border border-white/10 bg-black/30 p-3 text-xs"><div className="flex flex-wrap justify-between gap-2"><strong className="text-white">{task.title}</strong><span className="font-mono text-cyan-300">{task.phase} · {task.status}</span></div><p className="mt-2 text-zinc-400">{task.description || task.output}</p></div>)}</div></div>}
        {error && !currentWorkflow && <p className="text-xs text-amber-300">Workflow history could not be loaded: {error}</p>}
      </Card>
    </div>
  );
}

export function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState(loadProjects);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [user, setUser] = useState(getUser);
  const [createOpen, setCreateOpen] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = "Research Dashboard — Quinfosys™ Quantum Brain";
    return () => { document.title = "Quinfosys™ Quantum AI"; };
  }, []);

  useEffect(() => {
    persistProjects(projects);
  }, [projects]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const controller = new AbortController();
    apiRequest("/api/documents", { signal: controller.signal })
      .then((response) => {
        const documents = Array.isArray(response) ? response : response ? [response] : [];
        if (!documents.length) return;
        setProjects((current) => {
          const next = clone(current);
          const target = next.find((item) => item.id === (activeProjectId || next[0]?.id));
          if (!target) return current;
          target.documents = target.documents || [];
          for (const document of documents) {
            const index = target.documents.findIndex((item) => item.id === document.id || item.title === document.title);
            if (index < 0) target.documents.push(document);
            else target.documents[index] = { ...target.documents[index], ...document };
          }
          target.documentsCount = target.documents.length;
          return next;
        });
        setBackendError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setBackendError(error.message);
      });
    return () => controller.abort();
  }, [isAuthenticated]);

  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3500);
  }, []);

  const activeProject = projects.find((project) => project.id === activeProjectId);
  function updateProjects(next) {
    setProjects(next);
  }

  function openProject(id) {
    setActiveProjectId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeProject(id) {
    const project = projects.find((item) => item.id === id);
    if (!project || !window.confirm(`Are you sure you want to delete or archive research project "${project.name}"?`)) return;
    setProjects((current) => current.filter((item) => item.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
    notify(`Project "${project.name}" deleted.`);
  }

  function createProject(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const hypothesis = String(form.get("hypothesis") || "").trim();
    const domain = String(form.get("domain") || "").trim();
    if (!name || !hypothesis || !domain) return;
    const project = {
      id: `proj-${Date.now()}`,
      name,
      hypothesis,
      summary: hypothesis,
      domain,
      stage: "Discover",
      status: "Active",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: "Just now",
      tags: [],
      documentsCount: 0,
      citationsCount: 0,
      documents: [],
      reasoningSessions: [],
    };
    setProjects((current) => [project, ...current]);
    setCreateOpen(false);
    openProject(project.id);
    notify("Research project created.");
  }

  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  return (
    <DashboardLayout>
      {activeProject ? (
        <Workspace
          project={activeProject}
          projects={projects}
          onBack={() => setActiveProjectId(null)}
          onProjectsChange={updateProjects}
          onUserChange={setUser}
          notify={notify}
        />
      ) : (
        <DashboardHome
          projects={projects}
          user={user}
          onCreate={() => setCreateOpen(true)}
          onOpen={openProject}
          onDelete={removeProject}
          backendError={backendError}
        />
      )}
      {toast && <div role="status" className="fixed bottom-6 right-6 z-50 rounded-xl border border-white/20 bg-[#111] px-4 py-3 text-xs text-white shadow-2xl">{toast}</div>}
      {createOpen && (
        <Modal label="Create research project" onClose={() => setCreateOpen(false)}>
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold text-white">New Research Project</h2><p className="mt-1 text-xs text-zinc-400">Create a project workspace for an investigation.</p></div><Button onClick={() => setCreateOpen(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-white/10" aria-label="Close">✕</Button></div>
          <form onSubmit={createProject} className="space-y-3">
            <label className="block text-xs text-zinc-400">Project name<input autoFocus required name="name" className="form-input mt-1" placeholder="e.g. Quantum machine learning for…" /></label>
            <label className="block text-xs text-zinc-400">Research domain<input required name="domain" className="form-input mt-1" placeholder="e.g. Quantum Computing" /></label>
            <label className="block text-xs text-zinc-400">Hypothesis / problem statement<textarea required name="hypothesis" rows="4" className="form-input mt-1" placeholder="What question will this project investigate?" /></label>
            <div className="flex justify-end gap-2 border-t border-white/10 pt-4"><Button onClick={() => setCreateOpen(false)} className="glow-btn-secondary rounded-xl px-4 py-2 text-xs">Cancel</Button><Button type="submit" className="glow-btn-primary rounded-xl px-4 py-2 text-xs font-semibold">Create Project</Button></div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}

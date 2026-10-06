import { QuantumBrainCanvas } from "../components/QuantumBrainCanvas.jsx";

export function HomeContent({ onClick }) {
  return (
    <div onClick={onClick}>
      <main id="website-view" className="flex-grow">
        
        {/* Hero Landing Section */}
        <section id="overview" className="relative pt-8 pb-14 sm:pt-10 sm:pb-20 overflow-hidden bg-hero-glow border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Side: All text shifted to the left-hand side */}
              <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
                <div className="inline-flex">
                  <span className="badge-pill">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Quantum AI Research & Intelligence Platform
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold text-white tracking-tight font-heading leading-[1.08]">
                    Quantum AI
                  </h1>
                  <p className="text-lg sm:text-2xl font-light text-zinc-300 font-heading tracking-tight">
                    Quantum Intelligence for Research, Reasoning & Discovery
                  </p>
                </div>

                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
                  Quantum AI brings together Artificial Intelligence, Quantum Computing, Knowledge, Reasoning and Research into an integrated intelligence platform for exploring complex problems, conducting research and developing new ideas.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
                  <button id="btn-hero-getstarted" className="w-full sm:w-auto glow-btn-primary text-sm font-semibold px-8 py-3.5 rounded-full flex items-center justify-center gap-2">
                    <span>Get Started</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                  </button>
                  <button id="btn-hero-explore" className="w-full sm:w-auto glow-btn-secondary text-sm font-medium px-8 py-3.5 rounded-full flex items-center justify-center gap-2">
                    <span>Explore Quantum AI</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                  </button>
                </div>
              </div>

              {/* Right Side: Clean 3D Revolving White Quantum Particle Brain */}
              <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
                <div className="quantum-brain-frame w-full max-w-2xl lg:max-w-3xl">
                  <QuantumBrainCanvas />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-[#080808] border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="badge-pill">Features</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-heading">Quantum AI</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
                Engineered from first principles to unify advanced artificial intelligence, deep knowledge graph retrieval, and quantum computing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="text-cyan-400 font-mono text-xs">01 INTELLIGENCE</div>
                <h3 className="text-lg font-bold text-white">AI Intelligence</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Advanced AI capabilities for reasoning, analysis, information synthesis, problem solving and intelligent interaction.
                </p>
              </div>

              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="text-cyan-400 font-mono text-xs">02 RESEARCH</div>
                <h3 className="text-lg font-bold text-white">Deep Research</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Research-oriented workflows for exploring topics, analysing information, connecting sources and developing structured research outputs.
                </p>
              </div>

              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="text-cyan-400 font-mono text-xs">03 REASONING</div>
                <h3 className="text-lg font-bold text-white">Advanced Reasoning</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Support for complex reasoning, multi-step analysis, technical problem solving and structured decision workflows.
                </p>
              </div>

              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="text-cyan-400 font-mono text-xs">04 KNOWLEDGE</div>
                <h3 className="text-lg font-bold text-white">Knowledge Intelligence</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Connect documents, datasets, sources and knowledge graphs to build contextual intelligence around research and enterprise knowledge.
                </p>
              </div>

              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="text-cyan-400 font-mono text-xs">05 AGENTS</div>
                <h3 className="text-lg font-bold text-white">AI Agents</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Agent-based workflows for research, analysis, automation, information discovery and specialised tasks coordinated by an orchestrator.
                </p>
              </div>

              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="text-cyan-400 font-mono text-xs">06 QUANTUM</div>
                <h3 className="text-lg font-bold text-white">Quantum Intelligence</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Explore quantum computing concepts, quantum algorithms, quantum simulation, quantum machine learning and quantum optimisation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="py-20 bg-[#080808] border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-heading">Use Cases</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
                From theoretical quantum algorithm formulation to enterprise technical problem-solving.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Scientific Research</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Scientific literature, analysis, hypothesis exploration and discovery across multidisciplinary repositories.
                </p>
              </div>

              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Technical Research</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Engineering, technology and complex technical analysis for advanced materials and high-precision systems.
                </p>
              </div>

              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Quantum Computing</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Quantum algorithms, simulation, experimentation, noise mitigation, and variational circuit formulation.
                </p>
              </div>

              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">AI-Assisted Development</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Programming, computational problem solving, Hamiltonian mapping, and algorithmic pipeline development.
                </p>
              </div>

              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Knowledge Discovery</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Discover non-obvious relationships, patterns, mathematical mappings, and relevant information across documents.
                </p>
              </div>

              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Research Intelligence</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Organise, analyse and synthesise complex research information into verifiable, citation-backed outputs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scientific Work Section */}
        <section id="solutions" className="py-20 bg-[#060606] border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-heading">Scientific Work</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
                Tailored computational intelligence for scientific institutions, universities, and commercial R&D.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Enterprise R&D</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Support enterprise research, technical intelligence, knowledge management and AI-assisted problem solving.</p>
              </div>
              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Research Institutions</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Enable researchers and scientific teams to explore literature, knowledge, computational methods and emerging technologies.</p>
              </div>
              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Universities</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Support students, faculty and research groups with AI, quantum computing and research workflows.</p>
              </div>
              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Technology and Engineering</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Apply AI and quantum technologies to complex engineering, technical and computational problems.</p>
              </div>
              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Pharmaceutical and Healthcare</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Support knowledge-intensive research, scientific analysis and computational exploration across healthcare and drug discovery.</p>
              </div>
              <div className="bg-card-glass rounded-2xl p-6 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white">Financial Services</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Enable research, analytical workflows, portfolio optimisation exploration and AI-assisted financial intelligence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Target Users Section */}
        <section id="target-users" className="py-20 bg-[#080808] border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="badge-pill">Target Users</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-heading">
                Built for Individuals and Organisations
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
                From independent quantum enthusiasts to multinational corporate R&D centers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card-glass rounded-3xl p-8 border border-white/10 space-y-4">
                <div className="text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider">For Individuals</div>
                <h3 className="text-xl font-bold text-white">Researchers & Pioneers</h3>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Students and learners</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Researchers and scientists</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Engineers and developers</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Quantum technology enthusiasts</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Independent researchers</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Entrepreneurs and innovators</li>
                </ul>
              </div>

              <div className="bg-card-glass rounded-3xl p-8 border border-white/10 space-y-4">
                <div className="text-indigo-400 font-mono text-xs uppercase font-bold tracking-wider">For Organisations</div>
                <h3 className="text-xl font-bold text-white">Institutions & Enterprises</h3>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Enterprise R&D teams</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Research institutions</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Universities and laboratories</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Technology companies</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Pharmaceutical and healthcare organisations</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Financial institutions</li>
                  <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Engineering and manufacturing organisations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Section */}
        <section id="enterprise" className="py-20 bg-[#060606] border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card-glass rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8">
              <div className="max-w-2xl space-y-3">
                <span className="badge-pill">Enterprise Solutions</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading">
                  Bring AI and quantum intelligence into your organisation’s innovation workflows.
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-zinc-300">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white mb-1">Enterprise Research Intelligence</div>
                  <p className="text-zinc-400">Customized fine-tuned reasoning pipelines on dedicated infrastructure.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white mb-1">Private Knowledge Environments</div>
                  <p className="text-zinc-400">Air-gapped data ingestion, proprietary IP protection, and compliance.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white mb-1">AI-Assisted R&D</div>
                  <p className="text-zinc-400">Accelerate molecular screening, material simulation, and patent analysis.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white mb-1">Workflow Automation</div>
                  <p className="text-zinc-400">Multi-agent delegation, autonomous synthesis, and scheduled tasks.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white mb-1">Knowledge Management</div>
                  <p className="text-zinc-400">Centralized graph repository across enterprise silos and teams.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white mb-1">Team Collaboration</div>
                  <p className="text-zinc-400">Shared research projects, review workflows, and versioned hypotheses.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white mb-1">Enterprise Integration</div>
                  <p className="text-zinc-400">REST, GraphQL, Python SDK, and HPC cluster connectors.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white mb-1">Security & Governance</div>
                  <p className="text-zinc-400">Role-based access control, SOC2 compliance, audit logs, and encryption.</p>
                </div>
              </div>

              <div className="pt-2">
                <button className="glow-btn-primary text-xs font-semibold px-6 py-3 rounded-full" data-action="enterprise-signup">
                  Contact Enterprise
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-[#060606] border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="badge-pill">Flexible Access</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-heading">Pricing</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
                Flexible access for individuals, researchers, teams and enterprise organisations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card-glass rounded-3xl p-8 border border-white/10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-zinc-400 font-mono text-xs uppercase font-bold">Individual</div>
                  <div className="text-3xl font-extrabold text-white">Free</div>
                  <p className="text-xs text-zinc-400">For students, independent researchers, and learners starting with Quantum AI.</p>
                  <ul className="space-y-2 text-xs text-zinc-300 pt-4 border-t border-white/5">
                    <li className="flex items-center gap-2">✓ Personal research workspace</li>
                    <li className="flex items-center gap-2">✓ Core AI capabilities & RAG</li>
                    <li className="flex items-center gap-2">✓ Standard research workflows</li>
                    <li className="flex items-center gap-2">✓ Up to 5 projects</li>
                  </ul>
                </div>
                <a href="/signin" className="w-full glow-btn-secondary text-xs font-semibold py-3 rounded-full text-center">
                  Get Started Free
                </a>
              </div>

              <div className="bg-card-glass rounded-3xl p-8 border border-cyan-500/40 relative flex flex-col justify-between space-y-6 shadow-[0_0_50px_rgba(56,189,248,0.1)]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-mono text-xs uppercase font-bold">Professional</span>
                    <span className="badge-pill !text-[9px] !py-0.5 !text-cyan-300 !border-cyan-500/30">Popular</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white">$49 <span className="text-xs font-normal text-zinc-400">/ mo</span></div>
                  <p className="text-xs text-zinc-400">For advanced scientists, postdocs, and engineering development teams.</p>
                  <ul className="space-y-2 text-xs text-zinc-300 pt-4 border-t border-white/5">
                    <li className="flex items-center gap-2">✓ Advanced research orchestrator</li>
                    <li className="flex items-center gap-2">✓ Quantum simulation capabilities</li>
                    <li className="flex items-center gap-2">✓ Knowledge graph relational explorer</li>
                    <li className="flex items-center gap-2">✓ Autonomous multi-agent cycles</li>
                    <li className="flex items-center gap-2">✓ Unlimited research projects</li>
                  </ul>
                </div>
                <a href="/signin" className="w-full glow-btn-primary text-xs font-semibold py-3 rounded-full text-center">
                  Start 14-Day Trial
                </a>
              </div>

              <div className="bg-card-glass rounded-3xl p-8 border border-white/10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-indigo-400 font-mono text-xs uppercase font-bold">Enterprise</div>
                  <div className="text-3xl font-extrabold text-white">Custom</div>
                  <p className="text-xs text-zinc-400">For corporate R&D groups, national laboratories, and universities.</p>
                  <ul className="space-y-2 text-xs text-zinc-300 pt-4 border-t border-white/5">
                    <li className="flex items-center gap-2">✓ Enterprise intelligence platform</li>
                    <li className="flex items-center gap-2">✓ Private knowledge environments</li>
                    <li className="flex items-center gap-2">✓ Full HPC & Quantum API integration</li>
                    <li className="flex items-center gap-2">✓ Dedicated governance & SLA support</li>
                    <li className="flex items-center gap-2">✓ On-premise or sovereign cloud</li>
                  </ul>
                </div>
                <button className="w-full glow-btn-secondary text-xs font-semibold py-3 rounded-full" data-action="enterprise-signup">
                  Contact Enterprise
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-24 bg-[#040404] border-b border-white/[0.06] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white font-heading">
              Explore Quantum AI      
            </h2>
            <div className="text-base sm:text-xl font-mono text-zinc-300 tracking-wider">
              Research. Reason. Discover. Create.
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Quinfosys™ Quantum AI provides an integrated environment for AI, Quantum Computing, Knowledge and Research.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button id="btn-cta-getstarted" className="w-full sm:w-auto glow-btn-primary text-sm font-semibold px-8 py-3.5 rounded-full flex items-center justify-center gap-2">
                <span>Get Started</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </button>
              <button id="btn-cta-demo" className="w-full sm:w-auto glow-btn-secondary text-sm font-medium px-8 py-3.5 rounded-full flex items-center justify-center gap-2">
                <span>Request a Demo</span>
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

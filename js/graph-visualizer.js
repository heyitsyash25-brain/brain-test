/**
 * Quinfosys™ Quantum Brain — Knowledge Graph Interactive Visualizer
 * Renders entities, concepts, relationships, and source links
 * with animated node highlighting and relational inspect drawer.
 */

class KnowledgeGraphVisualizer {
  constructor(containerId, data, onSelectNode) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.onSelectNode = onSelectNode;
    this.selectedNodeId = null;
    this.filterCategory = "All";

    this.initLayout();
    this.render();
  }

  initLayout() {
    const width = this.container?.clientWidth || 800;
    const height = this.container?.clientHeight || 520;
    const centerX = width / 2;
    const centerY = height / 2;
    const total = this.data.nodes.length;

    this.nodes = this.data.nodes.map((node, i) => {
      if (node.id === "vqe" || node.id === "kinase") {
        return {
          ...node,
          x: node.id === "vqe" ? centerX - 80 : centerX + 80,
          y: centerY + (node.id === "vqe" ? -30 : 30)
        };
      }
      const angle = (i / (total - 2)) * 2 * Math.PI;
      const radius = 170 + (i % 3) * 35;
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });
  }

  setFilter(category) {
    this.filterCategory = category;
    this.render();
  }

  selectNode(nodeId) {
    this.selectedNodeId = nodeId;
    this.render();
    if (this.onSelectNode) {
      const node = this.data.nodes.find(n => n.id === nodeId);
      const connectedEdges = this.data.edges.filter(
        e => e.source === nodeId || e.target === nodeId
      );
      this.onSelectNode(node, connectedEdges);
    }
  }

  render() {
    if (!this.container) return;

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 520;

    const visibleNodes = this.nodes.filter(
      n => this.filterCategory === "All" || n.category === this.filterCategory
    );
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

    const visibleEdges = this.data.edges.filter(
      e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );

    let svgContent = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </radialGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g opacity="0.12">
          ${Array.from({ length: 9 }).map((_, i) => `
            <line x1="0" y1="${(i + 1) * (height / 10)}" x2="${width}" y2="${(i + 1) * (height / 10)}" stroke="#ffffff" stroke-width="1" stroke-dasharray="3,6" />
            <line x1="${(i + 1) * (width / 10)}" y1="0" x2="${(i + 1) * (width / 10)}" y2="${height}" stroke="#ffffff" stroke-width="1" stroke-dasharray="3,6" />
          `).join('')}
        </g>

        <g class="edges">
    `;

    for (const edge of visibleEdges) {
      const sourceNode = this.nodes.find(n => n.id === edge.source);
      const targetNode = this.nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) continue;

      const isConnected = this.selectedNodeId && 
        (edge.source === this.selectedNodeId || edge.target === this.selectedNodeId);
      
      const strokeColor = isConnected ? "#38bdf8" : "rgba(255, 255, 255, 0.18)";
      const strokeWidth = isConnected ? 2.5 : 1.5;
      const opacity = this.selectedNodeId ? (isConnected ? 1 : 0.25) : 0.8;

      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;

      svgContent += `
        <line x1="${sourceNode.x}" y1="${sourceNode.y}" x2="${targetNode.x}" y2="${targetNode.y}" 
              stroke="${strokeColor}" stroke-width="${strokeWidth}" opacity="${opacity}" class="transition-all duration-300" />
        ${isConnected ? `
          <rect x="${midX - 35}" y="${midY - 9}" width="70" height="18" rx="4" fill="#080808" stroke="#38bdf8" stroke-width="1" opacity="0.95"/>
          <text x="${midX}" y="${midY + 3}" fill="#38bdf8" font-size="9" text-anchor="middle" font-family="'JetBrains Mono', monospace">${edge.relation}</text>
        ` : ''}
      `;
    }

    svgContent += `</g><g class="nodes">`;

    for (const node of visibleNodes) {
      const isSelected = this.selectedNodeId === node.id;
      const isNeighbor = this.selectedNodeId && visibleEdges.some(
        e => (e.source === this.selectedNodeId && e.target === node.id) ||
             (e.target === this.selectedNodeId && e.source === node.id)
      );
      const isDimmed = this.selectedNodeId && !isSelected && !isNeighbor;
      const opacity = isDimmed ? 0.3 : 1;

      svgContent += `
        <g class="graph-node cursor-pointer" data-id="${node.id}" transform="translate(${node.x}, ${node.y})" opacity="${opacity}">
          ${isSelected ? `
            <circle r="${node.size + 10}" fill="none" stroke="${node.color}" stroke-width="2" opacity="0.6" stroke-dasharray="4,4" class="animate-spin-slow" />
          ` : ''}
          <circle r="${node.size}" fill="#0e0e0e" stroke="${isSelected ? '#ffffff' : node.color}" stroke-width="${isSelected ? 3 : 2}" filter="${isSelected ? 'url(#glowEffect)' : 'none'}" />
          <circle r="${node.size - 4}" fill="${node.color}" opacity="0.22" />
          <text y="4" fill="#f8f8f8" font-size="${node.size > 22 ? 11 : 9.5}" font-weight="600" text-anchor="middle" font-family="'Inter', sans-serif">
            ${node.label.length > 16 ? node.label.slice(0, 14) + '…' : node.label}
          </text>
          <text y="${node.size + 14}" fill="#94a3b8" font-size="8.5" text-anchor="middle" font-family="'Inter', sans-serif" letter-spacing="0.05em">
            ${node.category}
          </text>
        </g>
      `;
    }

    svgContent += `</g></svg>`;
    this.container.innerHTML = svgContent;

    this.container.querySelectorAll(".graph-node").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        this.selectNode(id);
      });
    });
  }
}

window.KnowledgeGraphVisualizer = KnowledgeGraphVisualizer;

export { KnowledgeGraphVisualizer };


// ============================================
// USSU ALGORITHM ANALYZER v4.0
// Visualization Engine - Sort, Search, Graph
// github.com/issu321
// ============================================

class VizEngine {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.steps = [];
        this.speed = 300;
        this.interval = null;
        this.canvas = null;
        this.ctx = null;
        this.graphNodes = [];
        this.graphEdges = [];
        this.init();
    }

    init() {
        const runBtn = document.getElementById('run-viz');
        if (runBtn) runBtn.addEventListener('click', () => this.start());

        const pauseBtn = document.getElementById('viz-pause');
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());

        const resumeBtn = document.getElementById('viz-resume');
        if (resumeBtn) resumeBtn.addEventListener('click', () => this.resume());

        const stepBtn = document.getElementById('viz-step');
        if (stepBtn) stepBtn.addEventListener('click', () => this.step());

        const resetBtn = document.getElementById('viz-reset');
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

        const speedInput = document.getElementById('viz-speed');
        if (speedInput) speedInput.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
        });
    }

    start() {
        this.reset();
        const type = document.getElementById('viz-type').value;
        this.speed = parseInt(document.getElementById('viz-speed').value);

        document.getElementById('viz-controls').style.display = 'flex';
        document.getElementById('viz-step-info').style.display = 'block';

        if (type === 'sort') this.startSort();
        else if (type === 'search') this.startSearch();
        else if (type === 'graph') this.startGraph();
    }

    pause() {
        this.isPaused = true;
        document.getElementById('viz-pause').disabled = true;
        document.getElementById('viz-resume').disabled = false;
        if (this.interval) clearInterval(this.interval);
    }

    resume() {
        this.isPaused = false;
        document.getElementById('viz-pause').disabled = false;
        document.getElementById('viz-resume').disabled = true;
        this.playSteps();
    }

    step() {
        if (this.currentStep < this.steps.length) {
            this.renderStep(this.currentStep);
            this.currentStep++;
            this.updateStepInfo();
        }
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.steps = [];
        if (this.interval) clearInterval(this.interval);
        document.getElementById('viz-pause').disabled = false;
        document.getElementById('viz-resume').disabled = true;
        document.getElementById('viz-canvas-area').innerHTML = '';
        document.getElementById('viz-step-info').textContent = '';
    }

    playSteps() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (!this.isPaused && this.currentStep < this.steps.length) {
                this.renderStep(this.currentStep);
                this.currentStep++;
                this.updateStepInfo();
            } else if (this.currentStep >= this.steps.length) {
                clearInterval(this.interval);
                this.isRunning = false;
                document.getElementById('viz-step-info').innerHTML += '<br><span style="color: var(--success);">✓ Visualization Complete</span>';
            }
        }, this.speed);
    }

    updateStepInfo() {
        const info = document.getElementById('viz-step-info');
        const step = this.steps[this.currentStep - 1];
        if (!step) return;

        let text = `Step ${this.currentStep} / ${this.steps.length} | `;
        if (step.comparing) text += `Comparing indices [${step.comparing.join(', ')}]`;
        else if (step.swapping) text += `Swapping indices [${step.swapping.join(', ')}]`;
        else if (step.pivot !== undefined) text += `Pivot at index ${step.pivot}`;
        else if (step.merged) text += `Merging range [${step.merged[0]}, ${step.merged[1]}]`;
        else if (step.current !== undefined) text += `Checking index ${step.current}`;
        else if (step.found) text += `Found at index ${step.index}`;
        else if (step.visited) text += `Visited: [${step.visited.join(', ')}]`;
        else if (step.edge) text += `Edge ${step.edge[0]} → ${step.edge[1]}`;
        else if (step.relax) text += `Relaxing edge ${step.relax[0]} → ${step.relax[1]}`;
        else text += 'Processing...';

        info.innerHTML = text;
    }

    // ========== SORT VISUALIZATION ==========
    startSort() {
        const algo = document.getElementById('viz-sort-algo').value;
        const input = document.getElementById('viz-sort-array').value;
        const arr = input.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));

        if (arr.length === 0) return;

        let result;
        switch(algo) {
            case 'bubble': result = Algorithms.sort.bubble(arr); break;
            case 'selection': result = Algorithms.sort.selection(arr); break;
            case 'insertion': result = Algorithms.sort.insertion(arr); break;
            case 'merge': result = Algorithms.sort.merge(arr); break;
            case 'quick': result = Algorithms.sort.quick(arr); break;
            case 'heap': result = Algorithms.sort.heap(arr); break;
            case 'shell': result = Algorithms.sort.shell(arr); break;
        }

        this.steps = result.steps;
        this.setupSortCanvas(arr);
        this.isRunning = true;
        this.playSteps();
    }

    setupSortCanvas(arr) {
        const container = document.getElementById('viz-canvas-area');
        container.innerHTML = `
            <div class="viz-container" style="min-height: 350px; display: flex; align-items: flex-end; justify-content: center; gap: 6px; padding: 2rem;">
                <div id="sort-bars" style="display: flex; align-items: flex-end; justify-content: center; gap: 6px; width: 100%; height: 300px;"></div>
            </div>
        `;
        const barsContainer = document.getElementById('sort-bars');
        const maxVal = Math.max(...arr);

        arr.forEach((val, idx) => {
            const bar = document.createElement('div');
            const height = (val / maxVal) * 260;
            const width = Math.max(30, Math.min(80, 800 / arr.length));
            bar.id = `bar-${idx}`;
            bar.style.cssText = `
                height: ${height}px;
                width: ${width}px;
                background: linear-gradient(to top, var(--primary), var(--secondary));
                border-radius: 8px 8px 4px 4px;
                transition: all 0.3s ease;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                padding-bottom: 8px;
                font-size: ${Math.max(10, width / 3)}px;
                font-weight: 700;
                color: #fff;
                text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                box-shadow: 0 4px 15px rgba(0, 240, 255, 0.2);
            `;
            bar.textContent = val;
            barsContainer.appendChild(bar);
        });
    }

    renderSortStep(step) {
        const bars = document.querySelectorAll('#sort-bars > div');
        if (!bars.length) return;

        bars.forEach((bar, idx) => {
            let bg = 'linear-gradient(to top, var(--primary), var(--secondary))';
            let shadow = '0 4px 15px rgba(0, 240, 255, 0.2)';
            let scale = 'scale(1)';

            if (step.sorted !== undefined && idx >= step.sorted) {
                bg = 'linear-gradient(to top, var(--success), #00cc66)';
                shadow = '0 4px 20px rgba(0, 255, 136, 0.4)';
            }
            if (step.comparing && step.comparing.includes(idx)) {
                bg = 'linear-gradient(to top, var(--warning), #ff8800)';
                shadow = '0 4px 20px rgba(255, 170, 0, 0.5)';
                scale = 'scale(1.05)';
            }
            if (step.swapping && step.swapping.includes(idx)) {
                bg = 'linear-gradient(to top, var(--accent), #cc0055)';
                shadow = '0 4px 20px rgba(255, 0, 110, 0.5)';
                scale = 'scale(1.1)';
            }
            if (step.pivot === idx) {
                bg = 'linear-gradient(to top, #fff, var(--primary))';
                shadow = '0 4px 25px rgba(255, 255, 255, 0.5)';
                scale = 'scale(1.15)';
            }
            if (step.current === idx) {
                bg = 'linear-gradient(to top, var(--warning), #ff8800)';
                shadow = '0 4px 20px rgba(255, 170, 0, 0.5)';
            }
            if (step.placed === idx) {
                bg = 'linear-gradient(to top, var(--success), #00cc66)';
                shadow = '0 4px 20px rgba(0, 255, 136, 0.4)';
                scale = 'scale(1.05)';
            }
            if (step.shifting && step.shifting.includes(idx)) {
                bg = 'linear-gradient(to top, #7000ff, var(--secondary))';
                shadow = '0 4px 20px rgba(112, 0, 255, 0.4)';
            }

            bar.style.background = bg;
            bar.style.boxShadow = shadow;
            bar.style.transform = scale;
        });

        // Update values if array changed
        if (step.array) {
            step.array.forEach((val, idx) => {
                if (bars[idx]) bars[idx].textContent = val;
            });
        }
    }

    // ========== SEARCH VISUALIZATION ==========
    startSearch() {
        const algo = document.getElementById('viz-search-algo').value;
        const input = document.getElementById('viz-search-array').value;
        const target = parseInt(document.getElementById('viz-search-target').value);
        const arr = input.split(',').map(x => parseInt(x.trim())).sort((a, b) => a - b);

        if (arr.length === 0 || isNaN(target)) return;

        let result;
        switch(algo) {
            case 'linear': result = Algorithms.search.linear(arr, target); break;
            case 'binary': result = Algorithms.search.binary(arr, target); break;
            case 'jump': result = Algorithms.search.jump(arr, target); break;
            case 'ternary': result = Algorithms.search.ternary(arr, target); break;
        }

        this.steps = result.steps;
        this.setupSearchCanvas(arr, target);
        this.isRunning = true;
        this.playSteps();
    }

    setupSearchCanvas(arr, target) {
        const container = document.getElementById('viz-canvas-area');
        container.innerHTML = `
            <div class="viz-container" style="min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; padding: 2rem;">
                <div style="font-size: 1.2rem; color: var(--text-secondary);">Target: <span style="color: var(--accent); font-weight: 800; font-size: 1.5rem;">${target}</span></div>
                <div id="search-bars" style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;"></div>
            </div>
        `;
        const barsContainer = document.getElementById('search-bars');

        arr.forEach((val, idx) => {
            const cell = document.createElement('div');
            cell.id = `search-${idx}`;
            cell.style.cssText = `
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 1.1rem;
                color: #000;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 240, 255, 0.2);
                border: 2px solid transparent;
            `;
            cell.textContent = val;
            barsContainer.appendChild(cell);
        });
    }

    renderSearchStep(step) {
        const cells = document.querySelectorAll('#search-bars > div');
        if (!cells.length) return;

        cells.forEach((cell, idx) => {
            let bg = 'linear-gradient(135deg, var(--primary), var(--secondary))';
            let border = '2px solid transparent';
            let scale = 'scale(1)';
            let shadow = '0 4px 15px rgba(0, 240, 255, 0.2)';

            if (step.index === idx) {
                if (step.status === 'found') {
                    bg = 'linear-gradient(135deg, var(--success), #00cc66)';
                    border = '2px solid var(--success)';
                    scale = 'scale(1.2)';
                    shadow = '0 0 30px rgba(0, 255, 136, 0.6)';
                } else if (step.status === 'checking') {
                    bg = 'linear-gradient(135deg, var(--warning), #ff8800)';
                    border = '2px solid var(--warning)';
                    scale = 'scale(1.1)';
                    shadow = '0 0 25px rgba(255, 170, 0, 0.5)';
                }
            }
            if (step.left !== undefined && step.right !== undefined) {
                if (idx >= step.left && idx <= step.right) {
                    // In current search range
                } else {
                    bg = 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))';
                    shadow = 'none';
                }
            }

            cell.style.background = bg;
            cell.style.border = border;
            cell.style.transform = scale;
            cell.style.boxShadow = shadow;
        });
    }

    // ========== GRAPH VISUALIZATION ==========
    startGraph() {
        const algo = document.getElementById('viz-graph-algo').value;
        const graphType = document.getElementById('viz-graph-type').value;
        const startNode = parseInt(document.getElementById('viz-graph-start').value);
        const numVertices = parseInt(document.getElementById('viz-graph-vertices').value);

        // Parse edges
        const edges = [];
        document.querySelectorAll('.edge-input-row').forEach(row => {
            const from = parseInt(row.querySelector('.edge-from').value);
            const to = parseInt(row.querySelector('.edge-to').value);
            const weight = parseInt(row.querySelector('.edge-weight').value) || 1;
            if (!isNaN(from) && !isNaN(to)) {
                edges.push([from, to, weight]);
            }
        });

        // Build adjacency list
        const graph = {};
        for (let i = 0; i < numVertices; i++) graph[i] = [];
        edges.forEach(([u, v, w]) => {
            graph[u].push([v, w]);
            if (graphType === 'undirected') graph[v].push([u, w]);
        });

        // Run algorithm
        let result;
        switch(algo) {
            case 'bfs': result = Algorithms.graph.bfs(graph, startNode); break;
            case 'dfs': result = Algorithms.graph.dfs(graph, startNode); break;
            case 'dijkstra': result = Algorithms.graph.dijkstra(graph, startNode); break;
            case 'prim': result = Algorithms.graph.prim(graph); break;
            case 'kruskal':
                const vertices = Object.keys(graph).map(Number);
                result = Algorithms.graph.kruskal(edges, vertices);
                break;
        }

        this.steps = result.steps || [];
        this.graphResult = result;
        this.setupGraphCanvas(numVertices, edges, graphType);
        this.isRunning = true;
        this.playSteps();
    }

    setupGraphCanvas(numVertices, edges, graphType) {
        const container = document.getElementById('viz-canvas-area');
        container.innerHTML = `
            <div class="graph-canvas-container">
                <canvas id="graph-canvas"></canvas>
            </div>
        `;

        this.canvas = document.getElementById('graph-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = 500;

        // Calculate node positions in a circle
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 80;

        this.graphNodes = [];
        for (let i = 0; i < numVertices; i++) {
            const angle = (2 * Math.PI * i) / numVertices - Math.PI / 2;
            this.graphNodes.push({
                id: i,
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                status: 'unvisited'
            });
        }

        this.graphEdges = edges.map(e => ({
            from: e[0],
            to: e[1],
            weight: e[2],
            status: 'default'
        }));

        this.drawGraph(graphType);
    }

    drawGraph(graphType) {
        const ctx = this.ctx;
        const canvas = this.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw edges
        this.graphEdges.forEach(edge => {
            const fromNode = this.graphNodes[edge.from];
            const toNode = this.graphNodes[edge.to];
            if (!fromNode || !toNode) return;

            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);

            let strokeStyle = 'rgba(255, 255, 255, 0.2)';
            let lineWidth = 2;

            if (edge.status === 'path') {
                strokeStyle = 'rgba(0, 255, 136, 0.8)';
                lineWidth = 4;
                ctx.shadowColor = 'rgba(0, 255, 136, 0.5)';
                ctx.shadowBlur = 15;
            } else if (edge.status === 'checking') {
                strokeStyle = 'rgba(255, 170, 0, 0.8)';
                lineWidth = 3;
                ctx.shadowColor = 'rgba(255, 170, 0, 0.5)';
                ctx.shadowBlur = 10;
            } else if (edge.status === 'mst') {
                strokeStyle = 'rgba(0, 240, 255, 0.9)';
                lineWidth = 4;
                ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
                ctx.shadowBlur = 15;
            }

            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw weight label
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '12px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Background for weight
            const textWidth = ctx.measureText(edge.weight).width;
            ctx.fillStyle = 'rgba(10, 10, 15, 0.8)';
            ctx.fillRect(midX - textWidth/2 - 4, midY - 8, textWidth + 8, 16);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(edge.weight, midX, midY);

            // Arrow for directed
            if (graphType === 'directed') {
                const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
                const arrowLen = 15;
                const arrowAngle = Math.PI / 6;
                const nodeRadius = 28;
                const toX = toNode.x - nodeRadius * Math.cos(angle);
                const toY = toNode.y - nodeRadius * Math.sin(angle);

                ctx.beginPath();
                ctx.moveTo(toX, toY);
                ctx.lineTo(toX - arrowLen * Math.cos(angle - arrowAngle), toY - arrowLen * Math.sin(angle - arrowAngle));
                ctx.moveTo(toX, toY);
                ctx.lineTo(toX - arrowLen * Math.cos(angle + arrowAngle), toY - arrowLen * Math.sin(angle + arrowAngle));
                ctx.strokeStyle = strokeStyle;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
            }
        });

        // Draw nodes
        this.graphNodes.forEach(node => {
            if (!node) return;

            let fillStyle = 'linear-gradient(135deg, var(--primary), var(--secondary))';
            let strokeStyle = 'rgba(0, 240, 255, 0.5)';
            let glowColor = 'rgba(0, 240, 255, 0.3)';
            let radius = 28;

            if (node.status === 'visited') {
                fillStyle = '#00ff88';
                strokeStyle = 'rgba(0, 255, 136, 0.8)';
                glowColor = 'rgba(0, 255, 136, 0.5)';
            } else if (node.status === 'current') {
                fillStyle = '#ff006e';
                strokeStyle = 'rgba(255, 0, 110, 0.8)';
                glowColor = 'rgba(255, 0, 110, 0.6)';
                radius = 32;
            } else if (node.status === 'checking') {
                fillStyle = '#ffaa00';
                strokeStyle = 'rgba(255, 170, 0, 0.8)';
                glowColor = 'rgba(255, 170, 0, 0.5)';
            }

            // Glow
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius + 8, 0, 2 * Math.PI);
            ctx.fillStyle = glowColor;
            ctx.fill();

            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);

            // Gradient fill
            const gradient = ctx.createRadialGradient(node.x - 5, node.y - 5, 0, node.x, node.y, radius);
            if (node.status === 'visited') {
                gradient.addColorStop(0, '#00ff88');
                gradient.addColorStop(1, '#00aa66');
            } else if (node.status === 'current') {
                gradient.addColorStop(0, '#ff006e');
                gradient.addColorStop(1, '#cc0055');
            } else if (node.status === 'checking') {
                gradient.addColorStop(0, '#ffaa00');
                gradient.addColorStop(1, '#cc8800');
            } else {
                gradient.addColorStop(0, '#00f0ff');
                gradient.addColorStop(1, '#7000ff');
            }

            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Node label
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.id, node.x, node.y);
        });
    }

    renderGraphStep(step) {
        if (!step) return;

        // Update node statuses
        if (step.current !== undefined) {
            this.graphNodes.forEach(n => {
                if (n.id === step.current) n.status = 'current';
                else if (step.visited && step.visited.includes(n.id)) n.status = 'visited';
            });
        }
        if (step.visited) {
            step.visited.forEach(id => {
                if (this.graphNodes[id]) this.graphNodes[id].status = 'visited';
            });
        }

        // Update edge statuses
        if (step.edge) {
            const [u, v] = step.edge;
            this.graphEdges.forEach(e => {
                if ((e.from === u && e.to === v) || (e.from === v && e.to === u)) {
                    e.status = 'checking';
                }
            });
        }
        if (step.added) {
            const [u, v] = step.edge || [];
            this.graphEdges.forEach(e => {
                if ((e.from === u && e.to === v) || (e.from === v && e.to === u)) {
                    e.status = 'mst';
                }
            });
        }
        if (step.relax) {
            const [u, v] = step.relax;
            this.graphEdges.forEach(e => {
                if ((e.from === u && e.to === v) || (e.from === v && e.to === u)) {
                    e.status = 'path';
                }
            });
        }

        const graphType = document.getElementById('viz-graph-type').value;
        this.drawGraph(graphType);
    }

    renderStep(index) {
        const type = document.getElementById('viz-type').value;
        const step = this.steps[index];
        if (!step) return;

        if (type === 'sort') this.renderSortStep(step);
        else if (type === 'search') this.renderSearchStep(step);
        else if (type === 'graph') this.renderGraphStep(step);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.vizEngine = new VizEngine();
});

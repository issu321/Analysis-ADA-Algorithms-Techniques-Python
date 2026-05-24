
/* ============================================
   USSU ALGORITHM ANALYZER v4.0 - WEB ENGINE
   3D Canvas, Interactive Visualizations, Graph Engine
   Author: Ussu (github.com/issu321)
   ============================================ */

// ─── 3D HERO CANVAS ───
class Hero3D {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.resize();
        this.initParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        const count = Math.min(80, Math.floor(window.innerWidth / 20));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 1000,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 2,
                size: Math.random() * 2 + 1,
                color: this.randomColor(),
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    randomColor() {
        const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#d946ef'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animate() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
        ctx.fillRect(0, 0, w, h);

        // Update particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            p.pulse += 0.02;

            // Wrap around
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;
            if (p.z < 0) p.z = 1000;
            if (p.z > 1000) p.z = 0;

            // Mouse repulsion
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                p.x += dx * force * 0.05;
                p.y += dy * force * 0.05;
            }

            // Draw particle
            const scale = 1 - p.z / 2000;
            const alpha = 0.3 + Math.sin(p.pulse) * 0.2 + (1 - p.z/1000) * 0.5;
            const size = p.size * scale * (0.8 + Math.sin(p.pulse) * 0.3);

            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(size, 0.5), 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.fill();

            // Glow
            const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
            glow.addColorStop(0, p.color + '40');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.fillRect(p.x - size*4, p.y - size*4, size*8, size*8);
        });

        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 200) {
                    const alpha = (1 - dist / 200) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ─── GRAPH VISUALIZER ENGINE ───
class GraphVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.edges = [];
        this.selectedNode = null;
        this.dragging = null;
        this.algorithm = 'bfs';
        this.visited = new Set();
        this.path = [];
        this.animating = false;
        this.speed = 500;

        this.resize();
        this.bindEvents();
        this.generateRandom();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 500;
    }

    generateRandom(count = 8, density = 0.3) {
        this.nodes = [];
        this.edges = [];
        const w = this.canvas.width;
        const h = this.canvas.height;
        const margin = 60;

        for (let i = 0; i < count; i++) {
            this.nodes.push({
                id: i,
                x: margin + Math.random() * (w - margin * 2),
                y: margin + Math.random() * (h - margin * 2),
                label: String.fromCharCode(65 + i),
                color: '#06b6d4',
                radius: 25,
                pulse: 0
            });
        }

        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                if (Math.random() < density) {
                    const weight = Math.floor(Math.random() * 20) + 1;
                    this.edges.push({ from: i, to: j, weight, color: 'rgba(139,92,246,0.6)' });
                }
            }
        }
        this.draw();
    }

    bindEvents() {
        let startX, startY;
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const node = this.nodes.find(n => Math.hypot(n.x - x, n.y - y) < n.radius);
            if (node) {
                this.dragging = node;
                startX = x - node.x;
                startY = y - node.y;
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.dragging) {
                const rect = this.canvas.getBoundingClientRect();
                this.dragging.x = e.clientX - rect.left - startX;
                this.dragging.y = e.clientY - rect.top - startY;
                this.draw();
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.dragging = null;
        });

        window.addEventListener('resize', () => {
            this.resize();
            this.draw();
        });
    }

    async runBFS(start = 0) {
        if (this.animating) return;
        this.animating = true;
        this.visited.clear();
        this.path = [];
        const queue = [start];
        this.visited.add(start);

        while (queue.length > 0) {
            const current = queue.shift();
            this.path.push(current);
            this.nodes[current].color = '#10b981';
            this.nodes[current].pulse = 1;
            this.draw();
            await this.sleep(this.speed);

            this.edges.filter(e => e.from === current || e.to === current).forEach(e => {
                const neighbor = e.from === current ? e.to : e.from;
                if (!this.visited.has(neighbor)) {
                    this.visited.add(neighbor);
                    queue.push(neighbor);
                    e.color = '#f59e0b';
                }
            });
        }
        this.animating = false;
    }

    async runDFS(start = 0) {
        if (this.animating) return;
        this.animating = true;
        this.visited.clear();
        this.path = [];
        await this._dfsRecursive(start);
        this.animating = false;
    }

    async _dfsRecursive(node) {
        this.visited.add(node);
        this.path.push(node);
        this.nodes[node].color = '#8b5cf6';
        this.nodes[node].pulse = 1;
        this.draw();
        await this.sleep(this.speed);

        const neighbors = this.edges
            .filter(e => e.from === node || e.to === node)
            .map(e => e.from === node ? e.to : e.from)
            .filter(n => !this.visited.has(n));

        for (const neighbor of neighbors) {
            if (!this.visited.has(neighbor)) {
                await this._dfsRecursive(neighbor);
            }
        }
    }

    reset() {
        this.visited.clear();
        this.path = [];
        this.animating = false;
        this.nodes.forEach(n => {
            n.color = '#06b6d4';
            n.pulse = 0;
        });
        this.edges.forEach(e => {
            e.color = 'rgba(139,92,246,0.6)';
        });
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Clear with trail
        ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        ctx.fillRect(0, 0, w, h);

        // Draw edges
        this.edges.forEach(e => {
            const n1 = this.nodes[e.from];
            const n2 = this.nodes[e.to];
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = e.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Weight label
            const midX = (n1.x + n2.x) / 2;
            const midY = (n1.y + n2.y) / 2;
            ctx.fillStyle = 'rgba(245,158,11,0.9)';
            ctx.font = 'bold 12px "Fira Code", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(e.weight, midX, midY - 5);
        });

        // Draw nodes
        this.nodes.forEach(n => {
            // Pulse effect
            if (n.pulse > 0) {
                n.pulse -= 0.02;
                const pulseRadius = n.radius + (1 - n.pulse) * 20;
                const gradient = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, pulseRadius);
                gradient.addColorStop(0, n.color + '60');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(n.x, n.y, pulseRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Node body
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            const nodeGrad = ctx.createRadialGradient(n.x - 5, n.y - 5, 0, n.x, n.y, n.radius);
            nodeGrad.addColorStop(0, n.color + 'cc');
            nodeGrad.addColorStop(1, n.color + '66');
            ctx.fillStyle = nodeGrad;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px "Orbitron", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(n.label, n.x, n.y);
        });

        requestAnimationFrame(() => this.draw());
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ─── SORTING VISUALIZER ───
class SortingVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.array = [];
        this.steps = [];
        this.currentStep = 0;
        this.animating = false;
        this.speed = 100;
        this.resize();
        this.generateArray();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 400;
    }

    generateArray(size = 50) {
        this.array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5);
        this.steps = [];
        this.currentStep = 0;
        this.draw();
    }

    async bubbleSort() {
        this.animating = true;
        const arr = [...this.array];
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                this.draw(arr, { compare: [j, j + 1] });
                await this.sleep(this.speed);
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.draw(arr, { swap: [j, j + 1] });
                    await this.sleep(this.speed);
                }
            }
        }
        this.draw(arr, { sorted: true });
        this.animating = false;
    }

    async quickSort(arr = null, low = 0, high = null) {
        if (!this.animating && arr === null) {
            this.animating = true;
            arr = [...this.array];
            high = arr.length - 1;
        }
        if (low < high) {
            const pi = await this.partition(arr, low, high);
            await this.quickSort(arr, low, pi - 1);
            await this.quickSort(arr, pi + 1, high);
        }
        if (low === 0 && high === arr.length - 1) {
            this.draw(arr, { sorted: true });
            this.animating = false;
        }
    }

    async partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            this.draw(arr, { compare: [j, high], pivot: high });
            await this.sleep(this.speed);
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.draw(arr, { swap: [i, j], pivot: high });
                await this.sleep(this.speed);
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.draw(arr, { swap: [i + 1, high] });
        await this.sleep(this.speed);
        return i + 1;
    }

    draw(arr = this.array, highlights = {}) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const barWidth = w / arr.length;
        const maxVal = Math.max(...arr);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        ctx.fillRect(0, 0, w, h);

        arr.forEach((val, i) => {
            const barHeight = (val / maxVal) * (h - 40);
            const x = i * barWidth;
            const y = h - barHeight - 20;

            let color = '#06b6d4';
            if (highlights.sorted) color = '#10b981';
            else if (highlights.pivot === i) color = '#d946ef';
            else if (highlights.swap && highlights.swap.includes(i)) color = '#ef4444';
            else if (highlights.compare && highlights.compare.includes(i)) color = '#f59e0b';

            // Bar gradient
            const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
            grad.addColorStop(0, color + 'cc');
            grad.addColorStop(1, color + '44');
            ctx.fillStyle = grad;
            ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

            // Glow top
            ctx.fillStyle = color;
            ctx.fillRect(x + 1, y, barWidth - 2, 2);
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ─── SEARCHING VISUALIZER ───
class SearchVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.array = [];
        this.target = 50;
        this.resize();
        this.generateArray();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 200;
    }

    generateArray(size = 30) {
        this.array = Array.from({ length: size }, (_, i) => i * 3 + Math.floor(Math.random() * 3));
        this.target = this.array[Math.floor(Math.random() * this.array.length)];
        this.draw();
    }

    async binarySearch() {
        let left = 0, right = this.array.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            this.draw({ range: [left, right], mid, found: this.array[mid] === this.target });
            await this.sleep(800);
            if (this.array[mid] === this.target) {
                this.draw({ found: true, index: mid });
                return mid;
            }
            if (this.array[mid] < this.target) left = mid + 1;
            else right = mid - 1;
        }
        this.draw({ notFound: true });
        return -1;
    }

    async linearSearch() {
        for (let i = 0; i < this.array.length; i++) {
            this.draw({ current: i, found: this.array[i] === this.target });
            await this.sleep(200);
            if (this.array[i] === this.target) {
                this.draw({ found: true, index: i });
                return i;
            }
        }
        this.draw({ notFound: true });
        return -1;
    }

    draw(highlights = {}) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cellWidth = w / this.array.length;
        const cellHeight = 60;
        const startY = (h - cellHeight) / 2;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        ctx.fillRect(0, 0, w, h);

        this.array.forEach((val, i) => {
            const x = i * cellWidth;
            let color = '#1e293b';
            let textColor = '#94a3b8';

            if (highlights.found && highlights.index === i) {
                color = '#10b981';
                textColor = '#fff';
            } else if (highlights.notFound) {
                color = '#ef4444';
                textColor = '#fff';
            } else if (highlights.mid === i) {
                color = '#f59e0b';
                textColor = '#fff';
            } else if (highlights.current === i) {
                color = '#8b5cf6';
                textColor = '#fff';
            } else if (highlights.range && i >= highlights.range[0] && i <= highlights.range[1]) {
                color = 'rgba(6,182,212,0.2)';
            }

            // Cell
            ctx.fillStyle = color;
            ctx.fillRect(x + 1, startY, cellWidth - 2, cellHeight);
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.strokeRect(x + 1, startY, cellWidth - 2, cellHeight);

            // Value
            ctx.fillStyle = textColor;
            ctx.font = 'bold 12px "Fira Code", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, x + cellWidth / 2, startY + cellHeight / 2);

            // Index
            ctx.fillStyle = '#64748b';
            ctx.font = '10px "Fira Code", monospace';
            ctx.fillText(i, x + cellWidth / 2, startY + cellHeight + 15);
        });

        // Target indicator
        ctx.fillStyle = '#22d3ee';
        ctx.font = '14px "Orbitron", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Target: ${this.target}`, 10, 25);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ─── DP TABLE VISUALIZER ───
class DPVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.table = [];
        this.highlights = [];
        this.resize();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 400;
    }

    generateLCS(str1 = "ABCDGH", str2 = "AEDFHR") {
        const m = str1.length, n = str2.length;
        this.table = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
        this.labels = { rows: [''] + str1.split(''), cols: [''] + str2.split('') };

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    this.table[i][j] = this.table[i - 1][j - 1] + 1;
                } else {
                    this.table[i][j] = Math.max(this.table[i - 1][j], this.table[i][j - 1]);
                }
            }
        }
        this.draw();
    }

    draw(activeCell = null) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const rows = this.table.length;
        const cols = this.table[0]?.length || 0;
        const cellW = Math.min(50, w / (cols + 1));
        const cellH = Math.min(40, h / (rows + 1));
        const startX = (w - cols * cellW) / 2;
        const startY = (h - rows * cellH) / 2;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = startX + j * cellW;
                const y = startY + i * cellH;
                let color = 'rgba(30,41,59,0.8)';
                let textColor = '#94a3b8';

                if (activeCell && activeCell[0] === i && activeCell[1] === j) {
                    color = 'rgba(6,182,212,0.3)';
                    textColor = '#22d3ee';
                } else if (i === 0 || j === 0) {
                    color = 'rgba(139,92,246,0.15)';
                    textColor = '#a78bfa';
                }

                ctx.fillStyle = color;
                ctx.fillRect(x, y, cellW - 2, cellH - 2);
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                ctx.strokeRect(x, y, cellW - 2, cellH - 2);

                ctx.fillStyle = textColor;
                ctx.font = 'bold 14px "Fira Code", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const val = this.table[i][j];
                const label = i === 0 ? this.labels.cols[j] : j === 0 ? this.labels.rows[i] : val;
                ctx.fillText(label, x + cellW / 2, y + cellH / 2);
            }
        }
    }
}

// ─── GREEDY VISUALIZER ───
class GreedyVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.activities = [];
        this.selected = [];
        this.resize();
        this.generateActivities();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 300;
    }

    generateActivities() {
        this.activities = [
            { id: 'A1', start: 1, end: 4 },
            { id: 'A2', start: 3, end: 5 },
            { id: 'A3', start: 0, end: 6 },
            { id: 'A4', start: 5, end: 7 },
            { id: 'A5', start: 3, end: 9 },
            { id: 'A6', start: 5, end: 9 },
            { id: 'A7', start: 6, end: 10 },
            { id: 'A8', start: 8, end: 11 },
        ];
        this.selected = [];
        this.draw();
    }

    async runActivitySelection() {
        const sorted = [...this.activities].sort((a, b) => a.end - b.end);
        this.selected = [sorted[0]];
        this.draw();
        await this.sleep(500);

        for (let i = 1; i < sorted.length; i++) {
            const last = this.selected[this.selected.length - 1];
            if (sorted[i].start >= last.end) {
                this.selected.push(sorted[i]);
                this.draw();
                await this.sleep(500);
            }
        }
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const maxTime = Math.max(...this.activities.map(a => a.end));
        const scaleX = (w - 100) / maxTime;
        const barH = 30;
        const gap = 10;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        ctx.fillRect(0, 0, w, h);

        // Timeline
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.moveTo(50, h - 30);
        ctx.lineTo(w - 50, h - 30);
        ctx.stroke();

        for (let t = 0; t <= maxTime; t++) {
            const x = 50 + t * scaleX;
            ctx.fillStyle = '#64748b';
            ctx.font = '10px "Fira Code", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(t, x, h - 15);
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x, h - 35);
            ctx.stroke();
        }

        this.activities.forEach((act, i) => {
            const isSelected = this.selected.some(s => s.id === act.id);
            const y = 20 + i * (barH + gap);
            const x = 50 + act.start * scaleX;
            const width = (act.end - act.start) * scaleX;

            const color = isSelected ? '#10b981' : '#ef4444';
            ctx.fillStyle = color + '60';
            ctx.fillRect(x, y, width, barH);
            ctx.strokeStyle = color;
            ctx.strokeRect(x, y, width, barH);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px "Orbitron", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(act.id, x + width / 2, y + barH / 2);
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ─── MATH TOOLS ───
class MathTools {
    static sieve(n) {
        const isPrime = Array(n + 1).fill(true);
        isPrime[0] = isPrime[1] = false;
        for (let i = 2; i * i <= n; i++) {
            if (isPrime[i]) {
                for (let j = i * i; j <= n; j += i) isPrime[j] = false;
            }
        }
        return isPrime.map((v, i) => v ? i : null).filter(v => v !== null);
    }

    static fibonacci(n) {
        if (n <= 1) return n;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
        return b;
    }

    static gcd(a, b) {
        while (b) [a, b] = [b, a % b];
        return a;
    }

    static isPrime(n) {
        if (n < 2) return false;
        for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
        return true;
    }
}

// ─── UI UTILITIES ───
const UI = {
    init() {
        this.navbarScroll();
        this.scrollReveal();
        this.mobileMenu();
        this.initCounters();
    },

    navbarScroll() {
        const nav = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    },

    scrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    },

    mobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (!hamburger) return;

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    },

    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    this.animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        });
        counters.forEach(c => observer.observe(c));
    },

    animateCounter(el, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current).toLocaleString();
            }
        }, 30);
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `glass toast toast-${type}`;
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; z-index: 9999;
            padding: 1rem 1.5rem; border-radius: 12px;
            color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#22d3ee'};
            font-family: 'Orbitron', sans-serif; font-size: 0.85rem;
            animation: fadeInUp 0.4s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'fadeInDown 0.4s ease reverse';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
};

// ─── INITIALIZE ───
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
    new Hero3D();

    // Initialize page-specific visualizers
    if (document.getElementById('graph-canvas')) {
        window.graphViz = new GraphVisualizer('graph-canvas');
    }
    if (document.getElementById('sort-canvas')) {
        window.sortViz = new SortingVisualizer('sort-canvas');
    }
    if (document.getElementById('search-canvas')) {
        window.searchViz = new SearchVisualizer('search-canvas');
    }
    if (document.getElementById('dp-canvas')) {
        window.dpViz = new DPVisualizer('dp-canvas');
    }
    if (document.getElementById('greedy-canvas')) {
        window.greedyViz = new GreedyVisualizer('greedy-canvas');
    }
});

// Export for inline usage
window.MathTools = MathTools;
window.GraphVisualizer = GraphVisualizer;
window.SortingVisualizer = SortingVisualizer;
window.SearchVisualizer = SearchVisualizer;
window.DPVisualizer = DPVisualizer;
window.GreedyVisualizer = GreedyVisualizer;

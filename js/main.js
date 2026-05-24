
// ============================================
// USSU ALGORITHM ANALYZER v4.0
// Main UI & Visualization Controller
// github.com/issu321
// ============================================

class USSUApp {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.init();
    }

    init() {
        this.initNavigation();
        this.initParticles();
        this.initTiltEffects();
        this.initScrollAnimations();
        this.initPageSpecific();
    }

    // Navigation
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.querySelector('.nav-links').classList.toggle('show');
            });
        }
    }

    // Particle Background
    initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.color = `rgba(0, 240, 255, ${Math.random() * 0.3})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - dist / 150)})`;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // 3D Tilt Effects
    initTiltEffects() {
        const cards = document.querySelectorAll('.tilt-element');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    // Scroll Animations
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.glass-card, .algo-card, .stat-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        document.addEventListener('scroll', () => {
            document.querySelectorAll('.animate-in').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        });
    }

    // Page Specific Initialization
    initPageSpecific() {
        const page = this.currentPage;

        if (page.includes('search')) this.initSearchPage();
        else if (page.includes('sort')) this.initSortPage();
        else if (page.includes('graph')) this.initGraphPage();
        else if (page.includes('dp')) this.initDPPage();
        else if (page.includes('greedy')) this.initGreedyPage();
        else if (page.includes('backtracking')) this.initBacktrackingPage();
        else if (page.includes('math')) this.initMathPage();
        else if (page.includes('benchmark')) this.initBenchmarkPage();
        else if (page.includes('compare')) this.initComparePage();
        else if (page.includes('visualize')) this.initVisualizePage();
    }

    // ========== SEARCH PAGE ==========
    initSearchPage() {
        const runBtn = document.getElementById('run-search');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            const algo = document.getElementById('search-algo').value;
            const input = document.getElementById('search-array').value;
            const target = parseInt(document.getElementById('search-target').value);

            if (!input || isNaN(target)) {
                this.showToast('Please enter valid array and target', 'error');
                return;
            }

            const arr = input.split(',').map(x => parseInt(x.trim())).sort((a, b) => a - b);
            const resultsDiv = document.getElementById('search-results');
            const vizDiv = document.getElementById('search-viz');

            let result;
            switch(algo) {
                case 'linear': result = Algorithms.search.linear(arr, target); break;
                case 'binary': result = Algorithms.search.binary(arr, target); break;
                case 'jump': result = Algorithms.search.jump(arr, target); break;
                case 'interpolation': result = Algorithms.search.interpolation(arr, target); break;
                case 'exponential': result = Algorithms.search.exponential(arr, target); break;
                case 'ternary': result = Algorithms.search.ternary(arr, target); break;
                case 'fibonacci': result = Algorithms.search.fibonacci(arr, target); break;
            }

            this.displaySearchResults(result, arr, target, algo, resultsDiv);
            this.visualizeSearch(result, arr, vizDiv);
            resultsDiv.classList.add('active');
        });
    }

    displaySearchResults(result, arr, target, algo, container) {
        const complexity = {
            linear: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)' },
            binary: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' },
            jump: { best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)' },
            interpolation: { best: 'O(1)', avg: 'O(log log n)', worst: 'O(n)' },
            exponential: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' },
            ternary: { best: 'O(1)', avg: 'O(log₃ n)', worst: 'O(log₃ n)' },
            fibonacci: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' }
        };

        const c = complexity[algo];
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${result.found ? '✓' : '✗'}</div>
                    <div class="stat-label">${result.found ? 'Found' : 'Not Found'}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${result.index !== -1 ? result.index : '-'}</div>
                    <div class="stat-label">Index</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${result.comparisons}</div>
                    <div class="stat-label">Comparisons</div>
                </div>
            </div>
            <div class="result-box">
                <div class="result-label">Input Array</div>
                <div class="result-value">[${arr.join(', ')}]</div>
            </div>
            <div class="result-box">
                <div class="result-label">Target Value</div>
                <div class="result-value">${target}</div>
            </div>
            <div class="result-box">
                <div class="result-label">Time Complexity</div>
                <div class="result-value">
                    <span class="complexity-badge complexity-best">Best: ${c.best}</span>
                    <span class="complexity-badge complexity-avg">Avg: ${c.avg}</span>
                    <span class="complexity-badge complexity-worst">Worst: ${c.worst}</span>
                </div>
            </div>
        `;
    }

    visualizeSearch(result, arr, container) {
        container.innerHTML = '<div class="viz-container"><div id="search-viz-canvas"></div></div>';
        const canvas = document.getElementById('search-viz-canvas');

        arr.forEach((val, idx) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar bar-default';
            bar.style.height = '40px';
            bar.style.width = '50px';
            bar.style.display = 'inline-flex';
            bar.style.alignItems = 'center';
            bar.style.justifyContent = 'center';
            bar.style.margin = '0 4px';
            bar.style.borderRadius = '8px';
            bar.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
            bar.style.color = '#000';
            bar.style.fontWeight = '700';
            bar.style.fontFamily = 'JetBrains Mono, monospace';
            bar.textContent = val;
            bar.dataset.index = idx;
            canvas.appendChild(bar);
        });

        if (result.steps) {
            let i = 0;
            const interval = setInterval(() => {
                if (i >= result.steps.length) {
                    clearInterval(interval);
                    return;
                }
                const step = result.steps[i];
                const bars = canvas.querySelectorAll('.array-bar');
                bars.forEach(b => b.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))');

                if (step.index !== undefined && bars[step.index]) {
                    bars[step.index].style.background = step.status === 'found' 
                        ? 'linear-gradient(135deg, var(--success), #00aa66)'
                        : 'linear-gradient(135deg, var(--warning), #ff8800)';
                }
                i++;
            }, 500);
        }
    }

    // ========== SORT PAGE ==========
    initSortPage() {
        const runBtn = document.getElementById('run-sort');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            const algo = document.getElementById('sort-algo').value;
            const input = document.getElementById('sort-array').value;

            if (!input) {
                this.showToast('Please enter an array', 'error');
                return;
            }

            const arr = input.split(',').map(x => parseInt(x.trim()));
            const resultsDiv = document.getElementById('sort-results');
            const vizDiv = document.getElementById('sort-viz');

            let result;
            switch(algo) {
                case 'bubble': result = Algorithms.sort.bubble(arr); break;
                case 'selection': result = Algorithms.sort.selection(arr); break;
                case 'insertion': result = Algorithms.sort.insertion(arr); break;
                case 'merge': result = Algorithms.sort.merge(arr); break;
                case 'quick': result = Algorithms.sort.quick(arr); break;
                case 'heap': result = Algorithms.sort.heap(arr); break;
                case 'counting': result = Algorithms.sort.counting(arr); break;
                case 'radix': result = Algorithms.sort.radix(arr); break;
                case 'bucket': result = Algorithms.sort.bucket(arr); break;
                case 'shell': result = Algorithms.sort.shell(arr); break;
            }

            this.displaySortResults(result, arr, algo, resultsDiv);
            this.visualizeSort(result, vizDiv);
            resultsDiv.classList.add('active');
        });
    }

    displaySortResults(result, arr, algo, container) {
        const complexity = {
            bubble: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
            selection: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
            insertion: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
            merge: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
            quick: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
            heap: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
            counting: { best: 'O(n+k)', avg: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)' },
            radix: { best: 'O(nk)', avg: 'O(nk)', worst: 'O(nk)', space: 'O(n+k)' },
            bucket: { best: 'O(n+k)', avg: 'O(n+k)', worst: 'O(n²)', space: 'O(n+k)' },
            shell: { best: 'O(n log n)', avg: 'O(n^1.5)', worst: 'O(n²)', space: 'O(1)' }
        };

        const c = complexity[algo];
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${arr.length}</div>
                    <div class="stat-label">Elements</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${result.steps.length}</div>
                    <div class="stat-label">Steps</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${result.result.length}</div>
                    <div class="stat-label">Sorted</div>
                </div>
            </div>
            <div class="result-box">
                <div class="result-label">Original Array</div>
                <div class="result-value">[${arr.join(', ')}]</div>
            </div>
            <div class="result-box">
                <div class="result-label">Sorted Array</div>
                <div class="result-value">[${result.result.join(', ')}]</div>
            </div>
            <div class="result-box">
                <div class="result-label">Complexity</div>
                <div class="result-value">
                    <span class="complexity-badge complexity-best">Best: ${c.best}</span>
                    <span class="complexity-badge complexity-avg">Avg: ${c.avg}</span>
                    <span class="complexity-badge complexity-worst">Worst: ${c.worst}</span>
                    <span class="complexity-badge" style="background: rgba(0,240,255,0.1); color: var(--primary); border: 1px solid rgba(0,240,255,0.3);">Space: ${c.space}</span>
                </div>
            </div>
        `;
    }

    visualizeSort(result, container) {
        container.innerHTML = '<div class="viz-container"><div id="sort-viz-canvas" style="display: flex; align-items: flex-end; justify-content: center; height: 300px; gap: 4px;"></div></div>';
        const canvas = document.getElementById('sort-viz-canvas');
        const maxVal = Math.max(...result.result);

        function render(step) {
            canvas.innerHTML = '';
            step.array.forEach((val, idx) => {
                const bar = document.createElement('div');
                const height = (val / maxVal) * 250;
                let bg = 'linear-gradient(to top, var(--primary), var(--secondary))';

                if (step.comparing && step.comparing.includes(idx)) bg = 'linear-gradient(to top, var(--warning), #ff8800)';
                if (step.swapping && step.swapping.includes(idx)) bg = 'linear-gradient(to top, var(--accent), #cc0055)';
                if (step.sorted && idx >= step.sorted) bg = 'linear-gradient(to top, var(--success), #00cc66)';
                if (step.pivot === idx) bg = 'linear-gradient(to top, #fff, var(--primary))';

                bar.style.cssText = `height: ${height}px; width: ${Math.max(30, 600 / step.array.length)}px; background: ${bg}; border-radius: 4px 4px 0 0; transition: all 0.3s ease;`;
                bar.title = val;
                canvas.appendChild(bar);
            });
        }

        let i = 0;
        const interval = setInterval(() => {
            if (i >= result.steps.length) {
                clearInterval(interval);
                return;
            }
            render(result.steps[i]);
            i++;
        }, 100);
    }

    // ========== GRAPH PAGE ==========
    initGraphPage() {
        const runBtn = document.getElementById('run-graph');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            const algo = document.getElementById('graph-algo').value;
            const input = document.getElementById('graph-input').value;
            const start = parseInt(document.getElementById('graph-start').value);

            if (!input || isNaN(start)) {
                this.showToast('Please enter valid graph and start node', 'error');
                return;
            }

            const graph = this.parseGraph(input);
            const resultsDiv = document.getElementById('graph-results');

            let result;
            switch(algo) {
                case 'bfs': result = Algorithms.graph.bfs(graph, start); break;
                case 'dfs': result = Algorithms.graph.dfs(graph, start); break;
                case 'dijkstra': result = Algorithms.graph.dijkstra(graph, start); break;
                case 'bellmanFord': 
                    const edges = this.parseEdges(input);
                    result = Algorithms.graph.bellmanFord(graph, start, edges);
                    break;
                case 'floydWarshall': result = Algorithms.graph.floydWarshall(graph); break;
                case 'prim': result = Algorithms.graph.prim(graph); break;
                case 'kruskal': 
                    const kEdges = this.parseEdges(input);
                    const vertices = Object.keys(graph).map(Number);
                    result = Algorithms.graph.kruskal(kEdges, vertices);
                    break;
                case 'topological': result = Algorithms.graph.topologicalSort(graph); break;
            }

            this.displayGraphResults(result, algo, resultsDiv);
            resultsDiv.classList.add('active');
        });
    }

    parseGraph(input) {
        const graph = {};
        const lines = input.split('\n');
        lines.forEach(line => {
            const [node, neighbors] = line.split(':');
            if (node && neighbors) {
                graph[parseInt(node.trim())] = neighbors.split(',').map(n => {
                    const parts = n.trim().split('(');
                    if (parts.length > 1) {
                        return [parseInt(parts[0]), parseInt(parts[1].replace(')', ''))];
                    }
                    return parseInt(parts[0]);
                });
            }
        });
        return graph;
    }

    parseEdges(input) {
        const edges = [];
        const lines = input.split('\n');
        lines.forEach(line => {
            const [node, neighbors] = line.split(':');
            if (node && neighbors) {
                const u = parseInt(node.trim());
                neighbors.split(',').forEach(n => {
                    const parts = n.trim().split('(');
                    if (parts.length > 1) {
                        edges.push([u, parseInt(parts[0]), parseInt(parts[1].replace(')', ''))]);
                    }
                });
            }
        });
        return edges;
    }

    displayGraphResults(result, algo, container) {
        let html = '<div class="result-box"><div class="result-label">Algorithm Result</div>';

        if (result.order) {
            html += `<div class="result-value">Traversal Order: [${result.order.join(' → ')}]</div>`;
        }
        if (result.dist) {
            html += '<div class="result-value">Distances:<br>';
            for (const [node, dist] of Object.entries(result.dist)) {
                html += `Node ${node}: ${dist === Infinity ? '∞' : dist}<br>`;
            }
            html += '</div>';
        }
        if (result.mst) {
            html += `<div class="result-value">MST Edges: ${result.mst.map(e => `${e[0]}-${e[1]}(${e[2]})`).join(', ')}</div>`;
            html += `<div class="result-value">Total Weight: ${result.totalWeight}</div>`;
        }
        if (result.hasNegativeCycle !== undefined) {
            html += `<div class="result-value">Negative Cycle: ${result.hasNegativeCycle ? 'Yes' : 'No'}</div>`;
        }

        html += '</div>';
        container.innerHTML = html;
    }

    // ========== DP PAGE ==========
    initDPPage() {
        const runBtn = document.getElementById('run-dp');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            const algo = document.getElementById('dp-algo').value;
            const resultsDiv = document.getElementById('dp-results');

            let result;
            switch(algo) {
                case 'fibonacci':
                    const n = parseInt(document.getElementById('dp-n').value);
                    result = Algorithms.dp.fibonacci(n);
                    break;
                case 'knapsack':
                    const weights = document.getElementById('dp-weights').value.split(',').map(Number);
                    const values = document.getElementById('dp-values').value.split(',').map(Number);
                    const capacity = parseInt(document.getElementById('dp-capacity').value);
                    result = Algorithms.dp.knapsack(weights, values, capacity);
                    break;
                case 'lcs':
                    const str1 = document.getElementById('dp-str1').value;
                    const str2 = document.getElementById('dp-str2').value;
                    result = Algorithms.dp.lcs(str1, str2);
                    break;
                case 'lis':
                    const arr = document.getElementById('dp-arr').value.split(',').map(Number);
                    result = Algorithms.dp.lis(arr);
                    break;
                case 'coinChange':
                    const coins = document.getElementById('dp-coins').value.split(',').map(Number);
                    const amount = parseInt(document.getElementById('dp-amount').value);
                    result = Algorithms.dp.coinChange(coins, amount);
                    break;
                case 'matrixChain':
                    const dims = document.getElementById('dp-dims').value.split(',').map(Number);
                    result = Algorithms.dp.matrixChain(dims);
                    break;
                case 'editDistance':
                    const s1 = document.getElementById('dp-s1').value;
                    const s2 = document.getElementById('dp-s2').value;
                    result = Algorithms.dp.editDistance(s1, s2);
                    break;
            }

            this.displayDPResults(result, algo, resultsDiv);
            resultsDiv.classList.add('active');
        });
    }

    displayDPResults(result, algo, container) {
        let html = '<div class="stats-grid">';
        html += `<div class="stat-card"><div class="stat-value">${result.result}</div><div class="stat-label">Result</div></div>`;
        html += `<div class="stat-card"><div class="stat-value">${result.steps.length}</div><div class="stat-label">Steps</div></div>`;
        html += '</div>';

        if (result.sequence) {
            html += `<div class="result-box"><div class="result-label">Sequence</div><div class="result-value">[${result.sequence.join(', ')}]</div></div>`;
        }
        if (result.lcs) {
            html += `<div class="result-box"><div class="result-label">LCS String</div><div class="result-value">${result.lcs}</div></div>`;
        }
        if (result.selected) {
            html += `<div class="result-box"><div class="result-label">Selected Items</div><div class="result-value">[${result.selected.join(', ')}]</div></div>`;
        }
        if (result.coins) {
            html += `<div class="result-box"><div class="result-label">Coins Used</div><div class="result-value">[${result.coins.join(', ')}]</div></div>`;
        }
        if (result.order) {
            html += `<div class="result-box"><div class="result-label">Optimal Order</div><div class="result-value">${result.order}</div></div>`;
        }

        container.innerHTML = html;
    }

    // ========== GREEDY PAGE ==========
    initGreedyPage() {
        const runBtn = document.getElementById('run-greedy');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            const algo = document.getElementById('greedy-algo').value;
            const resultsDiv = document.getElementById('greedy-results');

            let result;
            switch(algo) {
                case 'activity':
                    const activities = JSON.parse(document.getElementById('greedy-activities').value);
                    result = Algorithms.greedy.activitySelection(activities);
                    break;
                case 'fractionalKnapsack':
                    const items = JSON.parse(document.getElementById('greedy-items').value);
                    const cap = parseFloat(document.getElementById('greedy-capacity').value);
                    result = Algorithms.greedy.fractionalKnapsack(items, cap);
                    break;
                case 'jobSequencing':
                    const jobs = JSON.parse(document.getElementById('greedy-jobs').value);
                    const maxDeadline = parseInt(document.getElementById('greedy-deadline').value);
                    result = Algorithms.greedy.jobSequencing(jobs, maxDeadline);
                    break;
                case 'huffman':
                    const freq = JSON.parse(document.getElementById('greedy-freq').value);
                    result = Algorithms.greedy.huffman(freq);
                    break;
            }

            this.displayGreedyResults(result, algo, resultsDiv);
            resultsDiv.classList.add('active');
        });
    }

    displayGreedyResults(result, algo, container) {
        let html = '<div class="stats-grid">';
        html += `<div class="stat-card"><div class="stat-value">${result.result}</div><div class="stat-label">Optimal Value</div></div>`;
        html += '</div>';

        if (result.selected) {
            html += `<div class="result-box"><div class="result-label">Selected</div><div class="result-value">${JSON.stringify(result.selected, null, 2)}</div></div>`;
        }
        if (result.schedule) {
            html += `<div class="result-box"><div class="result-label">Schedule</div><div class="result-value">${JSON.stringify(result.schedule, null, 2)}</div></div>`;
        }
        if (result.result && typeof result.result === 'object') {
            html += `<div class="result-box"><div class="result-label">Huffman Codes</div><div class="result-value">${JSON.stringify(result.result, null, 2)}</div></div>`;
        }

        container.innerHTML = html;
    }

    // ========== BACKTRACKING PAGE ==========
    initBacktrackingPage() {
        const runBtn = document.getElementById('run-backtracking');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            const algo = document.getElementById('backtracking-algo').value;
            const resultsDiv = document.getElementById('backtracking-results');

            let result;
            switch(algo) {
                case 'nQueens':
                    const n = parseInt(document.getElementById('bt-n').value);
                    result = Algorithms.backtracking.nQueens(n);
                    break;
                case 'sudoku':
                    const grid = JSON.parse(document.getElementById('bt-grid').value);
                    result = Algorithms.backtracking.sudoku(grid);
                    break;
                case 'ratInMaze':
                    const maze = JSON.parse(document.getElementById('bt-maze').value);
                    result = Algorithms.backtracking.ratInMaze(maze);
                    break;
                case 'subsetSum':
                    const arr = document.getElementById('bt-arr').value.split(',').map(Number);
                    const target = parseInt(document.getElementById('bt-target').value);
                    result = Algorithms.backtracking.subsetSum(arr, target);
                    break;
                case 'hamiltonian':
                    const graph = JSON.parse(document.getElementById('bt-graph').value);
                    result = Algorithms.backtracking.hamiltonian(graph);
                    break;
            }

            this.displayBacktrackingResults(result, algo, resultsDiv);
            resultsDiv.classList.add('active');
        });
    }

    displayBacktrackingResults(result, algo, container) {
        let html = '<div class="stats-grid">';
        if (result.result !== undefined) {
            html += `<div class="stat-card"><div class="stat-value">${result.result}</div><div class="stat-label">${algo === 'nQueens' ? 'Solutions' : 'Result'}</div></div>`;
        }
        html += `<div class="stat-card"><div class="stat-value">${result.steps.length}</div><div class="stat-label">Steps</div></div>`;
        html += '</div>';

        if (result.solutions && result.solutions.length > 0) {
            html += `<div class="result-box"><div class="result-label">First Solution</div>`;
            html += `<div class="result-value"><pre style="font-family: monospace; line-height: 1.5;">${result.solutions[0].map(row => row.map(c => c ? '♛' : '·').join(' ')).join('\n')}</pre></div></div>`;
        }
        if (result.board) {
            html += `<div class="result-box"><div class="result-label">Solved Board</div>`;
            html += `<div class="result-value"><pre style="font-family: monospace; line-height: 1.5;">${result.board.map(row => row.join(' ')).join('\n')}</pre></div></div>`;
        }
        if (result.path) {
            html += `<div class="result-box"><div class="result-label">Path</div>`;
            html += `<div class="result-value"><pre style="font-family: monospace; line-height: 1.5;">${result.path.map(row => row.map(c => c ? '◆' : '○').join(' ')).join('\n')}</pre></div></div>`;
        }
        if (result.subsets) {
            html += `<div class="result-box"><div class="result-label">Subsets</div><div class="result-value">${result.subsets.map(s => `[${s.join(', ')}]`).join('<br>')}</div></div>`;
        }

        container.innerHTML = html;
    }

    // ========== MATH PAGE ==========
    initMathPage() {
        const runBtn = document.getElementById('run-math');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            const algo = document.getElementById('math-algo').value;
            const resultsDiv = document.getElementById('math-results');

            let result;
            switch(algo) {
                case 'gcd':
                    const a = parseInt(document.getElementById('math-a').value);
                    const b = parseInt(document.getElementById('math-b').value);
                    result = Algorithms.math.gcd(a, b);
                    break;
                case 'lcm':
                    const x = parseInt(document.getElementById('math-a').value);
                    const y = parseInt(document.getElementById('math-b').value);
                    result = Algorithms.math.lcm(x, y);
                    break;
                case 'isPrime':
                    const p = parseInt(document.getElementById('math-n').value);
                    result = Algorithms.math.isPrime(p);
                    break;
                case 'sieve':
                    const limit = parseInt(document.getElementById('math-n').value);
                    result = Algorithms.math.sieve(limit);
                    break;
                case 'factorial':
                    const f = parseInt(document.getElementById('math-n').value);
                    result = Algorithms.math.factorial(f);
                    break;
                case 'power':
                    const base = parseInt(document.getElementById('math-base').value);
                    const exp = parseInt(document.getElementById('math-exp').value);
                    result = Algorithms.math.power(base, exp);
                    break;
                case 'modInverse':
                    const ma = parseInt(document.getElementById('math-a').value);
                    const mm = parseInt(document.getElementById('math-m').value);
                    result = Algorithms.math.modInverse(ma, mm);
                    break;
                case 'ncr':
                    const nn = parseInt(document.getElementById('math-n').value);
                    const rr = parseInt(document.getElementById('math-r').value);
                    result = Algorithms.math.ncr(nn, rr);
                    break;
                case 'fib':
                    const fn = parseInt(document.getElementById('math-n').value);
                    result = Algorithms.math.fib(fn);
                    break;
            }

            this.displayMathResults(result, algo, resultsDiv);
            resultsDiv.classList.add('active');
        });
    }

    displayMathResults(result, algo, container) {
        let html = '<div class="stats-grid">';
        html += `<div class="stat-card"><div class="stat-value">${result.result !== undefined ? result.result : result.count}</div><div class="stat-label">Result</div></div>`;
        html += '</div>';

        if (result.formula) {
            html += `<div class="result-box"><div class="result-label">Formula</div><div class="result-value">${result.formula}</div></div>`;
        }
        if (result.error) {
            html += `<div class="result-box"><div class="result-label">Error</div><div class="result-value" style="color: var(--danger);">${result.error}</div></div>`;
        }
        if (result.steps && result.steps.length > 0) {
            html += `<div class="result-box"><div class="result-label">Steps</div><div class="terminal">${result.steps.map(s => `<div class="terminal-line">${JSON.stringify(s)}</div>`).join('')}</div></div>`;
        }

        container.innerHTML = html;
    }

    // ========== BENCHMARK PAGE ==========
    initBenchmarkPage() {
        const runBtn = document.getElementById('run-benchmark');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            const algoType = document.getElementById('bench-type').value;
            const size = parseInt(document.getElementById('bench-size').value);
            const resultsDiv = document.getElementById('benchmark-results');

            const data = this.generateRandomArray(size);
            const benchmarks = this.runBenchmark(algoType, data);

            this.displayBenchmarkResults(benchmarks, resultsDiv);
            resultsDiv.classList.add('active');
        });
    }

    generateRandomArray(size) {
        return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
    }

    runBenchmark(type, data) {
        const results = [];
        const sorted = [...data].sort((a, b) => a - b);

        if (type === 'search') {
            const target = sorted[Math.floor(sorted.length / 2)];
            const algos = ['linear', 'binary', 'jump', 'interpolation', 'exponential', 'ternary', 'fibonacci'];
            algos.forEach(algo => {
                const start = performance.now();
                Algorithms.search[algo](sorted, target);
                const end = performance.now();
                results.push({ name: algo, time: (end - start).toFixed(4) });
            });
        } else if (type === 'sort') {
            const algos = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'shell'];
            algos.forEach(algo => {
                const start = performance.now();
                Algorithms.sort[algo]([...data]);
                const end = performance.now();
                results.push({ name: algo, time: (end - start).toFixed(4) });
            });
        }

        return results.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    }

    displayBenchmarkResults(results, container) {
        const minTime = Math.min(...results.map(r => parseFloat(r.time)));

        let html = '<div class="result-box"><div class="result-label">Performance Benchmark</div>';
        html += '<table class="data-table"><thead><tr><th>Algorithm</th><th>Time (ms)</th><th>Performance</th></tr></thead><tbody>';

        results.forEach((r, i) => {
            const percentage = (parseFloat(r.time) / minTime).toFixed(2);
            const barWidth = Math.min(100, (minTime / parseFloat(r.time)) * 100);
            html += `<tr>
                <td><strong>${r.name}</strong></td>
                <td>${r.time} ms</td>
                <td>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${barWidth}%"></div></div>
                    <small style="color: var(--text-muted);">${percentage}x vs fastest</small>
                </td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        container.innerHTML = html;
    }

    // ========== COMPARE PAGE ==========
    initComparePage() {
        const runBtn = document.getElementById('run-compare');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            const algo1 = document.getElementById('compare-algo1').value;
            const algo2 = document.getElementById('compare-algo2').value;
            const type = document.getElementById('compare-type').value;
            const input = document.getElementById('compare-input').value;
            const resultsDiv = document.getElementById('compare-results');

            let data, result1, result2;
            if (type === 'search') {
                data = input.split(',').map(Number).sort((a, b) => a - b);
                const target = data[Math.floor(data.length / 2)];
                result1 = Algorithms.search[algo1](data, target);
                result2 = Algorithms.search[algo2](data, target);
            } else if (type === 'sort') {
                data = input.split(',').map(Number);
                result1 = Algorithms.sort[algo1]([...data]);
                result2 = Algorithms.sort[algo2]([...data]);
            }

            this.displayCompareResults(result1, result2, algo1, algo2, resultsDiv);
            resultsDiv.classList.add('active');
        });
    }

    displayCompareResults(r1, r2, a1, a2, container) {
        const winner = (r1.comparisons || r1.steps.length) < (r2.comparisons || r2.steps.length) ? 1 : 2;

        container.innerHTML = `
            <div class="compare-container">
                <div class="compare-card ${winner === 1 ? 'winner' : ''}">
                    <h3 style="margin-bottom: 1rem; color: var(--primary);">${a1}</h3>
                    <div class="stat-value">${r1.comparisons || r1.steps.length}</div>
                    <div class="stat-label">Operations</div>
                    ${r1.result ? `<div class="result-box" style="margin-top: 1rem;"><div class="result-label">Result</div><div class="result-value">${Array.isArray(r1.result) ? `[${r1.result.join(', ')}]` : r1.result}</div></div>` : ''}
                </div>
                <div class="compare-card ${winner === 2 ? 'winner' : ''}">
                    <h3 style="margin-bottom: 1rem; color: var(--accent);">${a2}</h3>
                    <div class="stat-value">${r2.comparisons || r2.steps.length}</div>
                    <div class="stat-label">Operations</div>
                    ${r2.result ? `<div class="result-box" style="margin-top: 1rem;"><div class="result-label">Result</div><div class="result-value">${Array.isArray(r2.result) ? `[${r2.result.join(', ')}]` : r2.result}</div></div>` : ''}
                </div>
            </div>
        `;
    }

    // ========== VISUALIZE PAGE ==========
    initVisualizePage() {
        const runBtn = document.getElementById('run-visualize');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            const type = document.getElementById('viz-type').value;
            const algo = document.getElementById('viz-algo').value;
            const input = document.getElementById('viz-input').value;
            const vizDiv = document.getElementById('visualize-canvas');

            if (type === 'sort') {
                const arr = input.split(',').map(Number);
                const result = Algorithms.sort[algo](arr);
                this.visualizeSort(result, vizDiv);
            } else if (type === 'search') {
                const arr = input.split(',').map(Number).sort((a, b) => a - b);
                const target = parseInt(document.getElementById('viz-target').value);
                const result = Algorithms.search[algo](arr, target);
                this.visualizeSearch(result, arr, vizDiv);
            }
        });
    }

    // Utility Functions
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new USSUApp();
});

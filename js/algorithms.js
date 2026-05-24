
// ============================================
// USSU ALGORITHM ANALYZER v4.0
// Core Algorithm Implementations
// github.com/issu321
// ============================================

const Algorithms = {
    // ========== SEARCH ALGORITHMS ==========
    search: {
        linear: (arr, target) => {
            const steps = [];
            for (let i = 0; i < arr.length; i++) {
                steps.push({ index: i, value: arr[i], status: 'checking' });
                if (arr[i] === target) {
                    steps.push({ index: i, value: arr[i], status: 'found' });
                    return { found: true, index: i, comparisons: i + 1, steps };
                }
            }
            return { found: false, index: -1, comparisons: arr.length, steps };
        },

        binary: (arr, target) => {
            const steps = [];
            let left = 0, right = arr.length - 1, comparisons = 0;
            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                comparisons++;
                steps.push({ left, right, mid, value: arr[mid], status: 'checking' });
                if (arr[mid] === target) {
                    steps.push({ left, right, mid, value: arr[mid], status: 'found' });
                    return { found: true, index: mid, comparisons, steps };
                }
                if (arr[mid] < target) left = mid + 1;
                else right = mid - 1;
            }
            return { found: false, index: -1, comparisons, steps };
        },

        jump: (arr, target) => {
            const steps = [];
            const n = arr.length;
            const step = Math.floor(Math.sqrt(n));
            let prev = 0, comparisons = 0;

            while (arr[Math.min(step, n) - 1] < target) {
                comparisons++;
                steps.push({ index: Math.min(step, n) - 1, value: arr[Math.min(step, n) - 1], status: 'jump' });
                prev = step;
                step += Math.floor(Math.sqrt(n));
                if (prev >= n) return { found: false, index: -1, comparisons, steps };
            }

            while (arr[prev] < target) {
                comparisons++;
                steps.push({ index: prev, value: arr[prev], status: 'checking' });
                prev++;
                if (prev === Math.min(step, n)) return { found: false, index: -1, comparisons, steps };
            }

            comparisons++;
            steps.push({ index: prev, value: arr[prev], status: 'checking' });
            if (arr[prev] === target) {
                steps.push({ index: prev, value: arr[prev], status: 'found' });
                return { found: true, index: prev, comparisons, steps };
            }
            return { found: false, index: -1, comparisons, steps };
        },

        interpolation: (arr, target) => {
            const steps = [];
            let low = 0, high = arr.length - 1, comparisons = 0;
            while (low <= high && target >= arr[low] && target <= arr[high]) {
                if (low === high) {
                    comparisons++;
                    steps.push({ low, high, pos: low, value: arr[low], status: 'checking' });
                    if (arr[low] === target) {
                        steps.push({ low, high, pos: low, value: arr[low], status: 'found' });
                        return { found: true, index: low, comparisons, steps };
                    }
                    break;
                }
                const pos = low + Math.floor(((target - arr[low]) / (arr[high] - arr[low])) * (high - low));
                comparisons++;
                steps.push({ low, high, pos, value: arr[pos], status: 'checking' });
                if (arr[pos] === target) {
                    steps.push({ low, high, pos, value: arr[pos], status: 'found' });
                    return { found: true, index: pos, comparisons, steps };
                }
                if (arr[pos] < target) low = pos + 1;
                else high = pos - 1;
            }
            return { found: false, index: -1, comparisons, steps };
        },

        exponential: (arr, target) => {
            const steps = [];
            const n = arr.length;
            if (arr[0] === target) {
                steps.push({ index: 0, value: arr[0], status: 'found' });
                return { found: true, index: 0, comparisons: 1, steps };
            }
            let i = 1, comparisons = 1;
            while (i < n && arr[i] <= target) {
                comparisons++;
                steps.push({ index: i, value: arr[i], status: 'checking' });
                i *= 2;
            }
            const result = Algorithms.search.binary(arr.slice(Math.floor(i / 2), Math.min(i, n)), target);
            if (result.found) {
                return { found: true, index: Math.floor(i / 2) + result.index, comparisons: comparisons + result.comparisons, steps: [...steps, ...result.steps] };
            }
            return { found: false, index: -1, comparisons: comparisons + result.comparisons, steps: [...steps, ...result.steps] };
        },

        ternary: (arr, target) => {
            const steps = [];
            let left = 0, right = arr.length - 1, comparisons = 0;
            while (left <= right) {
                const mid1 = left + Math.floor((right - left) / 3);
                const mid2 = right - Math.floor((right - left) / 3);
                comparisons++;
                steps.push({ left, right, mid1, mid2, value1: arr[mid1], value2: arr[mid2], status: 'checking' });
                if (arr[mid1] === target) {
                    steps.push({ left, right, mid1, mid2, value1: arr[mid1], value2: arr[mid2], status: 'found' });
                    return { found: true, index: mid1, comparisons, steps };
                }
                if (arr[mid2] === target) {
                    steps.push({ left, right, mid1, mid2, value1: arr[mid1], value2: arr[mid2], status: 'found' });
                    return { found: true, index: mid2, comparisons, steps };
                }
                if (target < arr[mid1]) right = mid1 - 1;
                else if (target > arr[mid2]) left = mid2 + 1;
                else { left = mid1 + 1; right = mid2 - 1; }
            }
            return { found: false, index: -1, comparisons, steps };
        },

        fibonacci: (arr, target) => {
            const steps = [];
            const n = arr.length;
            let fibM2 = 0, fibM1 = 1, fibM = fibM2 + fibM1;
            while (fibM < n) {
                fibM2 = fibM1;
                fibM1 = fibM;
                fibM = fibM2 + fibM1;
            }
            let offset = -1, comparisons = 0;
            while (fibM > 1) {
                const i = Math.min(offset + fibM2, n - 1);
                comparisons++;
                steps.push({ index: i, value: arr[i], status: 'checking' });
                if (arr[i] < target) {
                    fibM = fibM1;
                    fibM1 = fibM2;
                    fibM2 = fibM - fibM1;
                    offset = i;
                } else if (arr[i] > target) {
                    fibM = fibM2;
                    fibM1 = fibM1 - fibM2;
                    fibM2 = fibM - fibM1;
                } else {
                    steps.push({ index: i, value: arr[i], status: 'found' });
                    return { found: true, index: i, comparisons, steps };
                }
            }
            if (fibM1 && arr[offset + 1] === target) {
                steps.push({ index: offset + 1, value: arr[offset + 1], status: 'found' });
                return { found: true, index: offset + 1, comparisons, steps };
            }
            return { found: false, index: -1, comparisons, steps };
        }
    },

    // ========== SORT ALGORITHMS ==========
    sort: {
        bubble: (arr) => {
            const steps = [];
            const a = [...arr];
            const n = a.length;
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    steps.push({ array: [...a], comparing: [j, j + 1], sorted: n - i });
                    if (a[j] > a[j + 1]) {
                        [a[j], a[j + 1]] = [a[j + 1], a[j]];
                        steps.push({ array: [...a], swapping: [j, j + 1], sorted: n - i });
                    }
                }
            }
            steps.push({ array: [...a], sorted: n });
            return { result: a, steps, comparisons: steps.filter(s => s.comparing).length };
        },

        selection: (arr) => {
            const steps = [];
            const a = [...arr];
            const n = a.length;
            for (let i = 0; i < n - 1; i++) {
                let minIdx = i;
                for (let j = i + 1; j < n; j++) {
                    steps.push({ array: [...a], comparing: [minIdx, j], sorted: i });
                    if (a[j] < a[minIdx]) minIdx = j;
                }
                if (minIdx !== i) {
                    [a[i], a[minIdx]] = [a[minIdx], a[i]];
                    steps.push({ array: [...a], swapping: [i, minIdx], sorted: i + 1 });
                }
            }
            steps.push({ array: [...a], sorted: n });
            return { result: a, steps };
        },

        insertion: (arr) => {
            const steps = [];
            const a = [...arr];
            const n = a.length;
            for (let i = 1; i < n; i++) {
                const key = a[i];
                let j = i - 1;
                steps.push({ array: [...a], current: i, sorted: i });
                while (j >= 0 && a[j] > key) {
                    a[j + 1] = a[j];
                    steps.push({ array: [...a], shifting: [j, j + 1], sorted: i });
                    j--;
                }
                a[j + 1] = key;
                steps.push({ array: [...a], placed: j + 1, sorted: i + 1 });
            }
            steps.push({ array: [...a], sorted: n });
            return { result: a, steps };
        },

        merge: (arr) => {
            const steps = [];
            const a = [...arr];

            function merge(left, right, start) {
                const result = [];
                let i = 0, j = 0;
                while (i < left.length && j < right.length) {
                    steps.push({ array: [...a], comparing: [start + i, start + left.length + j] });
                    if (left[i] <= right[j]) {
                        result.push(left[i++]);
                    } else {
                        result.push(right[j++]);
                    }
                }
                return result.concat(left.slice(i)).concat(right.slice(j));
            }

            function sort(arr, start) {
                if (arr.length <= 1) return arr;
                const mid = Math.floor(arr.length / 2);
                const left = sort(arr.slice(0, mid), start);
                const right = sort(arr.slice(mid), start + mid);
                const merged = merge(left, right, start);
                for (let i = 0; i < merged.length; i++) {
                    a[start + i] = merged[i];
                }
                steps.push({ array: [...a], merged: [start, start + merged.length - 1] });
                return merged;
            }

            sort(a, 0);
            steps.push({ array: [...a], sorted: a.length });
            return { result: a, steps };
        },

        quick: (arr) => {
            const steps = [];
            const a = [...arr];

            function partition(low, high) {
                const pivot = a[high];
                steps.push({ array: [...a], pivot: high, range: [low, high] });
                let i = low - 1;
                for (let j = low; j < high; j++) {
                    steps.push({ array: [...a], comparing: [j, high], pivot: high });
                    if (a[j] < pivot) {
                        i++;
                        [a[i], a[j]] = [a[j], a[i]];
                        steps.push({ array: [...a], swapping: [i, j], pivot: high });
                    }
                }
                [a[i + 1], a[high]] = [a[high], a[i + 1]];
                steps.push({ array: [...a], pivot: i + 1, placed: true });
                return i + 1;
            }

            function sort(low, high) {
                if (low < high) {
                    const pi = partition(low, high);
                    sort(low, pi - 1);
                    sort(pi + 1, high);
                }
            }

            sort(0, a.length - 1);
            steps.push({ array: [...a], sorted: a.length });
            return { result: a, steps };
        },

        heap: (arr) => {
            const steps = [];
            const a = [...arr];
            const n = a.length;

            function heapify(i, heapSize) {
                let largest = i;
                const left = 2 * i + 1;
                const right = 2 * i + 2;
                if (left < heapSize) {
                    steps.push({ array: [...a], comparing: [largest, left], heapSize });
                    if (a[left] > a[largest]) largest = left;
                }
                if (right < heapSize) {
                    steps.push({ array: [...a], comparing: [largest, right], heapSize });
                    if (a[right] > a[largest]) largest = right;
                }
                if (largest !== i) {
                    [a[i], a[largest]] = [a[largest], a[i]];
                    steps.push({ array: [...a], swapping: [i, largest], heapSize });
                    heapify(largest, heapSize);
                }
            }

            for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
                heapify(i, n);
            }
            for (let i = n - 1; i > 0; i--) {
                [a[0], a[i]] = [a[i], a[0]];
                steps.push({ array: [...a], swapping: [0, i], sorted: n - i });
                heapify(0, i);
            }
            steps.push({ array: [...a], sorted: n });
            return { result: a, steps };
        },

        counting: (arr) => {
            const steps = [];
            const max = Math.max(...arr);
            const min = Math.min(...arr);
            const count = new Array(max - min + 1).fill(0);
            const output = new Array(arr.length);

            for (let i = 0; i < arr.length; i++) {
                count[arr[i] - min]++;
                steps.push({ array: [...arr], count: [...count], current: i });
            }
            for (let i = 1; i < count.length; i++) {
                count[i] += count[i - 1];
            }
            for (let i = arr.length - 1; i >= 0; i--) {
                output[count[arr[i] - min] - 1] = arr[i];
                count[arr[i] - min]--;
                steps.push({ array: [...arr], output: [...output], current: i });
            }
            steps.push({ array: [...output], sorted: output.length });
            return { result: output, steps };
        },

        radix: (arr) => {
            const steps = [];
            const a = [...arr];
            const max = Math.max(...a);

            function countingSort(exp) {
                const output = new Array(a.length).fill(0);
                const count = new Array(10).fill(0);
                for (let i = 0; i < a.length; i++) {
                    const digit = Math.floor(a[i] / exp) % 10;
                    count[digit]++;
                }
                for (let i = 1; i < 10; i++) count[i] += count[i - 1];
                for (let i = a.length - 1; i >= 0; i--) {
                    const digit = Math.floor(a[i] / exp) % 10;
                    output[count[digit] - 1] = a[i];
                    count[digit]--;
                }
                for (let i = 0; i < a.length; i++) a[i] = output[i];
                steps.push({ array: [...a], exp });
            }

            for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
                countingSort(exp);
            }
            steps.push({ array: [...a], sorted: a.length });
            return { result: a, steps };
        },

        bucket: (arr) => {
            const steps = [];
            const n = arr.length;
            const max = Math.max(...arr);
            const min = Math.min(...arr);
            const bucketCount = Math.floor(Math.sqrt(n)) || 1;
            const buckets = Array.from({ length: bucketCount }, () => []);

            for (let i = 0; i < n; i++) {
                const idx = Math.floor((arr[i] - min) / (max - min + 1) * bucketCount);
                buckets[idx].push(arr[i]);
                steps.push({ array: [...arr], buckets: buckets.map(b => [...b]), current: i });
            }

            for (let i = 0; i < bucketCount; i++) {
                buckets[i].sort((a, b) => a - b);
                steps.push({ array: [...arr], buckets: buckets.map(b => [...b]), sortedBucket: i });
            }

            let index = 0;
            const result = [];
            for (let i = 0; i < bucketCount; i++) {
                for (let j = 0; j < buckets[i].length; j++) {
                    result[index++] = buckets[i][j];
                }
            }
            steps.push({ array: [...result], sorted: result.length });
            return { result, steps };
        },

        shell: (arr) => {
            const steps = [];
            const a = [...arr];
            const n = a.length;
            for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
                for (let i = gap; i < n; i++) {
                    const temp = a[i];
                    let j = i;
                    steps.push({ array: [...a], gap, current: i });
                    while (j >= gap && a[j - gap] > temp) {
                        a[j] = a[j - gap];
                        steps.push({ array: [...a], gap, shifting: [j - gap, j] });
                        j -= gap;
                    }
                    a[j] = temp;
                    steps.push({ array: [...a], gap, placed: j });
                }
            }
            steps.push({ array: [...a], sorted: n });
            return { result: a, steps };
        }
    },

    // ========== GRAPH ALGORITHMS ==========
    graph: {
        bfs: (graph, start) => {
            const visited = new Set();
            const queue = [start];
            const order = [];
            const steps = [];
            visited.add(start);

            while (queue.length > 0) {
                const node = queue.shift();
                order.push(node);
                steps.push({ current: node, visited: [...visited], queue: [...queue], order: [...order] });
                for (const neighbor of graph[node] || []) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                        steps.push({ edge: [node, neighbor], visited: [...visited], queue: [...queue] });
                    }
                }
            }
            return { order, steps, visited: [...visited] };
        },

        dfs: (graph, start) => {
            const visited = new Set();
            const order = [];
            const steps = [];

            function visit(node) {
                visited.add(node);
                order.push(node);
                steps.push({ current: node, visited: [...visited], order: [...order] });
                for (const neighbor of graph[node] || []) {
                    if (!visited.has(neighbor)) {
                        steps.push({ edge: [node, neighbor], visited: [...visited] });
                        visit(neighbor);
                    }
                }
            }

            visit(start);
            return { order, steps, visited: [...visited] };
        },

        dijkstra: (graph, start) => {
            const dist = {};
            const prev = {};
            const unvisited = new Set(Object.keys(graph).map(Number));
            const steps = [];

            for (const node in graph) {
                dist[node] = Infinity;
                prev[node] = null;
            }
            dist[start] = 0;

            while (unvisited.size > 0) {
                let current = null;
                let minDist = Infinity;
                for (const node of unvisited) {
                    if (dist[node] < minDist) {
                        minDist = dist[node];
                        current = node;
                    }
                }

                if (current === null || dist[current] === Infinity) break;
                unvisited.delete(current);
                steps.push({ current, dist: {...dist}, unvisited: [...unvisited] });

                for (const [neighbor, weight] of graph[current] || []) {
                    const alt = dist[current] + weight;
                    if (alt < dist[neighbor]) {
                        dist[neighbor] = alt;
                        prev[neighbor] = current;
                        steps.push({ relax: [current, neighbor], dist: {...dist} });
                    }
                }
            }

            return { dist, prev, steps };
        },

        bellmanFord: (graph, start, edges) => {
            const dist = {};
            const prev = {};
            const steps = [];
            const vertices = Object.keys(graph).map(Number);

            for (const v of vertices) {
                dist[v] = Infinity;
                prev[v] = null;
            }
            dist[start] = 0;

            for (let i = 0; i < vertices.length - 1; i++) {
                let updated = false;
                for (const [u, v, w] of edges) {
                    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                        dist[v] = dist[u] + w;
                        prev[v] = u;
                        updated = true;
                        steps.push({ edge: [u, v], weight: w, dist: {...dist}, iteration: i });
                    }
                }
                if (!updated) break;
            }

            for (const [u, v, w] of edges) {
                if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                    return { dist, prev, steps, hasNegativeCycle: true };
                }
            }

            return { dist, prev, steps, hasNegativeCycle: false };
        },

        floydWarshall: (graph) => {
            const vertices = Object.keys(graph).map(Number);
            const n = vertices.length;
            const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
            const next = Array.from({ length: n }, () => Array(n).fill(null));
            const steps = [];

            for (let i = 0; i < n; i++) {
                dist[i][i] = 0;
                for (const [j, w] of graph[vertices[i]] || []) {
                    const idx = vertices.indexOf(j);
                    if (idx !== -1) {
                        dist[i][idx] = w;
                        next[i][idx] = j;
                    }
                }
            }

            for (let k = 0; k < n; k++) {
                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < n; j++) {
                        if (dist[i][k] + dist[k][j] < dist[i][j]) {
                            dist[i][j] = dist[i][k] + dist[k][j];
                            next[i][j] = next[i][k];
                        }
                    }
                }
                steps.push({ k, dist: dist.map(row => [...row]) });
            }

            return { dist, next, steps, vertices };
        },

        prim: (graph) => {
            const vertices = Object.keys(graph).map(Number);
            const mst = [];
            const visited = new Set();
            const edges = [];
            const steps = [];

            visited.add(vertices[0]);
            steps.push({ visited: [...visited], mst: [...mst] });

            for (const [v, w] of graph[vertices[0]] || []) {
                edges.push([vertices[0], v, w]);
            }

            while (edges.length > 0 && visited.size < vertices.length) {
                edges.sort((a, b) => a[2] - b[2]);
                const [u, v, w] = edges.shift();

                if (!visited.has(v)) {
                    visited.add(v);
                    mst.push([u, v, w]);
                    steps.push({ edge: [u, v, w], visited: [...visited], mst: [...mst] });

                    for (const [next, weight] of graph[v] || []) {
                        if (!visited.has(next)) {
                            edges.push([v, next, weight]);
                        }
                    }
                }
            }

            return { mst, steps, totalWeight: mst.reduce((sum, [, , w]) => sum + w, 0) };
        },

        kruskal: (edges, vertices) => {
            const parent = {};
            const rank = {};
            const mst = [];
            const steps = [];

            for (const v of vertices) {
                parent[v] = v;
                rank[v] = 0;
            }

            function find(v) {
                if (parent[v] !== v) parent[v] = find(parent[v]);
                return parent[v];
            }

            function union(u, v) {
                const rootU = find(u);
                const rootV = find(v);
                if (rootU !== rootV) {
                    if (rank[rootU] < rank[rootV]) parent[rootU] = rootV;
                    else if (rank[rootU] > rank[rootV]) parent[rootV] = rootU;
                    else {
                        parent[rootV] = rootU;
                        rank[rootU]++;
                    }
                }
            }

            const sortedEdges = [...edges].sort((a, b) => a[2] - b[2]);

            for (const [u, v, w] of sortedEdges) {
                steps.push({ edge: [u, v, w], checking: true });
                if (find(u) !== find(v)) {
                    union(u, v);
                    mst.push([u, v, w]);
                    steps.push({ edge: [u, v, w], added: true, mst: [...mst] });
                }
            }

            return { mst, steps, totalWeight: mst.reduce((sum, [, , w]) => sum + w, 0) };
        },

        topologicalSort: (graph) => {
            const inDegree = {};
            const vertices = Object.keys(graph).map(Number);

            for (const v of vertices) inDegree[v] = 0;
            for (const v of vertices) {
                for (const neighbor of graph[v] || []) {
                    inDegree[neighbor] = (inDegree[neighbor] || 0) + 1;
                }
            }

            const queue = vertices.filter(v => inDegree[v] === 0);
            const order = [];
            const steps = [];

            while (queue.length > 0) {
                const node = queue.shift();
                order.push(node);
                steps.push({ current: node, order: [...order], inDegree: {...inDegree} });

                for (const neighbor of graph[node] || []) {
                    inDegree[neighbor]--;
                    if (inDegree[neighbor] === 0) queue.push(neighbor);
                }
            }

            const hasCycle = order.length !== vertices.length;
            return { order, hasCycle, steps };
        }
    },

    // ========== DYNAMIC PROGRAMMING ==========
    dp: {
        fibonacci: (n) => {
            const steps = [];
            if (n <= 1) return { result: n, steps: [{ n, result: n }] };
            const dp = [0, 1];
            steps.push({ n: 0, value: 0 });
            steps.push({ n: 1, value: 1 });
            for (let i = 2; i <= n; i++) {
                dp[i] = dp[i - 1] + dp[i - 2];
                steps.push({ n: i, value: dp[i], formula: `${dp[i-1]} + ${dp[i-2]}` });
            }
            return { result: dp[n], steps, sequence: dp };
        },

        knapsack: (weights, values, capacity) => {
            const n = weights.length;
            const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
            const steps = [];

            for (let i = 1; i <= n; i++) {
                for (let w = 0; w <= capacity; w++) {
                    if (weights[i - 1] <= w) {
                        dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
                    } else {
                        dp[i][w] = dp[i - 1][w];
                    }
                    steps.push({ i, w, value: dp[i][w], table: dp.map(row => [...row]) });
                }
            }

            const selected = [];
            let w = capacity;
            for (let i = n; i > 0 && w > 0; i--) {
                if (dp[i][w] !== dp[i - 1][w]) {
                    selected.push(i - 1);
                    w -= weights[i - 1];
                }
            }

            return { result: dp[n][capacity], table: dp, selected, steps };
        },

        lcs: (str1, str2) => {
            const m = str1.length, n = str2.length;
            const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
            const steps = [];

            for (let i = 1; i <= m; i++) {
                for (let j = 1; j <= n; j++) {
                    if (str1[i - 1] === str2[j - 1]) {
                        dp[i][j] = dp[i - 1][j - 1] + 1;
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    }
                    steps.push({ i, j, value: dp[i][j], table: dp.map(row => [...row]) });
                }
            }

            let lcs = '';
            let i = m, j = n;
            while (i > 0 && j > 0) {
                if (str1[i - 1] === str2[j - 1]) {
                    lcs = str1[i - 1] + lcs;
                    i--; j--;
                } else if (dp[i - 1][j] > dp[i][j - 1]) {
                    i--;
                } else {
                    j--;
                }
            }

            return { result: dp[m][n], lcs, table: dp, steps };
        },

        lis: (arr) => {
            const n = arr.length;
            const dp = new Array(n).fill(1);
            const prev = new Array(n).fill(-1);
            const steps = [];

            for (let i = 1; i < n; i++) {
                for (let j = 0; j < i; j++) {
                    if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
                        dp[i] = dp[j] + 1;
                        prev[i] = j;
                    }
                }
                steps.push({ index: i, value: arr[i], length: dp[i], dp: [...dp] });
            }

            let maxLen = 0, maxIdx = 0;
            for (let i = 0; i < n; i++) {
                if (dp[i] > maxLen) {
                    maxLen = dp[i];
                    maxIdx = i;
                }
            }

            const sequence = [];
            let idx = maxIdx;
            while (idx !== -1) {
                sequence.unshift(arr[idx]);
                idx = prev[idx];
            }

            return { result: maxLen, sequence, dp, steps };
        },

        coinChange: (coins, amount) => {
            const dp = new Array(amount + 1).fill(Infinity);
            const used = new Array(amount + 1).fill(-1);
            const steps = [];
            dp[0] = 0;

            for (let i = 1; i <= amount; i++) {
                for (const coin of coins) {
                    if (coin <= i && dp[i - coin] + 1 < dp[i]) {
                        dp[i] = dp[i - coin] + 1;
                        used[i] = coin;
                    }
                }
                steps.push({ amount: i, minCoins: dp[i], dp: [...dp] });
            }

            if (dp[amount] === Infinity) return { result: -1, coins: [], dp, steps };

            const resultCoins = [];
            let remaining = amount;
            while (remaining > 0) {
                resultCoins.push(used[remaining]);
                remaining -= used[remaining];
            }

            return { result: dp[amount], coins: resultCoins, dp, steps };
        },

        matrixChain: (dims) => {
            const n = dims.length - 1;
            const dp = Array.from({ length: n }, () => Array(n).fill(0));
            const split = Array.from({ length: n }, () => Array(n).fill(0));
            const steps = [];

            for (let len = 2; len <= n; len++) {
                for (let i = 0; i <= n - len; i++) {
                    const j = i + len - 1;
                    dp[i][j] = Infinity;
                    for (let k = i; k < j; k++) {
                        const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
                        if (cost < dp[i][j]) {
                            dp[i][j] = cost;
                            split[i][j] = k;
                        }
                    }
                    steps.push({ i, j, cost: dp[i][j], split: split[i][j], table: dp.map(row => [...row]) });
                }
            }

            function getOrder(i, j) {
                if (i === j) return `A${i + 1}`;
                const k = split[i][j];
                return `(${getOrder(i, k)} x ${getOrder(k + 1, j)})`;
            }

            return { result: dp[0][n - 1], order: getOrder(0, n - 1), table: dp, split, steps };
        },

        editDistance: (str1, str2) => {
            const m = str1.length, n = str2.length;
            const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
            const steps = [];

            for (let i = 0; i <= m; i++) dp[i][0] = i;
            for (let j = 0; j <= n; j++) dp[0][j] = j;

            for (let i = 1; i <= m; i++) {
                for (let j = 1; j <= n; j++) {
                    if (str1[i - 1] === str2[j - 1]) {
                        dp[i][j] = dp[i - 1][j - 1];
                    } else {
                        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
                    }
                    steps.push({ i, j, value: dp[i][j], table: dp.map(row => [...row]) });
                }
            }

            return { result: dp[m][n], table: dp, steps };
        }
    },

    // ========== GREEDY ALGORITHMS ==========
    greedy: {
        activitySelection: (activities) => {
            const sorted = [...activities].sort((a, b) => a.finish - b.finish);
            const selected = [sorted[0]];
            const steps = [{ current: sorted[0], selected: [...selected] }];
            let lastFinish = sorted[0].finish;

            for (let i = 1; i < sorted.length; i++) {
                steps.push({ checking: sorted[i], lastFinish });
                if (sorted[i].start >= lastFinish) {
                    selected.push(sorted[i]);
                    lastFinish = sorted[i].finish;
                    steps.push({ added: sorted[i], selected: [...selected] });
                }
            }

            return { result: selected.length, selected, steps };
        },

        fractionalKnapsack: (items, capacity) => {
            const sorted = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
            let remaining = capacity;
            const selected = [];
            const steps = [];
            let totalValue = 0;

            for (const item of sorted) {
                steps.push({ checking: item, remaining });
                if (remaining >= item.weight) {
                    selected.push({ ...item, fraction: 1 });
                    totalValue += item.value;
                    remaining -= item.weight;
                    steps.push({ added: item, fraction: 1, remaining, totalValue });
                } else {
                    const fraction = remaining / item.weight;
                    if (fraction > 0) {
                        selected.push({ ...item, fraction });
                        totalValue += item.value * fraction;
                        remaining = 0;
                        steps.push({ added: item, fraction, remaining, totalValue });
                    }
                    break;
                }
            }

            return { result: totalValue, selected, steps };
        },

        jobSequencing: (jobs, maxDeadline) => {
            const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
            const result = new Array(maxDeadline).fill(null);
            const steps = [];
            let totalProfit = 0;

            for (const job of sorted) {
                steps.push({ checking: job });
                for (let i = Math.min(job.deadline, maxDeadline) - 1; i >= 0; i--) {
                    if (result[i] === null) {
                        result[i] = job;
                        totalProfit += job.profit;
                        steps.push({ placed: job, slot: i, schedule: [...result] });
                        break;
                    }
                }
            }

            return { result: totalProfit, schedule: result.filter(j => j !== null), steps };
        },

        huffman: (freq) => {
            const nodes = Object.entries(freq).map(([char, f]) => ({ char, freq: f, left: null, right: null }));
            const steps = [];

            while (nodes.length > 1) {
                nodes.sort((a, b) => a.freq - b.freq);
                const left = nodes.shift();
                const right = nodes.shift();
                const parent = { char: null, freq: left.freq + right.freq, left, right };
                nodes.push(parent);
                steps.push({ merged: [left, right], parent, nodes: nodes.map(n => ({ char: n.char, freq: n.freq })) });
            }

            const codes = {};
            function traverse(node, code = '') {
                if (!node) return;
                if (node.char !== null) {
                    codes[node.char] = code || '0';
                }
                traverse(node.left, code + '0');
                traverse(node.right, code + '1');
            }
            traverse(nodes[0]);

            return { result: codes, tree: nodes[0], steps };
        }
    },

    // ========== BACKTRACKING ALGORITHMS ==========
    backtracking: {
        nQueens: (n) => {
            const board = Array.from({ length: n }, () => Array(n).fill(0));
            const solutions = [];
            const steps = [];

            function isSafe(row, col) {
                for (let i = 0; i < col; i++) if (board[row][i]) return false;
                for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;
                for (let i = row, j = col; i < n && j >= 0; i++, j--) if (board[i][j]) return false;
                return true;
            }

            function solve(col) {
                if (col >= n) {
                    solutions.push(board.map(row => [...row]));
                    steps.push({ solution: board.map(row => [...row]) });
                    return;
                }
                for (let row = 0; row < n; row++) {
                    steps.push({ trying: [row, col], board: board.map(r => [...r]) });
                    if (isSafe(row, col)) {
                        board[row][col] = 1;
                        steps.push({ placed: [row, col], board: board.map(r => [...r]) });
                        solve(col + 1);
                        board[row][col] = 0;
                        steps.push({ backtrack: [row, col], board: board.map(r => [...r]) });
                    }
                }
            }

            solve(0);
            return { result: solutions.length, solutions, steps };
        },

        sudoku: (grid) => {
            const board = grid.map(row => [...row]);
            const steps = [];
            const n = 9;

            function isSafe(row, col, num) {
                for (let x = 0; x < n; x++) if (board[row][x] === num) return false;
                for (let x = 0; x < n; x++) if (board[x][col] === num) return false;
                const startRow = row - row % 3, startCol = col - col % 3;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i + startRow][j + startCol] === num) return false;
                    }
                }
                return true;
            }

            function solve() {
                for (let row = 0; row < n; row++) {
                    for (let col = 0; col < n; col++) {
                        if (board[row][col] === 0) {
                            for (let num = 1; num <= 9; num++) {
                                steps.push({ trying: [row, col], num, board: board.map(r => [...r]) });
                                if (isSafe(row, col, num)) {
                                    board[row][col] = num;
                                    steps.push({ placed: [row, col], num, board: board.map(r => [...r]) });
                                    if (solve()) return true;
                                    board[row][col] = 0;
                                    steps.push({ backtrack: [row, col], board: board.map(r => [...r]) });
                                }
                            }
                            return false;
                        }
                    }
                }
                return true;
            }

            const solved = solve();
            return { result: solved, board, steps };
        },

        ratInMaze: (maze) => {
            const n = maze.length;
            const solution = Array.from({ length: n }, () => Array(n).fill(0));
            const steps = [];

            function solve(x, y) {
                if (x === n - 1 && y === n - 1 && maze[x][y] === 1) {
                    solution[x][y] = 1;
                    steps.push({ solution: solution.map(r => [...r]), reached: true });
                    return true;
                }
                if (x >= 0 && y >= 0 && x < n && y < n && maze[x][y] === 1 && solution[x][y] === 0) {
                    solution[x][y] = 1;
                    steps.push({ trying: [x, y], solution: solution.map(r => [...r]) });
                    if (solve(x + 1, y)) return true;
                    if (solve(x, y + 1)) return true;
                    solution[x][y] = 0;
                    steps.push({ backtrack: [x, y], solution: solution.map(r => [...r]) });
                }
                return false;
            }

            const solved = solve(0, 0);
            return { result: solved, path: solution, steps };
        },

        subsetSum: (arr, target) => {
            const subsets = [];
            const steps = [];
            const n = arr.length;

            function find(index, current, sum) {
                steps.push({ index, current: [...current], sum });
                if (sum === target) {
                    subsets.push([...current]);
                    steps.push({ found: [...current], sum });
                    return;
                }
                if (index >= n || sum > target) return;

                current.push(arr[index]);
                find(index + 1, current, sum + arr[index]);
                current.pop();
                find(index + 1, current, sum);
            }

            find(0, [], 0);
            return { result: subsets.length, subsets, steps };
        },

        hamiltonian: (graph) => {
            const vertices = Object.keys(graph).map(Number);
            const n = vertices.length;
            const path = new Array(n).fill(-1);
            const steps = [];

            function isSafe(v, pos) {
                if (!graph[path[pos - 1]].includes(v)) return false;
                for (let i = 0; i < pos; i++) if (path[i] === v) return false;
                return true;
            }

            function solve(pos) {
                if (pos === n) {
                    if (graph[path[n - 1]].includes(path[0])) {
                        steps.push({ path: [...path], cycle: true });
                        return true;
                    }
                    return false;
                }
                for (const v of vertices) {
                    if (isSafe(v, pos)) {
                        path[pos] = v;
                        steps.push({ trying: v, pos, path: [...path] });
                        if (solve(pos + 1)) return true;
                        path[pos] = -1;
                        steps.push({ backtrack: v, pos, path: [...path] });
                    }
                }
                return false;
            }

            path[0] = vertices[0];
            const solved = solve(1);
            return { result: solved, path: solved ? [...path, path[0]] : [], steps };
        }
    },

    // ========== MATH TOOLS ==========
    math: {
        gcd: (a, b) => {
            const steps = [];
            a = Math.abs(a); b = Math.abs(b);
            while (b !== 0) {
                steps.push({ a, b, remainder: a % b });
                [a, b] = [b, a % b];
            }
            steps.push({ result: a });
            return { result: a, steps };
        },

        lcm: (a, b) => {
            const gcd = Algorithms.math.gcd(a, b).result;
            const result = Math.abs(a * b) / gcd;
            return { result, formula: `|${a} × ${b}| / ${gcd} = ${result}` };
        },

        isPrime: (n) => {
            if (n < 2) return { result: false };
            if (n === 2) return { result: true };
            if (n % 2 === 0) return { result: false };
            for (let i = 3; i <= Math.sqrt(n); i += 2) {
                if (n % i === 0) return { result: false, divisor: i };
            }
            return { result: true };
        },

        sieve: (n) => {
            const isPrime = new Array(n + 1).fill(true);
            isPrime[0] = isPrime[1] = false;
            const steps = [];

            for (let i = 2; i * i <= n; i++) {
                if (isPrime[i]) {
                    steps.push({ prime: i });
                    for (let j = i * i; j <= n; j += i) {
                        isPrime[j] = false;
                        steps.push({ mark: j, prime: i });
                    }
                }
            }

            const primes = [];
            for (let i = 2; i <= n; i++) if (isPrime[i]) primes.push(i);
            return { result: primes, count: primes.length, steps };
        },

        factorial: (n) => {
            if (n < 0) return { result: null, error: 'Negative input' };
            if (n === 0 || n === 1) return { result: 1 };
            let result = 1;
            const steps = [{ i: 1, result: 1 }];
            for (let i = 2; i <= n; i++) {
                result *= i;
                steps.push({ i, result });
            }
            return { result, steps };
        },

        power: (base, exp) => {
            const steps = [];
            let result = 1;
            let b = base, e = exp;
            while (e > 0) {
                steps.push({ base: b, exp: e, result });
                if (e % 2 === 1) result *= b;
                b *= b;
                e = Math.floor(e / 2);
            }
            steps.push({ result });
            return { result, steps };
        },

        modInverse: (a, m) => {
            const steps = [];
            function extendedGcd(a, b) {
                if (b === 0) return { gcd: a, x: 1, y: 0 };
                const { gcd, x: x1, y: y1 } = extendedGcd(b, a % b);
                const x = y1;
                const y = x1 - Math.floor(a / b) * y1;
                steps.push({ a, b, x, y, gcd });
                return { gcd, x, y };
            }
            const { gcd, x } = extendedGcd(a, m);
            if (gcd !== 1) return { result: null, error: 'Inverse does not exist' };
            const result = ((x % m) + m) % m;
            return { result, steps };
        },

        ncr: (n, r) => {
            if (r > n) return { result: 0 };
            if (r === 0 || r === n) return { result: 1 };
            r = Math.min(r, n - r);
            let result = 1;
            const steps = [];
            for (let i = 0; i < r; i++) {
                result = result * (n - i) / (i + 1);
                steps.push({ i, numerator: n - i, denominator: i + 1, result });
            }
            return { result: Math.round(result), steps };
        },

        fib: (n) => {
            return Algorithms.dp.fibonacci(n);
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Algorithms;
}

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=06b6d4&height=200&section=header&text=USSU%20ALGORITHM%20ANALYZER&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=v4.0%20Ultra%20Pro%20Max%20Streamlit%20Edition&descAlignY=55&descSize=20" />
</p>

<div align="center">

  [![Python](https://img.shields.io/badge/Python-3.10%2B-06b6d4?style=for-the-badge&logo=python&logoColor=white&labelColor=1e293b)](https://python.org)
  [![Streamlit](https://img.shields.io/badge/Streamlit-1.32%2B-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white&labelColor=1e293b)](https://streamlit.io)
  [![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20Kali-8b5cf6?style=for-the-badge&logo=linux&logoColor=white&labelColor=1e293b)](https://kali.org)
  [![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=1e293b)](LICENSE)
  [![Stars](https://img.shields.io/github/stars/issu321/algorithm-analyzer?color=f59e0b&style=for-the-badge&logo=github&labelColor=1e293b)](https://github.com/issu321)

</div>

<p align="center">
  <em><b>⚡ The most advanced algorithm analysis suite ever built — now with immersive Streamlit UI.</b></em><br>
  <sub>Graph Theory · Searching · Sorting · DP · Greedy · Backtracking · ADA · Speed Benchmarking · Futuristic Cyberpunk UI</sub>
</p>

---

## 🌌 Vision

> *"I didn't just build an algorithm visualizer. I built a **command center** for computational thinking."*
> — **Ussu** ([@issu321](https://github.com/issu321))

**USSU Algorithm Analyzer v4.0** is a **cyberpunk-themed**, fully interactive web application that transforms dry algorithm theory into an immersive, visual, and metrics-driven experience. Designed for **students, researchers, CTF players, and engineers** who refuse to use boring tools.

---

## ✨ Feature Matrix

| Category | Algorithms | Complexity Tracking | Speed Profile | Visualization |
| :----------------------- | :--------------------------------------------------------------------------------------- | :-----------------: | :-----------: | :-----------: |
| **Graph Traversal** | BFS, DFS (Iter & Rec) | ✅ | ✅ | ✅ |
| **Shortest Path** | Dijkstra, Bellman-Ford, Floyd-Warshall, A* | ✅ | ✅ | ✅ |
| **MST** | Prim's, Kruskal's (Union-Find) | ✅ | ✅ | ✅ |
| **DAG Analysis** | Longest Path, Topological Sort (Kahn) | ✅ | ✅ | ✅ |
| **SCC** | Kosaraju's Algorithm | ✅ | ✅ | ✅ |
| **Searching** | Linear, Binary, Jump, Interpolation, Exponential, Ternary, Fibonacci | ✅ | ✅ | ❌ |
| **Sorting** | Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Cocktail, Comb, Counting, Radix, Bucket, Timsort | ✅ | ✅ | ✅ |
| **Dynamic Programming** | 0/1 Knapsack, Unbounded Knapsack, LCS, Edit Distance, Matrix Chain, Coin Change, LIS | ✅ | ✅ | ✅ |
| **Greedy** | Activity Selection, Fractional Knapsack, Huffman Coding, Job Sequencing, Min Coins | ✅ | ✅ | ❌ |
| **Backtracking** | N-Queens, Sudoku, Subset Sum, Graph Coloring, Hamiltonian Cycle | ✅ | ✅ | ✅ |
| **Math Tools** | Factorial, Fibonacci, GCD, Extended GCD, Primes, Sieve, Matrix Multiply, Fast Power, Modular Power, Tower of Hanoi, Permutations | ✅ | ✅ | ✅ |
| **ADA Theory** | Master Theorem, Amortized Analysis, NP-Completeness, Asymptotic Notation, Paradigm Comparison | ✅ | ❌ | ✅ |
| **Benchmarks** | Cross-size performance suites with statistical profiling | ✅ | ✅ | ✅ |

---

## 🎨 UI Philosophy

Designed with the **50-30-20 Futuristic Color Rule**:
- **50% Deep Slate** (`#0f172a`, `#1e293b`) — Primary backgrounds
- **30% Charcoal Gray** (`#334155`, `#475569`) — Secondary elements
- **20% Vibrant Cyan** (`#06b6d4`, `#22d3ee`) — Accents and highlights

Custom **Orbitron** and **Rajdhani** fonts create a cyberpunk terminal aesthetic. Every metric card glows with subtle box-shadows. All plots use dark themes with neon color palettes.

---

## 🚀 Quick Start

### Linux / Kali / macOS
```bash
git clone https://github.com/issu321/algorithm-analyzer.git
cd algorithm-analyzer
chmod +x install.sh start.sh
./install.sh
./start.sh
```

### Windows 11
```powershell
git clone https://github.com/issu321/algorithm-analyzer.git
cd algorithm-analyzer
install.bat
start.bat
```

### Manual (any platform)
```bash
pip install -r requirements.txt
streamlit run app.py
```

Then open **http://localhost:8501** in your browser.

---

## 📁 Project Structure

```
ussu-algorithm-analyzer-v4/
├── app.py                    # Main entrypoint (st.navigation)
├── requirements.txt          # Dependencies
├── install.sh                # Linux/Kali installer
├── start.sh                  # Linux/Kali startup (venv-safe)
├── start.bat                 # Windows startup
├── .streamlit/
│   └── config.toml           # Cyberpunk theme config
├── utils/
│   ├── core.py               # Graph, Colors, profiling decorators
│   ├── ui.py                 # Streamlit UI components
│   └── viz.py                # Matplotlib cyberpunk plots
├── algorithms/
│   ├── search.py             # 8 searching algorithms
│   ├── sort.py               # 13 sorting algorithms
│   ├── graph.py              # 10 graph algorithms
│   ├── dp.py                 # 7 dynamic programming algorithms
│   ├── greedy.py             # 5 greedy algorithms
│   ├── backtrack.py          # 5 backtracking algorithms
│   ├── math_tools.py         # 12 mathematical utilities
│   ├── ada.py                # ADA theory tools
│   └── benchmark.py          # Benchmark & profiling suite
└── pages/
    ├── home.py               # Dashboard & feature overview
    ├── graph.py              # Interactive graph algorithms
    ├── search.py             # Searching with benchmarks
    ├── sort.py               # Sorting with step viz
    ├── dp.py                 # DP with table visualization
    ├── greedy.py             # Greedy algorithms
    ├── backtrack.py          # Backtracking with visual puzzles
    ├── ada.py                # Master theorem, NP theory
    ├── math.py               # Math calculator
    ├── benchmark.py          # Cross-size benchmarks
    └── compare.py            # Head-to-head comparisons
```

---

## 🔧 System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Python | 3.10 | 3.12+ |
| RAM | 2 GB | 4 GB |
| OS | Any | Kali Linux / Windows 11 |
| Browser | Chrome 100+ | Latest Chrome/Firefox |

---

## 🛡️ Kali Linux Compatibility

The `start.sh` script is specifically designed to handle non-interactive shell environments where `source venv/bin/activate` fails to update PATH:

```bash
# Uses full path to venv python or falls back to python -m streamlit
if [ -f "$VENV_STREAMLIT" ]; then
    STREAMLIT_CMD="$VENV_STREAMLIT"
elif [ -f "$VENV_PYTHON" ]; then
    STREAMLIT_CMD="$VENV_PYTHON -m streamlit"
else
    STREAMLIT_CMD="python3 -m streamlit"
fi
```

This fixes the classic "streamlit: command not found" error on Kali.

---

## 📊 Performance Profiling

Every algorithm execution captures:
- **Execution Time** (ms) via `time.perf_counter()`
- **Memory Usage** (KB) via `tracemalloc`
- **Operation Counters**: comparisons, swaps, array accesses, recursions, iterations
- **Algorithm Metrics**: time complexity, space complexity, stability

Benchmark suite supports:
- Cross-size scaling analysis
- Statistical profiling (min, max, mean, median, std dev)
- Custom algorithm profiling with configurable warmup and trials
- Distribution histograms

---

## 🧪 Testing

Run a quick smoke test:
```bash
python -c "from algorithms.search import SearchingAlgorithms; s = SearchingAlgorithms(); print(s.binary_search_iterative([1,2,3,4,5], 3))"
python -c "from algorithms.sort import SortingAlgorithms; s = SortingAlgorithms(); print(s.merge_sort([3,1,4,1,5,9,2,6]))"
python -c "from algorithms.graph import GraphAlgorithms; from utils.core import Graph; g = Graph.from_random(5, 0.5); ga = GraphAlgorithms(); print(ga.bfs(g, 0))"
```

---

## 🤝 Contributing

Contributions welcome! Fork the repo, create a feature branch, and submit a PR.

1. Fork it (`https://github.com/issu321/algorithm-analyzer/fork`)
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License — see [LICENSE](LICENSE) file.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=06b6d4&height=100&section=footer" />
</p>

<div align="center">
  <p><strong>Built with ❤️ by <a href="https://github.com/issu321">Ussu</a></strong></p>
  <p><sub>Kali Linux Compatible | Windows 11 Ready | Python 3.13 Ready</sub></p>
</div>

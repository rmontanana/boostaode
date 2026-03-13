const AppData = {
    experimental: null,
    paired: null,
    tests: null,
    segmented: null,
    summary: null,
    loaded: false,

    async loadAll() {
        try {
            const [exp, paired, tests, seg, summary] = await Promise.all([
                fetch('data/experimental_results.json').then(r => r.json()),
                fetch('data/paired_comparison.json').then(r => r.json()),
                fetch('data/statistical_tests.json').then(r => r.json()),
                fetch('data/segmented_analysis.json').then(r => r.json()),
                fetch('data/experiment_summary.json').then(r => r.json())
            ]);
            this.experimental = exp;
            this.paired = paired;
            this.tests = tests;
            this.segmented = seg;
            this.summary = summary;
            this.loaded = true;
            return true;
        } catch (error) {
            console.error('Error loading data:', error);
            return false;
        }
    }
};

// Utility functions
function formatNumber(n, decimals = 4) {
    if (n === null || n === undefined || isNaN(n)) return '\u2014';
    return Number(n).toFixed(decimals);
}

function formatPercent(n, decimals = 2) {
    if (n === null || n === undefined || isNaN(n)) return '\u2014';
    return (Number(n) * 100).toFixed(decimals) + '%';
}

function formatPValue(p) {
    if (p === null || p === undefined) return '\u2014';
    if (p < 0.001) return '< 0.001';
    if (p < 0.01) return p.toFixed(4);
    return p.toFixed(3);
}

function getSignificanceBadge(p) {
    if (p === null || p === undefined) return '<span class="badge badge-neutral">\u2014</span>';
    if (p < 0.001) return '<span class="badge badge-significance sig-3">\u2605\u2605\u2605</span>';
    if (p < 0.01) return '<span class="badge badge-significance sig-2">\u2605\u2605</span>';
    if (p < 0.05) return '<span class="badge badge-significance sig-1">\u2605</span>';
    return '<span class="badge badge-significance sig-ns">NS</span>';
}

function getDiffClass(diff) {
    if (diff > 0.001) return 'cell-positive';
    if (diff < -0.001) return 'cell-negative';
    return 'cell-neutral';
}

function showLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.add('active');
}

function hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.remove('active');
}

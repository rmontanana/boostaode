/* ==========================================================================
   Charts Page — 12 interactive chart types
   BoostAODE vs AODE Web App
   ========================================================================== */

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const chartState = {
    currentChart: 'scatter-accuracy',
    chartInstance: null,
    alpha: '0.5'
};

// ---------------------------------------------------------------------------
// Chart definitions
// ---------------------------------------------------------------------------

const CHARTS = [
    { id: 'scatter-accuracy', name: 'Scatter Accuracy', icon: '\u2299', description: 'Diagrama de dispersi\u00f3n que compara la accuracy media de BoostAODE (eje Y) frente a AODE (eje X) para cada dataset. Los puntos por encima de la diagonal y=x indican que BoostAODE supera a AODE.' },
    { id: 'scatter-pareto', name: 'Accuracy vs Simplicidad', icon: '\u25c8', description: 'Frente de Pareto: accuracy (eje X) frente a simplicidad del modelo (eje Y). AODE siempre tiene simplicidad 0 (usa todos los SPODEs). BoostAODE puede alcanzar mayor simplicidad al seleccionar menos SPODEs.' },
    { id: 'clc-boxplots', name: 'Boxplots CLC_\u03b1', icon: '\u2610', description: 'Distribuci\u00f3n de los valores CLC_\u03b1 para cada clasificador a trav\u00e9s de los 40 datasets. Se muestran los cuartiles (Q1, mediana, Q3) y los puntos individuales de cada dataset.' },
    { id: 'alpha-breakeven', name: 'Histograma \u03b1 Breakeven', icon: '\u229e', description: 'Distribuci\u00f3n de los valores de \u03b1 breakeven. Valores bajos indican que BoostAODE supera a AODE incluso priorizando accuracy. \u03b1=0 indica que no hay ventaja de compresi\u00f3n. "Siempre" indica que BoostAODE gana para todo \u03b1.' },
    { id: 'compression-hist', name: 'Histograma Compresi\u00f3n', icon: '\u25a5', description: 'Distribuci\u00f3n del ratio de compresi\u00f3n (n_spodes_BoostAODE / n_features). Valores bajos indican alta compresi\u00f3n (BoostAODE usa pocos SPODEs). Valor 1.0 indica sin compresi\u00f3n.' },
    { id: 'compression-features', name: 'Compresi\u00f3n vs Features', icon: '\u25c9', description: 'Relaci\u00f3n entre el n\u00famero de features de cada dataset y el ratio de compresi\u00f3n alcanzado. Datasets con muchas features tienden a tener mayor compresi\u00f3n.' },
    { id: 'timing', name: 'Comparaci\u00f3n Tiempos', icon: '\u23f1', description: 'Comparaci\u00f3n de tiempos de entrenamiento y predicci\u00f3n entre ambos clasificadores. Incluye barras resumen (medias globales) y scatter de tiempos por dataset.' },
    { id: 'heatmap', name: 'Heatmap Ventaja CLC', icon: '\u25a6', description: 'Mapa de calor mostrando la diferencia media de CLC_\u03b1 (BoostAODE - AODE) por segmento de datos y valor de \u03b1. Verde indica ventaja de BoostAODE, rojo indica ventaja de AODE. Celdas con borde indican significancia estad\u00edstica (p < 0.05).' },
    { id: 'radar', name: 'Radar Comparativo', icon: '\u2b21', description: 'Gr\u00e1fico radar comparando ambos clasificadores en 5 dimensiones: accuracy, simplicidad, compresi\u00f3n, velocidad de entrenamiento y velocidad de predicci\u00f3n. Cada eje est\u00e1 normalizado de 0 a 1.' },
    { id: 'wins-by-alpha', name: 'Victorias por \u03b1', icon: '\u2197', description: 'Evoluci\u00f3n del n\u00famero de victorias y derrotas de BoostAODE en funci\u00f3n del par\u00e1metro \u03b1. La zona verde indica significancia estad\u00edstica (p < 0.05). L\u00ednea horizontal de referencia en 20 (50% de los datasets).' },
    { id: 'clc-ranking', name: 'Ranking \u0394 CLC', icon: '\u25a4', description: 'Ranking de datasets ordenados por diferencia CLC_\u03b1 (BoostAODE - AODE). Barras verdes indican ventaja de BoostAODE, barras rojas indican ventaja de AODE.' },
    { id: 'accuracy-distribution', name: 'Distribuci\u00f3n Accuracy', icon: '\u224b', description: 'Distribuci\u00f3n de accuracies medias de ambos clasificadores a trav\u00e9s de los 40 datasets. Cada punto es un dataset. Se muestra la media y mediana de cada clasificador.' }
];

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

function getChartColors() {
    var cs = getComputedStyle(document.documentElement);
    return {
        aode:       cs.getPropertyValue('--chart-aode').trim(),
        boostaode:  cs.getPropertyValue('--chart-boostaode').trim(),
        positive:   cs.getPropertyValue('--chart-positive').trim(),
        negative:   cs.getPropertyValue('--chart-negative').trim(),
        neutral:    cs.getPropertyValue('--chart-neutral').trim(),
        grid:       cs.getPropertyValue('--chart-grid').trim(),
        gridDark:   cs.getPropertyValue('--chart-grid-dark').trim(),
        text:       cs.getPropertyValue('--text-primary').trim(),
        textSec:    cs.getPropertyValue('--text-secondary').trim(),
        textMuted:  cs.getPropertyValue('--text-muted').trim(),
        bgCard:     cs.getPropertyValue('--bg-card').trim(),
        bgElevated: cs.getPropertyValue('--bg-elevated').trim(),
        border:     cs.getPropertyValue('--border-color').trim(),
        warning:    cs.getPropertyValue('--color-warning').trim()
    };
}

function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

// ---------------------------------------------------------------------------
// Utility: quartile / stats
// ---------------------------------------------------------------------------

function computeQuartiles(arr) {
    var sorted = arr.slice().sort(function(a, b) { return a - b; });
    var n = sorted.length;
    var q1Idx = (n - 1) * 0.25;
    var medIdx = (n - 1) * 0.5;
    var q3Idx = (n - 1) * 0.75;
    function interp(idx) {
        var lo = Math.floor(idx), hi = Math.ceil(idx), f = idx - lo;
        if (hi >= n) return sorted[n - 1];
        return sorted[lo] * (1 - f) + sorted[hi] * f;
    }
    return {
        min: sorted[0],
        q1: interp(q1Idx),
        median: interp(medIdx),
        q3: interp(q3Idx),
        max: sorted[n - 1],
        mean: arr.reduce(function(s, v) { return s + v; }, 0) / n
    };
}

// ---------------------------------------------------------------------------
// Chart lifecycle
// ---------------------------------------------------------------------------

function destroyChart() {
    if (chartState.chartInstance) {
        chartState.chartInstance.destroy();
        chartState.chartInstance = null;
    }
}

function downloadPNG() {
    var canvas = document.getElementById('chart-canvas');
    // For heatmap, generate canvas from HTML
    var htmlEl = document.getElementById('chart-html');
    if (!htmlEl.classList.contains('hidden')) {
        // Use html2canvas-like fallback: just alert
        alert('Para la tabla heatmap, usa captura de pantalla del navegador (Ctrl+Shift+S en Firefox).');
        return;
    }
    if (!canvas) return;
    var link = document.createElement('a');
    link.download = chartState.currentChart + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// ---------------------------------------------------------------------------
// Common Chart.js defaults
// ---------------------------------------------------------------------------

function getDefaultOptions(colors) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: colors.textSec,
                    font: { size: 12 },
                    usePointStyle: true,
                    pointStyleWidth: 12
                }
            },
            tooltip: {
                backgroundColor: colors.bgElevated,
                titleColor: colors.text,
                bodyColor: colors.textSec,
                borderColor: colors.border,
                borderWidth: 1,
                cornerRadius: 8,
                padding: 10,
                displayColors: true
            }
        },
        scales: {
            x: {
                ticks: { color: colors.textMuted, font: { size: 11 } },
                grid: { color: colors.gridDark }
            },
            y: {
                ticks: { color: colors.textMuted, font: { size: 11 } },
                grid: { color: colors.gridDark }
            }
        }
    };
}

// ---------------------------------------------------------------------------
// Selector + Rendering
// ---------------------------------------------------------------------------

function renderChartSelector() {
    var container = document.getElementById('chart-selector');
    container.innerHTML = '';
    CHARTS.forEach(function(chart) {
        var btn = document.createElement('button');
        btn.className = 'chart-selector-btn' + (chart.id === chartState.currentChart ? ' active' : '');
        btn.setAttribute('data-chart', chart.id);
        btn.innerHTML = '<span class="chart-selector-icon">' + chart.icon + '</span>' +
                        '<span class="chart-selector-label">' + chart.name + '</span>';
        btn.addEventListener('click', function() { selectChart(chart.id); });
        container.appendChild(btn);
    });
}

function selectChart(chartId) {
    chartState.currentChart = chartId;
    // Update selector active state
    var btns = document.querySelectorAll('.chart-selector-btn');
    btns.forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-chart') === chartId);
    });
    renderChart(chartId);
}

function renderChart(chartId) {
    destroyChart();
    var chartDef = CHARTS.find(function(c) { return c.id === chartId; });
    if (!chartDef) return;

    document.getElementById('chart-title').textContent = chartDef.name;
    document.getElementById('chart-description').textContent = chartDef.description;

    // Toggle canvas vs HTML
    var wrapper = document.getElementById('chart-wrapper');
    var htmlEl = document.getElementById('chart-html');
    var downloadBtn = document.getElementById('chart-download');

    // Reset wrapper height (may have been changed by clc-ranking)
    wrapper.style.height = '';

    if (chartId === 'heatmap') {
        wrapper.classList.add('hidden');
        htmlEl.classList.remove('hidden');
        downloadBtn.style.display = 'none';
    } else {
        wrapper.classList.remove('hidden');
        htmlEl.classList.add('hidden');
        htmlEl.innerHTML = '';
        downloadBtn.style.display = '';
    }

    // Build controls
    buildControls(chartId);

    // Dispatch to chart renderer
    switch (chartId) {
        case 'scatter-accuracy':     renderScatterAccuracy(); break;
        case 'scatter-pareto':       renderScatterPareto(); break;
        case 'clc-boxplots':         renderCLCBoxplots(); break;
        case 'alpha-breakeven':      renderAlphaBreakeven(); break;
        case 'compression-hist':     renderCompressionHist(); break;
        case 'compression-features': renderCompressionFeatures(); break;
        case 'timing':               renderTiming(); break;
        case 'heatmap':              renderHeatmap(); break;
        case 'radar':                renderRadar(); break;
        case 'wins-by-alpha':        renderWinsByAlpha(); break;
        case 'clc-ranking':          renderCLCRanking(); break;
        case 'accuracy-distribution':renderAccuracyDistribution(); break;
    }
}

function buildControls(chartId) {
    var controlsEl = document.getElementById('chart-controls');
    controlsEl.innerHTML = '';
    // Charts that need alpha selector
    var needsAlpha = ['clc-boxplots', 'clc-ranking'];
    if (needsAlpha.indexOf(chartId) >= 0) {
        var group = document.createElement('div');
        group.className = 'form-group';
        var label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = '\u03b1 =';
        var select = document.createElement('select');
        select.id = 'alpha-chart-select';
        select.style.width = '80px';
        ['0.5', '0.6', '0.7', '0.8', '0.9', '1.0'].forEach(function(v) {
            var opt = document.createElement('option');
            opt.value = v;
            opt.textContent = v;
            if (v === chartState.alpha) opt.selected = true;
            select.appendChild(opt);
        });
        select.addEventListener('change', function() {
            chartState.alpha = this.value;
            renderChart(chartId);
        });
        group.appendChild(label);
        group.appendChild(select);
        controlsEl.appendChild(group);
    }
}

// ===========================================================================
// CHART 1: Scatter Accuracy
// ===========================================================================

function renderScatterAccuracy() {
    var colors = getChartColors();
    var datasets = AppData.paired.datasets;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    // Separate into above/below diagonal
    var above = [], below = [], onLine = [];
    datasets.forEach(function(d) {
        var point = { x: d.acc_AODE, y: d.acc_BoostAODE, dataset: d.dataset, diff: d.acc_diff, features: d.n_features };
        if (d.acc_diff > 0.001) above.push(point);
        else if (d.acc_diff < -0.001) below.push(point);
        else onLine.push(point);
    });

    // Determine axis range
    var allAcc = datasets.map(function(d) { return d.acc_AODE; }).concat(datasets.map(function(d) { return d.acc_BoostAODE; }));
    var minAcc = Math.min.apply(null, allAcc);
    var maxAcc = Math.max.apply(null, allAcc);
    var pad = (maxAcc - minAcc) * 0.08;
    var lo = Math.max(0, minAcc - pad);
    var hi = Math.min(1, maxAcc + pad);

    function makeTooltip(ctx) {
        var point = ctx.raw;
        return [
            point.dataset,
            'AODE: ' + point.x.toFixed(4),
            'BoostAODE: ' + point.y.toFixed(4),
            'Diferencia: ' + (point.diff > 0 ? '+' : '') + point.diff.toFixed(4)
        ];
    }

    chartState.chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'BoostAODE gana',
                    data: above,
                    backgroundColor: hexToRgba(colors.positive, 0.7),
                    borderColor: colors.positive,
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 9
                },
                {
                    label: 'AODE gana',
                    data: below,
                    backgroundColor: hexToRgba(colors.negative, 0.7),
                    borderColor: colors.negative,
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 9
                },
                {
                    label: 'Empate',
                    data: onLine,
                    backgroundColor: hexToRgba(colors.neutral, 0.7),
                    borderColor: colors.neutral,
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 9
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: colors.textSec, font: { size: 12 }, usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        title: function() { return ''; },
                        label: makeTooltip
                    }
                },
                annotation: undefined
            },
            scales: {
                x: {
                    title: { display: true, text: 'Accuracy AODE', color: colors.textSec, font: { size: 13 } },
                    min: lo, max: hi,
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                },
                y: {
                    title: { display: true, text: 'Accuracy BoostAODE', color: colors.textSec, font: { size: 13 } },
                    min: lo, max: hi,
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                }
            }
        },
        plugins: [{
            id: 'diagonalLine',
            beforeDraw: function(chart) {
                var ctx2 = chart.ctx;
                var xScale = chart.scales.x;
                var yScale = chart.scales.y;
                var startX = xScale.getPixelForValue(lo);
                var startY = yScale.getPixelForValue(lo);
                var endX = xScale.getPixelForValue(hi);
                var endY = yScale.getPixelForValue(hi);
                ctx2.save();
                ctx2.setLineDash([6, 4]);
                ctx2.strokeStyle = colors.neutral;
                ctx2.lineWidth = 1.5;
                ctx2.beginPath();
                ctx2.moveTo(startX, startY);
                ctx2.lineTo(endX, endY);
                ctx2.stroke();
                ctx2.restore();
            }
        }]
    });
}

// ===========================================================================
// CHART 2: Scatter Pareto (accuracy vs simplicity)
// ===========================================================================

function renderScatterPareto() {
    var colors = getChartColors();
    var datasets = AppData.paired.datasets;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    var aodeData = datasets.map(function(d) {
        return { x: d.acc_AODE, y: 0, dataset: d.dataset, n_spodes: d.n_spodes_AODE, n_features: d.n_features };
    });
    var boostData = datasets.map(function(d) {
        return { x: d.acc_BoostAODE, y: d.simplicity_BoostAODE, dataset: d.dataset, n_spodes: d.n_spodes_BoostAODE, n_features: d.n_features };
    });

    function makeTooltip(ctx) {
        var p = ctx.raw;
        return [
            p.dataset,
            'Accuracy: ' + p.x.toFixed(4),
            'Simplicidad: ' + p.y.toFixed(4),
            'SPODEs: ' + p.n_spodes + ' / ' + p.n_features
        ];
    }

    chartState.chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'AODE',
                    data: aodeData,
                    backgroundColor: hexToRgba(colors.aode, 0.7),
                    borderColor: colors.aode,
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 9
                },
                {
                    label: 'BoostAODE',
                    data: boostData,
                    backgroundColor: hexToRgba(colors.boostaode, 0.7),
                    borderColor: colors.boostaode,
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 9
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: colors.textSec, font: { size: 12 }, usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        title: function() { return ''; },
                        label: makeTooltip
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Accuracy', color: colors.textSec, font: { size: 13 } },
                    min: 0.5, max: 1.0,
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                },
                y: {
                    title: { display: true, text: 'Simplicidad (1 - n_spodes/n_features)', color: colors.textSec, font: { size: 13 } },
                    min: -0.05, max: 1.0,
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                }
            }
        }
    });
}

// ===========================================================================
// CHART 3: CLC Boxplots (floating bars + scatter)
// ===========================================================================

function renderCLCBoxplots() {
    var colors = getChartColors();
    var datasets = AppData.paired.datasets;
    var alpha = chartState.alpha;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    var aodeVals = datasets.map(function(d) { return d.clc[alpha].AODE; });
    var boostVals = datasets.map(function(d) { return d.clc[alpha].BoostAODE; });
    var statsAode = computeQuartiles(aodeVals);
    var statsBoost = computeQuartiles(boostVals);

    // Build combined chart: floating bars for IQR + scatter for individual points
    // X positions: 0 = AODE, 1 = BoostAODE
    // Floating bar: [Q1, Q3]
    // Lines plugin: whiskers + median

    // Jitter individual points
    function jitter(arr, xCenter) {
        return arr.map(function(v) {
            return { x: xCenter + (Math.random() - 0.5) * 0.3, y: v };
        });
    }

    chartState.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['AODE', 'BoostAODE'],
            datasets: [
                {
                    label: 'IQR (Q1-Q3)',
                    data: [
                        [statsAode.q1, statsAode.q3],
                        [statsBoost.q1, statsBoost.q3]
                    ],
                    backgroundColor: [hexToRgba(colors.aode, 0.3), hexToRgba(colors.boostaode, 0.3)],
                    borderColor: [colors.aode, colors.boostaode],
                    borderWidth: 2,
                    barPercentage: 0.5,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Datasets (AODE)',
                    type: 'scatter',
                    data: jitter(aodeVals, 0),
                    backgroundColor: hexToRgba(colors.aode, 0.6),
                    borderColor: colors.aode,
                    borderWidth: 1,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    xAxisID: 'x'
                },
                {
                    label: 'Datasets (BoostAODE)',
                    type: 'scatter',
                    data: jitter(boostVals, 1),
                    backgroundColor: hexToRgba(colors.boostaode, 0.6),
                    borderColor: colors.boostaode,
                    borderWidth: 1,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    xAxisID: 'x'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        label: function(ctx) {
                            if (ctx.datasetIndex === 0) {
                                var idx = ctx.dataIndex;
                                var s = idx === 0 ? statsAode : statsBoost;
                                return [
                                    'Min: ' + s.min.toFixed(4),
                                    'Q1: ' + s.q1.toFixed(4),
                                    'Mediana: ' + s.median.toFixed(4),
                                    'Media: ' + s.mean.toFixed(4),
                                    'Q3: ' + s.q3.toFixed(4),
                                    'Max: ' + s.max.toFixed(4)
                                ];
                            }
                            return 'CLC_' + alpha + ': ' + ctx.raw.y.toFixed(4);
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    labels: ['AODE', 'BoostAODE'],
                    ticks: { color: colors.textSec, font: { size: 13, weight: '600' } },
                    grid: { display: false }
                },
                y: {
                    title: { display: true, text: 'CLC_\u03b1 (\u03b1=' + alpha + ')', color: colors.textSec, font: { size: 13 } },
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                }
            }
        },
        plugins: [{
            id: 'boxWhiskers',
            afterDraw: function(chart) {
                var ctx2 = chart.ctx;
                var xScale = chart.scales.x;
                var yScale = chart.scales.y;
                var statsArr = [statsAode, statsBoost];
                var colorsArr = [colors.aode, colors.boostaode];
                var meta = chart.getDatasetMeta(0);

                statsArr.forEach(function(s, i) {
                    var bar = meta.data[i];
                    if (!bar) return;
                    var cx = bar.x;
                    var barWidth = bar.width || 40;
                    var halfW = barWidth * 0.25;

                    ctx2.save();
                    ctx2.strokeStyle = colorsArr[i];
                    ctx2.lineWidth = 2;

                    // Whisker: min to Q1
                    var yMin = yScale.getPixelForValue(s.min);
                    var yQ1 = yScale.getPixelForValue(s.q1);
                    ctx2.beginPath();
                    ctx2.moveTo(cx, yQ1);
                    ctx2.lineTo(cx, yMin);
                    ctx2.stroke();
                    // Min cap
                    ctx2.beginPath();
                    ctx2.moveTo(cx - halfW, yMin);
                    ctx2.lineTo(cx + halfW, yMin);
                    ctx2.stroke();

                    // Whisker: Q3 to max
                    var yQ3 = yScale.getPixelForValue(s.q3);
                    var yMax = yScale.getPixelForValue(s.max);
                    ctx2.beginPath();
                    ctx2.moveTo(cx, yQ3);
                    ctx2.lineTo(cx, yMax);
                    ctx2.stroke();
                    // Max cap
                    ctx2.beginPath();
                    ctx2.moveTo(cx - halfW, yMax);
                    ctx2.lineTo(cx + halfW, yMax);
                    ctx2.stroke();

                    // Median line
                    var yMed = yScale.getPixelForValue(s.median);
                    ctx2.lineWidth = 3;
                    ctx2.beginPath();
                    ctx2.moveTo(bar.x - barWidth / 2, yMed);
                    ctx2.lineTo(bar.x + barWidth / 2, yMed);
                    ctx2.stroke();

                    // Mean diamond
                    var yMean = yScale.getPixelForValue(s.mean);
                    ctx2.fillStyle = colorsArr[i];
                    ctx2.beginPath();
                    ctx2.moveTo(cx, yMean - 5);
                    ctx2.lineTo(cx + 5, yMean);
                    ctx2.lineTo(cx, yMean + 5);
                    ctx2.lineTo(cx - 5, yMean);
                    ctx2.closePath();
                    ctx2.fill();

                    ctx2.restore();
                });
            }
        }]
    });
}

// ===========================================================================
// CHART 4: Alpha Breakeven Histogram
// ===========================================================================

function renderAlphaBreakeven() {
    var colors = getChartColors();
    var datasets = AppData.paired.datasets;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    // Bins: 0, (0,0.1], (0.1,0.2], ..., (0.9,1.0], "Siempre"
    var binLabels = ['0', '0-0.2', '0.2-0.4', '0.4-0.6', '0.6-0.8', '0.8-1.0', 'Siempre'];
    var binCounts = [0, 0, 0, 0, 0, 0, 0];

    datasets.forEach(function(d) {
        var ab = d.alpha_breakeven;
        if (ab === null) {
            // null means BoostAODE always wins (or no compression advantage when acc is also same/better)
            // Check: if acc_diff > 0 and simplicity > 0, "Siempre BoostAODE"
            // If acc_diff > 0 and simplicity === 0, also always wins
            binCounts[6]++;
        } else if (ab === 0 || ab < 0.001) {
            binCounts[0]++;
        } else if (ab <= 0.2) {
            binCounts[1]++;
        } else if (ab <= 0.4) {
            binCounts[2]++;
        } else if (ab <= 0.6) {
            binCounts[3]++;
        } else if (ab <= 0.8) {
            binCounts[4]++;
        } else {
            binCounts[5]++;
        }
    });

    // Gradient colors from green (easy win / always) to yellow/red (hard)
    var barColors = [
        hexToRgba(colors.neutral, 0.6),    // 0 = no advantage
        hexToRgba(colors.positive, 0.9),    // 0-0.2 easy win
        hexToRgba(colors.positive, 0.7),    // 0.2-0.4
        hexToRgba(colors.warning, 0.7),     // 0.4-0.6
        hexToRgba(colors.warning, 0.8),     // 0.6-0.8
        hexToRgba(colors.negative, 0.6),    // 0.8-1.0 hard
        hexToRgba(colors.boostaode, 0.8)    // Siempre
    ];
    var borderColors = [
        colors.neutral,
        colors.positive,
        colors.positive,
        colors.warning,
        colors.warning,
        colors.negative,
        colors.boostaode
    ];

    chartState.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: 'Datasets',
                data: binCounts,
                backgroundColor: barColors,
                borderColor: borderColors,
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        label: function(ctx) {
                            return ctx.raw + ' dataset' + (ctx.raw !== 1 ? 's' : '');
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: '\u03b1 breakeven', color: colors.textSec, font: { size: 13 } },
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { display: false }
                },
                y: {
                    title: { display: true, text: 'N\u00famero de datasets', color: colors.textSec, font: { size: 13 } },
                    beginAtZero: true,
                    ticks: { color: colors.textMuted, font: { size: 11 }, stepSize: 2 },
                    grid: { color: colors.gridDark }
                }
            }
        }
    });
}

// ===========================================================================
// CHART 5: Compression Histogram
// ===========================================================================

function renderCompressionHist() {
    var colors = getChartColors();
    var datasets = AppData.paired.datasets;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    // Bins: [0,0.1), [0.1,0.2), ..., [0.9,1.0]
    var binLabels = ['0-0.1', '0.1-0.2', '0.2-0.3', '0.3-0.4', '0.4-0.5', '0.5-0.6', '0.6-0.7', '0.7-0.8', '0.8-0.9', '0.9-1.0'];
    var binCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    datasets.forEach(function(d) {
        var cr = d.compression_ratio;
        var bin = Math.min(Math.floor(cr * 10), 9);
        binCounts[bin]++;
    });

    // Color gradient: violet (high compression, low ratio) to gray (low compression, high ratio)
    var barColors = binCounts.map(function(_, i) {
        var t = i / 9; // 0=high compression, 1=no compression
        if (t < 0.5) return hexToRgba(colors.boostaode, 0.8 - t * 0.4);
        return hexToRgba(colors.neutral, 0.3 + (t - 0.5) * 0.6);
    });

    chartState.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: 'Datasets',
                data: binCounts,
                backgroundColor: barColors,
                borderColor: colors.boostaode,
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        label: function(ctx) {
                            return ctx.raw + ' dataset' + (ctx.raw !== 1 ? 's' : '');
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Ratio de compresi\u00f3n (n_spodes / n_features)', color: colors.textSec, font: { size: 13 } },
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { display: false }
                },
                y: {
                    title: { display: true, text: 'N\u00famero de datasets', color: colors.textSec, font: { size: 13 } },
                    beginAtZero: true,
                    ticks: { color: colors.textMuted, font: { size: 11 }, stepSize: 2 },
                    grid: { color: colors.gridDark }
                }
            }
        }
    });
}

// ===========================================================================
// CHART 6: Compression vs Features
// ===========================================================================

function renderCompressionFeatures() {
    var colors = getChartColors();
    var datasets = AppData.paired.datasets;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    var maxSamples = Math.max.apply(null, datasets.map(function(d) { return d.n_samples; }));
    var minSamples = Math.min.apply(null, datasets.map(function(d) { return d.n_samples; }));

    var points = datasets.map(function(d) {
        // Point size proportional to log of n_samples
        var sizeNorm = (Math.log(d.n_samples) - Math.log(minSamples)) / (Math.log(maxSamples) - Math.log(minSamples));
        var radius = 4 + sizeNorm * 12;
        return {
            x: d.n_features,
            y: d.compression_ratio,
            dataset: d.dataset,
            n_samples: d.n_samples,
            n_spodes: d.n_spodes_BoostAODE,
            r: radius
        };
    });

    // Color based on compression ratio
    var pointColors = points.map(function(p) {
        var cr = p.y;
        if (cr < 0.3) return hexToRgba(colors.boostaode, 0.9);
        if (cr < 0.6) return hexToRgba(colors.boostaode, 0.6);
        if (cr < 0.9) return hexToRgba(colors.neutral, 0.6);
        return hexToRgba(colors.neutral, 0.4);
    });

    chartState.chartInstance = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Datasets',
                data: points,
                backgroundColor: pointColors,
                borderColor: colors.boostaode,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        title: function() { return ''; },
                        label: function(ctx) {
                            var p = ctx.raw;
                            return [
                                p.dataset,
                                'Features: ' + p.x,
                                'Compresi\u00f3n: ' + p.y.toFixed(3),
                                'SPODEs: ' + p.n_spodes + ' / ' + p.x,
                                'Muestras: ' + p.n_samples.toLocaleString()
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'logarithmic',
                    title: { display: true, text: 'N\u00famero de features (escala log)', color: colors.textSec, font: { size: 13 } },
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                },
                y: {
                    title: { display: true, text: 'Ratio de compresi\u00f3n', color: colors.textSec, font: { size: 13 } },
                    min: 0, max: 1.1,
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                }
            }
        }
    });
}

// ===========================================================================
// CHART 7: Timing comparison
// ===========================================================================

function renderTiming() {
    var colors = getChartColors();
    var results = AppData.experimental.results;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    // Compute mean train/predict times per dataset per classifier
    var datasetMap = {};
    results.forEach(function(r) {
        var key = r.dataset + '|' + r.classifier;
        if (!datasetMap[key]) datasetMap[key] = { train: [], predict: [] };
        datasetMap[key].train.push(r.train_time);
        datasetMap[key].predict.push(r.predict_time);
    });

    // Compute per-dataset means
    var perDataset = {};
    Object.keys(datasetMap).forEach(function(key) {
        var parts = key.split('|');
        var ds = parts[0], cls = parts[1];
        var trainMean = datasetMap[key].train.reduce(function(s, v) { return s + v; }, 0) / datasetMap[key].train.length;
        var predictMean = datasetMap[key].predict.reduce(function(s, v) { return s + v; }, 0) / datasetMap[key].predict.length;
        if (!perDataset[ds]) perDataset[ds] = {};
        perDataset[ds][cls] = { train: trainMean, predict: predictMean };
    });

    // Overall means
    var allAodeTrain = [], allAodePredict = [], allBoostTrain = [], allBoostPredict = [];
    Object.keys(perDataset).forEach(function(ds) {
        if (perDataset[ds].AODE) {
            allAodeTrain.push(perDataset[ds].AODE.train);
            allAodePredict.push(perDataset[ds].AODE.predict);
        }
        if (perDataset[ds].BoostAODE) {
            allBoostTrain.push(perDataset[ds].BoostAODE.train);
            allBoostPredict.push(perDataset[ds].BoostAODE.predict);
        }
    });

    var mean = function(arr) { return arr.reduce(function(s, v) { return s + v; }, 0) / arr.length; };

    var summaryLabels = ['Entrenamiento', 'Predicci\u00f3n'];
    var aodeMeans = [mean(allAodeTrain), mean(allAodePredict)];
    var boostMeans = [mean(allBoostTrain), mean(allBoostPredict)];

    chartState.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: summaryLabels,
            datasets: [
                {
                    label: 'AODE',
                    data: aodeMeans,
                    backgroundColor: hexToRgba(colors.aode, 0.7),
                    borderColor: colors.aode,
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'BoostAODE',
                    data: boostMeans,
                    backgroundColor: hexToRgba(colors.boostaode, 0.7),
                    borderColor: colors.boostaode,
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    labels: { color: colors.textSec, font: { size: 12 }, usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        label: function(ctx) {
                            return ctx.dataset.label + ': ' + ctx.raw.toFixed(4) + ' s';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Tiempo medio (segundos)', color: colors.textSec, font: { size: 13 } },
                    beginAtZero: true,
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                },
                y: {
                    ticks: { color: colors.textSec, font: { size: 13, weight: '600' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// ===========================================================================
// CHART 8: Heatmap (HTML table)
// ===========================================================================

function renderHeatmap() {
    var colors = getChartColors();
    var segments = AppData.segmented.segments;
    var htmlEl = document.getElementById('chart-html');

    var segmentNames = ['all', 'high_dim', 'low_dim', 'small', 'large'];
    var segmentLabels = {
        'all': 'Todos (40)',
        'high_dim': 'Alta dimensi\u00f3n (9)',
        'low_dim': 'Baja dimensi\u00f3n (31)',
        'small': 'Peque\u00f1os (17)',
        'large': 'Grandes (23)'
    };
    var alphas = ['0.5', '0.6', '0.7', '0.8', '0.9', '1.0'];

    // Build lookup
    var lookup = {};
    segments.forEach(function(s) {
        lookup[s.segment + '|' + s.alpha] = s;
    });

    // Find max absolute diff for color scaling
    var maxAbs = 0;
    segments.forEach(function(s) {
        var v = Math.abs(s.mean_CLC_diff);
        if (v > maxAbs) maxAbs = v;
    });

    var html = '<table class="heatmap-table">';
    html += '<thead><tr><th>Segmento</th>';
    alphas.forEach(function(a) {
        html += '<th>\u03b1 = ' + a + '</th>';
    });
    html += '</tr></thead><tbody>';

    segmentNames.forEach(function(seg) {
        html += '<tr>';
        html += '<td>' + segmentLabels[seg] + '</td>';
        alphas.forEach(function(a) {
            var entry = lookup[seg + '|' + parseFloat(a)];
            if (!entry) {
                html += '<td>\u2014</td>';
                return;
            }
            var diff = entry.mean_CLC_diff;
            var sig = entry.significant;
            // Color: green for positive, red for negative
            var intensity = Math.min(Math.abs(diff) / maxAbs, 1);
            var bgColor;
            if (diff >= 0) {
                bgColor = 'rgba(16, 185, 129, ' + (intensity * 0.5).toFixed(3) + ')';
            } else {
                bgColor = 'rgba(239, 68, 68, ' + (intensity * 0.5).toFixed(3) + ')';
            }
            var cellClass = sig ? ' class="heatmap-cell-significant"' : '';
            var sigMark = sig ? ' *' : '';
            html += '<td' + cellClass + ' style="background-color: ' + bgColor + '">';
            html += (diff >= 0 ? '+' : '') + diff.toFixed(4) + sigMark;
            html += '</td>';
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    html += '<p style="margin-top:8px; font-size:0.75rem; color:var(--text-muted);">* Significancia estad\u00edstica (p &lt; 0.05). Borde en celdas significativas.</p>';
    htmlEl.innerHTML = html;
}

// ===========================================================================
// CHART 9: Radar chart
// ===========================================================================

function renderRadar() {
    var colors = getChartColors();
    var datasets = AppData.paired.datasets;
    var results = AppData.experimental.results;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    // Compute metrics
    var accAode = datasets.map(function(d) { return d.acc_AODE; });
    var accBoost = datasets.map(function(d) { return d.acc_BoostAODE; });
    var mean = function(arr) { return arr.reduce(function(s, v) { return s + v; }, 0) / arr.length; };
    var meanAccAode = mean(accAode);
    var meanAccBoost = mean(accBoost);

    var simplicities = datasets.map(function(d) { return d.simplicity_BoostAODE; });
    var meanSimplicity = mean(simplicities);

    var compressions = datasets.map(function(d) { return 1 - d.compression_ratio; }); // higher = more compression
    var meanCompression = mean(compressions);

    // Train and predict times from experimental results
    var trainTimesAode = [], trainTimesBoost = [], predictTimesAode = [], predictTimesBoost = [];
    results.forEach(function(r) {
        if (r.classifier === 'AODE') {
            trainTimesAode.push(r.train_time);
            predictTimesAode.push(r.predict_time);
        } else {
            trainTimesBoost.push(r.train_time);
            predictTimesBoost.push(r.predict_time);
        }
    });
    var meanTrainAode = mean(trainTimesAode);
    var meanTrainBoost = mean(trainTimesBoost);
    var meanPredictAode = mean(predictTimesAode);
    var meanPredictBoost = mean(predictTimesBoost);

    // Speed = inverse of time, normalized so maximum speed = 1
    var maxTrain = Math.max(meanTrainAode, meanTrainBoost);
    var maxPredict = Math.max(meanPredictAode, meanPredictBoost);
    // Faster (lower time) = higher score
    var trainSpeedAode = 1 - (meanTrainAode / (maxTrain * 2));
    var trainSpeedBoost = 1 - (meanTrainBoost / (maxTrain * 2));
    var predictSpeedAode = 1 - (meanPredictAode / (maxPredict * 2));
    var predictSpeedBoost = 1 - (meanPredictBoost / (maxPredict * 2));

    // Clamp
    trainSpeedAode = Math.max(0, Math.min(1, trainSpeedAode));
    trainSpeedBoost = Math.max(0, Math.min(1, trainSpeedBoost));
    predictSpeedAode = Math.max(0, Math.min(1, predictSpeedAode));
    predictSpeedBoost = Math.max(0, Math.min(1, predictSpeedBoost));

    chartState.chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Accuracy', 'Simplicidad', 'Compresi\u00f3n', 'Vel. Entrenamiento', 'Vel. Predicci\u00f3n'],
            datasets: [
                {
                    label: 'AODE',
                    data: [meanAccAode, 0, 0, trainSpeedAode, predictSpeedAode],
                    backgroundColor: hexToRgba(colors.aode, 0.15),
                    borderColor: colors.aode,
                    borderWidth: 2,
                    pointBackgroundColor: colors.aode,
                    pointBorderColor: colors.aode,
                    pointRadius: 4
                },
                {
                    label: 'BoostAODE',
                    data: [meanAccBoost, meanSimplicity, meanCompression, trainSpeedBoost, predictSpeedBoost],
                    backgroundColor: hexToRgba(colors.boostaode, 0.15),
                    borderColor: colors.boostaode,
                    borderWidth: 2,
                    pointBackgroundColor: colors.boostaode,
                    pointBorderColor: colors.boostaode,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: colors.textSec, font: { size: 12 }, usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        label: function(ctx) {
                            return ctx.dataset.label + ': ' + ctx.raw.toFixed(4);
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 1,
                    ticks: {
                        stepSize: 0.2,
                        color: colors.textMuted,
                        backdropColor: 'transparent',
                        font: { size: 10 }
                    },
                    pointLabels: {
                        color: colors.textSec,
                        font: { size: 12, weight: '500' }
                    },
                    grid: {
                        color: colors.grid
                    },
                    angleLines: {
                        color: colors.gridDark
                    }
                }
            }
        }
    });
}

// ===========================================================================
// CHART 10: Wins by Alpha
// ===========================================================================

function renderWinsByAlpha() {
    var colors = getChartColors();
    var tests = AppData.tests.tests;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    // Filter only CLC tests and accuracy (map to alpha)
    var alphaLabels = [];
    var winData = [];
    var lossData = [];
    var pValues = [];

    tests.forEach(function(t) {
        var label;
        if (t.metric === 'accuracy') {
            label = '1.0 (acc)';
        } else if (t.metric.startsWith('CLC_')) {
            label = t.metric.replace('CLC_', '');
        } else {
            return;
        }
        alphaLabels.push(label);
        winData.push(t.wins);
        lossData.push(t.losses);
        pValues.push(t.p_value);
    });

    chartState.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: alphaLabels,
            datasets: [
                {
                    label: 'Victorias BoostAODE',
                    data: winData,
                    borderColor: colors.positive,
                    backgroundColor: hexToRgba(colors.positive, 0.1),
                    borderWidth: 3,
                    pointBackgroundColor: colors.positive,
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    fill: false,
                    tension: 0.2
                },
                {
                    label: 'Derrotas BoostAODE',
                    data: lossData,
                    borderColor: hexToRgba(colors.negative, 0.5),
                    backgroundColor: hexToRgba(colors.negative, 0.05),
                    borderWidth: 2,
                    borderDash: [4, 4],
                    pointBackgroundColor: colors.negative,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    fill: false,
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: colors.textSec, font: { size: 12 }, usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        afterBody: function(ctx) {
                            var idx = ctx[0].dataIndex;
                            var p = pValues[idx];
                            var sig = p < 0.05 ? 'Significativo' : 'No significativo';
                            return ['p-value: ' + (p < 0.001 ? '< 0.001' : p.toFixed(4)), sig];
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Valor de \u03b1', color: colors.textSec, font: { size: 13 } },
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                },
                y: {
                    title: { display: true, text: 'N\u00famero de datasets', color: colors.textSec, font: { size: 13 } },
                    min: 0,
                    max: 40,
                    ticks: { color: colors.textMuted, font: { size: 11 }, stepSize: 5 },
                    grid: { color: colors.gridDark }
                }
            }
        },
        plugins: [{
            id: 'significanceBackground',
            beforeDraw: function(chart) {
                var ctx2 = chart.ctx;
                var xScale = chart.scales.x;
                var yScale = chart.scales.y;
                var chartArea = chart.chartArea;

                // Draw horizontal reference at 20
                var y20 = yScale.getPixelForValue(20);
                ctx2.save();
                ctx2.setLineDash([6, 4]);
                ctx2.strokeStyle = colors.neutral;
                ctx2.lineWidth = 1;
                ctx2.beginPath();
                ctx2.moveTo(chartArea.left, y20);
                ctx2.lineTo(chartArea.right, y20);
                ctx2.stroke();
                ctx2.restore();

                // Shade background per column based on significance
                var ticks = xScale.ticks;
                if (!ticks || ticks.length === 0) return;

                ctx2.save();
                for (var i = 0; i < alphaLabels.length; i++) {
                    var p = pValues[i];
                    var isSignificant = p < 0.05;
                    var xPixel = xScale.getPixelForValue(i);
                    var halfStep;
                    if (i < alphaLabels.length - 1) {
                        halfStep = (xScale.getPixelForValue(i + 1) - xPixel) / 2;
                    } else if (i > 0) {
                        halfStep = (xPixel - xScale.getPixelForValue(i - 1)) / 2;
                    } else {
                        halfStep = 20;
                    }
                    ctx2.fillStyle = isSignificant
                        ? 'rgba(16, 185, 129, 0.06)'
                        : 'rgba(239, 68, 68, 0.04)';
                    ctx2.fillRect(xPixel - halfStep, chartArea.top, halfStep * 2, chartArea.bottom - chartArea.top);
                }
                ctx2.restore();
            }
        }]
    });
}

// ===========================================================================
// CHART 11: CLC Ranking (horizontal bars)
// ===========================================================================

function renderCLCRanking() {
    var colors = getChartColors();
    var datasets = AppData.paired.datasets;
    var alpha = chartState.alpha;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    // Sort datasets by CLC diff for selected alpha
    var sorted = datasets.slice().sort(function(a, b) {
        return a.clc[alpha].diff - b.clc[alpha].diff;
    });

    var labels = sorted.map(function(d) { return d.dataset; });
    var diffs = sorted.map(function(d) { return d.clc[alpha].diff; });
    var barColors = diffs.map(function(d) {
        return d >= 0 ? hexToRgba(colors.positive, 0.7) : hexToRgba(colors.negative, 0.7);
    });
    var borderCols = diffs.map(function(d) {
        return d >= 0 ? colors.positive : colors.negative;
    });

    // Adjust canvas height for 40 bars
    var wrapper = document.getElementById('chart-wrapper');
    wrapper.style.height = Math.max(450, sorted.length * 20) + 'px';

    chartState.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '\u0394 CLC_\u03b1 (BoostAODE - AODE)',
                data: diffs,
                backgroundColor: barColors,
                borderColor: borderCols,
                borderWidth: 1,
                borderRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        label: function(ctx) {
                            var val = ctx.raw;
                            return '\u0394 CLC_' + alpha + ': ' + (val >= 0 ? '+' : '') + val.toFixed(4);
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: '\u0394 CLC_\u03b1 (\u03b1=' + alpha + ')', color: colors.textSec, font: { size: 13 } },
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                },
                y: {
                    ticks: { color: colors.textMuted, font: { size: 10 } },
                    grid: { display: false }
                }
            }
        },
        plugins: [{
            id: 'zeroLine',
            beforeDraw: function(chart) {
                var ctx2 = chart.ctx;
                var xScale = chart.scales.x;
                var chartArea = chart.chartArea;
                var x0 = xScale.getPixelForValue(0);
                ctx2.save();
                ctx2.strokeStyle = colors.neutral;
                ctx2.lineWidth = 1.5;
                ctx2.setLineDash([4, 3]);
                ctx2.beginPath();
                ctx2.moveTo(x0, chartArea.top);
                ctx2.lineTo(x0, chartArea.bottom);
                ctx2.stroke();
                ctx2.restore();
            }
        }]
    });
}

// ===========================================================================
// CHART 12: Accuracy Distribution (strip plot)
// ===========================================================================

function renderAccuracyDistribution() {
    var colors = getChartColors();
    var datasets = AppData.paired.datasets;
    var ctx = document.getElementById('chart-canvas').getContext('2d');

    // Reset wrapper height
    var wrapper = document.getElementById('chart-wrapper');
    wrapper.style.height = '450px';

    var aodeAccs = datasets.map(function(d) { return d.acc_AODE; });
    var boostAccs = datasets.map(function(d) { return d.acc_BoostAODE; });

    var statsAode = computeQuartiles(aodeAccs);
    var statsBoost = computeQuartiles(boostAccs);

    // Jittered scatter
    function jitter(arr, xCenter) {
        return arr.map(function(v, i) {
            return { x: xCenter + (Math.random() - 0.5) * 0.35, y: v, dataset: datasets[i].dataset };
        });
    }

    chartState.chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'AODE',
                    data: jitter(aodeAccs, 0),
                    backgroundColor: hexToRgba(colors.aode, 0.6),
                    borderColor: colors.aode,
                    borderWidth: 1,
                    pointRadius: 5,
                    pointHoverRadius: 8
                },
                {
                    label: 'BoostAODE',
                    data: jitter(boostAccs, 1),
                    backgroundColor: hexToRgba(colors.boostaode, 0.6),
                    borderColor: colors.boostaode,
                    borderWidth: 1,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: colors.textSec, font: { size: 12 }, usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: colors.bgElevated,
                    titleColor: colors.text,
                    bodyColor: colors.textSec,
                    borderColor: colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: {
                        title: function() { return ''; },
                        label: function(ctx) {
                            var p = ctx.raw;
                            return [p.dataset, 'Accuracy: ' + p.y.toFixed(4)];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: -0.5,
                    max: 1.5,
                    ticks: {
                        callback: function(val) {
                            if (val === 0) return 'AODE';
                            if (val === 1) return 'BoostAODE';
                            return '';
                        },
                        color: colors.textSec,
                        font: { size: 13, weight: '600' }
                    },
                    grid: { display: false }
                },
                y: {
                    title: { display: true, text: 'Accuracy', color: colors.textSec, font: { size: 13 } },
                    ticks: { color: colors.textMuted, font: { size: 11 } },
                    grid: { color: colors.gridDark }
                }
            }
        },
        plugins: [{
            id: 'meanMedianLines',
            afterDraw: function(chart) {
                var ctx2 = chart.ctx;
                var xScale = chart.scales.x;
                var yScale = chart.scales.y;

                var sets = [
                    { stats: statsAode, xCenter: 0, color: colors.aode },
                    { stats: statsBoost, xCenter: 1, color: colors.boostaode }
                ];

                sets.forEach(function(item) {
                    var xLeft = xScale.getPixelForValue(item.xCenter - 0.3);
                    var xRight = xScale.getPixelForValue(item.xCenter + 0.3);

                    ctx2.save();

                    // Mean line (solid, thick)
                    var yMean = yScale.getPixelForValue(item.stats.mean);
                    ctx2.strokeStyle = item.color;
                    ctx2.lineWidth = 3;
                    ctx2.setLineDash([]);
                    ctx2.beginPath();
                    ctx2.moveTo(xLeft, yMean);
                    ctx2.lineTo(xRight, yMean);
                    ctx2.stroke();

                    // Median line (dashed)
                    var yMed = yScale.getPixelForValue(item.stats.median);
                    ctx2.lineWidth = 2;
                    ctx2.setLineDash([4, 3]);
                    ctx2.beginPath();
                    ctx2.moveTo(xLeft, yMed);
                    ctx2.lineTo(xRight, yMed);
                    ctx2.stroke();

                    // Labels
                    ctx2.fillStyle = item.color;
                    ctx2.font = '10px ' + getComputedStyle(document.documentElement).getPropertyValue('--font-family').trim();
                    ctx2.textAlign = 'left';
                    ctx2.fillText('\u03bc=' + item.stats.mean.toFixed(3), xRight + 4, yMean + 3);
                    ctx2.fillText('med=' + item.stats.median.toFixed(3), xRight + 4, yMed + 3);

                    ctx2.restore();
                });
            }
        }]
    });
}

// ===========================================================================
// Theme change observer: re-render chart when theme changes
// ===========================================================================

(function() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            if (m.attributeName === 'data-theme' && AppData.loaded) {
                renderChart(chartState.currentChart);
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
})();

// ===========================================================================
// Initialization
// ===========================================================================

document.addEventListener('DOMContentLoaded', async function() {
    showLoading();
    var ok = await AppData.loadAll();
    if (!ok) {
        hideLoading();
        document.getElementById('chart-title').textContent = 'Error al cargar los datos';
        return;
    }
    renderChartSelector();
    selectChart('scatter-accuracy');
    hideLoading();
});

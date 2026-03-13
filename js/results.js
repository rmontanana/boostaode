/* ==========================================================================
   Results Page — Main Logic
   BoostAODE vs AODE Web App
   ========================================================================== */

const state = {
    view: 'summary',
    alpha: '0.5',
    segment: 'all',
    search: '',
    sortColumn: 'dataset',
    sortDirection: 'asc',
    currentPage: 1,
    pageSize: 20,
    rawPageSize: 50,
    rawSortColumn: 'dataset',
    rawSortDirection: 'asc',
    rawCurrentPage: 1,
    rawClassifierFilter: 'all'
};

let debounceTimer = null;

/* --------------------------------------------------------------------------
   Initialization
   -------------------------------------------------------------------------- */

async function init() {
    showLoading();
    const ok = await AppData.loadAll();
    hideLoading();

    if (!ok) {
        document.getElementById('main-content').innerHTML =
            '<div class="empty-state"><div class="empty-state-title">' + i18n.t('common.errorLoading') + '</div>' +
            '<div class="empty-state-text">' + i18n.t('common.errorLoadingDesc') + '</div></div>';
        return;
    }

    setupEventListeners();
    renderStatsCards();
    renderSummaryTable();
    renderStatisticalTests();
    renderSegmentedAnalysis();

    document.addEventListener('langchange', function() {
        renderStatsCards();
        renderSummaryTable();
        renderRawTable();
        renderStatisticalTests();
        renderSegmentedAnalysis();
    });
}

function setupEventListeners() {
    // Tabs
    document.querySelectorAll('[data-tab]').forEach(function(tab) {
        tab.addEventListener('click', function() {
            switchView(this.getAttribute('data-tab'));
        });
    });

    // Alpha selector
    var alphaSelect = document.getElementById('alpha-select');
    if (alphaSelect) {
        alphaSelect.addEventListener('change', function() {
            updateAlpha(this.value);
        });
    }

    // Segment radios
    document.querySelectorAll('input[name="segment"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            filterBySegment(this.value);
        });
    });

    // Search input
    var searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            var value = this.value;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function() {
                state.search = value.toLowerCase().trim();
                if (state.view === 'summary') {
                    state.currentPage = 1;
                    renderSummaryTable();
                } else {
                    state.rawCurrentPage = 1;
                    renderRawTable();
                }
            }, 300);
        });
    }

    // Classifier filter (raw view)
    var classifierFilter = document.getElementById('classifier-filter');
    if (classifierFilter) {
        classifierFilter.addEventListener('change', function() {
            state.rawClassifierFilter = this.value;
            state.rawCurrentPage = 1;
            renderRawTable();
        });
    }

    // Export CSV
    var exportBtn = document.getElementById('export-csv');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportCSV);
    }
}

/* --------------------------------------------------------------------------
   Stats Cards
   -------------------------------------------------------------------------- */

function renderStatsCards() {
    var summary = AppData.summary;
    var stats = summary.global_stats;
    var nDatasets = summary.dataset_list.length;

    // Card 1: Datasets
    var card1Value = document.getElementById('stat-datasets-value');
    var card1Label = document.getElementById('stat-datasets-label');
    if (card1Value) card1Value.textContent = nDatasets;
    if (card1Label) card1Label.textContent = i18n.t('results.statDatasetsLabel');

    // Card 2: Accuracy media
    var card2Value = document.getElementById('stat-accuracy-value');
    var card2Label = document.getElementById('stat-accuracy-label');
    if (card2Value) {
        card2Value.innerHTML = formatNumber(stats.mean_accuracy.AODE, 4) +
            ' <span class="text-muted text-sm">vs</span> ' +
            formatNumber(stats.mean_accuracy.BoostAODE, 4);
    }
    if (card2Label) card2Label.textContent = i18n.t('results.statAccuracyLabel');

    // Card 3: CLC a=0.5
    renderCLCCard();

    // Card 4: Wins/Ties/Losses
    renderWTLCard();
}

function renderCLCCard() {
    var stats = AppData.summary.global_stats;
    var alpha = state.alpha;
    var clcKey = 'mean_CLC_' + alpha;
    var card3Value = document.getElementById('stat-clc-value');
    var card3Label = document.getElementById('stat-clc-label');

    // Use summary data for CLC
    var clcData = stats[clcKey];
    if (clcData && card3Value) {
        card3Value.innerHTML = formatNumber(clcData.AODE, 4) +
            ' <span class="text-muted text-sm">vs</span> ' +
            formatNumber(clcData.BoostAODE, 4);
    } else if (card3Value) {
        // Fallback: compute from paired data
        var paired = AppData.paired.datasets;
        var sumAODE = 0, sumBoost = 0, count = 0;
        for (var i = 0; i < paired.length; i++) {
            var d = paired[i];
            if (d.clc && d.clc[alpha]) {
                sumAODE += d.clc[alpha].AODE;
                sumBoost += d.clc[alpha].BoostAODE;
                count++;
            }
        }
        if (count > 0) {
            card3Value.innerHTML = formatNumber(sumAODE / count, 4) +
                ' <span class="text-muted text-sm">vs</span> ' +
                formatNumber(sumBoost / count, 4);
        }
    }
    if (card3Label) card3Label.textContent = i18n.t('results.statCLCLabel', alpha);
}

function renderWTLCard() {
    var alpha = state.alpha;
    var tests = AppData.tests.tests;
    var clcMetric = 'CLC_' + alpha;
    var testData = null;

    for (var i = 0; i < tests.length; i++) {
        if (tests[i].metric === clcMetric) {
            testData = tests[i];
            break;
        }
    }

    var card4Value = document.getElementById('stat-wtl-value');
    var card4Label = document.getElementById('stat-wtl-label');
    var card4Bar = document.getElementById('stat-wtl-bar');

    if (testData) {
        var w = testData.wins;
        var t = testData.ties;
        var l = testData.losses;
        var total = w + t + l;

        if (card4Value) {
            card4Value.innerHTML =
                '<span class="text-success">' + w + '</span>' +
                ' / <span class="text-muted">' + t + '</span>' +
                ' / <span class="text-error">' + l + '</span>';
        }
        if (card4Label) card4Label.textContent = i18n.t('results.statWTLLabel', alpha);
        if (card4Bar) {
            card4Bar.innerHTML =
                '<div class="progress-bar" style="margin-top:6px">' +
                '<div class="progress-segment progress-segment--win" style="width:' + (w / total * 100) + '%"></div>' +
                '<div class="progress-segment progress-segment--tie" style="width:' + (t / total * 100) + '%"></div>' +
                '<div class="progress-segment progress-segment--loss" style="width:' + (l / total * 100) + '%"></div>' +
                '</div>';
        }
    }
}

/* --------------------------------------------------------------------------
   Summary Table
   -------------------------------------------------------------------------- */

function getSummaryData() {
    var datasets = AppData.paired.datasets;
    var alpha = state.alpha;
    var filtered = [];

    for (var i = 0; i < datasets.length; i++) {
        var d = datasets[i];

        // Segment filter
        if (state.segment !== 'all') {
            var passSegment = false;
            if (state.segment === 'high_dim' && d.n_features > 50) passSegment = true;
            if (state.segment === 'low_dim' && d.n_features <= 50) passSegment = true;
            if (state.segment === 'small' && d.n_samples < 1000) passSegment = true;
            if (state.segment === 'large' && d.n_samples >= 1000) passSegment = true;
            if (!passSegment) continue;
        }

        // Search filter
        if (state.search && d.dataset.toLowerCase().indexOf(state.search) === -1) {
            continue;
        }

        var clc = d.clc && d.clc[alpha] ? d.clc[alpha] : null;

        filtered.push({
            dataset: d.dataset,
            n_samples: d.n_samples,
            n_features: d.n_features,
            n_classes: d.n_classes,
            acc_AODE: d.acc_AODE,
            acc_BoostAODE: d.acc_BoostAODE,
            acc_diff: d.acc_diff,
            n_spodes_BoostAODE: d.n_spodes_BoostAODE,
            compression_ratio: d.compression_ratio,
            clc_AODE: clc ? clc.AODE : null,
            clc_BoostAODE: clc ? clc.BoostAODE : null,
            clc_diff: clc ? clc.diff : null,
            alpha_breakeven: d.alpha_breakeven
        });
    }

    // Sort
    var col = state.sortColumn;
    var dir = state.sortDirection === 'asc' ? 1 : -1;
    filtered.sort(function(a, b) {
        var va = a[col];
        var vb = b[col];
        if (va === null || va === undefined) va = -Infinity;
        if (vb === null || vb === undefined) vb = -Infinity;
        if (typeof va === 'string') {
            return va.localeCompare(vb) * dir;
        }
        return (va - vb) * dir;
    });

    return filtered;
}

function renderSummaryTable() {
    var data = getSummaryData();
    var totalPages = Math.max(1, Math.ceil(data.length / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;

    var start = (state.currentPage - 1) * state.pageSize;
    var end = Math.min(start + state.pageSize, data.length);
    var pageData = data.slice(start, end);

    var alpha = state.alpha;

    // Build header
    var columns = [
        { key: 'dataset', label: i18n.t('results.colDataset') },
        { key: 'n_samples', label: i18n.t('results.colSamples') },
        { key: 'n_features', label: i18n.t('results.colFeatures') },
        { key: 'n_classes', label: i18n.t('results.colClasses') },
        { key: 'acc_AODE', label: i18n.t('results.colAccAODE') },
        { key: 'acc_BoostAODE', label: i18n.t('results.colAccBoost') },
        { key: 'acc_diff', label: i18n.t('results.colAccDiff') },
        { key: 'n_spodes_BoostAODE', label: i18n.t('results.colSPODEs') },
        { key: 'compression_ratio', label: i18n.t('results.colCompression') },
        { key: 'clc_AODE', label: i18n.t('results.colCLCAODE') },
        { key: 'clc_BoostAODE', label: i18n.t('results.colCLCBoost') },
        { key: 'clc_diff', label: i18n.t('results.colCLCDiff') },
        { key: 'alpha_breakeven', label: i18n.t('results.colAlphaBreak') }
    ];

    var thead = '<thead><tr>';
    for (var c = 0; c < columns.length; c++) {
        var col = columns[c];
        var sortClass = 'sortable';
        if (state.sortColumn === col.key) {
            sortClass += state.sortDirection === 'asc' ? ' sort-active-asc' : ' sort-active-desc';
        }
        thead += '<th class="' + sortClass + '" data-sort="' + col.key + '">' +
            col.label +
            '<span class="sort-icon"><span class="sort-asc">\u25B2</span><span class="sort-desc">\u25BC</span></span>' +
            '</th>';
    }
    thead += '</tr></thead>';

    // Build body
    var tbody = '<tbody>';
    for (var i = 0; i < pageData.length; i++) {
        var d = pageData[i];
        tbody += '<tr>';
        tbody += '<td class="font-semibold">' + escapeHtml(d.dataset) + '</td>';
        tbody += '<td class="cell-mono">' + formatInt(d.n_samples) + '</td>';
        tbody += '<td class="cell-mono">' + d.n_features + '</td>';
        tbody += '<td class="cell-mono">' + d.n_classes + '</td>';
        tbody += '<td class="cell-mono">' + formatNumber(d.acc_AODE, 4) + '</td>';
        tbody += '<td class="cell-mono">' + formatNumber(d.acc_BoostAODE, 4) + '</td>';
        tbody += '<td class="cell-mono ' + getDiffClass(d.acc_diff) + '">' + formatDiff(d.acc_diff) + '</td>';
        tbody += '<td class="cell-mono">' + formatNumber(d.n_spodes_BoostAODE, 1) + '</td>';
        tbody += '<td class="cell-mono">' + formatPercent(d.compression_ratio, 1) + '</td>';
        tbody += '<td class="cell-mono">' + formatNumber(d.clc_AODE, 4) + '</td>';
        tbody += '<td class="cell-mono">' + formatNumber(d.clc_BoostAODE, 4) + '</td>';
        tbody += '<td class="cell-mono ' + getDiffClass(d.clc_diff) + '">' + formatDiff(d.clc_diff) + '</td>';
        tbody += '<td class="cell-mono">' + formatAlphaBreakeven(d.alpha_breakeven) + '</td>';
        tbody += '</tr>';
    }
    if (pageData.length === 0) {
        tbody += '<tr><td colspan="' + columns.length + '" class="text-center text-muted" style="padding:24px">' + i18n.t('common.noResults') + '</td></tr>';
    }
    tbody += '</tbody>';

    var container = document.getElementById('summary-table');
    if (container) {
        container.innerHTML =
            '<div class="table-wrapper"><table class="data-table" id="summary-data-table">' +
            thead + tbody +
            '</table></div>';

        // Attach sort listeners
        container.querySelectorAll('th.sortable').forEach(function(th) {
            th.addEventListener('click', function() {
                var key = this.getAttribute('data-sort');
                if (state.sortColumn === key) {
                    state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    state.sortColumn = key;
                    state.sortDirection = 'asc';
                }
                state.currentPage = 1;
                renderSummaryTable();
            });
        });
    }

    renderPagination('summary-pagination', state.currentPage, totalPages, data.length, function(page) {
        state.currentPage = page;
        renderSummaryTable();
    });
}

/* --------------------------------------------------------------------------
   Raw Table
   -------------------------------------------------------------------------- */

function getRawData() {
    var results = AppData.experimental.results;
    var filtered = [];

    for (var i = 0; i < results.length; i++) {
        var r = results[i];

        // Classifier filter
        if (state.rawClassifierFilter !== 'all' && r.classifier !== state.rawClassifierFilter) {
            continue;
        }

        // Search filter
        if (state.search && r.dataset.toLowerCase().indexOf(state.search) === -1) {
            continue;
        }

        filtered.push(r);
    }

    // Sort
    var col = state.rawSortColumn;
    var dir = state.rawSortDirection === 'asc' ? 1 : -1;
    filtered.sort(function(a, b) {
        var va = a[col];
        var vb = b[col];
        if (va === null || va === undefined) va = -Infinity;
        if (vb === null || vb === undefined) vb = -Infinity;
        if (typeof va === 'string') {
            return va.localeCompare(vb) * dir;
        }
        return (va - vb) * dir;
    });

    return filtered;
}

function renderRawTable() {
    var data = getRawData();
    var totalPages = Math.max(1, Math.ceil(data.length / state.rawPageSize));
    if (state.rawCurrentPage > totalPages) state.rawCurrentPage = totalPages;

    var start = (state.rawCurrentPage - 1) * state.rawPageSize;
    var end = Math.min(start + state.rawPageSize, data.length);
    var pageData = data.slice(start, end);

    var columns = [
        { key: 'dataset', label: i18n.t('results.colDataset') },
        { key: 'classifier', label: i18n.t('results.colClassifier') },
        { key: 'fold', label: i18n.t('results.colFold') },
        { key: 'repetition', label: i18n.t('results.colRep') },
        { key: 'seed', label: i18n.t('results.colSeed') },
        { key: 'accuracy', label: i18n.t('common.accuracy') },
        { key: 'n_spodes', label: i18n.t('results.colNSpodes') },
        { key: 'train_time', label: i18n.t('results.colTrainTime') },
        { key: 'predict_time', label: i18n.t('results.colPredictTime') }
    ];

    var thead = '<thead><tr>';
    for (var c = 0; c < columns.length; c++) {
        var col = columns[c];
        var sortClass = 'sortable';
        if (state.rawSortColumn === col.key) {
            sortClass += state.rawSortDirection === 'asc' ? ' sort-active-asc' : ' sort-active-desc';
        }
        thead += '<th class="' + sortClass + '" data-sort="' + col.key + '">' +
            col.label +
            '<span class="sort-icon"><span class="sort-asc">\u25B2</span><span class="sort-desc">\u25BC</span></span>' +
            '</th>';
    }
    thead += '</tr></thead>';

    var tbody = '<tbody>';
    for (var i = 0; i < pageData.length; i++) {
        var r = pageData[i];
        var clsClass = r.classifier === 'BoostAODE' ? 'text-accent' : 'text-info';
        tbody += '<tr>';
        tbody += '<td class="font-semibold">' + escapeHtml(r.dataset) + '</td>';
        tbody += '<td class="' + clsClass + ' font-medium">' + r.classifier + '</td>';
        tbody += '<td class="cell-mono">' + r.fold + '</td>';
        tbody += '<td class="cell-mono">' + r.repetition + '</td>';
        tbody += '<td class="cell-mono">' + r.seed + '</td>';
        tbody += '<td class="cell-mono">' + formatNumber(r.accuracy, 4) + '</td>';
        tbody += '<td class="cell-mono">' + r.n_spodes + '</td>';
        tbody += '<td class="cell-mono">' + formatNumber(r.train_time, 4) + '</td>';
        tbody += '<td class="cell-mono">' + formatNumber(r.predict_time, 4) + '</td>';
        tbody += '</tr>';
    }
    if (pageData.length === 0) {
        tbody += '<tr><td colspan="' + columns.length + '" class="text-center text-muted" style="padding:24px">' + i18n.t('common.noResults') + '</td></tr>';
    }
    tbody += '</tbody>';

    var container = document.getElementById('raw-table');
    if (container) {
        container.innerHTML =
            '<div class="table-wrapper"><table class="data-table" id="raw-data-table">' +
            thead + tbody +
            '</table></div>';

        container.querySelectorAll('th.sortable').forEach(function(th) {
            th.addEventListener('click', function() {
                var key = this.getAttribute('data-sort');
                if (state.rawSortColumn === key) {
                    state.rawSortDirection = state.rawSortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    state.rawSortColumn = key;
                    state.rawSortDirection = 'asc';
                }
                state.rawCurrentPage = 1;
                renderRawTable();
            });
        });
    }

    renderPagination('raw-pagination', state.rawCurrentPage, totalPages, data.length, function(page) {
        state.rawCurrentPage = page;
        renderRawTable();
    });
}

/* --------------------------------------------------------------------------
   Statistical Tests
   -------------------------------------------------------------------------- */

function renderStatisticalTests() {
    var tests = AppData.tests.tests;
    var container = document.getElementById('statistical-tests-table');
    if (!container) return;

    var thead = '<thead><tr>' +
        '<th>' + i18n.t('results.colMetric') + '</th>' +
        '<th>' + i18n.t('results.colStatW') + '</th>' +
        '<th>' + i18n.t('results.colPValue') + '</th>' +
        '<th>' + i18n.t('results.colSignificant') + '</th>' +
        '<th>' + i18n.t('results.colWins') + '</th>' +
        '<th>' + i18n.t('results.colTies') + '</th>' +
        '<th>' + i18n.t('results.colLosses') + '</th>' +
        '<th>' + i18n.t('results.colWTL') + '</th>' +
        '</tr></thead>';

    var tbody = '<tbody>';
    for (var i = 0; i < tests.length; i++) {
        var t = tests[i];
        var total = t.wins + t.ties + t.losses;
        var sigClass = t.significant ? '' : ' style="opacity:0.7"';
        tbody += '<tr' + sigClass + '>';
        tbody += '<td class="font-semibold">' + escapeHtml(t.metric) + '</td>';
        tbody += '<td class="cell-mono">' + formatNumber(t.wilcoxon_stat, 1) + '</td>';
        tbody += '<td class="cell-mono">' + formatPValue(t.p_value) + '</td>';
        tbody += '<td>' + getSignificanceBadge(t.p_value) + '</td>';
        tbody += '<td class="cell-mono text-success">' + t.wins + '</td>';
        tbody += '<td class="cell-mono text-muted">' + t.ties + '</td>';
        tbody += '<td class="cell-mono text-error">' + t.losses + '</td>';
        tbody += '<td style="min-width:120px">' +
            '<div class="progress-bar">' +
            '<div class="progress-segment progress-segment--win" style="width:' + (t.wins / total * 100) + '%"></div>' +
            '<div class="progress-segment progress-segment--tie" style="width:' + (t.ties / total * 100) + '%"></div>' +
            '<div class="progress-segment progress-segment--loss" style="width:' + (t.losses / total * 100) + '%"></div>' +
            '</div></td>';
        tbody += '</tr>';
    }
    tbody += '</tbody>';

    container.innerHTML =
        '<div class="table-wrapper"><table class="data-table">' +
        thead + tbody +
        '</table></div>';
}

/* --------------------------------------------------------------------------
   Segmented Analysis
   -------------------------------------------------------------------------- */

function renderSegmentedAnalysis() {
    var segments = AppData.segmented.segments;
    var container = document.getElementById('segmented-analysis-table');
    if (!container) return;

    // Group by segment name
    var segmentNames = [];
    var segmentMap = {};
    for (var i = 0; i < segments.length; i++) {
        var s = segments[i];
        if (!segmentMap[s.segment]) {
            segmentMap[s.segment] = [];
            segmentNames.push(s.segment);
        }
        segmentMap[s.segment].push(s);
    }

    var segmentLabels = {
        'all': i18n.t('results.segLabelAll'),
        'high_dim': i18n.t('results.segLabelHighDim'),
        'low_dim': i18n.t('results.segLabelLowDim'),
        'small': i18n.t('results.segLabelSmall'),
        'large': i18n.t('results.segLabelLarge')
    };

    var thead = '<thead><tr>' +
        '<th>' + i18n.t('results.colSegment') + '</th>' +
        '<th>' + i18n.t('results.colNDatasets') + '</th>' +
        '<th>' + i18n.t('results.colAlpha') + '</th>' +
        '<th>' + i18n.t('results.colPValue') + '</th>' +
        '<th>' + i18n.t('results.colSig') + '</th>' +
        '<th>' + i18n.t('results.colWins') + '</th>' +
        '<th>' + i18n.t('results.colTies') + '</th>' +
        '<th>' + i18n.t('results.colLosses') + '</th>' +
        '<th>' + i18n.t('results.colMeanCLCDiff') + '</th>' +
        '</tr></thead>';

    var tbody = '<tbody>';
    for (var si = 0; si < segmentNames.length; si++) {
        var segName = segmentNames[si];
        var rows = segmentMap[segName];
        for (var ri = 0; ri < rows.length; ri++) {
            var r = rows[ri];
            var sigRowClass = r.significant ? ' style="background-color: var(--color-success-light)"' : '';
            tbody += '<tr' + sigRowClass + '>';

            // Show segment label only on first row of group
            if (ri === 0) {
                tbody += '<td class="font-semibold" rowspan="' + rows.length + '">' +
                    (segmentLabels[segName] || segName) + '</td>';
            }
            tbody += '<td class="cell-mono">' + r.n_datasets + '</td>';
            tbody += '<td class="cell-mono">' + r.alpha + '</td>';
            tbody += '<td class="cell-mono">' + formatPValue(r.wilcoxon_p) + '</td>';
            tbody += '<td>' + getSignificanceBadge(r.wilcoxon_p) + '</td>';
            tbody += '<td class="cell-mono text-success">' + r.wins + '</td>';
            tbody += '<td class="cell-mono text-muted">' + r.ties + '</td>';
            tbody += '<td class="cell-mono text-error">' + r.losses + '</td>';
            tbody += '<td class="cell-mono ' + getDiffClass(r.mean_CLC_diff) + '">' + formatDiff(r.mean_CLC_diff) + '</td>';
            tbody += '</tr>';
        }
    }
    tbody += '</tbody>';

    container.innerHTML =
        '<div class="table-wrapper"><table class="data-table">' +
        thead + tbody +
        '</table></div>';
}

/* --------------------------------------------------------------------------
   View Switching
   -------------------------------------------------------------------------- */

function switchView(view) {
    state.view = view;

    // Update tab active state
    document.querySelectorAll('[data-tab]').forEach(function(tab) {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === view);
    });

    // Show/hide panels
    var summaryPanel = document.getElementById('summary-panel');
    var rawPanel = document.getElementById('raw-panel');
    if (summaryPanel) summaryPanel.classList.toggle('active', view === 'summary');
    if (rawPanel) rawPanel.classList.toggle('active', view === 'raw');

    // Show/hide controls
    var summaryControls = document.getElementById('summary-controls');
    var rawControls = document.getElementById('raw-controls');
    if (summaryControls) summaryControls.style.display = view === 'summary' ? 'flex' : 'none';
    if (rawControls) rawControls.style.display = view === 'raw' ? 'flex' : 'none';

    // Render the appropriate table
    if (view === 'summary') {
        renderSummaryTable();
    } else {
        renderRawTable();
    }
}

/* --------------------------------------------------------------------------
   Alpha Update
   -------------------------------------------------------------------------- */

function updateAlpha(alpha) {
    state.alpha = alpha;
    state.currentPage = 1;
    renderCLCCard();
    renderWTLCard();
    renderSummaryTable();
}

/* --------------------------------------------------------------------------
   Segment Filter
   -------------------------------------------------------------------------- */

function filterBySegment(segment) {
    state.segment = segment;
    state.currentPage = 1;
    renderSummaryTable();
}

/* --------------------------------------------------------------------------
   CSV Export
   -------------------------------------------------------------------------- */

function exportCSV() {
    var csv = '';
    var rows;

    if (state.view === 'summary') {
        var data = getSummaryData();
        csv = 'Dataset,Muestras,Features,Clases,Acc AODE,Acc BoostAODE,Delta Acc,' +
            'SPODEs BoostAODE,Compresion,CLC AODE,CLC BoostAODE,Delta CLC,Alpha Breakeven\n';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            csv += [
                csvEscape(d.dataset),
                d.n_samples,
                d.n_features,
                d.n_classes,
                d.acc_AODE,
                d.acc_BoostAODE,
                d.acc_diff,
                d.n_spodes_BoostAODE,
                d.compression_ratio,
                d.clc_AODE,
                d.clc_BoostAODE,
                d.clc_diff,
                d.alpha_breakeven !== null ? d.alpha_breakeven : ''
            ].join(',') + '\n';
        }
    } else {
        var data = getRawData();
        csv = 'Dataset,Classifier,Fold,Repetition,Seed,Accuracy,n_SPODEs,Train_Time,Predict_Time\n';
        for (var i = 0; i < data.length; i++) {
            var r = data[i];
            csv += [
                csvEscape(r.dataset),
                r.classifier,
                r.fold,
                r.repetition,
                r.seed,
                r.accuracy,
                r.n_spodes,
                r.train_time,
                r.predict_time
            ].join(',') + '\n';
        }
    }

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = state.view === 'summary' ? 'resultados_resumen.csv' : 'resultados_crudos.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/* --------------------------------------------------------------------------
   Pagination
   -------------------------------------------------------------------------- */

function renderPagination(containerId, currentPage, totalPages, totalItems, onPageChange) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = '<div class="text-sm text-muted text-center" style="padding:8px">' +
            i18n.t('results.pagination', totalItems, currentPage, totalPages) + '</div>';
        return;
    }

    var html = '<div class="pagination">';

    // Previous button
    html += '<button class="pagination-btn" data-page="' + (currentPage - 1) + '"' +
        (currentPage === 1 ? ' disabled' : '') + '>' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
        '</button>';

    // Page numbers
    var pages = getPaginationRange(currentPage, totalPages);
    for (var i = 0; i < pages.length; i++) {
        var p = pages[i];
        if (p === '...') {
            html += '<span class="pagination-ellipsis">...</span>';
        } else {
            html += '<button class="pagination-btn' + (p === currentPage ? ' active' : '') +
                '" data-page="' + p + '">' + p + '</button>';
        }
    }

    // Next button
    html += '<button class="pagination-btn" data-page="' + (currentPage + 1) + '"' +
        (currentPage === totalPages ? ' disabled' : '') + '>' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
        '</button>';

    html += '</div>';
    html += '<div class="text-sm text-muted text-center">' +
        i18n.t('results.pagination', totalItems, currentPage, totalPages) + '</div>';

    container.innerHTML = html;

    // Attach click handlers
    container.querySelectorAll('.pagination-btn:not([disabled])').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var page = parseInt(this.getAttribute('data-page'));
            if (page >= 1 && page <= totalPages) {
                onPageChange(page);
            }
        });
    });
}

function getPaginationRange(current, total) {
    if (total <= 7) {
        var arr = [];
        for (var i = 1; i <= total; i++) arr.push(i);
        return arr;
    }

    var pages = [];
    pages.push(1);

    if (current > 3) {
        pages.push('...');
    }

    var start = Math.max(2, current - 1);
    var end = Math.min(total - 1, current + 1);

    for (var i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push('...');
    }

    pages.push(total);

    return pages;
}

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function csvEscape(str) {
    if (!str) return '';
    if (str.indexOf(',') !== -1 || str.indexOf('"') !== -1 || str.indexOf('\n') !== -1) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

function formatInt(n) {
    if (n === null || n === undefined) return '\u2014';
    return Number(n).toLocaleString(i18n.getLang() === 'es' ? 'es-ES' : 'en-US');
}

function formatDiff(n) {
    if (n === null || n === undefined || isNaN(n)) return '\u2014';
    var abs = Math.abs(n);
    if (abs < 1e-6) return '0.0000';
    var sign = n > 0 ? '+' : '';
    return sign + n.toFixed(4);
}

function formatAlphaBreakeven(val) {
    if (val === null || val === undefined) return '<span class="badge badge-success">N/A</span>';
    if (val === 0) return '<span class="badge badge-neutral">0.0</span>';
    return formatNumber(val, 3);
}

/* --------------------------------------------------------------------------
   DOM Ready
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', init);

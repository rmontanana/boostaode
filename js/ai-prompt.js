/* ==========================================================================
   AI Prompt Generator — BoostAODE vs AODE
   Generates context-rich prompts for external AI consultation
   ========================================================================== */

const promptState = {
    detailLevel: 'basic',    // 'basic', 'detailed', 'complete'
    format: 'text',          // 'text', 'json', 'csv'
    question: '',
    generatedPrompt: ''
};

const exampleQuestions = [
    "\u00bfEn qu\u00e9 datasets BoostAODE supera significativamente a AODE en accuracy?",
    "\u00bfCu\u00e1l es el valor de \u03b1 breakeven t\u00edpico y qu\u00e9 significa para la elecci\u00f3n entre clasificadores?",
    "Analiza la relaci\u00f3n entre la dimensionalidad del dataset y la ventaja de BoostAODE",
    "\u00bfEn qu\u00e9 escenarios no merece la pena usar BoostAODE frente a AODE?",
    "Resume los resultados principales respondiendo a las preguntas de investigaci\u00f3n RQ1-RQ5",
    "\u00bfC\u00f3mo afecta el tama\u00f1o del dataset a la compresi\u00f3n que consigue BoostAODE?"
];

let debounceTimer = null;

/* --------------------------------------------------------------------------
   Initialization
   -------------------------------------------------------------------------- */

function init() {
    // Detail level radio buttons
    document.querySelectorAll('input[name="detail-level"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            promptState.detailLevel = this.value;
            generatePrompt();
        });
    });

    // Format radio buttons
    document.querySelectorAll('input[name="data-format"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            promptState.format = this.value;
            generatePrompt();
        });
    });

    // Question textarea
    var textarea = document.getElementById('prompt-question');
    if (textarea) {
        textarea.addEventListener('input', function() {
            var value = this.value;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function() {
                promptState.question = value;
                generatePrompt();
            }, 300);
        });
    }

    // Example question chips
    document.querySelectorAll('.example-chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
            var q = this.getAttribute('data-question');
            setQuestion(q);
        });
    });

    // Copy button
    var copyBtn = document.getElementById('copy-prompt-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPrompt);
    }

    // Generate initial prompt
    generatePrompt();
}

/* --------------------------------------------------------------------------
   Prompt Generation
   -------------------------------------------------------------------------- */

function generatePrompt() {
    var prompt = buildPrompt();
    promptState.generatedPrompt = prompt;

    var output = document.getElementById('prompt-output');
    if (output) {
        output.value = prompt;
    }

    updateTokenEstimate(prompt);
}

function buildPrompt() {
    var dataSection = '';
    switch (promptState.detailLevel) {
        case 'basic':
            dataSection = buildBasicContext();
            break;
        case 'detailed':
            dataSection = buildDetailedContext();
            break;
        case 'complete':
            dataSection = buildCompleteContext();
            break;
    }

    var questionSection = promptState.question.trim()
        ? promptState.question.trim()
        : '(Escribe tu pregunta arriba)';

    var prompt =
        'Eres un experto en machine learning y clasificadores bayesianos. Analiza los siguientes resultados experimentales y responde la pregunta del usuario.\n\n' +
        '## Contexto del Experimento\n' +
        'Se compara BoostAODE (ensemble boosted de SPODEs que selecciona un subconjunto de super-parents) contra AODE (Averaged One-Dependence Estimators, que usa todos los features como super-parents).\n' +
        '- 40 datasets de OpenML\n' +
        '- Validaci\u00f3n cruzada estratificada: 5 folds \u00d7 5 repeticiones\n' +
        '- Semillas: [42, 123, 456, 789, 1024]\n' +
        '- M\u00e9trica principal: CLC_\u03b1 = \u03b1 \u00d7 accuracy + (1 - \u03b1) \u00d7 (1 - n_spodes / n_features)\n' +
        '- Valores de \u03b1 analizados: 0.5, 0.6, 0.7, 0.8, 0.9, 1.0\n\n' +
        '## Datos\n' +
        dataSection + '\n\n' +
        '## Pregunta\n' +
        questionSection + '\n\n' +
        'Responde en espa\u00f1ol con an\u00e1lisis detallado, referencias a los datos y conclusiones fundamentadas.';

    return prompt;
}

/* --------------------------------------------------------------------------
   Basic Context (~2K tokens)
   -------------------------------------------------------------------------- */

function buildBasicContext() {
    if (!AppData.loaded) return '(Datos no cargados)';

    var summary = AppData.summary;
    var tests = AppData.tests;
    var segmented = AppData.segmented;
    var paired = AppData.paired;

    var lines = [];

    // Global stats
    lines.push('### Estad\u00edsticas Globales');
    lines.push('- N\u00famero de datasets: ' + summary.dataset_list.length);
    lines.push('- Clasificadores: AODE, BoostAODE');
    lines.push('- Folds: ' + summary.config.n_folds + ', Repeticiones: ' + summary.config.n_repetitions);
    lines.push('- Accuracy media AODE: ' + summary.global_stats.mean_accuracy.AODE.toFixed(4));
    lines.push('- Accuracy media BoostAODE: ' + summary.global_stats.mean_accuracy.BoostAODE.toFixed(4));
    lines.push('- CLC_0.5 media AODE: ' + summary.global_stats['mean_CLC_0.5'].AODE.toFixed(4));
    lines.push('- CLC_0.5 media BoostAODE: ' + summary.global_stats['mean_CLC_0.5'].BoostAODE.toFixed(4));
    lines.push('');

    // Wins/Ties/Losses
    lines.push('### Wins/Ties/Losses (BoostAODE vs AODE)');
    if (tests && tests.tests) {
        tests.tests.forEach(function(t) {
            var sig = t.significant ? ' ***' : ' (NS)';
            lines.push('- ' + t.metric + ': ' + t.wins + '/' + t.ties + '/' + t.losses +
                ' (p=' + formatPVal(t.p_value) + ')' + sig);
        });
    }
    lines.push('');

    // Segment highlights
    lines.push('### Resultados por Segmento (CLC_0.5)');
    if (segmented && segmented.segments) {
        var alpha05 = segmented.segments.filter(function(s) { return s.alpha === 0.5; });
        alpha05.forEach(function(s) {
            var label = segmentLabel(s.segment);
            lines.push('- ' + label + ' (' + s.n_datasets + ' datasets): ' +
                s.wins + '/' + s.ties + '/' + s.losses +
                ', \u0394CLC medio=' + s.mean_CLC_diff.toFixed(4));
        });
    }
    lines.push('');

    // Compression ratio
    if (paired && paired.datasets) {
        var totalCR = 0;
        var countCR = 0;
        paired.datasets.forEach(function(d) {
            if (d.compression_ratio !== null && d.compression_ratio !== undefined) {
                totalCR += d.compression_ratio;
                countCR++;
            }
        });
        var meanCR = countCR > 0 ? totalCR / countCR : 0;
        lines.push('### Compresi\u00f3n');
        lines.push('- Ratio de compresi\u00f3n medio: ' + meanCR.toFixed(4) +
            ' (BoostAODE usa en media el ' + (meanCR * 100).toFixed(1) + '% de los SPODEs de AODE)');
    }

    return lines.join('\n');
}

/* --------------------------------------------------------------------------
   Detailed Context (~8K tokens)
   -------------------------------------------------------------------------- */

function buildDetailedContext() {
    if (!AppData.loaded) return '(Datos no cargados)';

    var lines = [];

    // Include basic context
    lines.push(buildBasicContext());
    lines.push('');

    // CLC definition
    lines.push('### Definici\u00f3n de CLC_\u03b1');
    lines.push('CLC_\u03b1 = \u03b1 \u00d7 accuracy + (1 - \u03b1) \u00d7 (1 - n_spodes / n_features)');
    lines.push('- AODE siempre usa n_spodes = n_features (simplicidad = 0)');
    lines.push('- BoostAODE selecciona k \u2264 n_features SPODEs (simplicidad = 1 - k/n_features)');
    lines.push('- \u03b1 breakeven: valor de \u03b1 donde CLC_\u03b1(AODE) = CLC_\u03b1(BoostAODE)');
    lines.push('');

    // Complete paired comparison table
    lines.push('### Comparaci\u00f3n por Dataset');
    var paired = AppData.paired;
    if (paired && paired.datasets) {
        if (promptState.format === 'json') {
            lines.push(formatPairedAsJSON(paired.datasets));
        } else if (promptState.format === 'csv') {
            lines.push(formatPairedAsCSV(paired.datasets));
        } else {
            lines.push(formatPairedAsText(paired.datasets));
        }
    }
    lines.push('');

    // Statistical tests
    lines.push('### Tests Estad\u00edsticos (Wilcoxon Signed-Rank)');
    var tests = AppData.tests;
    if (tests && tests.tests) {
        if (promptState.format === 'json') {
            lines.push(JSON.stringify(tests.tests));
        } else if (promptState.format === 'csv') {
            lines.push('metric,statistic,p_value,significant,wins,ties,losses');
            tests.tests.forEach(function(t) {
                lines.push(t.metric + ',' + t.wilcoxon_stat + ',' + t.p_value + ',' +
                    t.significant + ',' + t.wins + ',' + t.ties + ',' + t.losses);
            });
        } else {
            tests.tests.forEach(function(t) {
                lines.push('- ' + t.metric + ': W=' + t.wilcoxon_stat +
                    ', p=' + formatPVal(t.p_value) +
                    ', significativo=' + (t.significant ? 'S\u00ed' : 'No') +
                    ', W/T/L=' + t.wins + '/' + t.ties + '/' + t.losses);
            });
        }
    }
    lines.push('');

    // Segmented analysis
    lines.push('### An\u00e1lisis Segmentado Completo');
    var segmented = AppData.segmented;
    if (segmented && segmented.segments) {
        if (promptState.format === 'json') {
            lines.push(JSON.stringify(segmented.segments));
        } else if (promptState.format === 'csv') {
            lines.push('segment,n_datasets,alpha,p_value,significant,wins,ties,losses,mean_CLC_diff');
            segmented.segments.forEach(function(s) {
                lines.push(s.segment + ',' + s.n_datasets + ',' + s.alpha + ',' +
                    s.wilcoxon_p + ',' + s.significant + ',' +
                    s.wins + ',' + s.ties + ',' + s.losses + ',' + s.mean_CLC_diff);
            });
        } else {
            var currentSeg = '';
            segmented.segments.forEach(function(s) {
                if (s.segment !== currentSeg) {
                    currentSeg = s.segment;
                    lines.push('\n' + segmentLabel(s.segment) + ' (' + s.n_datasets + ' datasets):');
                }
                var sig = s.significant ? '***' : 'NS';
                lines.push('  \u03b1=' + s.alpha + ': W/T/L=' + s.wins + '/' + s.ties + '/' + s.losses +
                    ', \u0394CLC=' + s.mean_CLC_diff.toFixed(4) +
                    ', p=' + formatPVal(s.wilcoxon_p) + ' ' + sig);
            });
        }
    }

    return lines.join('\n');
}

/* --------------------------------------------------------------------------
   Complete Context (~50K tokens)
   -------------------------------------------------------------------------- */

function buildCompleteContext() {
    if (!AppData.loaded) return '(Datos no cargados)';

    var lines = [];

    // Include detailed context
    lines.push(buildDetailedContext());
    lines.push('');

    // All experimental results
    lines.push('### Resultados Experimentales Crudos (' +
        AppData.experimental.results.length + ' observaciones)');

    var results = AppData.experimental.results;
    if (promptState.format === 'json') {
        // Compressed JSON with short keys
        var compressed = results.map(function(r) {
            return {
                d: r.dataset,
                cl: r.classifier,
                f: r.fold,
                r: r.repetition,
                a: round4(r.accuracy),
                sp: r.n_spodes,
                tt: round4(r.train_time),
                pt: round4(r.predict_time)
            };
        });
        lines.push(JSON.stringify(compressed));
    } else if (promptState.format === 'csv') {
        lines.push('dataset,classifier,fold,rep,accuracy,n_spodes,train_time,predict_time');
        results.forEach(function(r) {
            lines.push(r.dataset + ',' + r.classifier + ',' + r.fold + ',' +
                r.repetition + ',' + round4(r.accuracy) + ',' + r.n_spodes + ',' +
                round4(r.train_time) + ',' + round4(r.predict_time));
        });
    } else {
        // Text table header
        lines.push(padRight('Dataset', 28) + padRight('Clasif.', 12) + padRight('Fold', 5) +
            padRight('Rep', 5) + padRight('Accuracy', 10) + padRight('SPODEs', 8) +
            padRight('T.Train', 10) + padRight('T.Pred', 10));
        lines.push('-'.repeat(98));
        results.forEach(function(r) {
            lines.push(
                padRight(r.dataset, 28) +
                padRight(r.classifier, 12) +
                padRight(String(r.fold), 5) +
                padRight(String(r.repetition), 5) +
                padRight(round4(r.accuracy), 10) +
                padRight(String(r.n_spodes), 8) +
                padRight(round4(r.train_time), 10) +
                padRight(round4(r.predict_time), 10)
            );
        });
    }

    return lines.join('\n');
}

/* --------------------------------------------------------------------------
   Data Formatting Functions
   -------------------------------------------------------------------------- */

function formatPairedAsText(datasets) {
    var lines = [];
    var header =
        padRight('Dataset', 28) +
        padRight('Samples', 8) +
        padRight('Feats', 6) +
        padRight('Acc AODE', 10) +
        padRight('Acc BAODE', 10) +
        padRight('\u0394 Acc', 9) +
        padRight('SPODEs', 8) +
        padRight('Compr', 7) +
        padRight('CLC.5 A', 9) +
        padRight('CLC.5 B', 9) +
        padRight('\u0394 CLC', 9);
    lines.push(header);
    lines.push('-'.repeat(header.length));

    datasets.forEach(function(d) {
        var clc05 = d.clc['0.5'];
        lines.push(
            padRight(d.dataset, 28) +
            padRight(String(d.n_samples), 8) +
            padRight(String(d.n_features), 6) +
            padRight(round4(d.acc_AODE), 10) +
            padRight(round4(d.acc_BoostAODE), 10) +
            padRight(formatDiff(d.acc_diff), 9) +
            padRight(round2(d.n_spodes_BoostAODE), 8) +
            padRight(round3(d.compression_ratio), 7) +
            padRight(round4(clc05.AODE), 9) +
            padRight(round4(clc05.BoostAODE), 9) +
            padRight(formatDiff(clc05.diff), 9)
        );
    });

    return lines.join('\n');
}

function formatPairedAsJSON(datasets) {
    var compressed = datasets.map(function(d) {
        var obj = {
            d: d.dataset,
            s: d.n_samples,
            f: d.n_features,
            c: d.n_classes,
            a1: round4num(d.acc_AODE),
            a2: round4num(d.acc_BoostAODE),
            sp: round2num(d.n_spodes_BoostAODE),
            cr: round3num(d.compression_ratio),
            clc: {}
        };
        ['0.5', '0.6', '0.7', '0.8', '0.9', '1.0'].forEach(function(alpha) {
            if (d.clc[alpha]) {
                obj.clc[alpha] = [
                    round4num(d.clc[alpha].AODE),
                    round4num(d.clc[alpha].BoostAODE)
                ];
            }
        });
        return obj;
    });
    return JSON.stringify(compressed);
}

function formatPairedAsCSV(datasets) {
    var lines = [];
    lines.push('d,s,f,c,a1,a2,sp,cr,c05a,c05b,c06a,c06b,c07a,c07b,c08a,c08b,c09a,c09b,c10a,c10b');

    datasets.forEach(function(d) {
        var row = [
            d.dataset,
            d.n_samples,
            d.n_features,
            d.n_classes,
            round4(d.acc_AODE),
            round4(d.acc_BoostAODE),
            round2(d.n_spodes_BoostAODE),
            round3(d.compression_ratio)
        ];
        ['0.5', '0.6', '0.7', '0.8', '0.9', '1.0'].forEach(function(alpha) {
            if (d.clc[alpha]) {
                row.push(round4(d.clc[alpha].AODE));
                row.push(round4(d.clc[alpha].BoostAODE));
            } else {
                row.push('');
                row.push('');
            }
        });
        lines.push(row.join(','));
    });

    return lines.join('\n');
}

/* --------------------------------------------------------------------------
   Token Estimation
   -------------------------------------------------------------------------- */

function estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
}

function updateTokenEstimate(prompt) {
    var tokens = estimateTokens(prompt);
    var badge = document.getElementById('token-badge');
    if (badge) {
        var formatted = tokens >= 1000 ? (tokens / 1000).toFixed(1) + 'K' : String(tokens);
        badge.textContent = '~' + formatted + ' tokens';

        // Update badge color class
        badge.className = 'token-badge';
        if (tokens > 40000) {
            badge.classList.add('token-badge--error');
        } else if (tokens > 10000) {
            badge.classList.add('token-badge--warning');
        }
    }

    // Update sidebar token estimate
    var sidebarTokens = document.getElementById('sidebar-token-estimate');
    if (sidebarTokens) {
        var formatted2 = tokens >= 1000 ? (tokens / 1000).toFixed(1) + 'K' : String(tokens);
        sidebarTokens.textContent = '~' + formatted2;
    }
}

/* --------------------------------------------------------------------------
   User Actions
   -------------------------------------------------------------------------- */

function setQuestion(q) {
    promptState.question = q;
    var textarea = document.getElementById('prompt-question');
    if (textarea) {
        textarea.value = q;
    }
    generatePrompt();
}

function copyPrompt() {
    var text = promptState.generatedPrompt;
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showCopyFeedback();
        }).catch(function() {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (e) {
        console.error('Copy failed', e);
    }
    document.body.removeChild(textarea);
}

function showCopyFeedback() {
    var toast = document.getElementById('copy-feedback');
    if (!toast) return;
    toast.classList.add('visible');
    setTimeout(function() {
        toast.classList.remove('visible');
    }, 2000);
}

/* --------------------------------------------------------------------------
   Helper Functions
   -------------------------------------------------------------------------- */

function round2(n) {
    if (n === null || n === undefined || isNaN(n)) return '--';
    return Number(n).toFixed(2);
}

function round3(n) {
    if (n === null || n === undefined || isNaN(n)) return '--';
    return Number(n).toFixed(3);
}

function round4(n) {
    if (n === null || n === undefined || isNaN(n)) return '--';
    return Number(n).toFixed(4);
}

function round2num(n) {
    if (n === null || n === undefined || isNaN(n)) return 0;
    return Math.round(n * 100) / 100;
}

function round3num(n) {
    if (n === null || n === undefined || isNaN(n)) return 0;
    return Math.round(n * 1000) / 1000;
}

function round4num(n) {
    if (n === null || n === undefined || isNaN(n)) return 0;
    return Math.round(n * 10000) / 10000;
}

function formatDiff(n) {
    if (n === null || n === undefined || isNaN(n)) return '--';
    var sign = n >= 0 ? '+' : '';
    return sign + Number(n).toFixed(4);
}

function formatPVal(p) {
    if (p === null || p === undefined) return 'N/A';
    if (p < 0.001) return '<0.001';
    if (p < 0.01) return p.toFixed(4);
    return p.toFixed(3);
}

function padRight(str, len) {
    str = String(str);
    while (str.length < len) str += ' ';
    return str;
}

function segmentLabel(seg) {
    var labels = {
        'all': 'Todos',
        'high_dim': 'Alta dimensionalidad',
        'low_dim': 'Baja dimensionalidad',
        'small': 'Datasets peque\u00f1os',
        'large': 'Datasets grandes'
    };
    return labels[seg] || seg;
}

/* --------------------------------------------------------------------------
   Bootstrap
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', async function() {
    showLoading();
    var ok = await AppData.loadAll();
    hideLoading();

    if (!ok) {
        var output = document.getElementById('prompt-output');
        if (output) {
            output.value = 'Error: No se pudieron cargar los datos experimentales.';
        }
        return;
    }

    init();
});

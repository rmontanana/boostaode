/**
 * Internationalization module (i18n)
 * Supports English (en) and Spanish (es). Default: English.
 */
const i18n = (() => {
    const translations = {
        en: {
            // === NAV ===
            'nav.brand': 'BoostAODE',
            'nav.results': 'Results',
            'nav.charts': 'Charts',
            'nav.ai': 'AI Query',
            'nav.themeTitle': 'Toggle light/dark theme',

            // === COMMON ===
            'common.loading': 'Loading data...',
            'common.loadingExperimental': 'Loading experimental data...',
            'common.errorLoading': 'Error loading data',
            'common.errorLoadingDesc': 'Could not load JSON files. Check that they exist in the data/ folder.',
            'common.noResults': 'No results found',
            'common.dataset': 'Dataset',
            'common.datasets': 'Datasets',
            'common.samples': 'Samples',
            'common.features': 'Features',
            'common.classes': 'Classes',
            'common.accuracy': 'Accuracy',
            'common.classifier': 'Classifier',
            'common.classifiers': 'Classifiers',
            'common.all': 'All',
            'common.results': 'Results',
            'common.exportCSV': 'Export CSV',
            'common.search': 'Search dataset...',
            'common.page': 'Page',
            'common.of': 'of',
            'common.result': 'result',
            'common.resultPlural': 'results',
            'common.downloadPNG': 'Download as PNG',
            'common.copy': 'Copy',
            'common.copied': 'Copied!',

            // === FOOTER ===
            'footer.text': 'BoostAODE vs AODE \u2014 Paired comparison experiment \u2014 40 datasets, 5-fold \u00d7 5 repetitions',
            'footer.credits': 'Credits',
            'footer.creditsTitle': 'View project credits',

            // === CREDITS ===
            'credits.title': 'About & Credits',
            'credits.author': 'Author',
            'credits.role': 'Researcher & Developer',
            'credits.techStack': 'Tech Stack',
            'credits.libraries': 'Libraries',
            'credits.contributors': 'Contributors',
            'credits.contributorDesc': 'AI Assistant',
            'credits.design': 'Design',

            // === RESULTS PAGE (index.html) ===
            'results.title': 'Results - BoostAODE vs AODE',
            'results.header': 'Experimental Results',
            'results.subtitle': 'BoostAODE vs AODE comparison over 40 datasets',

            // Stats cards
            'results.statDatasets': 'Datasets',
            'results.statDatasetsLabel': '5-fold \u00d7 5 repetitions',
            'results.statAccuracy': 'Mean accuracy',
            'results.statAccuracyLabel': 'AODE vs BoostAODE',
            'results.statCLC': 'CLC \u03b1={0}',
            'results.statCLCLabel': 'CLC \u03b1={0} (AODE vs BoostAODE)',
            'results.statWTL': 'Wins / Ties / Losses',
            'results.statWTLLabel': 'Wins / Ties / Losses (CLC \u03b1={0})',

            // Tabs
            'results.tabSummary': 'Summary by Dataset',
            'results.tabRaw': 'Raw Data',

            // Controls
            'results.classifierLabel': 'Classifier:',
            'results.segAll': 'All',
            'results.segSmall': 'Small',
            'results.segMedium': 'Medium',
            'results.segLarge': 'Large',

            // Summary table columns
            'results.colDataset': 'Dataset',
            'results.colSamples': 'Samples',
            'results.colFeatures': 'Features',
            'results.colClasses': 'Classes',
            'results.colAccAODE': 'Acc AODE',
            'results.colAccBoost': 'Acc BoostAODE',
            'results.colAccDiff': '\u0394 Acc',
            'results.colSPODEs': 'SPODEs Boost',
            'results.colCompression': 'Compression',
            'results.colCLCAODE': 'CLC AODE',
            'results.colCLCBoost': 'CLC Boost',
            'results.colCLCDiff': '\u0394 CLC',
            'results.colAlphaBreak': '\u03b1 breakeven',

            // Raw table columns
            'results.colClassifier': 'Classifier',
            'results.colFold': 'Fold',
            'results.colRep': 'Rep',
            'results.colSeed': 'Seed',
            'results.colNSpodes': 'n SPODEs',
            'results.colTrainTime': 'Train Time (s)',
            'results.colPredictTime': 'Predict Time (s)',

            // Statistical tests section
            'results.testsTitle': 'Statistical Tests (Wilcoxon Signed-Rank)',
            'results.testsBadge': 'BoostAODE vs AODE',
            'results.colMetric': 'Metric',
            'results.colStatW': 'W Statistic',
            'results.colPValue': 'p-value',
            'results.colSignificant': 'Significant',
            'results.colWins': 'Wins',
            'results.colTies': 'Ties',
            'results.colLosses': 'Losses',
            'results.colWTL': 'W/T/L',

            // Segmented analysis section
            'results.segTitle': 'Segmented Analysis',
            'results.segBadge': 'By dataset type',
            'results.colSegment': 'Segment',
            'results.colNDatasets': 'n Datasets',
            'results.colAlpha': '\u03b1',
            'results.colSig': 'Sig?',
            'results.colMeanCLCDiff': '\u0394 Mean CLC',

            // Segment labels (long form for segmented table)
            'results.segLabelAll': 'All',
            'results.segLabelSmall': 'Small (<10 feat.)',
            'results.segLabelMedium': 'Medium (10-99 feat.)',
            'results.segLabelLarge': 'Large (>=100 feat.)',

            // Pagination
            'results.pagination': '{0} result(s) \u2014 Page {1} of {2}',

            // === CHARTS PAGE ===
            'charts.title': 'Charts - BoostAODE vs AODE',
            'charts.header': 'Interactive Charts',
            'charts.subtitle': 'Visualization of BoostAODE vs AODE results',
            'charts.sidebarTitle': 'Chart type',
            'charts.loading': 'Loading...',

            // Chart names
            'charts.name.scatterAccuracy': 'Scatter Accuracy',
            'charts.name.scatterPareto': 'Accuracy vs Simplicity',
            'charts.name.clcBoxplots': 'Boxplots CLC_\u03b1',
            'charts.name.alphaBreakeven': 'Histogram \u03b1 Breakeven',
            'charts.name.compressionHist': 'SPODEs Usage Histogram',
            'charts.name.compressionFeatures': 'SPODEs Usage vs Features',
            'charts.name.timing': 'Timing Comparison',
            'charts.name.heatmap': 'Heatmap CLC Advantage',
            'charts.name.radar': 'Comparative Radar',
            'charts.name.winsByAlpha': 'Wins by \u03b1',
            'charts.name.clcRanking': 'Ranking \u0394 CLC',
            'charts.name.accuracyDist': 'Accuracy Distribution',

            // Chart descriptions
            'charts.desc.scatterAccuracy': 'Scatter plot comparing the mean accuracy of BoostAODE (Y axis) vs AODE (X axis) for each dataset. Points above the y=x diagonal indicate that BoostAODE outperforms AODE.',
            'charts.desc.scatterPareto': 'Pareto front: model simplicity (X axis) vs accuracy (Y axis). AODE always has simplicity 0 (uses all SPODEs). BoostAODE can achieve higher simplicity by selecting fewer SPODEs.',
            'charts.desc.clcBoxplots': 'Distribution of CLC_\u03b1 values for each classifier across the 40 datasets. Shows quartiles (Q1, median, Q3), whiskers (Tukey 1.5\u00d7IQR rule) and outliers.',
            'charts.desc.alphaBreakeven': 'Distribution of \u03b1 breakeven values across datasets. The \u03b1 breakeven is the value of \u03b1 at which CLC_\u03b1(AODE) equals CLC_\u03b1(BoostAODE). Datasets with no breakeven always favor BoostAODE.',
            'charts.desc.compressionHist': 'Distribution of the SPODEs usage ratio (n_spodes/n_features) across datasets. Lower values indicate that BoostAODE uses fewer SPODEs relative to the total number of features.',
            'charts.desc.compressionFeatures': 'Relationship between the number of features and the SPODEs usage ratio achieved by BoostAODE. Bubble size is proportional to the number of samples.',
            'charts.desc.timing': 'Comparison of mean training and prediction times between AODE and BoostAODE, averaged across all datasets, folds and repetitions.',
            'charts.desc.heatmap': 'Mean CLC_\u03b1 advantage of BoostAODE over AODE segmented by dataset type and \u03b1 value. Green indicates BoostAODE advantage; borders mark statistically significant results.',
            'charts.desc.radar': 'Radar chart comparing AODE and BoostAODE across 5 normalized axes: accuracy, simplicity, compression, training speed and prediction speed.',
            'charts.desc.winsByAlpha': 'Evolution of the number of BoostAODE wins as \u03b1 increases from 0.5 to 1.0. The green zone indicates statistical significance (p < 0.05).',
            'charts.desc.clcRanking': 'Ranking of all 40 datasets by CLC_\u03b1 difference (BoostAODE \u2212 AODE). Green bars indicate BoostAODE advantage; red bars indicate AODE advantage.',
            'charts.desc.accuracyDist': 'Distribution of mean accuracy values for both classifiers. Each point represents one dataset. Thick lines show the mean and dashed lines show the median.',

            // Chart axis labels and legends
            'charts.axis.accAODE': 'Accuracy AODE',
            'charts.axis.accBoost': 'Accuracy BoostAODE',
            'charts.axis.accuracy': 'Accuracy',
            'charts.axis.simplicity': 'Simplicity (1 - n_spodes/n_features)',
            'charts.axis.clcValue': 'CLC_\u03b1 Value',
            'charts.axis.datasets': 'Datasets',
            'charts.axis.count': 'Count',
            'charts.axis.compressionRatio': 'SPODEs Usage Ratio (n_spodes / n_features)',
            'charts.axis.nFeatures': 'Number of Features',
            'charts.axis.time': 'Time (seconds)',
            'charts.axis.alpha': '\u03b1',
            'charts.axis.wins': 'Number of wins',
            'charts.legend.aode': 'AODE',
            'charts.legend.boostaode': 'BoostAODE',
            'charts.legend.diagonal': 'Diagonal y=x',
            'charts.legend.mean': 'Mean',
            'charts.legend.median': 'Median',
            'charts.legend.significant': 'Significant (p<0.05)',
            'charts.legend.notSignificant': 'Not significant',
            'charts.legend.reference50': 'Reference 50%',
            'charts.legend.trainAODE': 'Train AODE',
            'charts.legend.trainBoost': 'Train BoostAODE',
            'charts.legend.predictAODE': 'Predict AODE',
            'charts.legend.predictBoost': 'Predict BoostAODE',
            'charts.legend.losses': 'Losses',

            // Heatmap
            'charts.heatmap.segment': 'Segment',
            'charts.heatmap.all': 'All',
            'charts.heatmap.small': 'Small',
            'charts.heatmap.medium': 'Medium',
            'charts.heatmap.large': 'Large',

            // Radar axes
            'charts.radar.accuracy': 'Accuracy',
            'charts.radar.simplicity': 'Simplicity',
            'charts.radar.compression': 'Compression',
            'charts.radar.trainSpeed': 'Train Speed',
            'charts.radar.predictSpeed': 'Predict Speed',

            // Chart legend labels (additional)
            'charts.legend.boostWins': 'BoostAODE wins',
            'charts.legend.aodeWins': 'AODE wins',
            'charts.legend.tie': 'Tie',
            'charts.legend.winsBoost': 'Wins BoostAODE',
            'charts.legend.lossesBoost': 'Losses BoostAODE',
            'charts.legend.iqr': 'IQR (Q1-Q3)',
            'charts.legend.datasetsAODE': 'Datasets (AODE)',
            'charts.legend.datasetsBoost': 'Datasets (BoostAODE)',
            'charts.legend.deltaCLC': '\u0394 CLC_\u03b1 (BoostAODE - AODE)',

            // Chart axis labels (additional)
            'charts.axis.nDatasets': 'Number of datasets',
            'charts.axis.alphaBreakeven': '\u03b1 breakeven',
            'charts.axis.nFeaturesLog': 'Number of features (log scale)',
            'charts.axis.compressionRatioShort': 'SPODEs usage ratio',
            'charts.axis.meanTime': 'Mean time (seconds)',
            'charts.axis.alphaValue': 'Value of \u03b1',
            'charts.axis.deltaCLCAlpha': '\u0394 CLC_\u03b1',

            // Timing chart labels
            'charts.timing.training': 'Training',
            'charts.timing.prediction': 'Prediction',

            // Heatmap footnote
            'charts.heatmap.footnote': '* Statistical significance (p < 0.05). Border on significant cells.',

            // Heatmap screenshot message
            'charts.heatmap.screenshotMsg': 'For the heatmap table, use browser screenshot (Ctrl+Shift+S in Firefox).',

            // Error loading
            'charts.errorLoading': 'Error loading data',

            // CLC boxplot axis
            'charts.axis.clcAlpha': 'CLC_\u03b1',

            // Breakeven histogram bins
            'charts.breakeven.always': 'Always Boost',
            'charts.breakeven.noBenefit': 'No benefit',

            // Compression histogram
            'charts.compression.high': 'High compression',
            'charts.compression.low': 'Low compression',

            // === AI PROMPT PAGE ===
            'ai.title': 'AI Query - BoostAODE vs AODE',
            'ai.header': 'AI Query',
            'ai.subtitle': 'Generate a prompt with experimental data to query an external AI',

            // Config panel
            'ai.detailLevel': 'Detail Level',
            'ai.basic': 'Basic',
            'ai.basicDesc': 'Main statistical summary (~2K tokens)',
            'ai.detailed': 'Detailed',
            'ai.detailedDesc': 'Per-dataset data + statistical tests (~8K tokens)',
            'ai.complete': 'Complete',
            'ai.completeDesc': 'All experimental results (~50K tokens)',
            'ai.dataFormat': 'Data Format',
            'ai.fmtText': 'Plain text',
            'ai.fmtJSON': 'JSON',
            'ai.fmtCSV': 'CSV',
            'ai.information': 'Information',
            'ai.tokensEstimated': 'Estimated tokens',

            // Prompt panel
            'ai.yourQuestion': 'Your question',
            'ai.questionPlaceholder': 'Write your question about the experimental results...',
            'ai.exampleQuestions': 'Example questions',
            'ai.generatedPrompt': 'Generated Prompt',
            'ai.promptPlaceholder': 'The prompt will be generated automatically...',
            'ai.openExternal': 'Open in external AI',

            // Example question chips
            'ai.ex1label': 'Datasets where BoostAODE wins in accuracy',
            'ai.ex1question': 'In which datasets does BoostAODE significantly outperform AODE in accuracy?',
            'ai.ex2label': '\u03b1 breakeven value and meaning',
            'ai.ex2question': 'What is the typical \u03b1 breakeven value and what does it mean for the choice between classifiers?',
            'ai.ex3label': 'Dimensionality vs BoostAODE advantage',
            'ai.ex3question': 'Analyze the relationship between dataset dimensionality and the advantage of BoostAODE',
            'ai.ex4label': 'Scenarios where AODE is sufficient',
            'ai.ex4question': 'In which scenarios is it not worth using BoostAODE over AODE?',
            'ai.ex5label': 'Summary of RQ1-RQ5',
            'ai.ex5question': 'Summarize the main results answering the research questions RQ1-RQ5',
            'ai.ex6label': 'Dataset size vs compression',
            'ai.ex6question': 'How does dataset size affect the compression achieved by BoostAODE?',

            // Prompt template
            'ai.promptIntro': 'You are an expert in machine learning and Bayesian classifiers. Analyze the following experimental results and answer the user\'s question.',
            'ai.promptContext': '## Experiment Context\nBoostAODE (boosted SPODE ensemble that selects a subset of super-parents) is compared against AODE (Averaged One-Dependence Estimators, which uses all features as super-parents).\n- 40 datasets from OpenML\n- Stratified cross-validation: 5 folds \u00d7 5 repetitions\n- Seeds: [42, 123, 456, 789, 1024]\n- Primary metric: CLC_\u03b1 = \u03b1 \u00d7 accuracy + (1 - \u03b1) \u00d7 (1 - n_spodes / n_features)\n- \u03b1 values analyzed: 0.5, 0.6, 0.7, 0.8, 0.9, 1.0',
            'ai.promptData': '## Data',
            'ai.promptQuestion': '## Question',
            'ai.promptWriteAbove': '(Write your question above)',
            'ai.promptOutro': 'Answer in English with detailed analysis, references to the data, and well-founded conclusions.',

            // Context section headers
            'ai.ctx.globalStats': '### Global Statistics',
            'ai.ctx.numDatasets': '- Number of datasets: ',
            'ai.ctx.classifiers': '- Classifiers: AODE, BoostAODE',
            'ai.ctx.foldsReps': '- Folds: {0}, Repetitions: {1}',
            'ai.ctx.meanAccAODE': '- Mean accuracy AODE: ',
            'ai.ctx.meanAccBoost': '- Mean accuracy BoostAODE: ',
            'ai.ctx.meanCLC05AODE': '- Mean CLC_0.5 AODE: ',
            'ai.ctx.meanCLC05Boost': '- Mean CLC_0.5 BoostAODE: ',
            'ai.ctx.wtlTitle': '### Wins/Ties/Losses (BoostAODE vs AODE)',
            'ai.ctx.segTitle': '### Results by Segment (CLC_0.5)',
            'ai.ctx.compressionTitle': '### Compression',
            'ai.ctx.compressionLine': '- Mean compression ratio: {0} (BoostAODE uses on average {1}% of AODE\'s SPODEs)',
            'ai.ctx.clcDefTitle': '### CLC_\u03b1 Definition',
            'ai.ctx.clcFormula': 'CLC_\u03b1 = \u03b1 \u00d7 accuracy + (1 - \u03b1) \u00d7 (1 - n_spodes / n_features)',
            'ai.ctx.clcNote1': '- AODE always uses n_spodes = n_features (simplicity = 0)',
            'ai.ctx.clcNote2': '- BoostAODE selects k \u2264 n_features SPODEs (simplicity = 1 - k/n_features)',
            'ai.ctx.clcNote3': '- \u03b1 breakeven: value of \u03b1 where CLC_\u03b1(AODE) = CLC_\u03b1(BoostAODE)',
            'ai.ctx.pairedTitle': '### Comparison by Dataset',
            'ai.ctx.testsTitle': '### Statistical Tests (Wilcoxon Signed-Rank)',
            'ai.ctx.segFullTitle': '### Complete Segmented Analysis',
            'ai.ctx.rawTitle': '### Raw Experimental Results ({0} observations)',
            'ai.ctx.yes': 'Yes',
            'ai.ctx.no': 'No',
            'ai.ctx.significant': 'significant',
            'ai.ctx.notLoaded': '(Data not loaded)',

            // Segment labels for prompts
            'ai.seg.all': 'All',
            'ai.seg.small': 'Small datasets (<10 feat.)',
            'ai.seg.medium': 'Medium datasets (10-99 feat.)',
            'ai.seg.large': 'Large datasets (>=100 feat.)',

            // Table headers in prompts
            'ai.table.dataset': 'Dataset',
            'ai.table.samples': 'Samples',
            'ai.table.feats': 'Feats',
            'ai.table.accAODE': 'Acc AODE',
            'ai.table.accBoost': 'Acc BAODE',
            'ai.table.diffAcc': '\u0394 Acc',
            'ai.table.spodes': 'SPODEs',
            'ai.table.compr': 'Compr',
            'ai.table.clc5a': 'CLC.5 A',
            'ai.table.clc5b': 'CLC.5 B',
            'ai.table.diffCLC': '\u0394 CLC',
            'ai.table.classifier': 'Classif.',
            'ai.table.fold': 'Fold',
            'ai.table.rep': 'Rep',
            'ai.table.tTrain': 'T.Train',
            'ai.table.tPred': 'T.Pred',

            // Error in prompt page
            'ai.errorLoading': 'Error: Could not load experimental data.',
        },

        es: {
            // === NAV ===
            'nav.brand': 'BoostAODE',
            'nav.results': 'Resultados',
            'nav.charts': 'Gr\u00e1ficos',
            'nav.ai': 'Consulta IA',
            'nav.themeTitle': 'Cambiar tema claro/oscuro',

            // === COMMON ===
            'common.loading': 'Cargando datos...',
            'common.loadingExperimental': 'Cargando datos experimentales...',
            'common.errorLoading': 'Error cargando datos',
            'common.errorLoadingDesc': 'No se pudieron cargar los archivos JSON. Comprueba que existen en la carpeta data/.',
            'common.noResults': 'No se encontraron resultados',
            'common.dataset': 'Dataset',
            'common.datasets': 'Datasets',
            'common.samples': 'Muestras',
            'common.features': 'Features',
            'common.classes': 'Clases',
            'common.accuracy': 'Accuracy',
            'common.classifier': 'Clasificador',
            'common.classifiers': 'Clasificadores',
            'common.all': 'Todos',
            'common.results': 'Resultados',
            'common.exportCSV': 'Exportar CSV',
            'common.search': 'Buscar dataset...',
            'common.page': 'P\u00e1gina',
            'common.of': 'de',
            'common.result': 'resultado',
            'common.resultPlural': 'resultados',
            'common.downloadPNG': 'Descargar como PNG',
            'common.copy': 'Copiar',
            'common.copied': '\u00a1Copiado!',

            // === FOOTER ===
            'footer.text': 'BoostAODE vs AODE \u2014 Experimento de comparaci\u00f3n pareada \u2014 40 datasets, 5-fold \u00d7 5 repeticiones',
            'footer.credits': 'Cr\u00e9ditos',
            'footer.creditsTitle': 'Ver cr\u00e9ditos del proyecto',

            // === CREDITS ===
            'credits.title': 'Acerca de & Cr\u00e9ditos',
            'credits.author': 'Autor',
            'credits.role': 'Investigador & Desarrollador',
            'credits.techStack': 'Stack Tecnol\u00f3gico',
            'credits.libraries': 'Bibliotecas',
            'credits.contributors': 'Colaboradores',
            'credits.contributorDesc': 'Asistente IA',
            'credits.design': 'Dise\u00f1o',

            // === RESULTS PAGE ===
            'results.title': 'Resultados - BoostAODE vs AODE',
            'results.header': 'Resultados Experimentales',
            'results.subtitle': 'Comparaci\u00f3n BoostAODE vs AODE sobre 40 datasets',

            'results.statDatasets': 'Datasets',
            'results.statDatasetsLabel': '5-fold \u00d7 5 repeticiones',
            'results.statAccuracy': 'Accuracy media',
            'results.statAccuracyLabel': 'AODE vs BoostAODE',
            'results.statCLC': 'CLC \u03b1={0}',
            'results.statCLCLabel': 'CLC \u03b1={0} (AODE vs BoostAODE)',
            'results.statWTL': 'Wins / Ties / Losses',
            'results.statWTLLabel': 'Wins / Ties / Losses (CLC \u03b1={0})',

            'results.tabSummary': 'Resumen por Dataset',
            'results.tabRaw': 'Datos Crudos',

            'results.classifierLabel': 'Clasificador:',
            'results.segAll': 'Todos',
            'results.segSmall': 'Peque\u00f1os',
            'results.segMedium': 'Medianos',
            'results.segLarge': 'Grandes',

            'results.colDataset': 'Dataset',
            'results.colSamples': 'Muestras',
            'results.colFeatures': 'Features',
            'results.colClasses': 'Clases',
            'results.colAccAODE': 'Acc AODE',
            'results.colAccBoost': 'Acc BoostAODE',
            'results.colAccDiff': '\u0394 Acc',
            'results.colSPODEs': 'SPODEs Boost',
            'results.colCompression': 'Compresi\u00f3n',
            'results.colCLCAODE': 'CLC AODE',
            'results.colCLCBoost': 'CLC Boost',
            'results.colCLCDiff': '\u0394 CLC',
            'results.colAlphaBreak': '\u03b1 breakeven',

            'results.colClassifier': 'Clasificador',
            'results.colFold': 'Fold',
            'results.colRep': 'Rep',
            'results.colSeed': 'Seed',
            'results.colNSpodes': 'n SPODEs',
            'results.colTrainTime': 'Tiempo Entren. (s)',
            'results.colPredictTime': 'Tiempo Pred. (s)',

            'results.testsTitle': 'Tests Estad\u00edsticos (Wilcoxon Signed-Rank)',
            'results.testsBadge': 'BoostAODE vs AODE',
            'results.colMetric': 'M\u00e9trica',
            'results.colStatW': 'Estad\u00edstico W',
            'results.colPValue': 'p-valor',
            'results.colSignificant': 'Significativo',
            'results.colWins': 'Wins',
            'results.colTies': 'Ties',
            'results.colLosses': 'Losses',
            'results.colWTL': 'W/T/L',

            'results.segTitle': 'An\u00e1lisis Segmentado',
            'results.segBadge': 'Por tipo de dataset',
            'results.colSegment': 'Segmento',
            'results.colNDatasets': 'n Datasets',
            'results.colAlpha': '\u03b1',
            'results.colSig': 'Sig?',
            'results.colMeanCLCDiff': '\u0394 CLC medio',

            'results.segLabelAll': 'Todos',
            'results.segLabelSmall': 'Peque\u00f1os (<10 var.)',
            'results.segLabelMedium': 'Medianos (10-99 var.)',
            'results.segLabelLarge': 'Grandes (>=100 var.)',

            'results.pagination': '{0} resultado(s) \u2014 P\u00e1gina {1} de {2}',

            // === CHARTS PAGE ===
            'charts.title': 'Gr\u00e1ficos - BoostAODE vs AODE',
            'charts.header': 'Gr\u00e1ficos Interactivos',
            'charts.subtitle': 'Visualizaci\u00f3n de resultados BoostAODE vs AODE',
            'charts.sidebarTitle': 'Tipo de gr\u00e1fico',
            'charts.loading': 'Cargando...',

            'charts.name.scatterAccuracy': 'Scatter Accuracy',
            'charts.name.scatterPareto': 'Accuracy vs Simplicidad',
            'charts.name.clcBoxplots': 'Boxplots CLC_\u03b1',
            'charts.name.alphaBreakeven': 'Histograma \u03b1 Breakeven',
            'charts.name.compressionHist': 'Histograma Uso SPODEs',
            'charts.name.compressionFeatures': 'Uso SPODEs vs Features',
            'charts.name.timing': 'Comparaci\u00f3n Tiempos',
            'charts.name.heatmap': 'Heatmap Ventaja CLC',
            'charts.name.radar': 'Radar Comparativo',
            'charts.name.winsByAlpha': 'Victorias por \u03b1',
            'charts.name.clcRanking': 'Ranking \u0394 CLC',
            'charts.name.accuracyDist': 'Distribuci\u00f3n Accuracy',

            'charts.desc.scatterAccuracy': 'Diagrama de dispersi\u00f3n que compara la accuracy media de BoostAODE (eje Y) frente a AODE (eje X) para cada dataset. Los puntos por encima de la diagonal y=x indican que BoostAODE supera a AODE.',
            'charts.desc.scatterPareto': 'Frente de Pareto: simplicidad del modelo (eje X) frente a accuracy (eje Y). AODE siempre tiene simplicidad 0 (usa todos los SPODEs). BoostAODE puede alcanzar mayor simplicidad al seleccionar menos SPODEs.',
            'charts.desc.clcBoxplots': 'Distribuci\u00f3n de los valores CLC_\u03b1 para cada clasificador a trav\u00e9s de los 40 datasets. Se muestran los cuartiles (Q1, mediana, Q3), bigotes (regla de Tukey 1,5\u00d7IQR) y outliers.',
            'charts.desc.alphaBreakeven': 'Distribuci\u00f3n de los valores \u03b1 breakeven entre datasets. El \u03b1 breakeven es el valor de \u03b1 en el que CLC_\u03b1(AODE) iguala a CLC_\u03b1(BoostAODE). Los datasets sin breakeven favorecen siempre a BoostAODE.',
            'charts.desc.compressionHist': 'Distribuci\u00f3n del ratio de uso de SPODEs (n_spodes/n_features) entre datasets. Valores m\u00e1s bajos indican que BoostAODE utiliza menos SPODEs en relaci\u00f3n al n\u00famero total de features.',
            'charts.desc.compressionFeatures': 'Relaci\u00f3n entre el n\u00famero de features y el ratio de uso de SPODEs conseguido por BoostAODE. El tama\u00f1o del punto es proporcional al n\u00famero de muestras.',
            'charts.desc.timing': 'Comparaci\u00f3n de tiempos medios de entrenamiento y predicci\u00f3n entre AODE y BoostAODE, promediados sobre todos los datasets, folds y repeticiones.',
            'charts.desc.heatmap': 'Ventaja media de CLC_\u03b1 de BoostAODE sobre AODE, segmentada por tipo de dataset y valor de \u03b1. El verde indica ventaja de BoostAODE; los bordes marcan resultados estad\u00edsticamente significativos.',
            'charts.desc.radar': 'Gr\u00e1fico radar que compara AODE y BoostAODE en 5 ejes normalizados: accuracy, simplicidad, compresi\u00f3n, velocidad de entrenamiento y velocidad de predicci\u00f3n.',
            'charts.desc.winsByAlpha': 'Evoluci\u00f3n del n\u00famero de victorias de BoostAODE seg\u00fan aumenta \u03b1 de 0.5 a 1.0. La zona verde indica significaci\u00f3n estad\u00edstica (p < 0.05).',
            'charts.desc.clcRanking': 'Ranking de los 40 datasets por diferencia de CLC_\u03b1 (BoostAODE \u2212 AODE). Las barras verdes indican ventaja de BoostAODE; las rojas, ventaja de AODE.',
            'charts.desc.accuracyDist': 'Distribuci\u00f3n de los valores medios de accuracy para ambos clasificadores. Cada punto representa un dataset. Las l\u00edneas gruesas muestran la media y las punteadas la mediana.',

            'charts.axis.accAODE': 'Accuracy AODE',
            'charts.axis.accBoost': 'Accuracy BoostAODE',
            'charts.axis.accuracy': 'Accuracy',
            'charts.axis.simplicity': 'Simplicidad (1 - n_spodes/n_features)',
            'charts.axis.clcValue': 'Valor CLC_\u03b1',
            'charts.axis.datasets': 'Datasets',
            'charts.axis.count': 'Cantidad',
            'charts.axis.compressionRatio': 'Ratio de uso de SPODEs (n_spodes / n_features)',
            'charts.axis.nFeatures': 'N\u00famero de Features',
            'charts.axis.time': 'Tiempo (segundos)',
            'charts.axis.alpha': '\u03b1',
            'charts.axis.wins': 'N\u00famero de victorias',
            'charts.legend.aode': 'AODE',
            'charts.legend.boostaode': 'BoostAODE',
            'charts.legend.diagonal': 'Diagonal y=x',
            'charts.legend.mean': 'Media',
            'charts.legend.median': 'Mediana',
            'charts.legend.significant': 'Significativo (p<0.05)',
            'charts.legend.notSignificant': 'No significativo',
            'charts.legend.reference50': 'Referencia 50%',
            'charts.legend.trainAODE': 'Entren. AODE',
            'charts.legend.trainBoost': 'Entren. BoostAODE',
            'charts.legend.predictAODE': 'Pred. AODE',
            'charts.legend.predictBoost': 'Pred. BoostAODE',
            'charts.legend.losses': 'Derrotas',

            'charts.heatmap.segment': 'Segmento',
            'charts.heatmap.all': 'Todos',
            'charts.heatmap.small': 'Peque\u00f1os',
            'charts.heatmap.medium': 'Medianos',
            'charts.heatmap.large': 'Grandes',

            'charts.radar.accuracy': 'Accuracy',
            'charts.radar.simplicity': 'Simplicidad',
            'charts.radar.compression': 'Compresi\u00f3n',
            'charts.radar.trainSpeed': 'Vel. Entrenamiento',
            'charts.radar.predictSpeed': 'Vel. Predicci\u00f3n',

            // Chart legend labels (additional)
            'charts.legend.boostWins': 'BoostAODE gana',
            'charts.legend.aodeWins': 'AODE gana',
            'charts.legend.tie': 'Empate',
            'charts.legend.winsBoost': 'Victorias BoostAODE',
            'charts.legend.lossesBoost': 'Derrotas BoostAODE',
            'charts.legend.iqr': 'IQR (Q1-Q3)',
            'charts.legend.datasetsAODE': 'Datasets (AODE)',
            'charts.legend.datasetsBoost': 'Datasets (BoostAODE)',
            'charts.legend.deltaCLC': '\u0394 CLC_\u03b1 (BoostAODE - AODE)',

            // Chart axis labels (additional)
            'charts.axis.nDatasets': 'N\u00famero de datasets',
            'charts.axis.alphaBreakeven': '\u03b1 breakeven',
            'charts.axis.nFeaturesLog': 'N\u00famero de features (escala log)',
            'charts.axis.compressionRatioShort': 'Ratio de uso de SPODEs',
            'charts.axis.meanTime': 'Tiempo medio (segundos)',
            'charts.axis.alphaValue': 'Valor de \u03b1',
            'charts.axis.deltaCLCAlpha': '\u0394 CLC_\u03b1',

            // Timing chart labels
            'charts.timing.training': 'Entrenamiento',
            'charts.timing.prediction': 'Predicci\u00f3n',

            // Heatmap footnote
            'charts.heatmap.footnote': '* Significancia estad\u00edstica (p < 0.05). Borde en celdas significativas.',

            // Heatmap screenshot message
            'charts.heatmap.screenshotMsg': 'Para la tabla heatmap, usa captura de pantalla del navegador (Ctrl+Shift+S en Firefox).',

            // Error loading
            'charts.errorLoading': 'Error al cargar los datos',

            // CLC boxplot axis
            'charts.axis.clcAlpha': 'CLC_\u03b1',

            'charts.breakeven.always': 'Siempre Boost',
            'charts.breakeven.noBenefit': 'Sin beneficio',

            'charts.compression.high': 'Alta compresi\u00f3n',
            'charts.compression.low': 'Baja compresi\u00f3n',

            // === AI PROMPT PAGE ===
            'ai.title': 'Consulta IA - BoostAODE vs AODE',
            'ai.header': 'Consulta IA',
            'ai.subtitle': 'Genera un prompt con los datos experimentales para consultar una IA externa',

            'ai.detailLevel': 'Nivel de Detalle',
            'ai.basic': 'B\u00e1sico',
            'ai.basicDesc': 'Resumen estad\u00edstico principal (~2K tokens)',
            'ai.detailed': 'Detallado',
            'ai.detailedDesc': 'Datos por dataset + tests estad\u00edsticos (~8K tokens)',
            'ai.complete': 'Completo',
            'ai.completeDesc': 'Todos los resultados experimentales (~50K tokens)',
            'ai.dataFormat': 'Formato de Datos',
            'ai.fmtText': 'Texto plano',
            'ai.fmtJSON': 'JSON',
            'ai.fmtCSV': 'CSV',
            'ai.information': 'Informaci\u00f3n',
            'ai.tokensEstimated': 'Tokens estimados',

            'ai.yourQuestion': 'Tu pregunta',
            'ai.questionPlaceholder': 'Escribe tu pregunta sobre los resultados experimentales...',
            'ai.exampleQuestions': 'Preguntas de ejemplo',
            'ai.generatedPrompt': 'Prompt Generado',
            'ai.promptPlaceholder': 'El prompt se generar\u00e1 autom\u00e1ticamente...',
            'ai.openExternal': 'Abrir en IA externa',

            'ai.ex1label': 'Datasets donde BoostAODE gana en accuracy',
            'ai.ex1question': '\u00bfEn qu\u00e9 datasets BoostAODE supera significativamente a AODE en accuracy?',
            'ai.ex2label': 'Valor de \u03b1 breakeven y su significado',
            'ai.ex2question': '\u00bfCu\u00e1l es el valor de \u03b1 breakeven t\u00edpico y qu\u00e9 significa para la elecci\u00f3n entre clasificadores?',
            'ai.ex3label': 'Dimensionalidad vs ventaja de BoostAODE',
            'ai.ex3question': 'Analiza la relaci\u00f3n entre la dimensionalidad del dataset y la ventaja de BoostAODE',
            'ai.ex4label': 'Escenarios donde AODE es suficiente',
            'ai.ex4question': '\u00bfEn qu\u00e9 escenarios no merece la pena usar BoostAODE frente a AODE?',
            'ai.ex5label': 'Resumen de RQ1-RQ5',
            'ai.ex5question': 'Resume los resultados principales respondiendo a las preguntas de investigaci\u00f3n RQ1-RQ5',
            'ai.ex6label': 'Tama\u00f1o del dataset vs compresi\u00f3n',
            'ai.ex6question': '\u00bfC\u00f3mo afecta el tama\u00f1o del dataset a la compresi\u00f3n que consigue BoostAODE?',

            'ai.promptIntro': 'Eres un experto en machine learning y clasificadores bayesianos. Analiza los siguientes resultados experimentales y responde la pregunta del usuario.',
            'ai.promptContext': '## Contexto del Experimento\nSe compara BoostAODE (ensemble boosted de SPODEs que selecciona un subconjunto de super-parents) contra AODE (Averaged One-Dependence Estimators, que usa todos los features como super-parents).\n- 40 datasets de OpenML\n- Validaci\u00f3n cruzada estratificada: 5 folds \u00d7 5 repeticiones\n- Semillas: [42, 123, 456, 789, 1024]\n- M\u00e9trica principal: CLC_\u03b1 = \u03b1 \u00d7 accuracy + (1 - \u03b1) \u00d7 (1 - n_spodes / n_features)\n- Valores de \u03b1 analizados: 0.5, 0.6, 0.7, 0.8, 0.9, 1.0',
            'ai.promptData': '## Datos',
            'ai.promptQuestion': '## Pregunta',
            'ai.promptWriteAbove': '(Escribe tu pregunta arriba)',
            'ai.promptOutro': 'Responde en espa\u00f1ol con an\u00e1lisis detallado, referencias a los datos y conclusiones fundamentadas.',

            'ai.ctx.globalStats': '### Estad\u00edsticas Globales',
            'ai.ctx.numDatasets': '- N\u00famero de datasets: ',
            'ai.ctx.classifiers': '- Clasificadores: AODE, BoostAODE',
            'ai.ctx.foldsReps': '- Folds: {0}, Repeticiones: {1}',
            'ai.ctx.meanAccAODE': '- Accuracy media AODE: ',
            'ai.ctx.meanAccBoost': '- Accuracy media BoostAODE: ',
            'ai.ctx.meanCLC05AODE': '- CLC_0.5 media AODE: ',
            'ai.ctx.meanCLC05Boost': '- CLC_0.5 media BoostAODE: ',
            'ai.ctx.wtlTitle': '### Wins/Ties/Losses (BoostAODE vs AODE)',
            'ai.ctx.segTitle': '### Resultados por Segmento (CLC_0.5)',
            'ai.ctx.compressionTitle': '### Compresi\u00f3n',
            'ai.ctx.compressionLine': '- Ratio de compresi\u00f3n medio: {0} (BoostAODE usa en media el {1}% de los SPODEs de AODE)',
            'ai.ctx.clcDefTitle': '### Definici\u00f3n de CLC_\u03b1',
            'ai.ctx.clcFormula': 'CLC_\u03b1 = \u03b1 \u00d7 accuracy + (1 - \u03b1) \u00d7 (1 - n_spodes / n_features)',
            'ai.ctx.clcNote1': '- AODE siempre usa n_spodes = n_features (simplicidad = 0)',
            'ai.ctx.clcNote2': '- BoostAODE selecciona k \u2264 n_features SPODEs (simplicidad = 1 - k/n_features)',
            'ai.ctx.clcNote3': '- \u03b1 breakeven: valor de \u03b1 donde CLC_\u03b1(AODE) = CLC_\u03b1(BoostAODE)',
            'ai.ctx.pairedTitle': '### Comparaci\u00f3n por Dataset',
            'ai.ctx.testsTitle': '### Tests Estad\u00edsticos (Wilcoxon Signed-Rank)',
            'ai.ctx.segFullTitle': '### An\u00e1lisis Segmentado Completo',
            'ai.ctx.rawTitle': '### Resultados Experimentales Crudos ({0} observaciones)',
            'ai.ctx.yes': 'S\u00ed',
            'ai.ctx.no': 'No',
            'ai.ctx.significant': 'significativo',
            'ai.ctx.notLoaded': '(Datos no cargados)',

            'ai.seg.all': 'Todos',
            'ai.seg.small': 'Datasets peque\u00f1os (<10 var.)',
            'ai.seg.medium': 'Datasets medianos (10-99 var.)',
            'ai.seg.large': 'Datasets grandes (>=100 var.)',

            'ai.table.dataset': 'Dataset',
            'ai.table.samples': 'Muestras',
            'ai.table.feats': 'Feats',
            'ai.table.accAODE': 'Acc AODE',
            'ai.table.accBoost': 'Acc BAODE',
            'ai.table.diffAcc': '\u0394 Acc',
            'ai.table.spodes': 'SPODEs',
            'ai.table.compr': 'Compr',
            'ai.table.clc5a': 'CLC.5 A',
            'ai.table.clc5b': 'CLC.5 B',
            'ai.table.diffCLC': '\u0394 CLC',
            'ai.table.classifier': 'Clasif.',
            'ai.table.fold': 'Fold',
            'ai.table.rep': 'Rep',
            'ai.table.tTrain': 'T.Entren',
            'ai.table.tPred': 'T.Pred',

            'ai.errorLoading': 'Error: No se pudieron cargar los datos experimentales.',
        }
    };

    let currentLang = localStorage.getItem('lang') || 'en';

    function getLang() { return currentLang; }

    function t(key, ...args) {
        const val = (translations[currentLang] && translations[currentLang][key])
            || (translations.en && translations.en[key])
            || key;
        if (args.length === 0) return val;
        return val.replace(/\{(\d+)\}/g, (_, i) => args[i] !== undefined ? args[i] : `{${i}}`);
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.dataset.i18n);
        });
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            el.innerHTML = t(el.dataset.i18nHtml);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const translation = t(el.dataset.i18nPlaceholder);
            if (translation) el.placeholder = translation;
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const translation = t(el.dataset.i18nTitle);
            if (translation) el.title = translation;
        });
        // Update <html lang>
        document.documentElement.lang = currentLang;
        // Update page title if <title> has data-i18n
        const titleEl = document.querySelector('title[data-i18n]');
        if (titleEl) titleEl.textContent = t(titleEl.dataset.i18n);

        // Update active state on language buttons
        document.querySelectorAll('.btn-lang-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }

    function setLang(lang) {
        if (currentLang === lang) return;
        currentLang = lang;
        localStorage.setItem('lang', lang);
        applyTranslations();
        // Dispatch event for JS re-renders
        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }

    function toggleLang() {
        setLang(currentLang === 'en' ? 'es' : 'en');
    }

    /** Locale-aware number formatting: ES uses comma, EN uses period */
    function formatLocaleNumber(num, decimals = 2) {
        if (num === null || num === undefined || isNaN(num)) return '-';
        const str = num.toFixed(decimals);
        return currentLang === 'es' ? str.replace('.', ',') : str;
    }

    /** Locale string for integers (thousand separators) */
    function localeInt(num) {
        return num.toLocaleString(currentLang === 'es' ? 'es-ES' : 'en-US');
    }

    // Initialize on load
    function init() {
        // Wire up language toggle buttons
        document.querySelectorAll('.btn-lang-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                setLang(btn.dataset.lang);
            });
        });

        // Backward compatibility with a single toggle button
        const toggleBtn = document.getElementById('lang-toggle');
        if (toggleBtn) toggleBtn.addEventListener('click', toggleLang);

        applyTranslations();
    }

    // Auto-init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { t, getLang, setLang, toggleLang, applyTranslations, formatLocaleNumber, localeInt, init };
})();

# BoostAODE 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)

An interactive web-based results page comparing **BoostAODE** (Boosted Average One-Dependence Estimators) against **AODE** (Average One-Dependence Estimators) across 40 datasets.

## 📊 About the Experiment

This project presents comprehensive experimental results comparing two Bayesian classifiers:

| Classifier | Description |
|------------|-------------|
| **AODE** | Average One-Dependence Estimators - A probabilistic classifier that averages all one-dependence estimators |
| **BoostAODE** | Boosted version of AODE - Applies ensemble boosting techniques to improve classification performance |

### Experimental Design

- **Datasets**: 40 different classification datasets
- **Cross-Validation**: 5-fold cross-validation
- **Repetitions**: 5 repetitions per fold (25 runs per dataset)
- **Metrics**: Accuracy and Classification Loss Complexity (CLC) with α=0.5 parameter

### Statistical Analysis

The experiment includes rigorous statistical testing:

- **Wilcoxon Signed-Rank Test**: Non-parametric test for comparing paired samples
- **Paired Comparisons**: Detailed head-to-head comparison between classifiers
- **Segmented Analysis**: Results broken down by dataset characteristics

## ✨ Features

### 📈 Results Dashboard
- Interactive table with dataset-level summaries
- Sortable and filterable results
- Side-by-side classifier comparison
- Detailed metrics (accuracy, CLC, standard deviation)

### 📉 Charts Visualization
- Visual representation of experimental data
- Multiple chart types for different analysis perspectives
- Interactive and responsive visualizations

### 🤖 AI Prompt Generator
- Generate ready-to-use prompts for AI analysis
- Extract insights from experimental results
- Customizable query templates

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Internationalization**: Support for English (EN) and Spanish (ES)
- **Responsive Design**: Works on desktop and mobile devices
- **Clean Interface**: Modern, intuitive UI with smooth transitions

## 📁 Project Structure

```
web/
├── index.html                 # Main results page
├── charts.html                # Charts visualization page
├── ai-prompt.html             # AI prompt generator page
├── css/
│   ├── theme.css             # Dark/light theme styles
│   ├── layout.css            # Page layout styles
│   └── components.css        # Reusable component styles
├── js/
│   ├── data.js               # Data loading utilities
│   ├── charts.js             # Chart.js configuration
│   ├── i18n.js               # Internationalization (ES/EN)
│   ├── results.js            # Results table logic
│   └── theme.js              # Theme toggle functionality
├── data/
│   ├── experimental_results.json    # Complete experimental data
│   ├── paired_comparison.json        # Head-to-head comparisons
│   ├── statistical_tests.json        # Wilcoxon test results
│   ├── segmented_analysis.json       # Analysis by dataset type
│   └── experiment_summary.json      # Overall summary statistics
└── generate_data.py         # Python script to generate JSON data
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd boostaode/new/web
```

2. Install Python dependencies:
```bash
pip install pandas numpy
```

### Generating Data

If you have the CSV files from the experiments, generate the JSON data files:

```bash
python generate_data.py
```

This script converts CSV files from `results/` directory into JSON format for the web application.

### Running the Web Application

Simply open `index.html` in your web browser:

```bash
# On Linux/Mac
open index.html

# On Windows
start index.html

# Or use a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables for theming
- **Vanilla JavaScript**: No framework dependencies
- **Chart.js**: Data visualization (via CDN)
- **Python**: Data processing and JSON generation
- **Pandas**: Data manipulation

## 📊 Data Files

The web application loads the following JSON data files:

| File | Description |
|------|-------------|
| `experimental_results.json` | Complete dataset with all experimental runs |
| `paired_comparison.json` | Head-to-head classifier comparisons |
| `statistical_tests.json` | Wilcoxon Signed-Rank test results |
| `segmented_analysis.json` | Analysis by dataset characteristics |
| `experiment_summary.json` | Aggregate statistics and metadata |

## 🎯 Key Metrics

The experiment evaluates classifiers using two primary metrics:

1. **Accuracy**: Percentage of correct predictions
2. **CLC (Classification Loss Complexity)**: A metric that combines classification accuracy with model complexity, parameterized by α (alpha value)

## 📈 Statistical Significance

All statistical tests are performed using the Wilcoxon Signed-Rank test with α=0.5, providing:

- p-values for significance testing
- Effect sizes
- Confidence intervals
- Detailed test statistics

## 🌐 Internationalization

The application supports two languages:

- **English (EN)**: Default language
- **Español (ES)**: Spanish translation

Language switching is instant and preserves current view state.

## 🎨 Theming

Toggle between light and dark modes using the theme button in the navigation bar. Theme preference is automatically saved to localStorage.

## 📝 Data Generation

The `generate_data.py` script:

1. Reads CSV files from the `results/` directory
2. Processes and aggregates experimental data
3. Generates JSON files optimized for web loading
4. Creates summary statistics and metadata

Input CSV files:
- `results/experimental_results.csv`
- `results/analysis/paired_comparison.csv`
- `results/analysis/statistical_tests.csv`
- `results/analysis/segmented_analysis.csv`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Resources

- AODE Paper: [Webb, G. I., Boughton, J., & Wang, Z. (2005). Not So Naive Bayes: Aggregating One-Dependence Estimators](https://dl.acm.org/doi/10.1007/s10994-005-0004-x)
- Boosting Techniques: [Freund & Schapire (1997). A Decision-Theoretic Generalization of On-Line Learning](https://www.sciencedirect.com/science/article/abs/1997)

---

Made with ❤️ for the machine learning research community

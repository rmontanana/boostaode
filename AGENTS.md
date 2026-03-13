# AGENTS.md

This file contains instructions for agentic coding agents working in this repository.

## Project Overview

This is a vanilla JavaScript web application for visualizing experimental results comparing BoostAODE vs AODE classifiers. The app includes interactive tables, charts, and AI prompt generation for querying external AI services with experimental data.

## Build/Test Commands

### Running the Application

```bash
# Option 1: Direct file opening (development)
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux

# Option 2: Using Python HTTP server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Using Node.js http-server (if installed)
npx http-server -p 8000
```

### Generating Data from CSV

```bash
# Install dependencies (first time only)
pip install pandas numpy

# Generate JSON files from CSV data
python generate_data.py
```

**Note:** This script expects CSV files in `results/` and `results/analysis/` directories relative to the project root, not the web/ directory.

### No Automated Tests

This project does not have automated tests. When making changes:
1. Test manually by opening the app in a browser
2. Test both light and dark themes
3. Test both English and Spanish language modes
4. Verify data loads correctly from JSON files
5. Check responsive behavior on different screen sizes

### Linting/Formatting

This project has no formal linting or formatting configured. When writing code:
- Follow existing code style patterns (see below)
- Use 4-space indentation for JavaScript
- Use 2-space indentation for CSS/HTML
- Keep lines under 100 characters where practical

## Code Style Guidelines

### JavaScript (ES6+)

#### Variables and Declarations

- Use `const` for variables that don't change after assignment
- Use `let` for variables that need reassignment
- Some legacy code uses `var` - prefer `const`/`let` for new code
- Use function declarations for module-level functions (e.g., `function init()`)
- Use arrow functions for callbacks and local helpers

```javascript
// Good
const state = { view: 'summary', alpha: '0.5' };
let currentPage = 1;

function init() { }

document.addEventListener('click', () => { });
```

#### Function Naming

- Use camelCase for function names
- Use descriptive names that indicate what the function does
- Render functions: `renderSummaryTable()`, `renderStatsCards()`
- Getters: `getSummaryData()`, `getRawData()`
- Handlers: `handleAlphaChange()`, `handleSearch()`
- Utility: `escapeHtml()`, `formatNumber()`

#### State Management

- Use a global state object at module level when needed
- Example pattern from `results.js`:

```javascript
const state = {
    view: 'summary',
    alpha: '0.5',
    segment: 'all',
    search: '',
    sortColumn: 'dataset',
    sortDirection: 'asc',
    currentPage: 1,
    pageSize: 20
};
```

- Update state before re-rendering
- Use debouncing for input handlers (see `debounceTimer` pattern)

#### DOM Manipulation

- Always check for null elements before accessing properties:

```javascript
const el = document.getElementById('my-element');
if (el) {
    el.textContent = 'Hello';
}
```

- Use `innerHTML` sparingly; prefer `textContent` when possible
- Use template literals for complex HTML construction
- Escape user-provided data before inserting into HTML (use `escapeHtml()`)

#### Event Listeners

- Attach event listeners in `DOMContentLoaded` or initialization functions
- Clean up references when destroying components
- Use event delegation for repeated elements:

```javascript
document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', function() {
        switchView(this.dataset.tab);
    });
});
```

#### Error Handling

- Use try-catch for async operations:

```javascript
async function loadAll() {
    try {
        const data = await fetch('data.json').then(r => r.json());
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}
```

- Check for null/undefined before accessing nested properties
- Return fallback values for utility functions:

```javascript
function formatNumber(n, decimals = 4) {
    if (n === null || n === undefined || isNaN(n)) return '—';
    return Number(n).toFixed(decimals);
}
```

#### Async/Await

- Use `async/await` for all async operations
- Use `Promise.all()` for parallel fetches:

```javascript
const [exp, paired, tests, seg, summary] = await Promise.all([
    fetch('data/experimental_results.json').then(r => r.json()),
    fetch('data/paired_comparison.json').then(r => r.json()),
    // ...
]);
```

#### Internationalization (i18n)

- Always use the `i18n` module for translatable strings:

```javascript
// Text content
el.textContent = i18n.t('common.loading');

// With parameters
i18n.t('results.pagination', totalItems, currentPage, totalPages)

// HTML content
el.innerHTML = i18n.t('charts.desc.scatterAccuracy');
```

- Add translation keys to both `en` and `es` objects in `js/i18n.js`
- Use `data-i18n`, `data-i18n-html`, `data-i18n-placeholder`, `data-i18n-title` attributes in HTML
- Dispatch `langchange` event when language changes for re-renders

#### Module Pattern

- Use IIFE pattern for modules that need initialization:

```javascript
(function() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}
```

#### File Organization

- Place each major feature in its own file (e.g., `results.js`, `charts-page.js`, `ai-prompt.js`)
- Use section comments to organize code:

```javascript
/* --------------------------------------------------------------------------
   Initialization
   -------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
   Summary Table
   -------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */
```

### CSS

#### CSS Custom Properties

- All colors, spacing, and typography values use CSS custom properties
- Define in `css/theme.css` with `--` prefix
- Access with `var(--property-name)`:

```css
.my-element {
    background-color: var(--bg-card);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
}
```

#### Naming Conventions

- Use BEM-like naming: `.block__element--modifier`
- Use kebab-case for class names
- Semantic naming over descriptive:

```css
/* Good */
.stat-card-value
.stat-card--secondary
.progress-segment--win

/* Avoid */
.text-green
.margin-top-10
```

#### Theme Support

- Support both dark and light themes using `data-theme` attribute
- Default to dark theme: `<html lang="en" data-theme="dark">`
- Theme values defined in `:root` and `[data-theme="dark"]`
- Override in `[data-theme="light"]`

#### Responsive Design

- Use mobile-first approach
- Use CSS Grid/Flexbox for layouts
- Define breakpoints using media queries in `css/layout.css`:

```css
@media (max-width: 768px) {
    .grid-4 {
        grid-template-columns: 1fr;
    }
}
```

#### Component Organization

- Each major component has its own CSS file if complex
- Common styles in `css/components.css`
- Page-specific styles can be inline in `<style>` tags within HTML pages

### HTML

#### Structure

- Use semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, `<article>`)
- Include `lang` attribute on `<html>` element
- Include viewport meta tag for responsive design

#### Attributes

- Use `data-*` attributes for storing element-specific data
- Use `data-i18n` for translatable content:

```html
<button data-i18n="common.exportCSV">Export CSV</button>
<input data-i18n-placeholder="common.search" placeholder="Search...">
```

#### Accessibility

- Include `aria-label` on interactive elements without visible labels
- Use semantic buttons, not `div` with click handlers
- Maintain proper heading hierarchy (`h1` → `h2` → `h3`)

### Python (Data Generation)

#### Style

- Use 4-space indentation (PEP 8)
- Include docstrings for modules and major functions
- Use type hints where appropriate

#### JSON Serialization

- Replace NaN and Inf values with `None` before JSON serialization
- Use the `nan_to_none()` helper function from `generate_data.py`:

```python
def nan_to_none(obj):
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return round(obj, 6)
    # ... handle dict/list recursively
```

## File Structure

```
web/
├── index.html              # Main results page
├── charts.html             # Charts visualization page
├── ai-prompt.html          # AI prompt generator page
├── css/
│   ├── theme.css          # CSS custom properties (dark/light themes)
│   ├── layout.css         # Layout and responsive styles
│   ├── components.css     # Reusable component styles
│   ├── charts.css         # Chart-specific styles
│   └── ai-prompt.css      # AI prompt page styles
├── js/
│   ├── data.js            # Data loading and utility functions
│   ├── results.js         # Results page logic
│   ├── charts-page.js     # Charts page logic (Chart.js)
│   ├── ai-prompt.js       # AI prompt generator logic
│   ├── i18n.js            # Internationalization (EN/ES)
│   └── theme.js           # Theme toggle functionality
├── data/
│   ├── experimental_results.json
│   ├── paired_comparison.json
│   ├── statistical_tests.json
│   ├── segmented_analysis.json
│   └── experiment_summary.json
└── generate_data.py       # Python script for JSON generation
```

## External Dependencies

- **Chart.js**: Loaded via CDN in HTML pages for data visualization
- **Pandas/NumPy**: Python dependencies for data generation (install via pip)
- No JavaScript package manager (npm/yarn) - uses vanilla JS

## Common Patterns

### State-Driven Rendering

```javascript
function updateAlpha(alpha) {
    state.alpha = alpha;
    state.currentPage = 1;
    renderCLCCard();
    renderWTLCard();
    renderSummaryTable();
}
```

### Debounced Input Handling

```javascript
let debounceTimer = null;

input.addEventListener('input', function() {
    const value = this.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
        state.search = value.toLowerCase().trim();
        renderTable();
    }, 300);
});
```

### Data Loading with Loading State

```javascript
async function init() {
    showLoading();
    const ok = await AppData.loadAll();
    hideLoading();

    if (!ok) {
        showError();
        return;
    }

    render();
}
```

### Custom Event Dispatching

```javascript
document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));

document.addEventListener('langchange', function() {
    renderStatsCards();
    renderSummaryTable();
});
```

## Testing Checklist

When making changes, verify:
- [ ] Dark/light theme works correctly
- [ ] English/Spanish translation works
- [ ] Data loads from JSON files
- [ ] No console errors
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Interactive elements (tabs, buttons, inputs) work
- [ ] CSV export produces correct data
- [ ] Charts render correctly (if applicable)
- [ ] Links between pages work

## Important Notes

- The app uses `localStorage` to persist theme and language preferences
- The `i18n` module automatically updates elements with `data-i18n` attributes
- Chart.js instances must be destroyed before re-creating them
- All JSON data files are loaded at page initialization
- The Python script expects to be run from the web/ directory or have correct relative paths

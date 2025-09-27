# Partial Derivative Practice

A front-end only web app for practicing partial derivatives. Students get 10 questions; each shows a function f(x, y), a point, asks for the symbolic partial derivative in a specified direction, and the numeric value at the given point. All mathematics is rendered in LaTeX using MathJax.

Features:
- MathJax v3 configured to support both `$...$` and `\( ... \)` inline math reliably, plus display math.
- Ten curated problems with show/hide solutions.
- Lightweight numeric checker for the value at the point; accepts expressions like `3/sqrt(13)`.
- Optional numeric approximations displayed next to exact values.

## How to run

This is a static site. You can open `index.html` directly in a browser, or serve the folder with any static server.

From a terminal:

```bash
# Option 1: Python 3 built-in server
python3 -m http.server 8000
# then visit http://localhost:8000 in your browser and open partial-derivative-practice/index.html

# Option 2: Node http-server (if installed)
npx http-server -p 8000
```

If inline math ever looks off, try toggling between `$...$` and `\( ... \)` delimiters. This app enables both styles for robustness.

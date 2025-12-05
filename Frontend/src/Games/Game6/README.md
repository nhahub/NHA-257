Memory timeline — Story Chain Game

How to try locally

1. Open index.html in any modern browser (double-click the file).

2. Or run a local server for best results (recommended):

   - Python 3:
     ```powershell
     py -3 -m http.server 5500; # navigate to http://localhost:5500 in your browser
     ```

What I fixed

- Reworked `script.js` to match the DOM in `index.html` (the previous script referenced missing story UI elements and had duplicated listeners).
- Implemented a single-quiz flow that shows the questions, tracks score, and displays a results modal.

If anything else is broken or you'd like the multi-story flow restored, I can extend the UI and the script to support that next.

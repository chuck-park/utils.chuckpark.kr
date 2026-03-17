const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const charNoSpaceCount = document.getElementById('charNoSpaceCount');
const wordCount = document.getElementById('wordCount');
const lineCount = document.getElementById('lineCount');

function countStats(text) {
  const totalChars = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.length ? text.split(/\r?\n/).length : 0;

  return {
    totalChars,
    charsWithoutSpaces,
    words,
    lines,
  };
}

function render() {
  const stats = countStats(textInput.value);
  charCount.textContent = String(stats.totalChars);
  charNoSpaceCount.textContent = String(stats.charsWithoutSpaces);
  wordCount.textContent = String(stats.words);
  lineCount.textContent = String(stats.lines);
}

textInput.addEventListener('input', render);
render();

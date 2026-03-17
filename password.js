const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SAFE_SPECIAL = '@#%+=_-';

function randomInt(maxExclusive) {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error('Invalid random max value');
  }

  const randomBuffer = new Uint32Array(1);
  const maxUint32 = 0xFFFFFFFF;
  const threshold = maxUint32 - (maxUint32 % maxExclusive);

  let value;
  do {
    crypto.getRandomValues(randomBuffer);
    value = randomBuffer[0];
  } while (value >= threshold);

  return value % maxExclusive;
}

function pickOne(chars) {
  return chars[randomInt(chars.length)];
}

function secureShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildPool() {
  return LOWER + UPPER + DIGITS + SAFE_SPECIAL;
}

function validateLength(length) {
  if (!Number.isInteger(length)) {
    throw new Error('길이는 정수여야 합니다.');
  }
  if (length < 8 || length > 64) {
    throw new Error('길이는 8~64 사이여야 합니다.');
  }
}

function generatePassword(length = 24) {
  validateLength(length);

  const required = [
    pickOne(LOWER),
    pickOne(UPPER),
    pickOne(DIGITS),
    pickOne(SAFE_SPECIAL),
  ];

  const pool = buildPool();
  const chars = [...required];

  for (let i = required.length; i < length; i += 1) {
    chars.push(pickOne(pool));
  }

  return secureShuffle(chars).join('');
}

function hasAllCategories(value) {
  return /[a-z]/.test(value)
    && /[A-Z]/.test(value)
    && /\d/.test(value)
    && /[@#%+=_-]/.test(value);
}

function runSelfChecks() {
  const set = new Set();
  for (let i = 0; i < 10; i += 1) {
    const pw = generatePassword(24);
    if (pw.length !== 24) throw new Error('길이 검증 실패');
    if (!hasAllCategories(pw)) throw new Error('카테고리 검증 실패');
    set.add(pw);
  }
  if (set.size !== 10) throw new Error('중복 발생');
}

const lengthInput = document.getElementById('length');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const resultEl = document.getElementById('result');
const feedbackEl = document.getElementById('feedback');

function showFeedback(message, isError = false) {
  feedbackEl.textContent = message;
  feedbackEl.style.color = isError ? '#ff9f9f' : '#9fd3a8';
}

function readLength() {
  const parsed = Number.parseInt(lengthInput.value, 10);
  if (!Number.isInteger(parsed)) {
    throw new Error('길이를 숫자로 입력해주세요.');
  }
  if (parsed < 8 || parsed > 64) {
    throw new Error('길이는 8~64 사이여야 합니다.');
  }
  return parsed;
}

function onGenerate() {
  try {
    const length = readLength();
    const password = generatePassword(length);
    resultEl.value = password;
    showFeedback('새 비밀번호가 생성되었습니다.');
  } catch (err) {
    showFeedback(err.message || '생성 중 오류가 발생했습니다.', true);
  }
}

async function onCopy() {
  const text = resultEl.value;
  if (!text) {
    showFeedback('먼저 비밀번호를 생성해주세요.', true);
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      resultEl.focus();
      resultEl.select();
      const ok = document.execCommand('copy');
      resultEl.setSelectionRange(0, 0);
      if (!ok) throw new Error('copy failed');
    }
    showFeedback('복사되었습니다.');
  } catch {
    showFeedback('복사에 실패했습니다. 수동으로 복사해주세요.', true);
  }
}

generateBtn.addEventListener('click', onGenerate);
copyBtn.addEventListener('click', onCopy);

try {
  runSelfChecks();
} catch {
  showFeedback('초기 검증 실패: 브라우저 환경을 확인해주세요.', true);
}

onGenerate();

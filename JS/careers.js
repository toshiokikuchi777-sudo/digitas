/* CAREERS PAGE — careers.js */

function submitApply() {
  const btn = document.getElementById('applyBtn');
  btn.textContent = '✓ エントリーを受け付けました。3営業日以内にご連絡します。';
  btn.style.background = '#2E7D32';
  btn.disabled = true;
}

/* RENTAL PAGE — rental.js */

// ===== PRICE DATA =====
const prices = {
  ip:     [4200, 5200, 6300, 7200, 8200],
  simple: [2500, 3500, 4500, 5500, 6500]
};
const periodLabels = ['4泊5日', '8泊9日', '15泊16日', '22泊23日', '30泊31日'];
const BASE_FEE = 1500;
let currentType = 'ip';

// ===== HERO QUICK CALC =====
function setType(type, el) {
  currentType = type;
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  calcPrice();
}

function calcPrice() {
  const period = parseInt(document.getElementById('periodSel').value) - 1;
  const qty = parseInt(document.getElementById('qtySel').value);
  const unitPrice = prices[currentType][period];
  const total = unitPrice * qty + BASE_FEE;
  document.getElementById('resultPrice').textContent = '¥' + total.toLocaleString();
  document.getElementById('resultUnit').textContent = qty + '台 × ' + periodLabels[period] + '（税別・基本料金込）';
}

function scrollToEstimate() {
  document.getElementById('estimate').scrollIntoView({ behavior: 'smooth' });
}

// ===== FAQ ACCORDION =====
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ===== ESTIMATE FORM =====
function getPeriodIndex(days) {
  if (days <= 5) return 0;
  if (days <= 9) return 1;
  if (days <= 16) return 2;
  if (days <= 23) return 3;
  if (days <= 31) return 4;
  return -1; // over 30 days
}

function calcEstimate() {
  const startDate = document.getElementById('estStart').value;
  const endDate = document.getElementById('estEnd').value;
  const qty = parseInt(document.getElementById('estQty').value) || 1;
  const type = document.getElementById('estType').value;
  const discount = document.querySelector('input[name="estDiscount"]:checked');
  const discountType = discount ? discount.value : 'web';

  const resultBox = document.getElementById('estResult');

  if (!startDate || !endDate) {
    resultBox.style.display = 'none';
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    resultBox.innerHTML = '<p style="color:var(--red);font-size:.88rem;">返却日は利用開始日より後の日付を選択してください。</p>';
    resultBox.style.display = 'block';
    return;
  }

  if (days > 31) {
    resultBox.innerHTML = '<p style="color:var(--gold-muted);font-size:.88rem;">31日を超える長期レンタルは個別見積もりとなります。お電話（0120-933-992）またはフォームよりお問い合わせください。</p>';
    resultBox.style.display = 'block';
    return;
  }

  const periodIdx = getPeriodIndex(days);
  const priceKey = type === 'IP無線' ? 'ip' : 'simple';
  const unitPrice = prices[priceKey][periodIdx];
  const subtotalBeforeDiscount = unitPrice * qty + BASE_FEE;

  // Discount
  let discountRate = 0;
  let discountLabel = '';
  if (discountType === 'student') {
    discountRate = 0.10;
    discountLabel = '学生割引 10%OFF';
  } else {
    discountRate = 0.05;
    discountLabel = 'WEB割引 5%OFF';
  }
  const discountAmount = Math.floor(subtotalBeforeDiscount * discountRate);
  const subtotal = subtotalBeforeDiscount - discountAmount;
  const tax = Math.floor(subtotal * 0.10);
  const total = subtotal + tax;

  resultBox.innerHTML = `
    <div class="est-summary">
      <div class="est-row"><span class="est-label">機種</span><span class="est-val">${type}</span></div>
      <div class="est-row"><span class="est-label">利用日数</span><span class="est-val">${days}日間（${periodLabels[periodIdx]}プラン）</span></div>
      <div class="est-row"><span class="est-label">台数</span><span class="est-val">${qty}台</span></div>
      <div class="est-row"><span class="est-label">1台単価</span><span class="est-val">¥${unitPrice.toLocaleString()}</span></div>
      <div class="est-row"><span class="est-label">基本料金</span><span class="est-val">¥${BASE_FEE.toLocaleString()}</span></div>
      <div class="est-row"><span class="est-label">${discountLabel}</span><span class="est-val discount">-¥${discountAmount.toLocaleString()}</span></div>
      <div class="est-divider"></div>
      <div class="est-row"><span class="est-label">小計（税別）</span><span class="est-val">¥${subtotal.toLocaleString()}</span></div>
      <div class="est-row"><span class="est-label">消費税（10%）</span><span class="est-val">¥${tax.toLocaleString()}</span></div>
      <div class="est-divider"></div>
      <div class="est-row est-total"><span class="est-label">合計（税込）</span><span class="est-val">¥${total.toLocaleString()}</span></div>
    </div>
  `;
  resultBox.style.display = 'block';

  // Store for form submission
  window._estimateData = { type, days, periodLabel: periodLabels[periodIdx], qty, unitPrice, discountLabel, discountAmount, subtotal, tax, total };
}

// Watch all estimate inputs for real-time calculation
document.addEventListener('DOMContentLoaded', function() {
  const inputs = ['estStart', 'estEnd', 'estQty', 'estType'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', calcEstimate);
  });
  document.querySelectorAll('input[name="estDiscount"]').forEach(r => {
    r.addEventListener('change', calcEstimate);
  });

  // Set min date for start (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const startInput = document.getElementById('estStart');
  if (startInput) startInput.min = tomorrow.toISOString().split('T')[0];

  // Update end min when start changes
  if (startInput) {
    startInput.addEventListener('change', function() {
      const endInput = document.getElementById('estEnd');
      if (endInput && this.value) {
        const minEnd = new Date(this.value);
        minEnd.setDate(minEnd.getDate() + 1);
        endInput.min = minEnd.toISOString().split('T')[0];
        const maxEnd = new Date(this.value);
        maxEnd.setDate(maxEnd.getDate() + 31);
        endInput.max = maxEnd.toISOString().split('T')[0];
      }
    });
  }
});

// ===== FORM SUBMIT =====
function submitEstimate() {
  const btn = document.getElementById('estBtn');
  const name = document.getElementById('estName').value.trim();
  const company = document.getElementById('estCompany').value.trim();
  const tel = document.getElementById('estTel').value.trim();
  const email = document.getElementById('estEmail').value.trim();
  const startDate = document.getElementById('estStart').value;
  const endDate = document.getElementById('estEnd').value;
  const address = document.getElementById('estAddress').value.trim();
  const usage = document.getElementById('estUsage').value;
  const payment = document.querySelector('input[name="estPayment"]:checked');
  const note = document.getElementById('estNote').value.trim();

  // Clear previous errors
  document.querySelectorAll('.est-field-error').forEach(el => el.remove());
  document.querySelectorAll('.est-error').forEach(el => el.classList.remove('est-error'));

  let valid = true;
  function showError(id, msg) {
    valid = false;
    const el = document.getElementById(id);
    el.classList.add('est-error');
    const span = document.createElement('span');
    span.className = 'est-field-error';
    span.textContent = msg;
    el.parentNode.appendChild(span);
  }

  if (!name) showError('estName', 'お名前を入力してください');
  if (!tel) showError('estTel', '電話番号を入力してください');
  if (!email) showError('estEmail', 'メールアドレスを入力してください');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) showError('estEmail', '正しいメールアドレスを入力してください');
  if (!startDate) showError('estStart', '利用開始日を選択してください');
  if (!endDate) showError('estEnd', '返却日を選択してください');
  if (!address) showError('estAddress', 'お届け先を入力してください');

  if (!valid) return;

  const est = window._estimateData || {};

  btn.textContent = '送信中...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Redirect to thanks page after simulated send
  setTimeout(() => {
    window.location.href = 'digitas_thanks.html';
  }, 800);
}

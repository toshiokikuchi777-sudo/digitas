/* LP PAGE — lp.js */

// Form validation & submit handler
document.getElementById('submitBtn').addEventListener('click', function(e) {
  e.preventDefault();
  const form = this.closest('.contact-form');
  const inputs = form.querySelectorAll('input[type=text], input[type=email]');
  let valid = true;

  // Clear previous errors
  form.querySelectorAll('.field-error').forEach(el => el.remove());
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

  // Validate required fields
  inputs.forEach(input => {
    const label = input.closest('.form-row').querySelector('label');
    if (label && label.textContent.includes('*') && !input.value.trim()) {
      valid = false;
      input.classList.add('error');
      const msg = document.createElement('span');
      msg.className = 'field-error';
      msg.textContent = 'この項目は必須です';
      input.parentNode.appendChild(msg);
    }
  });

  // Validate email format
  const email = form.querySelector('input[type=email]');
  if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    valid = false;
    email.classList.add('error');
    if (!email.parentNode.querySelector('.field-error')) {
      const msg = document.createElement('span');
      msg.className = 'field-error';
      msg.textContent = '正しいメールアドレスを入力してください';
      email.parentNode.appendChild(msg);
    }
  }

  if (!valid) return;

  // Show loading
  this.textContent = '送信中...';
  this.disabled = true;
  this.style.opacity = '0.7';

  // Simulate sending, then redirect to thanks page
  setTimeout(() => {
    window.location.href = 'digitas_thanks.html';
  }, 800);
});

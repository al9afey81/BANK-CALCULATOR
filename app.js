'use strict';
const form = document.getElementById('finance-form');
const fields = ['amount', 'rate', 'months'].map(id => document.getElementById(id));
const outputs = ['payment', 'profit', 'total'].map(id => document.getElementById(id));
const error = document.getElementById('error');
const format = new Intl.NumberFormat('en-US', {minimumFractionDigits:3, maximumFractionDigits:3});
function parse(value) {
  const normalized = value.trim().replace(/[٠-٩]/g, c => c.charCodeAt(0)-1632).replace(/[۰-۹]/g,c=>c.charCodeAt(0)-1776).replace(/٫/g,'.');
  return /^\d+(?:\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
}
function update() {
  const values = fields.map(field => parse(field.value));
  const monthCount = values[2];
  const duration = document.getElementById('duration');
  if (Number.isSafeInteger(monthCount) && monthCount > 0) {
    const years = Math.floor(monthCount / 12), remaining = monthCount % 12;
    duration.value = [years ? `${years} سنة` : '', remaining ? `${remaining} شهر` : ''].filter(Boolean).join(' و ');
  } else duration.value = '—';
  document.querySelectorAll('[data-months]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.months) === monthCount)));
  const valid = [Number.isFinite(values[0]) && values[0]>0, Number.isFinite(values[1]) && values[1]>=0, Number.isSafeInteger(values[2]) && values[2]>0];
  fields.forEach((field,i)=>field.setAttribute('aria-invalid', String(!valid[i])));
  try {
    if (valid.includes(false)) throw new RangeError();
    const result = calculateFinance(...values);
    outputs.forEach(output => output.value = format.format(result[output.id]));
    document.getElementById('principal-bar').style.width = `${values[0]/result.total*100}%`;
    error.textContent = '';
  } catch {
    outputs.forEach(output => output.value = '—');
    document.getElementById('principal-bar').style.width = '0%';
    error.textContent = !valid[0] ? 'أدخل مبلغ تمويل موجباً.' : !valid[1] ? 'أدخل نسبة سنوية تساوي صفراً أو أكثر.' : !valid[2] ? 'أدخل مدة بالأشهر: عدد صحيح موجب.' : 'القيم أكبر من نطاق الحساب. يرجى تقليلها.';
  }
}
document.querySelectorAll('[data-months]').forEach(button => button.addEventListener('click', () => {
  fields[2].value = button.dataset.months;
  update();
}));
form.addEventListener('input',update);
form.addEventListener('submit',event=>event.preventDefault());
form.addEventListener('reset',()=>{setTimeout(()=>{fields[0].value='';fields[1].value='6.5';fields[2].value='';update();error.textContent='';fields.forEach(field=>field.setAttribute('aria-invalid','false'));fields[0].focus();},0);});
update();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});

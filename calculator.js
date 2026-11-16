/* Equal monthly instalments on a reducing balance. No intermediate rounding. */
(function (root) {
  'use strict';
  function calculate(amount, annualRate, months) {
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(annualRate) || annualRate < 0 || !Number.isSafeInteger(months) || months <= 0) throw new RangeError('Invalid financing inputs');
    const r = annualRate / 1200;
    const payment = r === 0 ? amount / months : amount * (r / -Math.expm1(-months * Math.log1p(r)));
    const total = r === 0 ? amount : payment * months;
    const profit = Math.max(0, total - amount);
    if (![payment, total, profit].every(Number.isFinite)) throw new RangeError('Result outside supported numeric range');
    return {payment, total, profit};
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = calculate;
  else root.calculateFinance = calculate;
})(typeof window !== 'undefined' ? window : globalThis);

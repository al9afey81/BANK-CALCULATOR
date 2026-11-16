const test = require('node:test');
const assert = require('node:assert/strict');
const calculate = require('../calculator.js');
const close = (a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
test('zero interest: exact principal and zero profit',()=>{const x=calculate(10000,0,60);close(x.payment,10000/60);assert.equal(x.total,10000);assert.equal(x.profit,0);});
test('6.5% reducing balance agrees with iterative amortization',()=>{const x=calculate(10000,6.5,60);let balance=10000,interest=0;for(let i=0;i<60;i++){const charge=balance*0.065/12;interest+=charge;balance+=charge-x.payment;}close(balance,0);close(x.profit,interest);close(x.total,11739.688931237126,1e-6);});
test('one month and arbitrary integer month counts',()=>{close(calculate(1000,12,1).payment,1010);for(const n of [7,37,121,10001]){const x=calculate(7000,6.5,n);close(x.payment*n,x.total);}});
test('very small rates remain stable',()=>close(calculate(10000,1e-12,60).payment,10000/60));
test('reject invalid inputs',()=>{for(const args of [[0,6.5,60],[-1,6.5,60],[1000,-1,60],[1000,1,0],[1000,1,1.5],[NaN,1,60],[1000,Infinity,60],[1000,1,Number.MAX_SAFE_INTEGER+1]]) assert.throws(()=>calculate(...args),RangeError);});

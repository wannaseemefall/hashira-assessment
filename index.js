function charToVal(ch) {
  const c = ch.toLowerCase();
  if (c >= '0' && c <= '9') return BigInt(c.charCodeAt(0) - 48);  
  if (c >= 'a' && c <= 'z') return BigInt(10 + (c.charCodeAt(0) - 97)); 
  throw new Error(`Invalid digit character: ${ch}`);
}


function parseInBaseToBigInt(s, base) {
  const B = BigInt(base);
  let sign = 1n;
  let i = 0;
  if (s === '+') { i = 1; }
  else if (s === '-') { sign = -1n; i = 1; }

  let acc = 0n;
  for (; i < s.length; i++) {
    const ch = s[i];
    if (ch === '_' || ch === ' ' || ch === '\t') continue; 
    const val = charToVal(ch);
    if (val >= B) {
      throw new Error(`Digit '${ch}' out of range for base ${base}`);
    }
    acc = acc * B + val;
  }
  return sign * acc;
}


function computeConstant(testcase) {
  const n = Number(testcase.keys.n);
  const k = Number(testcase.keys.k);
  const m = k - 1; // degree


  const roots = [];
  for (let idx = 1; idx <= n && roots.length < m; idx++) {
    const entry = testcase[String(idx)];
    if (!entry) continue;
    const base = Number(entry.base);
    const value = String(entry.value);
    const r = parseInBaseToBigInt(value, base);
    roots.push(r);
  }
  if (roots.length !== m) {
    throw new Error(`Expected ${m} roots but found ${roots.length}`);
  }

  
  let prod = 1n;
  for (const r of roots) prod *= r;

  
  const sign = (m % 2 === 0) ? 1n : -1n;
  const c = sign * prod; 
  return c.toString();   
}


const fs = require('fs');

function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Usage: node index.js <testcase1.json> [<testcase2.json> ...]');
    process.exit(1);
  }
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(raw); 
    const c = computeConstant(data);
    console.log(c);
  }
}

if (require.main === module) main();

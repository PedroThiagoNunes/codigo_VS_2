// SHA-256 em JavaScript puro + salt. A senha nunca é guardada em texto puro.
const _K = [], _H = [];
(function () {
  let p = 0;
  for (let n = 2; p < 64; n++) {
    let primo = true;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) { primo = false; break; }
    if (!primo) continue;
    _K[p] = (Math.pow(n, 1 / 3) % 1 * 4294967296) | 0;
    if (p < 8) _H[p] = (Math.pow(n, 0.5) % 1 * 4294967296) | 0;
    p++;
  }
})();

function sha256(str) {
  str = unescape(encodeURIComponent(str)); // UTF-8
  const rr = (v, a) => (v >>> a) | (v << (32 - a));
  const bits = str.length * 8, words = [];
  let hash = _H.slice(0), i, j;
  str += '\x80';
  while (str.length % 64 - 56) str += '\x00';
  for (i = 0; i < str.length; i++) words[i >> 2] |= str.charCodeAt(i) << ((3 - i) % 4) * 8;
  words.push((bits / 4294967296) | 0, bits);
  for (j = 0; j < words.length;) {
    const w = words.slice(j, j += 16), old = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
      const t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + _K[i] +
        (w[i] = i < 16 ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
      const t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(t1 + t2) | 0].concat(hash);
      hash[4] = (hash[4] + t1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + old[i]) | 0;
  }
  let out = '';
  for (i = 0; i < 8; i++) for (j = 3; j >= 0; j--) { const b = (hash[i] >> (j * 8)) & 255; out += (b < 16 ? '0' : '') + b.toString(16); }
  return out;
}

function novoSalt() {
  const a = new Uint8Array(16);
  if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
  else for (let i = 0; i < 16; i++) a[i] = Math.random() * 256;
  return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
}

function hashSenha(senha, salt) {
  let h = sha256(salt + senha);
  for (let i = 0; i < 3000; i++) h = sha256(h + salt); // reforço contra tentativa e erro
  return h;
}

// Acesso ao "banco" local (converte cadastros antigos com senha em texto puro)
function salvarUsuarios(us) { localStorage.setItem('usuarios', JSON.stringify(us)); }
function carregarUsuarios() {
  const us = JSON.parse(localStorage.getItem('usuarios') || '[]');
  let mudou = false;
  us.forEach(u => {
    if (u.senha !== undefined) { u.salt = novoSalt(); u.hash = hashSenha(u.senha, u.salt); delete u.senha; mudou = true; }
  });
  if (mudou) salvarUsuarios(us);
  return us;
}


function primefiller() {
  let prime = new Set();

  let seive = Array(251).fill(true);
  seive[0] = false;
  seive[1] = false;
  for (let i = 2; i < 251; i++) {
    for (let j = i * 2; j < 251; j += i) {
      seive[j] = false;
    }
  }
  for (let i = 0; i < seive.length; i++) {
    if (seive[i]) {
      prime.add(i);
    }
  }

  return prime;
}

function pickrandomprime(prime) {
  let primeArray = Array.from(prime);
  let k = Math.floor(Math.random() * prime.size);
  return primeArray.splice(k, 1)[0];
}

function setkeys(prime) {
  let prime1 = pickrandomprime(prime);
  let prime2 = pickrandomprime(prime);

  let fi = (prime1 - 1) * (prime2 - 1);
  let e = 2;
  while (true) {
    if (gcd(e, fi) === 1) {
      break;
    }
    e++;
  }

  let d = 2;
  while (true) {
    if ((d * e) % fi === 1) {
      break;
    }
    d++;
  }

  return {
    public_key: e,
    private_key: d,
    n: prime1 * prime2,
  }
}

function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function encrypt(message, public_key, n) {
  let e = public_key;
  let encrypted_text = 1;
  while (e > 0) {
    encrypted_text *= message;
    encrypted_text %= n;
    e--;
  }
  return encrypted_text;
}

function decrypt(encrypted_text, private_key, n) {
  let d = private_key;
  let decrypted = 1;
  while (d > 0) {
    decrypted *= encrypted_text;
    decrypted %= n;
    d--;
  }
  return decrypted;
}

function encoder(message, public_key, n) {
  let encoded = [];
  for (let i = 0; i < message.length; i++) {
    encoded.push(encrypt(message.charCodeAt(i), public_key, n));
  }
  return encoded;
}

function decoder(encoded, private_key, n) {
  let s = '';
  for (let i = 0; i < encoded.length; i++) {
    s += String.fromCharCode(decrypt(encoded[i], private_key, n));
  }
  return s;
}

const btnEnc = document.getElementById('btn-encryption');
const btnDes = document.getElementById('btn-descryption');

// Tombol enkripsi
btnEnc.addEventListener('click', (e) => {
  e.preventDefault();
  const message = document.getElementById('msg-encryption').value;
  if (!message.length) return;

  // Proses enkripsi
  const prime = primefiller();
  const { public_key, private_key, n } = setkeys(prime);
  let coded = encoder(message, public_key, n);

  // Menampilkan hasilnya
  document.getElementById('result-pub-key').value = public_key;
  document.getElementById('result-pri-key').value = private_key;
  document.getElementById('result-n-key').value = n;
  document.getElementById('result-msg-enc').innerHTML = coded.join(' ');
});

// Tombol deskripsi
btnDes.addEventListener('click', (e) => {
  e.preventDefault();
  const message = document.getElementById('msg-descryption').value;
  const privateKeyInput = document.getElementById('private-key-input').value;
  const nKeyInput = document.getElementById('n-key-input').value;
  if (!message.length || !privateKeyInput.length || !nKeyInput.length) return;

  // Proses deskripsi
  const result = decoder(message.split(' '), privateKeyInput, nKeyInput);

  // Menampilkan hasilnya
  document.getElementById('result-msg-des').innerHTML = result;
});

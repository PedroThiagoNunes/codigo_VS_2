const form = document.getElementById('formCadastro');
const msg = document.getElementById('mensagem');
const campo = id => document.getElementById(id);

// ---- Máscaras ----
campo('cpf').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = v;
});
campo('telefone').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  e.target.value = v;
});

// ---- Validação de CPF ----
function cpfValido(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += cpf[i] * (t + 1 - i);
    const dig = ((soma * 10) % 11) % 10;
    if (dig != cpf[t]) return false;
  }
  return true;
}

function erro(texto) {
  msg.className = 'msg erro';
  msg.textContent = texto;
}

// ---- "Banco de dados" local ----

form.addEventListener('submit', e => {
  e.preventDefault();
  const nome = campo('nome').value.trim();
  const email = campo('email').value.trim().toLowerCase();
  const cpf = campo('cpf').value.trim();
  const telefone = campo('telefone').value.trim();
  const senha = campo('senha').value;
  const confirmar = campo('confirmarSenha').value;

  if (!nome || !email || !cpf || !telefone || !senha || !confirmar) return erro('Preencha todos os campos.');
  if (!/^\S+@\S+\.\S+$/.test(email)) return erro('Digite um e-mail válido.');
  if (!cpfValido(cpf)) return erro('CPF inválido.');
  if (telefone.replace(/\D/g, '').length < 10) return erro('Telefone inválido.');
  if (senha.length < 6) return erro('A senha deve ter pelo menos 6 caracteres.');
  if (senha !== confirmar) return erro('As senhas não conferem.');

  const usuarios = carregarUsuarios();
  if (usuarios.some(u => u.email === email)) return erro('Este e-mail já está cadastrado.');
  if (usuarios.some(u => u.cpf === cpf)) return erro('Este CPF já está cadastrado.');

  const salt = novoSalt();
  usuarios.push({ nome, email, cpf, telefone, salt, hash: hashSenha(senha, salt) });
  salvarUsuarios(usuarios);

  msg.className = 'msg ok';
  msg.textContent = 'Cadastro realizado! Redirecionando para o login...';
  form.reset();
  setTimeout(() => (window.location.href = '../index.html'), 1500);
});

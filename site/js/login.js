const form = document.getElementById('formLogin');
const erroEl = document.getElementById('erro');
const sugestaoEl = document.getElementById('sugestao');
let tentativas = 0;

form.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const senha = document.getElementById('senha').value;
  const usuarios = carregarUsuarios();
  const usuario = usuarios.find(u => u.email === email);

  if (usuario && hashSenha(senha, usuario.salt) === usuario.hash) {
    sessionStorage.setItem('usuarioLogado', usuario.email);
    window.location.href = 'pages/menu.html';
    return;
  }

  tentativas++;
  const emailErrado = !usuario;
  erroEl.textContent = emailErrado ? 'E-mail errado (não cadastrado).' : 'Senha errada.';
  sugestaoEl.textContent = '';

  if (tentativas > 3) {
    sugestaoEl.className = 'msg';
    sugestaoEl.innerHTML = emailErrado
      ? 'Muitas tentativas. Esse e-mail não está cadastrado: <a href="pages/cadastro.html">cadastre-se aqui</a>.'
      : 'Muitas tentativas. Esqueceu a senha? <a href="pages/recuperar.html">Redefina aqui</a>.';
  }
});

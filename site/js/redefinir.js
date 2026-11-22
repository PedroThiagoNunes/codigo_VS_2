const email = sessionStorage.getItem('emailRecuperacao');
if (!email) window.location.replace('recuperar.html'); // só entra após validar o código

const form = document.getElementById('formRedefinir');
const msg = document.getElementById('mensagem');
const mostrar = (t, c) => { msg.className = 'msg ' + c; msg.textContent = t; };

form.addEventListener('submit', e => {
  e.preventDefault();
  const nova = document.getElementById('novaSenha').value;
  const conf = document.getElementById('confirmarSenha').value;
  if (!nova || !conf) return mostrar('Preencha os dois campos.', 'erro');
  if (nova.length < 6) return mostrar('A senha deve ter pelo menos 6 caracteres.', 'erro');
  if (nova !== conf) return mostrar('As senhas não conferem.', 'erro');

  const usuarios = carregarUsuarios();
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) return mostrar('Conta não encontrada.', 'erro');

  usuario.salt = novoSalt();
  usuario.hash = hashSenha(nova, usuario.salt);
  salvarUsuarios(usuarios);
  sessionStorage.removeItem('emailRecuperacao');

  form.reset();
  mostrar('Senha redefinida! Redirecionando para o login...', 'ok');
  setTimeout(() => (window.location.href = '../index.html'), 1200);
});

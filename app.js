const API = window.API_BASE || 'http://136.248.118.64:3000'; // ajuste para seu IP público

const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const goRegister = document.getElementById('goRegister');
const goLogin = document.getElementById('goLogin');

if (goRegister) goRegister.onclick = () => { document.getElementById('registerCard').style.display = 'block'; };
if (goLogin) goLogin.onclick = () => { document.getElementById('registerCard').style.display = 'none'; };

if (btnRegister) btnRegister.onclick = async () => {
  const body = {
    nome: document.getElementById('r_nome').value,
    telefone: document.getElementById('r_telefone').value,
    email: document.getElementById('r_email').value,
    senha: document.getElementById('r_senha').value,
  };
  const r = await fetch(API + '/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const j = await r.json();
  if (r.ok) {
    localStorage.setItem('user', JSON.stringify(j.user));
    window.location.href = 'homeUsuario.html';
  } else alert(j.error || 'Erro ao cadastrar');
};

if (btnLogin) btnLogin.onclick = async () => {
  const body = {
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value,
    tipo: document.getElementById('tipo').value
  };
  const r = await fetch(API + '/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const j = await r.json();
  if (r.ok) {
    localStorage.setItem('token', j.token);
    localStorage.setItem('user', JSON.stringify(j.user));
    window.location.href = 'homeUsuario.html';
  } else alert(j.error || 'Login inválido');
};

const API = window.API_BASE || 'http://localhost:3000';

async function carregarPendentes(){
  const r = await fetch(API + '/admin/events/pending');
  const evs = await r.json();
  const wrap = document.getElementById('pendentes');
  wrap.innerHTML = '';
  for (const e of evs){
    const div = document.createElement('div');
    div.className='card';
    div.innerHTML = `
      <strong>${e.nome}</strong> — ${e.endereco} — ${e.classificacao}<br>
      <button data-aprovar="${e.id_evento}">Aprovar</button>
      <button data-rejeitar="${e.id_evento}" class="ghost">Rejeitar</button>
    `;
    wrap.appendChild(div);
  }
  document.querySelectorAll('[data-aprovar]').forEach(b => b.onclick = async () => {
    const id = b.getAttribute('data-aprovar');
    await fetch(API + '/admin/events/' + id + '/approve', {method:'POST'});
    carregarPendentes();
  });
  document.querySelectorAll('[data-rejeitar]').forEach(b => b.onclick = async () => {
    const id = b.getAttribute('data-rejeitar');
    await fetch(API + '/admin/events/' + id + '/reject', {method:'POST'});
    carregarPendentes();
  });
}

async function carregarUsuarios(){
  const r = await fetch(API + '/admin/users');
  const us = await r.json();
  const wrap = document.getElementById('usuarios');
  wrap.innerHTML = '';
  for (const u of us){
    const div = document.createElement('div');
    div.className='card';
    div.innerHTML = `
      <strong>${u.nome}</strong> — ${u.email} — ${u.telefone}<br>
      <button data-editar="${u.id_usuario}">Editar</button>
      <button data-remover="${u.id_usuario}" class="ghost">Remover</button>
    `;
    wrap.appendChild(div);
  }
  document.querySelectorAll('[data-remover]').forEach(b => b.onclick = async () => {
    const id = b.getAttribute('data-remover');
    await fetch(API + '/admin/users/' + id, {method:'DELETE'});
    carregarUsuarios();
  });
}

carregarPendentes();
carregarUsuarios();

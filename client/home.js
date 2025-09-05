const API = window.API_BASE || 'http://localhost:3000';
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (!user || !user.id) { /* exige login */ }

document.getElementById('btnLogout').onclick = () => { localStorage.clear(); window.location.href = 'index.html'; };
document.getElementById('btnAdmin').onclick = () => { window.location.href='admin.html'; };
document.getElementById('btnAuthority').onclick = () => { window.location.href='autoridade.html'; };

const feed = document.getElementById('feed');

async function carregarFeed(){
  const r = await fetch(API + '/events');
  const eventos = await r.json();
  feed.innerHTML = '';
  for (const ev of eventos){
    const card = document.createElement('div');
    card.className = 'event';
    card.innerHTML = `
      <div class="event-header">
        <strong>${ev.nome}</strong>
        <span class="tag">${ev.classificacao}</span>
      </div>
      <div class="event-meta">
        <div>Por: <strong>${ev.nome_usuario || 'Anônimo'}</strong></div>
        <div>Endereço: ${ev.endereco}</div>
        <div>Risco: ${ev.nivel_risco} · Reclamações: <span data-qtd="${ev.id_evento}">${ev.quantidade_reclamacoes}</span></div>
      </div>
      <div class="event-imgs">${(ev.fotos||[]).map(u => `<img src="${API}${u}" alt="foto">`).join('')}</div>
      <div class="event-actions">
        <button data-like="${ev.id_evento}">Reclamar</button>
        <button data-report="${ev.id_evento}" class="ghost">Denunciar</button>
        <button data-comments="${ev.id_evento}" class="ghost">Comentários</button>
      </div>
    `;
    feed.appendChild(card);
  }

  // listeners
  document.querySelectorAll('[data-like]').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-like');
      const r = await fetch(API + `/events/${id}/reclamar`, {method:'POST'});
      const j = await r.json();
      if (r.ok) {
        document.querySelector(`[data-qtd="${id}"]`).textContent = j.quantidade_reclamacoes;
      }
    };
  });

  document.querySelectorAll('[data-report]').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-report');
      await fetch(API + `/events/${id}/denunciar`, {method:'POST'});
      alert('Denúncia enviada. Obrigado!');
    };
  });

  document.querySelectorAll('[data-comments]').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-comments');
      const r = await fetch(API + `/events/${id}/comentarios`);
      const cs = await r.json();
      alert(cs.map(c => `• ${c.autor}: ${c.comentario}`).join('\n') || 'Sem comentários');
    };
  });
}

carregarFeed();

// Modal de criação
const modal = document.getElementById('modalNovo');
const btnNovo = document.getElementById('btnNovo');
const closeModal = document.getElementById('closeModal');
btnNovo.onclick = () => modal.style.display = 'flex';
closeModal.onclick = () => modal.style.display = 'none';

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const progressBar = document.getElementById('progressBar');

document.getElementById('toStep2').onclick = () => { step1.style.display='none'; step2.style.display='block'; progressBar.style.width='66%'; };
document.getElementById('back1').onclick = () => { step2.style.display='none'; step1.style.display='block'; progressBar.style.width='33%'; };
document.getElementById('toStep3').onclick = () => { step2.style.display='none'; step3.style.display='block'; progressBar.style.width='100%'; };
document.getElementById('back2').onclick = () => { step3.style.display='none'; step2.style.display='block'; progressBar.style.width='66%'; };

document.getElementById('criarEvento').onclick = async () => {
  const body = {
    nome: document.getElementById('ev_nome').value,
    endereco: document.getElementById('ev_endereco').value,
    nivel_risco: document.getElementById('ev_risco').value,
    classificacao: document.getElementById('ev_classificacao').value,
    descricao: document.getElementById('ev_descricao').value,
    id_usuario: (JSON.parse(localStorage.getItem('user')||'{}').id)
  };
  const r = await fetch(API + '/events', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const j = await r.json();
  if (!r.ok) return alert(j.error || 'Erro ao criar evento');
  const idEvento = j.id_evento;

  // upload de fotos
  const files = document.getElementById('ev_fotos').files;
  if (files.length){
    const form = new FormData();
    for (const f of files) form.append('fotos', f);
    await fetch(API + `/events/${idEvento}/fotos`, { method:'POST', body: form });
  }
  alert('Evento criado! Aguarde aprovação do administrador.');
  modal.style.display='none';
  carregarFeed();
};

const API = window.API_BASE || 'https://acaocidada.duckdns.org';

async function carregar(){
  const r = await fetch(API + '/authority/events');
  const evs = await r.json();
  const wrap = document.getElementById('evs');
  wrap.innerHTML = '';
  for (const e of evs){
    const div = document.createElement('div');
    div.className='card';
    div.innerHTML = `
      <strong>${e.nome}</strong> — ${e.endereco}<br>
      Situação: ${e.situacao}<br>
      <button data-resolve="${e.id_evento}">Marcar como resolvido</button>
    `;
    wrap.appendChild(div);
  }
  document.querySelectorAll('[data-resolve]').forEach(b => b.onclick = async () => {
    const id = b.getAttribute('data-resolve');
    await fetch(API + '/authority/events/' + id + '/resolve', {method:'POST'});
    carregar();
  });
}

carregar();

# Ação Cidadã — Quickstart

## Backend (Oracle Cloud VM)
```bash
cd server
cp .env.example .env
# edite .env se necessário (DB_HOST/USER/PASSWORD)
npm install
# importe o schema (na VM):
mysql -u root -p < schema.sql
npm start
```

API base: `http://SEU_IP_PUBLICO:3000`

## Frontend (GitHub Pages ou local)
Edite `client/*.html` e defina:
```html
<script>
  window.API_BASE = "http://SEU_IP_PUBLICO:3000";
</script>
```
Suba a pasta `client` para um repositório GitHub e ative Pages.

## Endpoints principais
- `POST /auth/register` — cria usuário cidadão
- `POST /auth/login` — login (body: email, senha, tipo: 'usuario'|'admin'|'autoridade')
- `GET /events` — feed de eventos aprovados
- `POST /events` — cria evento (pendente)
- `POST /events/:id/fotos` — upload de até 5 fotos (multipart/form-data, campo `fotos`)
- `POST /events/:id/reclamar` — incrementa contagem
- `POST /events/:id/denunciar` — registra denúncia
- `GET /events/:id/comentarios` e `POST /events/:id/comentarios`
- Admin: `GET /admin/events/pending`, `POST /admin/events/:id/approve|reject`, `GET/PUT/DELETE /admin/users`
- Autoridade: `GET /authority/events`, `POST /authority/events/:id/resolve`

```
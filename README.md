# Sistema de registro de productores y productos con geocercas

Monorepo del sistema web (tesis): Django + DRF + PostgreSQL/PostGIS (backend) y React + Leaflet (frontend).

## Estructura

```
backend/    Django + DRF + PostGIS
frontend/   React (Vite) + Leaflet
```

## Requisitos

- Python 3.9+
- Node.js (LTS)
- PostgreSQL 16 + PostGIS (instalados vía Homebrew, instancia dedicada en el puerto 5433 para no interferir con otras instalaciones de Postgres en esta máquina)

## Backend

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

La API queda disponible en `http://localhost:8000/api/`, con el panel de administración en `http://localhost:8000/admin/`.

Variables de entorno en `backend/.env` (ver `backend/.env.example`).

## Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Base de datos

Rol y base de datos dedicados para el proyecto (instancia Homebrew `postgresql@16`, puerto 5433):

```bash
createuser -p 5433 tesis_user
createdb -p 5433 -O tesis_user tesis_geocercas
psql -p 5433 -d tesis_geocercas -c "CREATE EXTENSION postgis;"
```

## Autenticación

JWT (`djangorestframework-simplejwt`). Login: `POST /api/auth/login/` con `{ "username": "...", "password": "..." }`, devuelve `access` y `refresh`.

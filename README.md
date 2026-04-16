# Mini Blog Dashboard

Une application fullstack pour créer et gérer un blog avec un backend Django REST API et un frontend React + Vite.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Démarrage du projet](#démarrage-du-projet)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)

## 🔧 Prérequis

- Python 3.12+
- Node.js 18+
- pip
- npm

## 📦 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Florian-26/mini_blog.git
cd mini_blog
```

### 2. Configuration du Backend (Django)

#### Créer et activer l'environnement virtuel

```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

#### Installer les dépendances Python

```bash
pip install -r requirements.txt
```

#### Configurer la base de données

```bash
python manage.py migrate
```

### 3. Configuration du Frontend (React + Vite)

#### Accéder au dossier frontend

```bash
cd frontend
```

#### Installer les dépendances

```bash
npm install
```

#### Retourner au dossier racine

```bash
cd ..
```

## 🚀 Démarrage du projet

### Lancer le serveur Django (backend)

```bash
# S'assurer que l'environnement virtuel est activé
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

python manage.py runserver
```

Le backend sera disponible sur `http://localhost:8000`

### Lancer le serveur de développement React (frontend)

Depuis un autre terminal :

```bash
cd frontend
npm run dev
```

Le frontend sera disponible sur `http://localhost:5173`

## 📁 Structure du projet

```
mini_blog/
├── backend/
│   ├── core/                 # Configuration Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── blog/                 # Application Django
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── migrations/
│   │   └── admin.py
│   ├── manage.py
│   ├── db.sqlite3
│   └── requirements.txt
├── frontend/                 # Application React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── assets/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## ✨ Fonctionnalités

- ✅ Création, lecture, modification et suppression d'articles
- ✅ Interface utilisateur moderne avec React et Tailwind CSS
- ✅ API REST avec Django REST Framework
- ✅ Support PostgreSQL et SQLite3
- ✅ CORS configuré pour développement

## 🛠️ Technologies utilisées

### Backend
- **Django** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL / SQLite3** - Base de données

### Frontend
- **React** - Bibliothèque UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Axios** - Client HTTP

## 📝 API Endpoints

- `GET /api/articles/` - Lister tous les articles
- `POST /api/articles/` - Créer un nouvel article
- `GET /api/articles/<id>/` - Récupérer un article spécifique
- `PUT /api/articles/<id>/` - Mettre à jour un article
- `DELETE /api/articles/<id>/` - Supprimer un article

## 👤 Auteur

Florian-26

## 📄 License

MIT

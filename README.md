# Pokédex ECE – Backend

## Description du projet

Ce backend Node.js/Express/MongoDB gère l'API REST du Pokédex. Il permet l'authentification sécurisée (JWT), la gestion des utilisateurs, et le CRUD complet sur les Pokémon. Toutes les routes critiques sont protégées par un middleware d'authentification.

---

## Installation

1. Cloner le dépôt et se placer dans le dossier backend :

```bash
git clone <url-du-repo>
cd pokedex-api-EnzoSinghavara
```

2. Installer les dépendances :

```bash
npm install
```

3. Configurer l'environnement :
- Créer un fichier `.env` à la racine (voir `.env.example` si présent)
- Exemple de variables :
  ```env
  MONGODB_URI=mongodb://localhost:27017/pokedex
  JWT_SECRET=une_chaine_secrete
  PORT=3000
  ```

4. Lancer le serveur :

```bash
npm start
```

- L'API sera accessible sur `http://localhost:3000`

---

## Documentation de l'API

### Authentification
- `POST /api/auth/login` – Connexion
- `POST /api/auth/register` – Création de compte

### Pokémon
- `GET /api/pokemons` – Liste tous les Pokémon
- `GET /api/pokemons/:id` – Détail d'un Pokémon
- `POST /api/pokemons` – Créer un Pokémon (**authentifié**)
- `PUT /api/pokemons/:id` – Modifier un Pokémon (**authentifié**)
- `DELETE /api/pokemons/:id` – Supprimer un Pokémon (**authentifié**)

**Toutes les routes POST/PUT/DELETE nécessitent le header :**
```
Authorization: Bearer <token>
```

---

## Lien vers la vidéo de démonstration

👉 [Voir la démo sur YouTube](https://youtu.be/Md4c6YVMc9s)

---

## Concepts à Comprendre
1. REST API
   - Méthodes HTTP (GET, POST, PUT, DELETE)
   - Codes de statut HTTP
   - Structure des URL
   - CORS (Cross-Origin Resource Sharing)

2. Express.js
   - Routing
   - Middleware
   - Gestion des requêtes et réponses
   - Configuration CORS

3. Sécurité de Base
   - Validation des entrées
   - Authentification
   - Gestion des erreurs
   - Politiques CORS

## Configuration CORS
CORS (Cross-Origin Resource Sharing) est un mécanisme qui permet à de nombreuses ressources (polices, JavaScript, etc.) d'une page web d'être demandées à partir d'un autre domaine que celui du domaine d'origine.

Pour utiliser l'API depuis un autre domaine :
1. L'API est configurée avec CORS activé
2. Toutes les origines sont autorisées dans cette version de développement
3. En production, vous devriez restreindre les origines autorisées

Pour une configuration plus restrictive, vous pouvez modifier les options CORS :

```javascript
app.use(cors({
  origin: 'https://votre-domaine.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Gestion des Fichiers Statiques
Le serveur expose le dossier `assets` pour servir les images des Pokémon. Les images sont accessibles via l'URL :
```
http://localhost:3000/assets/pokemons/{id}.png
```

Par exemple, pour accéder à l'image de Pikachu (ID: 25) :
```
http://localhost:3000/assets/pokemons/25.png
```

### Configuration
Le middleware `express.static` est utilisé pour servir les fichiers statiques :
```javascript
app.use('/assets', express.static(path.join(__dirname, '../assets')));
```

### Sécurité
- Seuls les fichiers du dossier `assets` sont exposés
- Les autres dossiers du projet restent inaccessibles
- En production, considérez l'utilisation d'un CDN pour les fichiers statiques

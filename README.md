# E-commerce Fashion Website - Frontend-Only

Application e-commerce complète avec dashboard administrateur, construite avec Next.js 16 et TypeScript. **Application 100% frontend-only** utilisant localStorage pour la persistance des données.

## 🚀 Fonctionnalités

### Frontend
- ✅ Interface e-commerce moderne (Shop, Product, Cart, Wishlist)
- ✅ Dashboard administrateur complet
- ✅ Gestion des produits (CRUD)
- ✅ Gestion des commandes
- ✅ Gestion des clients
- ✅ Gestion des catégories
- ✅ Gestion des coupons
- ✅ Analytics et statistiques
- ✅ Gestion de l'inventaire
- ✅ Upload d'images (base64)
- ✅ Authentification simplifiée (Login/Register)
- ✅ Thème dark/light
- ✅ Données persistantes dans localStorage
- ✅ Initialisation automatique avec données mockées

## 📋 Prérequis

- Node.js 18+ 
- pnpm (ou npm/yarn)

## 🛠️ Installation

1. **Cloner le projet** (si applicable)
```bash
git clone <repository-url>
cd e-commerce-fashion-website
```

2. **Installer les dépendances**
```bash
pnpm install
```

**Note** : Aucune configuration de base de données nécessaire ! L'application utilise localStorage pour stocker toutes les données.

## 🎯 Utilisation

### Démarrer le serveur de développement
```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

### Accéder au dashboard admin
1. Aller sur `/admin/login`
2. Se connecter avec :
   - Email: `admin@nextgen.com`
   - Password: `admin123`

### Commandes disponibles
```bash
pnpm dev          # Démarrer le serveur de développement
pnpm build        # Build de production
pnpm start        # Démarrer le serveur de production
pnpm lint         # Linter le code
```

## 📁 Structure du projet

```
├── app/
│   ├── admin/           # Pages admin
│   │   ├── login/        # Page de connexion admin
│   │   ├── products/     # Gestion produits
│   │   ├── orders/       # Gestion commandes
│   │   ├── customers/    # Gestion clients
│   │   ├── categories/   # Gestion catégories
│   │   ├── coupons/      # Gestion coupons
│   │   ├── analytics/    # Statistiques
│   │   ├── inventory/    # Gestion inventaire
│   │   └── settings/     # Paramètres
│   ├── account/          # Pages compte (visiteurs)
│   └── ...               # Pages e-commerce
├── components/           # Composants React
├── context/             # Contexts React (Auth, Cart)
├── hooks/               # Hooks personnalisés
│   ├── use-products.ts   # Gestion produits (localStorage)
│   ├── use-orders.ts     # Gestion commandes (localStorage)
│   ├── use-customers.ts  # Gestion clients (localStorage)
│   ├── use-categories.ts # Gestion catégories (localStorage)
│   └── use-coupons.ts    # Gestion coupons (localStorage)
├── lib/
│   ├── mock-data.ts      # Données mockées initiales
│   ├── storage.ts        # Service localStorage
│   └── utils.ts          # Utilitaires
└── public/               # Fichiers statiques
```

## 🔐 Authentification

### Utilisateur Admin
- Email: `admin@nextgen.com`
- Password: `admin123`

### Créer un nouvel utilisateur
Les utilisateurs peuvent s'inscrire via `/account`. Par défaut, ils ont le rôle `customer`.

**Note** : Tous les utilisateurs sont stockés dans localStorage. Les données sont initialisées automatiquement avec des données mockées au premier chargement.

## 💾 Stockage des données

L'application utilise **localStorage** pour stocker toutes les données :

- `ecommerce_products` - Produits
- `ecommerce_categories` - Catégories
- `ecommerce_orders` - Commandes
- `ecommerce_customers` - Clients
- `ecommerce_coupons` - Coupons
- `ecommerce_users` - Utilisateurs
- `ecommerce_current_user` - Utilisateur connecté
- `ecommerce_initialized` - Flag d'initialisation

### Initialisation automatique
Au premier chargement, si localStorage est vide, l'application initialise automatiquement avec des données mockées (produits, catégories, commandes, clients, coupons, utilisateurs).

### Réinitialiser les données
Pour réinitialiser toutes les données :
1. Ouvrir la console du navigateur (F12)
2. Exécuter : `localStorage.clear()`
3. Recharger la page

## 🎨 Fonctionnalités principales

### Dashboard Admin
- Vue d'ensemble avec statistiques
- Graphiques et analytics
- Gestion complète des produits, commandes, clients
- Gestion de l'inventaire
- Système de coupons

### E-commerce
- Catalogue de produits
- Panier d'achat
- Liste de souhaits
- Pages produit détaillées
- Filtres et recherche

## 🔧 Configuration

**Aucune configuration nécessaire !** L'application fonctionne immédiatement après l'installation des dépendances.

### Variables d'environnement (optionnel)
Si vous souhaitez personnaliser l'application, vous pouvez créer un fichier `.env` :
```env
NODE_ENV="development"
```

## 📝 Architecture Frontend-Only

### Avantages
- ✅ Pas de dépendances backend
- ✅ Fonctionne sans serveur de base de données
- ✅ Déploiement simplifié (statique)
- ✅ Données persistantes dans le navigateur
- ✅ Pas de configuration complexe

### Limitations
- ⚠️ Données limitées au navigateur (pas de synchronisation multi-appareils)
- ⚠️ Pas de sauvegarde serveur
- ⚠️ Authentification simplifiée (pas de JWT)

## 🐛 Dépannage

### Réinitialiser les données
```javascript
// Dans la console du navigateur
localStorage.clear()
location.reload()
```

### Vérifier les données stockées
```javascript
// Dans la console du navigateur
console.log(localStorage.getItem('ecommerce_products'))
```

### Problème d'authentification
1. Vérifier que vous utilisez les bonnes identifiants
2. Réinitialiser localStorage si nécessaire
3. Vérifier la console pour les erreurs

## 📄 Licence

Ce projet est un exemple d'application e-commerce frontend-only.

## 👨‍💻 Développement

Pour contribuer ou modifier le projet :
1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)

---

**Note** : Cette application est conçue comme une démonstration frontend-only. Pour une application de production, considérez l'ajout d'un backend pour la sécurité, la synchronisation et la persistance des données.

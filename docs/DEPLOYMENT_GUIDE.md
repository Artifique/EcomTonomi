# Guide de Déploiement sur Vercel

Ce guide vous explique comment déployer votre projet E-commerce Tonomi sur Vercel.

## 📋 Prérequis

1. Un compte GitHub (votre projet est déjà sur : `https://github.com/Artifique/EcomTonomi.git`)
2. Un compte Vercel (gratuit) : [https://vercel.com](https://vercel.com)
3. Votre projet Supabase configuré avec les variables d'environnement

## 🚀 Étape 1 : Préparer le projet

### 1.1 Vérifier que le build fonctionne localement

```bash
npm run build
```

Si le build réussit, vous êtes prêt pour le déploiement.

### 1.2 S'assurer que tous les fichiers sont commités

```bash
git add .
git commit -m "Préparation pour déploiement Vercel"
git push origin main
```

## 🔗 Étape 2 : Connecter le projet à Vercel

### 2.1 Créer un compte Vercel

1. Allez sur [https://vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"** pour connecter votre compte GitHub

### 2.2 Importer le projet

1. Une fois connecté, cliquez sur **"Add New..."** → **"Project"**
2. Dans la liste des dépôts GitHub, trouvez **"EcomTonomi"** (ou `Artifique/EcomTonomi`)
3. Cliquez sur **"Import"**

## ⚙️ Étape 3 : Configurer le projet

### 3.1 Configuration du projet

Vercel détectera automatiquement que c'est un projet Next.js. Les paramètres par défaut sont généralement corrects :

- **Framework Preset** : Next.js
- **Root Directory** : `./` (racine du projet)
- **Build Command** : `npm run build` (ou `pnpm run build` si vous utilisez pnpm)
- **Output Directory** : `.next` (automatique pour Next.js)
- **Install Command** : `npm install` (ou `pnpm install`)

### 3.2 Variables d'environnement

**⚠️ IMPORTANT :** Vous devez ajouter toutes vos variables d'environnement dans Vercel.

Cliquez sur **"Environment Variables"** et ajoutez :

#### Variables Supabase (OBLIGATOIRES)
```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

#### Variables Resend (OPTIONNELLES - pour les emails)
```
RESEND_API_KEY=votre_clé_api_resend
RESEND_FROM_EMAIL=noreply@votredomaine.com
```

**Comment trouver vos variables Supabase :**
1. Allez sur [https://supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Important :**
- Cochez **Production**, **Preview**, et **Development** pour chaque variable
- Les variables commençant par `NEXT_PUBLIC_` sont accessibles côté client
- Les autres variables sont uniquement côté serveur

## 🚀 Étape 4 : Déployer

### 4.1 Lancer le déploiement

1. Cliquez sur **"Deploy"**
2. Vercel va :
   - Cloner votre dépôt
   - Installer les dépendances (`npm install`)
   - Exécuter le build (`npm run build`)
   - Déployer l'application

### 4.2 Suivre le déploiement

Vous verrez les logs en temps réel. Le processus prend généralement 2-5 minutes.

## ✅ Étape 5 : Vérifier le déploiement

### 5.1 Accéder à votre site

Une fois le déploiement terminé, vous recevrez une URL comme :
```
https://ecom-tonomi.vercel.app
```

### 5.2 Tester les fonctionnalités

1. **Page d'accueil** : Vérifiez que le site charge correctement
2. **Authentification** : Testez la connexion/inscription
3. **Produits** : Vérifiez l'affichage des produits
4. **Panier** : Testez l'ajout au panier
5. **Checkout** : Testez le processus de commande
6. **Admin** : Vérifiez l'accès au dashboard admin

## 🔄 Étape 6 : Déploiements automatiques

### 6.1 Déploiements automatiques

Vercel déploie automatiquement :
- **Production** : À chaque push sur la branche `main`
- **Preview** : À chaque pull request

### 6.2 Gérer les déploiements

- Allez dans l'onglet **"Deployments"** pour voir l'historique
- Vous pouvez rollback vers un déploiement précédent si nécessaire

## 🔧 Configuration avancée

### Ajouter un domaine personnalisé

1. Allez dans **Settings** → **Domains**
2. Ajoutez votre domaine
3. Suivez les instructions pour configurer les DNS

### Variables d'environnement par environnement

Vous pouvez avoir des variables différentes pour :
- **Production** : Variables pour la production
- **Preview** : Variables pour les previews (branches)
- **Development** : Variables pour le développement local

## 🐛 Résolution de problèmes

### Erreur : "Build failed"

1. **Vérifiez les logs** dans Vercel pour voir l'erreur exacte
2. **Testez localement** : `npm run build`
3. **Vérifiez les variables d'environnement** sont bien définies
4. **Vérifiez les dépendances** dans `package.json`

### Erreur : "Module not found"

- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez que les imports utilisent les bons chemins

### Erreur : "Environment variable not found"

- Vérifiez que toutes les variables sont ajoutées dans Vercel
- Vérifiez que les variables sont cochées pour le bon environnement

### Erreur : "Supabase connection failed"

- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects
- Vérifiez que votre projet Supabase est actif
- Vérifiez les politiques RLS dans Supabase

## 📝 Checklist de déploiement

Avant de déployer, vérifiez :

- [ ] Le build fonctionne localement (`npm run build`)
- [ ] Tous les fichiers sont commités et poussés sur GitHub
- [ ] Les variables d'environnement Supabase sont prêtes
- [ ] Les variables d'environnement sont ajoutées dans Vercel
- [ ] Le projet est connecté au bon dépôt GitHub
- [ ] La configuration du projet est correcte

## 🎉 Félicitations !

Votre site est maintenant en ligne ! 

### Prochaines étapes :

1. **Configurer un domaine personnalisé** (optionnel)
2. **Configurer les emails** avec Resend (optionnel)
3. **Surveiller les performances** dans le dashboard Vercel
4. **Configurer les analytics** (Vercel Analytics est déjà intégré)

## 📚 Ressources utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)

## 💡 Astuces

1. **Preview URLs** : Chaque pull request génère une URL de preview pour tester avant de merger
2. **Analytics** : Vercel Analytics est déjà configuré dans votre projet
3. **Logs** : Consultez les logs en temps réel dans le dashboard Vercel
4. **Rollback** : Vous pouvez facilement revenir à une version précédente

---

**Besoin d'aide ?** Consultez les logs de déploiement dans Vercel ou vérifiez la documentation.

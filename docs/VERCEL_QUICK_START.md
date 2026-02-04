# 🚀 Déploiement Vercel - Guide Rapide

## ⚡ Déploiement en 5 minutes

### 1. Préparer le projet
```bash
# Vérifier que le build fonctionne
npm run build

# Commit et push sur GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Créer un compte Vercel
- Allez sur [vercel.com](https://vercel.com)
- Connectez-vous avec GitHub
- Cliquez sur **"Add New Project"**

### 3. Importer le projet
- Sélectionnez le dépôt **`Artifique/EcomTonomi`**
- Cliquez sur **"Import"**

### 4. Configurer les variables d'environnement

**Dans Vercel, allez dans "Environment Variables" et ajoutez :**

#### ✅ OBLIGATOIRES
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### ⚙️ OPTIONNELLES (pour les emails)
```
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@votredomaine.com
```

**Important :** Cochez ✅ **Production**, ✅ **Preview**, et ✅ **Development** pour chaque variable.

### 5. Déployer
- Cliquez sur **"Deploy"**
- Attendez 2-5 minutes
- Votre site sera en ligne ! 🎉

## 📍 Où trouver vos variables Supabase ?

1. Allez sur [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. **Settings** → **API**
4. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ✅ Checklist avant déploiement

- [ ] `npm run build` fonctionne localement
- [ ] Code poussé sur GitHub (`git push`)
- [ ] Variables Supabase prêtes
- [ ] Variables ajoutées dans Vercel

## 🔗 Après le déploiement

Votre site sera accessible sur : `https://ecom-tonomi.vercel.app` (ou un nom similaire)

## 🐛 Problèmes courants

**Build failed ?**
- Vérifiez les logs dans Vercel
- Testez `npm run build` localement
- Vérifiez que toutes les variables d'environnement sont définies

**Erreur Supabase ?**
- Vérifiez que les variables sont correctes
- Vérifiez que votre projet Supabase est actif

## 📚 Documentation complète

Voir `DEPLOYMENT_GUIDE.md` pour le guide détaillé.

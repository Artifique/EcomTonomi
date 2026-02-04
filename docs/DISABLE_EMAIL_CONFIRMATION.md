# Désactiver la confirmation d'email dans Supabase (Développement)

## 🚨 Problème
Vous rencontrez l'erreur **"email rate limit exceeded"** lors de l'inscription. Cela signifie que Supabase a atteint sa limite d'envoi d'emails de confirmation.

## ✅ Solution : Désactiver la confirmation d'email pour le développement

### Étapes à suivre :

1. **Allez sur [https://supabase.com](https://supabase.com)**
2. **Sélectionnez votre projet**
3. **Allez dans Authentication → Settings** (ou **Settings → Authentication**)
4. **Trouvez la section "Email Auth"** ou **"Email Templates"**
5. **Désactivez "Enable email confirmations"** ou **"Confirm email"**
   - Cochez la case **"Disable email confirmations"** ou décochez **"Enable email confirmations"**
6. **Sauvegardez les changements**

### Alternative : Configuration via l'interface

1. Dans votre projet Supabase, allez dans **Authentication** → **Providers**
2. Cliquez sur **Email**
3. Décochez **"Confirm email"** ou **"Enable email confirmations"**
4. Cliquez sur **Save**

## ⚠️ Important

- **Cette configuration est uniquement pour le développement**
- **En production, vous devriez réactiver la confirmation d'email** pour la sécurité
- Les utilisateurs pourront se connecter immédiatement après l'inscription sans confirmer leur email

## 🔄 Après avoir désactivé la confirmation

1. Les nouvelles inscriptions fonctionneront sans envoyer d'email
2. Les utilisateurs pourront se connecter immédiatement
3. Vous pourrez tester l'inscription sans limite

## 📝 Note

Si vous avez déjà créé des utilisateurs avec des emails non confirmés, vous pouvez :
- Les supprimer et les recréer
- Ou utiliser l'API Admin de Supabase pour confirmer leurs emails manuellement


# Scripts SQL - Base de Données

Ce dossier contient tous les scripts SQL pour la configuration et la maintenance de la base de données Supabase.

## 📋 Scripts Disponibles

### Setup Initial
- `setup-profiles-automatic.sql` - Configuration complète de la table profiles avec création automatique

### Migrations et Corrections
- `fix-profiles-rls.sql` - Correction des politiques RLS pour la table profiles
- `fix-products-rls.sql` - Correction des politiques RLS pour la table products
- `fix-rls-policies.sql` - Correction générale des politiques RLS
- `fix-store-settings-rls.sql` - Correction des politiques RLS pour store_settings
- `fix-store-settings-complete.sql` - Correction complète de store_settings

### Modifications de Schéma
- `alter_profiles_add_phone.sql` - Ajout de la colonne phone à profiles
- `alter_profiles_add_email_notifications.sql` - Ajout de la colonne email_notifications_enabled à profiles

### Setup de Fonctionnalités
- `user_addresses_supabase_setup.sql` - Configuration de la table user_addresses
- `user_payment_methods_supabase_setup.sql` - Configuration de la table user_payment_methods
- `verify-is-admin-function.sql` - Vérification/création de la fonction is_admin()

## ⚠️ Important

- **Exécutez ces scripts dans l'éditeur SQL de Supabase**
- **Vérifiez les dépendances** avant d'exécuter (certains scripts dépendent d'autres)
- **Sauvegardez votre base de données** avant d'exécuter des scripts de modification
- **Lisez les commentaires** dans chaque script pour comprendre son rôle

## 📝 Ordre d'Exécution Recommandé

1. `setup-profiles-automatic.sql` (si nouvelle installation)
2. `verify-is-admin-function.sql` (vérifier/créer la fonction is_admin)
3. `fix-rls-policies.sql` (corriger les politiques RLS)
4. Scripts spécifiques selon vos besoins


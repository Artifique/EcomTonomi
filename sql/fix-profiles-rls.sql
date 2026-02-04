-- Script SQL pour corriger les politiques RLS manquantes pour la table profiles
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- ---------------------------------------------------------
-- POLITIQUE RLS MANQUANTE POUR LA TABLE profiles
-- ---------------------------------------------------------

-- Permettre aux utilisateurs de créer leur propre profil lors de l'inscription
-- Cette politique permet à un utilisateur authentifié d'insérer un profil avec son propre ID
CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- S'assurer que les colonnes phone et email_notifications_enabled existent
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT TRUE;


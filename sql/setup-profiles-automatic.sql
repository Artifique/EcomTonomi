-- Script SQL complet pour configurer la table profiles avec création automatique
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- ---------------------------------------------------------
-- 1. CRÉER LA TABLE profiles SI ELLE N'EXISTE PAS
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  phone TEXT,
  email_notifications_enabled BOOLEAN DEFAULT TRUE
);

-- ---------------------------------------------------------
-- 2. AJOUTER LES COLONNES SI ELLES N'EXISTENT PAS
-- ---------------------------------------------------------
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT TRUE;

-- ---------------------------------------------------------
-- 3. ACTIVER RLS
-- ---------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 4. SUPPRIMER LES ANCIENNES POLITIQUES SI ELLES EXISTENT
-- ---------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

-- ---------------------------------------------------------
-- 5. CRÉER LES POLITIQUES RLS
-- ---------------------------------------------------------

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Les utilisateurs peuvent créer leur propre profil
CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------
-- 6. CRÉER UNE FONCTION POUR CRÉER AUTOMATIQUEMENT LE PROFIL
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, phone, email_notifications_enabled)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NULL),
    'customer',
    NULL,
    TRUE
  )
  ON CONFLICT (id) DO NOTHING; -- Évite les erreurs si le profil existe déjà
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------
-- 7. CRÉER LE TRIGGER QUI APPELERA LA FONCTION
-- ---------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Script pour vérifier et créer la fonction is_admin() si nécessaire
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- Vérifier si la fonction existe
SELECT 
    proname as function_name,
    pg_get_function_arguments(oid) as arguments
FROM pg_proc
WHERE proname = 'is_admin' AND pronamespace = 'public'::regnamespace;

-- Créer ou remplacer la fonction is_admin() (sans paramètre, utilise auth.uid())
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Vérifier si l'utilisateur actuel a le rôle 'admin' dans la table profiles
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Tester la fonction (remplacer 'VOTRE_USER_ID' par un ID d'utilisateur admin réel pour tester)
-- SELECT public.is_admin();

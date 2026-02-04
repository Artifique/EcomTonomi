-- Script SQL complet pour corriger les problèmes de sauvegarde des paramètres
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- ============================================================
-- ÉTAPE 1 : Créer ou remplacer la fonction is_admin()
-- ============================================================

-- IMPORTANT : On utilise CREATE OR REPLACE au lieu de DROP
-- car la fonction est utilisée par de nombreuses politiques RLS

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

-- ============================================================
-- ÉTAPE 2 : Vérifier et corriger les politiques RLS
-- ============================================================

-- Supprimer les anciennes politiques pour éviter les conflits
DROP POLICY IF EXISTS "Admins can manage store settings" ON public.store_settings;
DROP POLICY IF EXISTS "Authenticated users can read store settings" ON public.store_settings;

-- Créer la politique pour les admins (CRUD complet)
CREATE POLICY "Admins can manage store settings"
ON public.store_settings
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Créer la politique pour la lecture (tous les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can read store settings"
ON public.store_settings
FOR SELECT
TO authenticated
USING (true);

-- ============================================================
-- ÉTAPE 3 : Vérifier que la ligne existe, sinon la créer
-- ============================================================

-- Insérer la ligne par défaut si elle n'existe pas
INSERT INTO public.store_settings (
  id,
  name,
  email,
  phone,
  address,
  description,
  currency,
  timezone,
  notification_settings,
  shipping_settings,
  payment_settings
)
VALUES (
  1,
  'Tonomi',
  'contact@tonomi.com',
  '+33 1 23 45 67 89',
  '123 Fashion Street, Paris, France',
  'Mode de qualité qui reflète votre style.',
  'EUR',
  'Europe/Paris',
  '{"orderConfirmation": true, "orderShipped": true, "orderDelivered": true, "newCustomer": true, "lowStock": true, "weeklyReport": false, "lowStockThreshold": 10}'::jsonb,
  '{"freeShippingThreshold": "50", "standardRate": "5.99", "expressRate": "12.99", "internationalRate": "19.99"}'::jsonb,
  '{"stripeEnabled": true, "paypalEnabled": true, "bankTransferEnabled": false, "testMode": false}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ÉTAPE 4 : Vérification (optionnel - pour tester)
-- ============================================================

-- Vérifier que la fonction existe et fonctionne
-- Remplacez 'VOTRE_USER_ID_ADMIN' par l'ID d'un utilisateur admin pour tester
-- SELECT 
--   auth.uid() as current_user_id,
--   public.is_admin() as is_admin_result,
--   (SELECT role FROM public.profiles WHERE id = auth.uid()) as user_role;

-- Vérifier que la ligne existe
-- SELECT * FROM public.store_settings WHERE id = 1;

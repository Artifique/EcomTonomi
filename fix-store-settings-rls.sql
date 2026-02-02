-- Script SQL pour corriger les politiques RLS de store_settings
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- ---------------------------------------------------------
-- FONCTION is_admin (si elle n'existe pas déjà)
-- ---------------------------------------------------------

-- Créer la fonction is_admin si elle n'existe pas (sans paramètre, utilise auth.uid())
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------
-- POLITIQUES RLS POUR store_settings
-- ---------------------------------------------------------

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Admins can manage store settings" ON public.store_settings;
DROP POLICY IF EXISTS "Authenticated users can read store settings" ON public.store_settings;

-- Les administrateurs peuvent tout faire sur cette table
CREATE POLICY "Admins can manage store settings"
ON public.store_settings
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Les utilisateurs authentifiés peuvent lire les paramètres (pour la vitrine si besoin)
CREATE POLICY "Authenticated users can read store settings"
ON public.store_settings FOR SELECT
TO authenticated
USING (true);

-- ---------------------------------------------------------
-- VÉRIFICATION ET CRÉATION DE LA LIGNE PAR DÉFAUT
-- ---------------------------------------------------------

-- Insérer la ligne de paramètres par défaut si elle n'existe pas déjà
INSERT INTO public.store_settings (id, name, email, phone, address, description, currency, timezone, notification_settings, shipping_settings, payment_settings)
VALUES (
  1,
  'Tonomi',
  'contact@tonomi.com',
  '+33 1 23 45 67 89',
  '123 Rue de la Mode, Paris, France',
  'Votre boutique de mode en ligne',
  'EUR',
  'Europe/Paris',
  '{
    "orderConfirmation": true,
    "orderShipped": true,
    "orderDelivered": true,
    "newCustomer": true,
    "lowStock": true,
    "weeklyReport": false,
    "lowStockThreshold": 10
  }'::jsonb,
  '{
    "freeShippingThreshold": "50",
    "standardRate": "5.99",
    "expressRate": "12.99",
    "internationalRate": "19.99"
  }'::jsonb,
  '{
    "stripEnabled": true,
    "paypalEnabled": true,
    "bankTransferEnabled": false,
    "testMode": false
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

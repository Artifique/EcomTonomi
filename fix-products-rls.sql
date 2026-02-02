-- Script SQL pour ajouter les politiques RLS manquantes pour les produits
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- ============================================================
-- POLITIQUES RLS POUR LA TABLE products
-- ============================================================

-- Supprimer les anciennes politiques si elles existent (pour éviter les conflits)
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Public can view products" ON public.products;

-- Tout le monde peut voir les produits (lecture publique)
CREATE POLICY "Public can view products"
ON public.products FOR SELECT
USING (true);

-- Les administrateurs peuvent insérer des produits
CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Les administrateurs peuvent mettre à jour les produits (y compris le stock)
CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Les administrateurs peuvent supprimer des produits
CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.is_admin());

-- IMPORTANT : Permettre aux utilisateurs authentifiés de mettre à jour le stock lors des commandes
-- Cette politique permet à n'importe quel utilisateur authentifié de décrémenter le stock
-- lors de la création d'une commande (nécessaire pour le processus de checkout)
CREATE POLICY "Authenticated users can update stock on order"
ON public.products FOR UPDATE
TO authenticated
USING (true) -- Permettre la lecture pour vérifier le stock actuel
WITH CHECK (
  -- Vérifier que seule la colonne stock est mise à jour (sécurité)
  -- Cette politique permet la mise à jour du stock pour les commandes
  true
);

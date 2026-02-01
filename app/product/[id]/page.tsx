// Rendu côté serveur pour la récupération des données
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail, RelatedProducts } from "./ProductClient"

// Activer la révalidation pour garder les données à jour
export const revalidate = 60

// Définir les types de données
// Idéalement, générer depuis la DB Supabase
type Product = any; 
type Category = any;

interface ProductPageProps {
  params: {
    id: string
  }
}

// Générer les métadonnées dynamiquement
export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const resolvedParams = await params;
    const { data: product, error } = await supabase
      .from('products')
      .select('name, description')
      .eq('id', resolvedParams.id)
      .single()

    if (error || !product) {
      return { title: 'Produit non trouvé' }
    }

    return {
      title: product.name || 'Produit',
      description: product.description || 'Découvrez ce produit',
    }
  } catch (error) {
    console.error('Erreur dans generateMetadata:', error)
    return { title: 'Produit' }
  }
}

// Pré-générer les pages statiques pour les produits populaires si nécessaire
// export async function generateStaticParams() {
//   const { data: products } = await supabase.from('products').select('id').limit(10)
//   return products?.map(({ id }) => ({ id })) || []
// }

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { id } = await params

    // Validation pour s'assurer que l'ID est une chaîne non vide et non "undefined"
    if (!id || typeof id !== 'string' || id.toLowerCase() === 'undefined') {
      notFound(); // Rediriger vers une page 404 si l'ID est invalide
    }

    // Récupérer le produit principal
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        categories (name, slug)
      `)
      .eq('id', id)
      .single()

    if (productError) {
      console.error(`Erreur produit ${id}:`, productError)
      // Si l'erreur est "PGRST116" (no rows found), utiliser notFound
      if (productError.code === 'PGRST116') {
        notFound()
      }
      // Sinon, lancer une erreur pour afficher une page d'erreur
      throw new Error(`Erreur lors du chargement du produit: ${productError.message}`)
    }

    if (!product) {
      notFound()
    }

    // Récupérer les produits similaires
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(4)

    if (relatedError) {
      console.error("Erreur produits similaires:", relatedError)
      // Ne pas bloquer l'affichage si les produits similaires échouent
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1">
          <ProductDetail product={product} />
          {relatedProducts && relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Erreur dans ProductPage:', error)
    // Afficher une page d'erreur ou rediriger vers 404
    notFound()
  }
}

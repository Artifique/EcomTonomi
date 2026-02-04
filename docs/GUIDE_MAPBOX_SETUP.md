# 🗺️ Guide de Configuration Mapbox

## 📋 Configuration Requise

### 1. Obtenir une clé API Mapbox

1. Allez sur [https://account.mapbox.com/](https://account.mapbox.com/)
2. Créez un compte (gratuit jusqu'à 50 000 chargements de carte/mois)
3. Allez dans **Account** → **Access tokens**
4. Copiez votre **Default public token**

### 2. Ajouter la clé dans `.env.local`

Ajoutez cette ligne dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_MAPBOX_TOKEN=votre_token_mapbox_ici
```

### 3. Redémarrer le serveur

Après avoir ajouté la clé, redémarrez le serveur de développement :

```bash
pnpm dev
```

---

## 🎨 Fonctionnalités

### Composant WorldMapSection

Le composant affiche :
- ✅ Une carte interactive mondiale
- ✅ Des marqueurs pour chaque ville avec des clients
- ✅ Des animations d'apparition des marqueurs
- ✅ Un tooltip au survol des marqueurs
- ✅ Une légende des couleurs
- ✅ Un compteur animé du nombre total de clients

### Données

Les données sont actuellement en dur dans le composant. Pour utiliser des données réelles :

1. **Option 1 : Utiliser les commandes**
   - Extraire les adresses des commandes (`customer_details.address`)
   - Géocoder les adresses pour obtenir lat/lng
   - Grouper par ville/pays

2. **Option 2 : Utiliser les profils utilisateurs**
   - Ajouter un champ `location` dans la table `profiles`
   - Stocker la ville/pays de chaque utilisateur
   - Grouper et compter

3. **Option 3 : API externe**
   - Utiliser une API de géolocalisation
   - Récupérer les données depuis Supabase
   - Mettre à jour la carte en temps réel

---

## 🔧 Personnalisation

### Modifier les villes affichées

Éditez le tableau `customerLocations` dans `components/world-map-section.tsx` :

```tsx
const customerLocations = [
  { lat: 48.8566, lng: 2.3522, count: 75, city: "Paris", country: "France" },
  // Ajoutez vos villes ici
]
```

### Modifier les couleurs des marqueurs

Les couleurs sont déterminées par le nombre de clients :
- **Vert** : 50+ clients
- **Bleu** : 20-49 clients
- **Gris** : Moins de 20 clients

Modifiez la logique dans la fonction `useEffect` :

```tsx
const color = location.count >= 50 
  ? 'rgb(34, 197, 94)' // green
  : location.count >= 20 
  ? 'rgb(59, 130, 246)' // blue
  : 'rgb(31, 41, 55)' // gray
```

### Modifier le style de la carte

Changez le style Mapbox dans l'initialisation :

```tsx
style: 'mapbox://styles/mapbox/light-v11', // Style clair
// Ou
style: 'mapbox://styles/mapbox/dark-v11', // Style sombre
// Ou
style: 'mapbox://styles/mapbox/streets-v12', // Style rues
```

---

## 🐛 Dépannage

### La carte ne s'affiche pas

1. Vérifiez que `NEXT_PUBLIC_MAPBOX_TOKEN` est bien défini dans `.env.local`
2. Vérifiez que le token est valide sur [Mapbox Account](https://account.mapbox.com/)
3. Vérifiez la console du navigateur pour les erreurs
4. Vérifiez que les styles CSS de Mapbox sont importés dans `globals.css`

### Les marqueurs ne s'affichent pas

1. Vérifiez que les coordonnées lat/lng sont correctes
2. Vérifiez que le zoom de la carte est approprié
3. Vérifiez la console pour les erreurs JavaScript

### Erreur "mapbox-gl is not defined"

1. Vérifiez que `mapbox-gl` est bien installé : `pnpm list mapbox-gl`
2. Vérifiez que l'import dynamique fonctionne correctement
3. Redémarrez le serveur de développement

---

## 💡 Alternatives

Si vous ne voulez pas utiliser Mapbox, vous pouvez :

1. **Leaflet** (gratuit, open-source)
   ```bash
   pnpm add leaflet react-leaflet
   ```

2. **Google Maps** (nécessite une clé API Google)
   ```bash
   pnpm add @react-google-maps/api
   ```

3. **Carte statique** (pas d'interactivité)
   - Utiliser une image SVG
   - Utiliser une API de carte statique

---

## 📊 Coûts Mapbox

- **Gratuit** : 50 000 chargements de carte/mois
- **Payant** : À partir de $5/mois pour 100 000 chargements

Pour un site e-commerce, le plan gratuit devrait suffire largement.

---

## ✅ Checklist

- [ ] Compte Mapbox créé
- [ ] Token API obtenu
- [ ] Token ajouté dans `.env.local`
- [ ] Serveur redémarré
- [ ] Carte s'affiche correctement
- [ ] Marqueurs visibles
- [ ] Tooltip fonctionne au survol
- [ ] Légende affichée

---

## 🎉 Résultat

Une fois configuré, vous aurez une belle carte interactive montrant vos clients dans le monde entier !


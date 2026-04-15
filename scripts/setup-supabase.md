# Setup Supabase pour Habitat3RI.eu

## 1. Créer le projet

1. Va sur https://supabase.com/dashboard
2. Clique "New Project"
3. Nom : `habitat3ri`
4. Région : **West EU (eu-west-1)** — important pour RGPD
5. Mot de passe DB : génère un mot de passe fort
6. Clique "Create new project"

## 2. Exécuter les migrations

Dans le SQL Editor (icône SQL à gauche) :

### Migration 1 : Schema de base
Copie-colle le contenu de `supabase/schema.sql` → Run

### Migration 2 : pgvector (Deuxième Cerveau)
Copie-colle le contenu de `supabase/migration-vector.sql` → Run

## 3. Récupérer les clés

Va dans Settings → API :

| Clé | Où la trouver |
|-----|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (ex: https://xxxxx.supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (secret!) |

## 4. Ajouter dans Vercel

```bash
cd E:/habitat3ri.eu
echo "https://xxxxx.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "eyJhbGci..." | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "eyJhbGci..." | npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

## 5. Activer Auth (optionnel, pour Deuxième Cerveau)

Dans Authentication → Providers :
- Email/Password : activé
- Google OAuth : optionnel

## 6. Vérifier

Le CRON `/api/cron/publish` utilisera automatiquement Supabase pour publier les articles.
Le Deuxième Cerveau utilisera pgvector pour la recherche sémantique.

# Robotique industrielle — site de cours et de TP

Site statique des ressources du module : un menu d'accueil, une partie **Cours** et une partie
**Travaux pratiques**, qui se remplissent au fil du semestre.

Céline Dobigeon — IUT, Université de Bordeaux.

**Adresse publique** : `https://celdobigeon.github.io/robotique/`

---

## Organisation du dépôt

```
robotique/
├── index.html                  menu d'accueil (cours + TP)
├── cours/
│   ├── index.html              liste des cours
│   └── securite-espace-travail/
│       └── index.html          huit démonstrations 3D
├── tp/
│   └── index.html              liste des TP (vide pour l'instant)
├── assets/
│   ├── catalogue.js            ← LA LISTE DES RESSOURCES
│   ├── site.css                mise en forme commune
│   ├── site.js                 affichage des cartes
│   └── vendor/three.min.js     bibliothèque 3D, embarquée
└── README.md
```

Tout est statique : aucun serveur, aucune installation. Les pages fonctionnent aussi en
ouvrant les fichiers depuis le disque, donc depuis une clé USB en salle.

**Pour ajouter une ressource**, il y a deux gestes : déposer la page dans `cours/<nom>/index.html`
ou `tp/<nom>/index.html`, et ajouter son entrée dans `assets/catalogue.js`. Le menu se met à jour
tout seul.

---

## Les deux branches

| Branche | Rôle |
|---|---|
| **`main`** | Ce que voient les étudiants. GitHub publie cette branche, et elle seule. |
| **`travail`** | Le brouillon. On y prépare et on y vérifie avant de publier. |

Rien n'apparaît en ligne tant que `travail` n'a pas été fusionnée dans `main`.

---

## Première mise en ligne (une seule fois)

Le dépôt `robotique` est créé sur GitHub et cloné dans `Documents\Claude_Robot\robotique`.
Il reste trois choses à faire :

1. **Premier envoi** — depuis le dossier `robotique` :
   ```bash
   git add .
   git commit -m "Première version du site"
   git push -u origin main
   ```
   *(ou, dans VS Code : panneau **Source Control**, message, **Commit**, puis **Publish Branch**)*

2. **Activer la publication** — onglet **Settings** du dépôt sur GitHub → **Pages** dans le menu
   de gauche → Source : `Deploy from a branch`, Branch : **`main`** et `/ (root)` → **Save**.
   Une à deux minutes plus tard, le site est à l'adresse indiquée en haut de cette page.

3. **Créer la branche de travail** :
   ```bash
   git branch travail
   git push -u origin travail
   git switch travail
   ```

## Le cycle habituel

**1. Les modifications se font sur `travail`.**

```bash
git switch travail
```

**2. Vérifier avant publication** — ouvrir `index.html` par un double-clic et naviguer dans le
site. Tout s'affiche exactement comme en ligne : mêmes fichiers, même mise en page.
*(Avec VS Code, l'extension **Live Server** donne un rendu encore plus fidèle : clic droit sur
`index.html` → « Open with Live Server ».)*

**3. Publier** — une fois que cela convient :

```bash
git switch main
git merge travail
git push
```

En une minute environ, le site en ligne est à jour. Si l'ancienne version s'affiche encore,
recharger en forçant le cache : **Ctrl + Maj + R**.

**4. Repartir sur la branche de travail** pour la suite :

```bash
git switch travail
git merge main
```

### Avec VS Code, sans taper de commandes

Le panneau **Source Control** (icône des branches, à gauche) fait tout : la branche courante
s'affiche en bas à gauche et se change d'un clic, les fichiers modifiés apparaissent dans la
liste, un message + **Commit** + **Sync Changes** suffisent à envoyer.

---

## Comment Claude intervient

Claude écrit directement dans ce dossier (il est connecté à `Documents\Claude_Robot`) :
il crée ou met à jour les pages, met à jour `assets/catalogue.js`, et annonce ce qu'il a changé.

**Restent de votre côté** : vérifier le rendu, puis valider (`commit`) et envoyer (`push`).
Claude travaille toujours sur la branche `travail` — vérifiez qu'elle est bien active avant de
lui demander une modification.

---

## Bon à savoir

- **Le dépôt est public.** Les fichiers sont lisibles par tous, l'adresse est indexable par les
  moteurs de recherche. Ne rien y mettre de personnel ni de soumis à droits.
- **Les polices** viennent de Google Fonts. Si le réseau les bloque, les pages s'affichent avec
  les polices du système — la mise en page tient.
- **La 3D** est embarquée dans `assets/vendor/three.min.js` : aucune dépendance à un CDN.
- **Intégration dans Moodle** : un lien direct, ou
  `<iframe src="https://celdobigeon.github.io/robotique/" style="width:100%;height:900px;border:0"></iframe>`

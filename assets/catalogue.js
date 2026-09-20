/* ============================================================
   Catalogue du site — la seule liste à tenir à jour.
   Ajouter une ressource = ajouter une entrée ici, et déposer la
   page correspondante dans cours/<slug>/ ou tp/<slug>/.
   ------------------------------------------------------------
   slug   : nom du dossier de la page
   titre  : titre affiché sur la carte
   sous   : une ligne de sous-titre (facultatif)
   texte  : deux ou trois lignes de résumé
   tags   : étiquettes courtes
   maj    : date de dernière mise à jour, format AAAA-MM-JJ
   icone  : 'robot' | 'bouclier' | 'cle' | 'cible'  (facultatif)
   ============================================================ */
window.CATALOGUE = {
  cours: [
    {
      slug: 'securite-espace-travail',
      titre: 'Espace de travail homme / machine',
      sous: 'Huit démonstrations 3D interactives',
      texte: 'Le volume que le robot peut atteindre, les deux façons de le restreindre, ' +
             'le partage de l’espace avec l’opérateur, la clé de mode, l’arrêt d’urgence, ' +
             'les quatre modes collaboratifs et l’effecteur.',
      tags: ['Sécurité', '3D interactif', 'ISO 10218'],
      maj: '2026-09-17',
      icone: 'robot',
    },
  ],

  tp: [
    {
      slug: 'manipulation-robot-abb',
      titre: 'Manipulation d’un robot ABB',
      sous: 'IRB 140 et IRB 6620, TP auto-corrigé',
      texte: 'Repérage auto-corrigé des dix dispositifs de sécurité sur la cellule, ' +
             'cinq questions à défendre à l’oral, comparatif des deux machines et ' +
             'checklist de feu vert avant manipulation.',
      tags: ['TP', 'ABB', 'Sécurité'],
      maj: '2026-09-18',
      icone: 'cle',
    },
    {
      slug: 'manipulation-cobot-ur',
      titre: 'Manipulation d’un cobot UR',
      sous: 'UR5 et UR10, TP auto-corrigé',
      texte: 'Le poste collaboratif sans protecteur : repérage auto-corrigé des dix ' +
             'dispositifs, cinq questions à défendre à l’oral, comparatif des deux ' +
             'cobots et checklist de feu vert avant manipulation.',
      tags: ['TP', 'Universal Robots', 'Collaboratif'],
      maj: '2026-09-18',
      icone: 'cle',
    },
    {
      slug: 'trajectoires-abb',
      titre: 'TP 1 — Programmation de trajectoires',
      sous: 'Robot ABB IRB 6620',
      texte: 'Repères outil et objet définis par apprentissage, MoveL contre MoveJ, passage par une singularité, puis un motif répété ailleurs dans l’espace par changement de repère.',
      tags: ['TP', 'ABB', 'RAPID'],
      maj: '2026-09-20',
      icone: 'cle',
    },
    {
      slug: 'pick-and-place-abb',
      titre: 'TP 2 — Pick and Place',
      sous: 'Robot ABB IRB 140',
      texte: 'Commande de la pince par sorties digitales, influence du lissage sur la trajectoire, empilement de cinq cubes et palettisation par compteurs.',
      tags: ['TP', 'ABB', 'RAPID'],
      maj: '2026-09-20',
      icone: 'cle',
    },
    {
      slug: 'pick-and-place-camera-ur',
      titre: 'TP 3 — Pick and Place par caméra',
      sous: 'Cobot UR — UR5 ou UR10e',
      texte: 'Ventouse et pince deux doigts, calibration de la caméra de poignet, apprentissage de la pièce à reconnaître et programme de pick and place.',
      tags: ['TP', 'Universal Robots', 'Robotiq'],
      maj: '2026-09-20',
      icone: 'cle',
    },
    {
      slug: 'trajectoires-ur',
      titre: 'TP 4 — Trajectoires sur cobot',
      sous: 'Cobot UR — UR5 ou UR10e',
      texte: 'Mise en service et repérage des éléments de sécurité, définition du TCP, de la charge et du centre de gravité, motif carré et effet du lissage.',
      tags: ['TP', 'Universal Robots', 'PolyScope'],
      maj: '2026-09-20',
      icone: 'cle',
    },
  ],
};

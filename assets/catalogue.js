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
      texte: 'Repérage des dix dispositifs de sécurité sur la cellule, questionnaire à ' +
             'correction immédiate, questions à défendre à l’oral, comparatif des deux ' +
             'machines et checklist de feu vert avant manipulation.',
      tags: ['TP', 'ABB', 'Sécurité'],
      maj: '2026-09-18',
      icone: 'cle',
    },
  ],
};

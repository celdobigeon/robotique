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
    // Exemple de ce qu'une entrée de TP contiendra :
    // {
    //   slug: 'manipulation-abb',
    //   titre: 'Manipulation d’un robot ABB',
    //   sous: 'IRB 140 et IRB 6620',
    //   texte: 'Repérage des dispositifs de sécurité, questionnaire autocorrigé, ' +
    //          'comparatif des deux machines.',
    //   tags: ['TP', 'ABB'],
    //   maj: '2026-09-17',
    //   icone: 'cle',
    // },
  ],
};

/* ============================================================
   Rendu des cartes à partir de assets/catalogue.js
   ============================================================ */
(function () {
  var ICONES = {
    robot: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M10 42h13"/>' +
      '<path d="M16.5 42V33"/><path d="M16.5 33 L27 20"/><path d="M27 20 L38 15"/>' +
      '<circle cx="16.5" cy="33" r="3.2"/><circle cx="27" cy="20" r="3.2"/>' +
      '<path d="M36 10.5 42 13 39.5 19"/></svg>',
    bouclier: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M24 6 39 11v13c0 9-6.5 15.5-15 18' +
      '-8.5-2.5-15-9-15-18V11z"/><path d="M17 24l5 5 10-11"/></svg>',
    cle: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M31 6a11 11 0 0 0-9.4 16.7L7 37.3' +
      'l3.7 3.7 14.6-14.6A11 11 0 1 0 31 6z"/><circle cx="31" cy="17" r="4"/></svg>',
    cible: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="17"/>' +
      '<circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="1.6" fill="currentColor"/></svg>',
  };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function carte(item, base) {
    var ic = ICONES[item.icone] || ICONES.cible;
    var tags = (item.tags || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
    // on vise index.html et non le dossier : ainsi le site marche aussi bien
    // ouvert depuis le disque (file://) qu'en ligne
    return '<a class="card" href="' + base + esc(item.slug) + '/index.html">' +
      '<span class="ic">' + ic + '</span>' +
      '<h3>' + esc(item.titre) + '</h3>' +
      (item.sous ? '<p class="sub">' + esc(item.sous) + '</p>' : '') +
      (item.texte ? '<p>' + esc(item.texte) + '</p>' : '') +
      (tags ? '<div class="tags">' + tags + '</div>' : '') +
      '<span class="go">Ouvrir <em>→</em></span></a>';
  }

  // rend la liste demandée dans l'élément portant data-liste="cours" ou "tp"
  window.rendreCartes = function () {
    var cat = window.CATALOGUE || { cours: [], tp: [] };
    Array.prototype.forEach.call(document.querySelectorAll('[data-liste]'), function (hote) {
      var cle = hote.getAttribute('data-liste');
      var base = hote.getAttribute('data-base') || '';
      var liste = cat[cle] || [];
      var cpt = document.querySelector('[data-compte="' + cle + '"]');
      if (cpt) {
        cpt.textContent = liste.length === 0 ? 'aucune ressource pour l’instant'
          : liste.length + (liste.length > 1 ? ' ressources' : ' ressource');
      }
      if (liste.length === 0) {
        hote.classList.remove('grid');
        hote.innerHTML = '<div class="empty"><b>Rien ici pour le moment</b>' +
          'Cette partie se remplira au fil du semestre.</div>';
        return;
      }
      hote.classList.add('grid');
      hote.innerHTML = liste.map(function (i) { return carte(i, base); }).join('');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.rendreCartes);
  } else {
    window.rendreCartes();
  }
})();

/* Schéma d'anatomie du bras, en perspective.
   ------------------------------------------------------------------
   Chaque figure marquée data-bras="abb" ou "ur" reçoit une vue 3D : les six
   articulations numérotées, le repère de base et le repère outil. La vue se
   tourne à la souris, au doigt et au clavier.

   Le schéma SVG reste dans la page : il s'affiche si le script ou Three.js ne
   se charge pas, et c'est lui qui part à l'impression — un dessin vectoriel
   sort mieux qu'une capture de canevas.

   Produit à la main, pas par un générateur. */
(function () {
  'use strict';
  var THREE = window.THREE;
  if (!THREE) return;                       // sans la bibliothèque, le SVG suffit

  var RAD = Math.PI / 180;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var sombre = function () {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Les trois machines du module, à leurs proportions réelles.
  //   art    : les six articulations — position, axe de rotation, rayon et
  //            longueur du tonneau qui la matérialise
  //   tubes  : rayon de chaque segment, entre deux articulations
  //   cadre  : distance de caméra, ajustée à l'encombrement de la machine
  var BRAS = {
    // Portée 2,2 m, 150 kg : socle massif, bras long, et le contrepoids
    // caractéristique derrière l'axe 2.
    irb6620: {
      robot: 0xF07C00, carter: 0x3B4149, cadre: 4.15, cible: [0.62, 1.02, 0],
      socle: { type: 'boite', l: 0.78, p: 0.66, h: 0.30 },
      contrepoids: { r: 0.22, l: 0.42, d: -0.46 },
      art: [
        { p: [0, 0.30, 0],     axe: [0, 1, 0], r: 0.26, l: 0.28 },
        { p: [0.04, 0.76, 0],  axe: [0, 0, 1], r: 0.23, l: 0.52 },
        { p: [0.20, 1.64, 0],  axe: [0, 0, 1], r: 0.17, l: 0.42 },
        { p: [0.94, 1.52, 0],  axe: [1, -0.16, 0], r: 0.11, l: 0.36 },
        { p: [1.32, 1.46, 0],  axe: [0, 0, 1], r: 0.10, l: 0.24 },
        { p: [1.46, 1.44, 0],  axe: [1, -0.16, 0], r: 0.072, l: 0.13 }
      ],
      tubes: [0.20, 0.175, 0.125, 0.085, 0.06],
      reperes: ['Wobj0', 'Tool0']
    },
    // Portée 810 mm, 6 kg : compact, épaule décalée, avant-bras court.
    irb140: {
      robot: 0xF07C00, carter: 0x3B4149, cadre: 2.25, cible: [0.26, 0.44, 0],
      socle: { type: 'boite', l: 0.34, p: 0.30, h: 0.13 },
      art: [
        { p: [0, 0.13, 0],     axe: [0, 1, 0], r: 0.115, l: 0.15 },
        { p: [0.06, 0.30, 0],  axe: [0, 0, 1], r: 0.10, l: 0.27 },
        { p: [0.06, 0.66, 0],  axe: [0, 0, 1], r: 0.085, l: 0.23 },
        { p: [0.31, 0.66, 0],  axe: [1, 0, 0], r: 0.062, l: 0.19 },
        { p: [0.42, 0.66, 0],  axe: [0, 0, 1], r: 0.055, l: 0.14 },
        { p: [0.49, 0.66, 0],  axe: [1, 0, 0], r: 0.044, l: 0.075 }
      ],
      tubes: [0.092, 0.082, 0.062, 0.05, 0.038],
      reperes: ['Wobj0', 'Tool0']
    },
    // UR : tubes aluminium, carters sombres, et le poignet en trois tonneaux
    // dont le cinquième tourne perpendiculairement aux autres.
    ur: {
      robot: 0xC2CAD2, carter: 0x3B4149, cadre: 2.3, cible: [0.42, 0.40, 0],
      socle: { type: 'disque', r: 0.095, h: 0.035 },
      art: [
        { p: [0, 0.075, 0],      axe: [0, 1, 0], r: 0.066, l: 0.13 },
        { p: [0, 0.215, 0.06],   axe: [0, 0, 1], r: 0.062, l: 0.15 },
        { p: [0.40, 0.50, 0.06], axe: [0, 0, 1], r: 0.052, l: 0.13 },
        { p: [0.745, 0.47, 0.06], axe: [0, 0, 1], r: 0.044, l: 0.11 },
        { p: [0.825, 0.405, 0.06], axe: [0, 1, 0], r: 0.042, l: 0.10 },
        { p: [0.825, 0.315, 0.06], axe: [0, 1, 0], r: 0.038, l: 0.08 }
      ],
      tubes: [0.055, 0.05, 0.044, 0.038, 0.036],
      reperes: ['Base', 'TCP']
    }
  };
  // Les deux familles n'ont pas le même vocabulaire d'articulations.
  var FAMILLE = { irb6620: 'abb', irb140: 'abb', ur: 'ur' };

  function tube(a, b, r, mat) {
    var dir = new THREE.Vector3().subVectors(b, a);
    var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, dir.length(), 22), mat);
    m.position.copy(a).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return m;
  }

  function tonneau(centre, axe, r, l, mat) {
    // Une articulation se dessine suivant son axe de rotation : c'est ce qui
    // permet de lire, sur le schéma, autour de quoi le segment tourne.
    var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, l, 26), mat);
    m.position.copy(centre);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axe.clone().normalize());
    return m;
  }

  function triedre(scene, origine, taille) {
    // X rouge, Y vert, Z bleu — la convention que rappelle la légende.
    var axes = [[new THREE.Vector3(1, 0, 0), 0xD2232A],
                [new THREE.Vector3(0, 1, 0), 0x17A05E],
                [new THREE.Vector3(0, 0, 1), 0x2F7BD4]];
    axes.forEach(function (a) {
      scene.add(new THREE.ArrowHelper(a[0], origine, taille, a[1],
                                      taille * 0.28, taille * 0.16));
    });
  }

  function init(fig) {
    var quoi = fig.getAttribute('data-bras');
    var B = BRAS[quoi];
    if (!B) return;
    // schéma vierge : le bras seul, l'étudiant place lui-même articulations et repères
    var vierge = fig.getAttribute('data-vierge') === '1';

    var vue = document.createElement('div');
    vue.className = 'vue3d';
    var boite = document.createElement('div');
    boite.className = 'boite3d';
    var canvas = document.createElement('canvas');
    var etiq = document.createElement('div');
    etiq.className = 'etiq';
    var aide = document.createElement('p');
    aide.className = 'aide3d';
    aide.innerHTML = 'Glissez pour tourner autour du bras. ' +
                     '<button type="button" class="raz">Vue d’origine</button>';
    boite.appendChild(canvas);
    boite.appendChild(etiq);
    vue.appendChild(boite);
    vue.appendChild(aide);
    fig.insertBefore(vue, fig.firstChild);

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) {
      vue.parentNode.removeChild(vue);      // pas de WebGL : on garde le SVG
      return;
    }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.05, 60);
    var cible = new THREE.Vector3(B.cible[0], B.cible[1], B.cible[2]);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe6ec, 1.5));
    var dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(1.6, 2.4, 1.9);
    scene.add(dir);
    var app = new THREE.DirectionalLight(0xffffff, 0.35);
    app.position.set(-1.6, 1.0, -1.2);
    scene.add(app);

    var matRobot = new THREE.MeshStandardMaterial({
      color: B.robot, roughness: 0.52, metalness: 0.22 });
    var matCarter = new THREE.MeshStandardMaterial({
      color: B.carter, roughness: 0.6, metalness: 0.15 });

    var P = B.art.map(function (a) {
      return new THREE.Vector3(a.p[0], a.p[1], a.p[2]);
    });

    // socle : caisson boulonné au sol pour les ABB, galette pour les UR
    if (B.socle.type === 'boite') {
      var so = new THREE.Mesh(new THREE.BoxGeometry(B.socle.l, B.socle.h, B.socle.p),
                              matCarter);
      so.position.y = B.socle.h / 2;
      scene.add(so);
    } else {
      var sd = new THREE.Mesh(
        new THREE.CylinderGeometry(B.socle.r * 1.25, B.socle.r * 1.4, B.socle.h, 30),
        matCarter);
      sd.position.y = B.socle.h / 2;
      scene.add(sd);
    }

    // segments, puis articulations par-dessus
    for (var i = 0; i < P.length - 1; i++) {
      scene.add(tube(P[i], P[i + 1], B.tubes[i], matRobot));
    }
    B.art.forEach(function (a, k) {
      var axe = new THREE.Vector3(a.axe[0], a.axe[1], a.axe[2]);
      scene.add(tonneau(P[k], axe, a.r, a.l, matCarter));
    });

    // le contrepoids du 6620, derrière l'axe 2
    if (B.contrepoids) {
      // À l'arrière de l'axe 2, à l'horizontale : sur la machine il équilibre le
      // bras, et il balaie un volume que l'étudiant doit connaître.
      var cp = B.contrepoids;
      var arriere = new THREE.Vector3(P[1].x + cp.d, P[1].y + 0.02, P[1].z);
      var horiz = new THREE.Vector3(1, 0, 0);
      scene.add(tube(P[1], arriere, cp.r * 0.5, matRobot));
      scene.add(tonneau(arriere, horiz, cp.r, cp.l, matCarter));
    }

    // bride, au bout du poignet
    var axeBride = new THREE.Vector3().subVectors(P[5], P[4]).normalize();
    var bride = new THREE.Mesh(
      new THREE.CylinderGeometry(B.art[5].r * 1.12, B.art[5].r * 1.12, 0.022, 26),
      new THREE.MeshStandardMaterial({ color: 0x2F7BD4, roughness: 0.45 }));
    bride.position.copy(P[5]).addScaledVector(axeBride, B.art[5].l / 2 + 0.012);
    bride.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axeBride);
    scene.add(bride);

    // sol discret, pour que la perspective se lise
    var etendue = Math.max(2.4, B.cadre);
    var grille = new THREE.GridHelper(etendue, Math.round(etendue * 5),
      sombre() ? 0x2b333c : 0xd7dee5, sombre() ? 0x232a32 : 0xe6ebf0);
    grille.position.y = 0.001;
    scene.add(grille);

    var pointeOutil = P[5].clone().addScaledVector(axeBride, B.art[5].l / 2 + 0.025);
    if (!vierge) {
      triedre(scene, new THREE.Vector3(0, 0, 0), B.cadre * 0.14);
      triedre(scene, pointeOutil, B.cadre * 0.09);
    }

    // étiquettes : les six articulations, puis les deux repères
    var ancres = vierge ? [] :
      P.map(function (p, k) { return { p: p, t: String(k + 1), r: false }; });
    if (!vierge) {
      ancres.push({ p: new THREE.Vector3(0, 0, 0), t: B.reperes[0], r: true });
      ancres.push({ p: pointeOutil, t: B.reperes[1], r: true });
    }
    var puces = ancres.map(function (a) {
      var d = document.createElement('span');
      d.className = a.r ? 'puce rep' : 'puce';
      d.textContent = a.t;
      etiq.appendChild(d);
      return d;
    });

    // ---- rotation du point de vue ----------------------------------
    var orbite = { az: 0.62, el: 0.24 };     // vue de trois quarts au départ
    var DEPART = { az: orbite.az, el: orbite.el };

    function poser() {
      var r = B.cadre;
      var phi = clamp(Math.PI / 2 - orbite.el, 0.25, Math.PI / 2 - 0.04);
      camera.position.set(
        cible.x + r * Math.sin(phi) * Math.sin(orbite.az),
        cible.y + r * Math.cos(phi),
        cible.z + r * Math.sin(phi) * Math.cos(orbite.az));
      camera.lookAt(cible);
      camera.updateMatrixWorld(true);
    }

    function etiquettes() {
      if (!ancres.length) return;          // schéma vierge : rien à placer
      var w = canvas.clientWidth, h = canvas.clientHeight;
      var v = new THREE.Vector3();
      var pos = [], cx = 0, cy = 0;
      ancres.forEach(function (a) {
        v.copy(a.p).project(camera);
        var p = { x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h, z: v.z };
        cx += p.x; cy += p.y;
        pos.push(p);
      });
      cx /= pos.length; cy /= pos.length;

      // on écarte chaque pastille du centre du bras : elle ne masque plus
      // l'articulation qu'elle désigne
      pos.forEach(function (p) {
        var dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1;
        p.x += (dx / d) * 30;
        p.y += (dy / d) * 30;
      });

      // au poignet, trois articulations se suivent de près, plus l'étiquette du
      // repère outil : deux passes pour les désempiler toutes
      for (var passe = 0; passe < 2; passe++) {
        for (var i = 1; i < pos.length; i++) {
          for (var j = 0; j < i; j++) {
            var mini = (ancres[i].r || ancres[j].r) ? 46 : 30;
            var dx2 = pos[i].x - pos[j].x, dy2 = pos[i].y - pos[j].y;
            var d2 = Math.hypot(dx2, dy2);
            if (d2 < mini) {
              var a2 = d2 > 0.5 ? Math.atan2(dy2, dx2) : (i * 1.7);
              pos[i].x = pos[j].x + Math.cos(a2) * mini;
              pos[i].y = pos[j].y + Math.sin(a2) * mini;
            }
          }
        }
      }

      pos.forEach(function (p, k) {
        puces[k].style.left = clamp(p.x, 16, w - 16) + 'px';
        puces[k].style.top = clamp(p.y, 12, h - 12) + 'px';
        puces[k].style.opacity = p.z > 1 ? 0 : 1;
      });
    }

    var lw = 0, lh = 0;
    function dessiner() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      if (w !== lw || h !== lh) {
        lw = w; lh = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      poser();
      renderer.render(scene, camera);
      etiquettes();
    }

    function tourner(dx, dy) {
      orbite.az -= dx * 0.008;
      orbite.el = clamp(orbite.el + dy * 0.006, -0.5, 1.15);
      dessiner();
    }

    var glisse = null;
    canvas.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      glisse = { x: e.clientX, y: e.clientY };
      if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!glisse) return;
      tourner(e.clientX - glisse.x, e.clientY - glisse.y);
      glisse.x = e.clientX; glisse.y = e.clientY;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) {
      canvas.addEventListener(t, function () { glisse = null; });
    });
    canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', 'Vue 3D du bras. Flèches pour tourner autour, '
      + 'Échap pour revenir à la vue d’origine. Les articulations et les repères '
      + 'sont décrits sous la figure.');
    canvas.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') tourner(26, 0);
      else if (e.key === 'ArrowRight') tourner(-26, 0);
      else if (e.key === 'ArrowUp') tourner(0, -26);
      else if (e.key === 'ArrowDown') tourner(0, 26);
      else if (e.key === 'Escape') raz();
      else return;
      e.preventDefault();
    });
    function raz() { orbite.az = DEPART.az; orbite.el = DEPART.el; dessiner(); }
    aide.querySelector('.raz').addEventListener('click', raz);
    canvas.addEventListener('dblclick', raz);

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var maj = function () {
        grille.material.color.setHex(sombre() ? 0x2b333c : 0xd7dee5);
        dessiner();
      };
      if (mq.addEventListener) mq.addEventListener('change', maj);
    }

    fig.classList.add('a3d');       // masque le SVG à l'écran, le garde à l'impression
    dessiner();
    if (window.ResizeObserver) new ResizeObserver(dessiner).observe(canvas);
    else window.addEventListener('resize', dessiner);
  }

  var figs = document.querySelectorAll('[data-bras]');
  for (var i = 0; i < figs.length; i++) init(figs[i]);
})();

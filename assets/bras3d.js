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

  // Morphologies. Les longueurs sont en mètres, à l'échelle d'un IRB 140.
  // Chaque articulation porte son nom et le point où la poser.
  var BRAS = {
    abb: {
      robot: 0xF07C00, carter: 0x3B4149,
      points: [[0, 0, 0], [0, 0.34, 0], [0.30, 0.86, 0], [0.78, 0.78, 0],
               [0.90, 0.745, 0], [0.98, 0.72, 0]],
      rayons: [0.115, 0.095, 0.075, 0.058, 0.05],
      joints: [0.15, 0.125, 0.10, 0.075, 0.062, 0.05],
      reperes: ['Wobj0', 'Tool0']
    },
    ur: {
      robot: 0xC2CAD2, carter: 0x3B4149,
      points: [[0, 0, 0], [0, 0.26, 0], [0.36, 0.70, 0], [0.80, 0.60, 0],
               [0.90, 0.555, 0], [0.97, 0.53, 0]],
      rayons: [0.10, 0.085, 0.068, 0.054, 0.046],
      joints: [0.125, 0.115, 0.095, 0.072, 0.06, 0.05],
      reperes: ['Base', 'TCP']
    }
  };

  function tube(a, b, r, mat) {
    var dir = new THREE.Vector3().subVectors(b, a);
    var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, dir.length(), 22), mat);
    m.position.copy(a).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
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
    var cible = new THREE.Vector3(0.44, 0.46, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe6ec, 1.5));
    var dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(1.6, 2.4, 1.9);
    scene.add(dir);
    var app = new THREE.DirectionalLight(0xffffff, 0.35);
    app.position.set(-1.6, 1.0, -1.2);
    scene.add(app);

    var matRobot = new THREE.MeshStandardMaterial({
      color: B.robot, roughness: 0.55, metalness: 0.2 });
    var matCarter = new THREE.MeshStandardMaterial({
      color: B.carter, roughness: 0.6, metalness: 0.15 });

    var P = B.points.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });

    // embase posée au sol
    var socle = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.07, 28), matCarter);
    socle.position.y = 0.035;
    scene.add(socle);

    for (var i = 0; i < P.length - 1; i++) scene.add(tube(P[i], P[i + 1], B.rayons[i], matRobot));
    P.forEach(function (p, k) {
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(B.joints[k], 20, 14), matCarter));
      scene.children[scene.children.length - 1].position.copy(p);
    });
    // bride, au bout du poignet
    var bride = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.022, 24),
      new THREE.MeshStandardMaterial({ color: 0x2F7BD4, roughness: 0.45 }));
    var axeBride = new THREE.Vector3().subVectors(P[5], P[4]).normalize();
    bride.position.copy(P[5]).addScaledVector(axeBride, 0.02);
    bride.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axeBride);
    scene.add(bride);

    // sol discret, pour que la perspective se lise
    var grille = new THREE.GridHelper(2.4, 12,
      sombre() ? 0x2b333c : 0xd7dee5, sombre() ? 0x232a32 : 0xe6ebf0);
    grille.position.y = 0.001;
    scene.add(grille);

    triedre(scene, new THREE.Vector3(0, 0, 0), 0.34);
    triedre(scene, P[5].clone().addScaledVector(axeBride, 0.03), 0.22);

    // étiquettes : les six articulations, puis les deux repères
    var ancres = P.map(function (p, k) { return { p: p, t: String(k + 1), r: false }; });
    ancres.push({ p: new THREE.Vector3(0, 0, 0), t: B.reperes[0], r: true });
    ancres.push({ p: P[5].clone().addScaledVector(axeBride, 0.03), t: B.reperes[1], r: true });
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
      var r = 2.02;
      var phi = clamp(Math.PI / 2 - orbite.el, 0.25, Math.PI / 2 - 0.04);
      camera.position.set(
        cible.x + r * Math.sin(phi) * Math.sin(orbite.az),
        cible.y + r * Math.cos(phi),
        cible.z + r * Math.sin(phi) * Math.cos(orbite.az));
      camera.lookAt(cible);
      camera.updateMatrixWorld(true);
    }

    function etiquettes() {
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

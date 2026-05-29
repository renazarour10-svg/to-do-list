// ============================================================
//  Ma ToDo — point de départ
//  Écran unique, sans routage.
// ============================================================

let $$ = Dom7; // utilitaire DOM intégré à Framework7

//initialisation du localstorage
var CLE = "ma-todo-taches";
var taches = chargerTaches();

// Sauvegarder : objet -> texte
function sauvegarder() {
  localStorage.setItem(CLE, JSON.stringify(taches));
}

// Charger : texte -> objet (ou tâches d'exemple la première fois)
function chargerTaches() {
  var data = localStorage.getItem(CLE);
  if (data) return JSON.parse(data);
  return [];
}

let app = new Framework7({
  el: "#app",
  name: "MaToDo",
  theme: "auto",
  routes: routes,
});

var mainView = app.views.create(".view-main", { url: "/" });

let filtreActif = "toutes";

/*let taches = [
  { id: 1, texte: "Ranger mes fournitures", fait: false },
  { id: 2, texte: "Réviser JavaScript", fait: true },
  { id: 3, texte: "Faire la lessive", fait: false },
];*/

function ligneTache(t) {
  return `
    <li class="item-content" data-id="${t.id}">
        <div class="item-media"> 
            <label class="checkbox">
                <input type="checkbox" ${t.fait ? "checked" : ""} />
                <i class="icon icon-checkbox"></i>
            </label>
        </div>
        <div class="item-inner  ${t.fait ? "tache-faite" : ""}">
            <div class="item-title">${t.texte}</div>
            <div class="item-after">
            <a href="#" class="btn-suppr"><i class="icon f7-icons">trash</i></a>
            </div>
        </div>
    </li>`;
}

function afficher() {
  let tachesVisible = tachesVisibles();
  $$(".liste-taches").html(tachesVisible.map(ligneTache).join(""));

  var restantes = tachesVisible.filter(function (t) {
    return !t.fait;
  }).length;
  $$(".compteur").text(restantes + " tâche(s) restante(s)");
}

$$(document).on("page:init", '.page[data-name="taches"]', function () {
  afficher(); // premier affichage
});

function ajouterTache() {
  const saisieTache = $$("#champ-tache").val();
  if (saisieTache === "") return;
  var nouvelId =
    taches.reduce(function (m, t) {
      return Math.max(m, t.id);
    }, 0) + 1;
  taches.push({ id: nouvelId, texte: saisieTache, fait: false });

  sauvegarder();
  afficher();
  // à la fin de ajouterTache :
  $$("#champ-tache").val("");
  app.toast.create({ text: "Tâche ajoutée !", closeTimeout: 1200 }).open();
}

afficher();

$$(document).on("click", "#btn-ajouter", function () {
  var champ = $$("#champ-tache");
  ajouterTache();
});

function supprimerTache(id) {
  taches = taches.filter(function (t) {
    return t.id !== parseInt(id, 10);
  });
  sauvegarder();
  afficher();
}

function basculerTache(id) {
  var t = taches.find(function (x) {
    return x.id === parseInt(id, 10);
  });
  if (t) {
    t.fait = !t.fait;
    sauvegarder();
    afficher();
  }
}

function tachesVisibles() {
  if (filtreActif === "afaire")
    return taches.filter(function (t) {
      return !t.fait;
    });
  if (filtreActif === "faites")
    return taches.filter(function (t) {
      return t.fait;
    });
  return taches;
}

$$(document).on("click", ".btn-suppr", function (e) {
  e.preventDefault();
  var id = $$(this).parents(".item-content").attr("data-id");
  supprimerTache(id);
});

$$(document).on("change", '.liste-taches input[type="checkbox"]', function () {
  var id = $$(this).parents(".item-content").attr("data-id");
  basculerTache(id);
});

$$(document).on("click", ".filtre-btn", function () {
  $$(".filtre-btn").removeClass("button-active");
  $$(this).addClass("button-active");
  filtreActif = $$(this).attr("data-filtre");
  afficher();
});

// ============================================================
//  SÉANCE 2 — déclarer le tableau des tâches, puis :
//    - une fonction afficher() qui construit la liste
//    - une fonction ajouterTache(texte)
//    - une fonction supprimerTache(id)
// ============================================================

//  SÉANCE 3 — ajouter :
//    - basculerTache(id) pour cocher / décocher
//    - le compteur de tâches restantes
//    - les filtres (Toutes / À faire / Faites)
//    - chargerTaches() et sauvegarder() avec localStorage
// ------------------------------------------------------------

// Exemple de structure de données (à activer en séance 2) :
// var taches = [
//   { id: 1, texte: "Réviser l'algorithmique", fait: false },
// ];

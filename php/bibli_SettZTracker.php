<?php

// Force l'affichage des erreurs
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting( E_ALL );

//_______________________________________________________________
/**
 * Affichage du début de la page HTML (jusqu'à l'élément header inclus).
 *
 * @param  string  $titre       le titre de la page
 * @param  string  $prefixe     chemin relatif vers la racine du site
 *
 * @return void
 */
function affDebutEnseigneEntete(string $titre, string $prefixe = '.') : void {
    affDebut($titre, "$prefixe/styles/SettZTracker.css");
    echo'<main>',
        '<header>',
  '<img src="./images/logo.png" alt="logo" id="logo" />',
  '<div class="header-text">',
    '<p class="description">Bienvenue sur Sett\'s Z Tracker !</p>',
    '<p class="description">Un simple site pour calculer les dégâts bruts du coup cathartique de Sett.</p>',
    '<div id="z-damage" class="damage-appear"></div>',
    '</div>',
'</header>';

}

function sessionExit($redirectPage) {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    header("Location: $redirectPage");
    exit();
}
//_______________________________________________________________
/**
 * Affichage du pied et de la fin de la page (de l'élément footer jusqu'à la fin)
 *
 * @return void
 */
function affPiedFin() : void {
    echo
        '<footer>',
        '</footer>',
        '<script src="./js/index.js"></script>',
    '</main>';

    affFin();
}

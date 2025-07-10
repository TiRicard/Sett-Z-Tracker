<?php

/**
 * Affichage du début de la page HTML (jusqu'au tag ouvrant de l'élément body).
 *
 * @param  string  $titre       le titre de la page
 * @param  ?string $stylesheet  le chemin vers la feuille de style (null s'il n'y en a pas)
 *
 * @return void
 */
function affDebut(string $titre, ?string $stylesheet = null) : void {
    echo
        '<!doctype html>',
        '<html lang="fr">',
        '<head>',
            '<title>', $titre, '</title>',
            '<meta charset="UTF-8">',
            $stylesheet !=  null ? "<link rel='stylesheet' type='text/css' href='$stylesheet'>" : '',
        '</head>',
        '<body>';
}

//_______________________________________________________________
/**
 * Affichage de la fin de la page HTML.
 *
 * @return void
 */
function affFin() : void {
    echo
        '</body></html>';
}

//____________________________________________________________________________
/**
 *  Protection des sorties (code HTML généré à destination du client).
 *
 *  Fonction à appeler pour toutes les chaines provenant de :
 *      - de saisies de l'utilisateur (formulaires, query string)
 *      - de la bdD
 *  Permet de se protéger contre les attaques XSS (Cross site scripting)
 *  Convertit tous les caractères éligibles en entités HTML, notamment :
 *      - les caractères ayant une signification spéciales en HTML (<, >, ...)
 *      - les caractères accentués
 *
 *  Si on lui transmet un tableau, la fonction renvoie un tableau où toutes les chaines
 *  qu'il contient sont protégées, les autres données du tableau ne sont pas modifiées.
 *
 * @param  array|string  $content   la chaine à protéger ou un tableau contenant des chaines à protéger
 *
 * @return array|string             la chaîne protégée ou le tableau
 */
function htmlProtegerSorties(array|string $content): array|string {
    if (is_array($content)) {
        foreach ($content as &$value) {
            if (is_array($value) || is_string($value)){
                $value = htmlProtegerSorties($value);
            }
        }
        unset ($value); // à ne pas oublier (de façon générale)
        return $content;
    }
    // $content est de type string
    return htmlentities($content, ENT_QUOTES, encoding:'UTF-8');
}

//___________________________________________________________________
/**
 * Contrôle des clés présentes dans les tableaux $_GET ou $_POST - piratage ?
 *
 * Soit $x l'ensemble des clés contenues dans $_GET ou $_POST
 * L'ensemble des clés obligatoires doit être inclus dans $x.
 * De même $x doit être inclus dans l'ensemble des clés autorisées,
 * formé par l'union de l'ensemble des clés facultatives et de
 * l'ensemble des clés obligatoires. Si ces 2 conditions sont
 * vraies, la fonction renvoie true, sinon, elle renvoie false.
 * Dit autrement, la fonction renvoie false si une clé obligatoire
 * est absente ou si une clé non autorisée est présente; elle
 * renvoie true si "tout va bien"
 *
 * @param string    $tabGlobal          'post' ou 'get'
 * @param array     $clesObligatoires   tableau contenant les clés qui doivent obligatoirement être présentes
 * @param array     $clesFacultatives   tableau contenant les clés facultatives
 *
 * @return bool                         true si les paramètres sont corrects, false sinon
 */
function parametresControle(string $tabGlobal, array $clesObligatoires, array $clesFacultatives = []): bool{
    $x = strtolower($tabGlobal) == 'post' ? $_POST : $_GET;

    $x = array_keys($x);
    // $clesObligatoires doit être inclus dans $x
    if (count(array_diff($clesObligatoires, $x)) > 0){
        return false;
    }
    // $x doit être inclus dans
    // $clesObligatoires Union $clesFacultatives
    if (count(array_diff($x, array_merge($clesObligatoires, $clesFacultatives))) > 0){
        return false;
    }
    return true;
}

/**
 * Afficher une ligne d'un champ de formulaire.
 *
 * @param string $label  label à afficher
 * @param string $name Nom du champ input
 * @param string $type Type du champ input
 * @return void
 */
function affLigneInput(string $label, string $name, string $type = 'text'): void {
    echo '<tr>',
        '<td><label for="' . htmlspecialchars($name) . '">' . htmlspecialchars($label) . '</label></td>',
        '<td><input type="' . htmlspecialchars($type) . '" name="' . htmlspecialchars($name) . '" id="' . htmlspecialchars($name) . '/></td>',
        '</tr>';
}

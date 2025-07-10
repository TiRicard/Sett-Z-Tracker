# Sett-Z-Tracker

### Fonctionnalités Principales

1. **Affichage et gestion du niveau de Sett (1 à 18) :**

   * Modification des stats de base (PV, AD, dégâts sort Z) selon le niveau.
   * Mise à jour dynamique des barres de PV et de Grit en fonction des stats et des interactions.

2. **Gestion du sort Z de Sett :**

   * Possibilité d'upgrader/downgrader le sort Z (max 5 rangs).
   * Chaque rang augmente les dégâts flat du sort.

3. **Barres interactives :**

   * Barre de vie et barre de grit modifiables par clic/glissement.
   * Mise à jour automatique des valeurs et des barres visuelles.

4. **Gestion d’un inventaire avec items :**

   * Affichage de 6 emplacements d’items.
   * Bouton pour ouvrir/fermer un shop affichant 6 items.
   * Ajout/suppression d’items dans l’inventaire via clic.
   * Application dynamique des bonus (AD, PV) liés aux items.

5. **Items spécifiques :**

   * Chaque item apporte des stats fixes (AD, PV) ou dynamiques (bonus AD basé sur PV manquants).
   * Calcul des effets passifs (Sterak, BloodMail) influençant l’AD.
   * Certains items ont des bonus scalés selon les stats de Sett.

6. **Runes et stacks :**

   * Gestion de stacks Conqueror (0 à 12) via boutons +/– et champ numérique avec validation.
   * Calcul du bonus AD lié au nombre de stacks Conqueror et au niveau.
   * Gestion d’une rune « Last Stand » activable/désactivable avec bonus de dégâts selon PV manquants.
   * Gestion de shards (AD, PV) activables/désactivables affectant les stats.

7. **Calcul des dégâts totaux :**

   * Un bouton déclenche le calcul des dégâts totaux du sort Z, intégrant :

     * Dégâts de base du sort.
     * Bonus AD cumulé (items, runes, stacks).
     * Bonus selon la quantité de grit accumulé.
     * Bonus de Last Stand selon PV manquants.

8. **Interface dynamique :**

   * Mise à jour visuelle en temps réel des barres, niveaux, runes, items.
   * Interface manipulable (exemple : déplacement possible du shop et runes via drag).

---

### Résumé des variables et modules clés

* **Stats de Sett :** `flatHp`, `bonusHp`, `totalHp`, `currentHp`, `flatAd`, `flatZDamage`, `settLevel`.
* **Bonus AD :** `adBonus`, `runeAdBonus`, `sterakAdBonus`, `bloodMailAdBonus`.
* **Runes et stacks :** Gestion du nombre de stacks Conqueror et activation des runes Last Stand et shards.
* **Interface :** Éléments DOM manipulés pour niveaux, barres, boutons, inventaire, shop.

---

Cette application simule un calculateur interactif des dégâts du sort Z de Sett dans League of Legends, prenant en compte les niveaux, items, runes, stacks et barres de vie/grit.

---

Commentaires + fonctions complexe fait avec IA.
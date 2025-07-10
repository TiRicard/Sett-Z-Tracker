let flatHp, bonusHp, totalHp, currentHp, settLevel, levelZ, flatAd, flatZDamage, totalDamage;
let missingHp = 0, gritAmount = 0, lastStandRatio = 0;
let sterakAdBonus = 0, bloodMailAdBonus = 0, runeAdBonus, adBonus = 0;
let shopIsToggle = false;

const levelDisplay = document.getElementById('level');
const gritFillBar = document.getElementById('gritBar');
const gritBarContainer = document.getElementById('gritContainer');
const healthFillBar = document.getElementById('healthBar');
const healthBarContainer = document.getElementById('healthContainer');
const gritValueDisplay = document.getElementById('updateValGrit');
const healthValueDisplay = document.getElementById('updateValHealth');
const upgradeZButton = document.querySelector("#upgradeZ");
const downgradeZButton = document.querySelector("#downgradeZ");
const spellRankIcons = document.querySelectorAll(".spell-rank");
const levelUpButton = document.getElementById("level-up");
const levelDownButton = document.getElementById("level-down");
const uwwhaButton = document.querySelector("#uwwha-button");
const shopToggleButton = document.querySelector("#shop-button");
const itemBar = document.getElementById("item-bar");
const stackInput = document.getElementById("stack-container");
const addStackButton = document.querySelector("#add-button");
const subStackButton = document.querySelector("#sub-button");
const runeButtons = document.querySelectorAll('#rune-activable button');
const lastStandIcon = document.getElementById('last-stand');
const zDamage = document.getElementById('z-damage');

//Affiche les infos initial, level, le grit et les pv, mets aussi les bar à 50%
function init() {
  flatHp = 670; //lvl 1
  bonusHp = 65; //pv flat shard
  totalHp = flatHp + bonusHp;
  currentHp = totalHp;
  settLevel = 1;
  levelZ = 1;
  flatAd = 60; //lvl 1
  flatZDamage = 80; //Z lvl 1
  runeAdBonus = 10.8; //2 ad shard
  levelDisplay.textContent = settLevel;
  gritValueDisplay.textContent = `${parseInt(gritAmount)} / ${parseInt(totalHp / 2)}`;
  healthValueDisplay.textContent = `${parseInt(currentHp)} / ${totalHp}`;
  gritFillBar.style.width = "0%";
  healthFillBar.style.width = "100%";
  stackInput.value = "0";
}
init();

/*********************************************************************/
/********************** Mise à jour stats par niveau *****************/
/*********************************************************************/

// Modifie les stats de base et bonus en fonction du niveau (+ ou -)
function updateStatsByLevel(action) {
  const delta = action === "+" && settLevel < 18 ? 1 : action === "-" && settLevel > 1 ? -1 : 0;
  if (!delta) return;

  settLevel += delta;
  flatHp += 114 * delta;
  totalHp += 114 * delta;
  flatAd += 4 * delta;

  levelDisplay.textContent = settLevel;
  updateGritBar();
  updateHealthBar();
  
  updateConquerorAdBonus();
  updateSterak();
  updateBloodMail();
}

// Event click niveau +
levelUpButton.addEventListener("click", () => {
    updateStatsByLevel("+");
});

// Event click niveau -
levelDownButton.addEventListener("click", () => {
   updateStatsByLevel("-");
});

/*********************************************************************/
/*********************** Upgrade sort Z ******************************/
/*********************************************************************/

// Ajoute un rang au sort Z et augmente flatZDamage
upgradeZButton.addEventListener("click", () => {
    for (let i = 0; i < spellRankIcons.length; i++) {
        const img = spellRankIcons[i];
        if (!img.classList.contains("active")) {
            img.src = "../images/spell-rank.png";
            img.alt = "spell-rank";
            img.classList.add("active");
            flatZDamage += 20;
            levelZ ++;
            break;
        }
    }
    const iconZ = document.querySelector('.icon-Z');
    iconZ.classList.remove('level-1', 'level-2', 'level-3', 'level-4', 'level-5');
    if(levelZ >= 1 && levelZ <= 5) {
      iconZ.classList.add(`level-${levelZ}`);
    }
});

// Retire un rang au sort Z et diminue flatZDamag
downgradeZButton.addEventListener("click", () => {
    for (let i = spellRankIcons.length - 1; i > 0; i--) {
        const img = spellRankIcons[i];
        if (img.classList.contains("active")) {
            img.src = "../images/spell-rank-missing.png";
            img.alt = "spell rank miss";
            img.classList.remove("active");
            flatZDamage -= 20;
            levelZ --;
            break;
        }
    }
    const iconZ = document.querySelector('.icon-Z');
    iconZ.classList.remove('level-1', 'level-2', 'level-3', 'level-4', 'level-5');
    if(levelZ >= 1 && levelZ <= 5) {
      iconZ.classList.add(`level-${levelZ}`);
    }
});

/*********************************************************************/
/******************* Mise à jour des barres Grit et PV ***************/
/*********************************************************************/

// Fonction générique de mise à jour d'une barre de progression (grit ou PV)
function updateBar({ e = null, container, bar, maxValue, setValue, updateRef, reverse = false }) {
  let percent;

  // Si un événement est fourni, calcule le pourcentage selon la position de la souris
  if (e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    percent = Math.max(0, Math.min(1, x / rect.width));
  }
  // Sinon, essaie de déduire le pourcentage à partir de la largeur actuelle
  else if (bar.style.width) {
    percent = parseFloat(bar.style.width) / 100;
  } else {
    percent = bar.offsetWidth / container.offsetWidth;
  }

  // Applique la largeur à la barre
  bar.style.width = `${percent * 100}%`;

  // Calcule la valeur absolue correspondante
  const value = percent * maxValue;

  // Applique la valeur via callback si défini
  if (setValue) setValue(value);

  // Si `reverse`, met à jour les PV manquants
  if (reverse) missingHp = totalHp - currentHp;

  // Met à jour le texte d’affichage si défini
  if (updateRef) updateRef.textContent = `${parseInt(value)} / ${parseInt(maxValue)}`;
}

// Met à jour la barre de grit à partir de la souris ou de l'état actuel
function updateGritBar(e = null) {
  updateBar({
    e,
    container: gritBarContainer,
    bar: gritFillBar,
    maxValue: totalHp / 2,
    setValue: v => gritAmount = v,
    updateRef: document.querySelector('#updateValGrit')
  });
}

// Met à jour la barre de vie, puis les effets liés aux PV
function updateHealthBar(e = null) {
  updateBar({
    e,
    container: healthBarContainer,
    bar: healthFillBar,
    maxValue: totalHp,
    setValue: (v) => { currentHp = v; },
    updateRef: document.querySelector('#updateValHealth'),
    reverse: true
  });
  updateBloodMail();      // bonus AD dynamique
  updateBonusLastStand(); // bonus selon PV manquants
}

// Événements sur la barre de grit : clic ou glissement
gritBarContainer.addEventListener('mousedown', (e) => {
  updateGritBar(e);
});
gritBarContainer.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) updateGritBar(e);
});

// Événements sur la barre de PV : clic ou glissement
healthBarContainer.addEventListener('mousedown', (e) => {
  updateHealthBar(e);
});
healthBarContainer.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) updateHealthBar(e);
});


/*********************************************************************/
/************************* Gestion Shop ******************************/
/*********************************************************************/

// Affiche ou masque le shop selon l'état `isOpen`
function toggleShop (isOpen) {
  if (!isOpen) {
    // Crée la section du shop avec 6 boutons d’items
    const shopContainer = document.createElement("section");
    shopContainer.id = "shop-container";
    const itemsContainer = document.getElementById('items-container');
    const parent = itemsContainer.parentNode;
    parent.insertBefore(shopContainer, itemsContainer.nextSibling);
    for(let i = 1; i <= 6; i++) {
      const caseButton = document.createElement("button");
      caseButton.classList.add("shop-case");
      caseButton.id = "item" + i;
      caseButton.style.backgroundImage = `url('./images/item${i}.png')`;
      document.getElementById('shop-container').appendChild(caseButton);
    }
    isOpen = true;
  } else {
    // Supprime la section du shop
    const shopContainer = document.getElementById('shop-container');
    shopContainer.remove();
    isOpen = false;
  }
  return isOpen;
}

// Clic sur le bouton de toggle du shop
shopToggleButton.addEventListener("click", () => {
  shopIsToggle = toggleShop(shopIsToggle);
});

/*********************************************************************/

// Gestion clic sur un item du shop : ajout dans la barre et stats modifiées
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList && target.classList.contains('shop-case')) {
    const slots = document.querySelectorAll(".item-case");
    let idItem = target.id;
    let isPresent;

    // Vérifie si l’item est déjà présent dans une case
    for(const slot of slots) {
      if (slot.id === idItem) {
        isPresent = true;
        break;
      } else {
        isPresent = false;
      }
    }

    // Ajoute l’item dans la première case vide si non déjà présent
    for (const itemSlot of slots) {
      if (!itemSlot.id && isPresent === false) {
        itemSlot.id = idItem;
        itemSlot.style.backgroundImage = `url('./images/${idItem}.png')`;
        applyItemStats(idItem, "+");
        updateGritBar();
        updateHealthBar();
        isPresent = true;
        break;
      }
    }

    // Met à jour les effets passifs liés aux items
    updateSterak();
    updateBloodMail();
  }
});

// Dictionnaire des items et leurs stats
const itemsData = {
  item1: { ad: 40, pv: 450 },
  item2: {
    ad: 43,
    pv: 550,
    dynamicAd: {
      base: () => flatAd + adBonus + sterakAdBonus + runeAdBonus,
      ratioPerStep: 0.01,         // 1 % par palier
      step: 0.05833,              // 5,833 % des PV manquants
      maxRatio: 0.12,             // max 12 %
      cap: 0.7                    // capé à 70 % des PV manquants
    },
    scaleAd: {
      base: "bonusHp",
      ratio: 0.025
    }
  },
  item3: { ad: 45, pv: 450 },
  item4: { ad: 40, pv: 400 },
  item5: { adScale: { base: "flatAd", ratio: 0.45 }, pv: 400 },
  item6: { ad: 40, pv: 500 },
};

const appliedItemStats = {};

// Applique ou retire les stats d’un item selon `action` ("+" ou "-")
function applyItemStats(itemId, action) {
  const item = itemsData[itemId];
  if (!item) return;

  const sign = action === "+" ? 1 : -1;

  // AD fixe sauf pour item2 (bloodmail) (calculé dynamiquement)
  if (item.ad && itemId != "item2") adBonus += sign * item.ad;

  if (item.pv) {
    bonusHp += sign * item.pv;
    totalHp += sign * item.pv;
  }
}

// Met à jour le bonus d’AD donné par Sterak (item1)
function updateSterak() {
  const hasSterak = document.querySelectorAll(".item-case[id=item1]").length > 0;
  sterakAdBonus = hasSterak ? 0.45 * flatAd : 0;
}

// Calcule le bonus d’AD donné par BloodMail (item2)
function updateBloodMail() {
  const item2 = itemBar.querySelector("#item2");
  bloodMailAdBonus = 0;
  if (item2) {
    const item = itemsData["item2"];
    if (!item || !item.dynamicAd || !item.scaleAd) return;

    const baseValue = eval(item.scaleAd.base);
    const { base, ratioPerStep, step, maxRatio, cap } = item.dynamicAd;
    const cappedMissing = Math.min(missingHp, totalHp * cap);
    const percent = cappedMissing / totalHp;
    const steps = Math.floor(percent / step);
    const gainRatio = Math.min(steps * ratioPerStep, maxRatio);

    bloodMailAdBonus = item.ad + baseValue * item.scaleAd.ratio + base() * gainRatio;
  }
}

// Clic sur une case d’item de l’inventaire
document.querySelectorAll('.item-case').forEach(caseEl => {
  caseEl.addEventListener('click', (e) => {
    if (e.target.id) {
      // Supprime l’item de la case
      applyItemStats(e.target.id, "-");
      updateGritBar();
      updateHealthBar();
      e.target.style.backgroundImage = '';
      e.target.removeAttribute("id");
      updateSterak();
      updateBloodMail();
    } else {
      // Affiche le shop si la case est vide
      shopIsToggle = toggleShop(shopIsToggle);
    }
  });
});

/*********************************************************************/
/*******************************RUNES*********************************/
/*********************************************************************/

/*****************************Conqueror*******************************/

// Sélectionne le contenu du champ stackInput au clic
stackInput.addEventListener("click", () => {
  stackInput.select();
});

// Validation en temps réel du champ stackInput : doit être un entier entre 0 et 12
stackInput.addEventListener("input", () => {
  const value = parseInt(stackInput.value, 10);
  if (!/^\d{1,2}$/.test(stackInput.value) || isNaN(value) || value < 0 || value > 12) {
    stackInput.value = "";
  }
});

// Quand on appuie sur "Entrée", vide le champ s’il est vide et perd le focus
stackInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (stackInput.value.trim() === "") {
      stackInput.value = 0;
    }
    stackInput.blur();
  }
});

// Bouton "+" : incrémente la valeur (max 12), puis met à jour le bonus d'AD
addStackButton.addEventListener("click", () => {
  let nbStack = parseInt(stackInput.value) || 0;
  if (nbStack < 12) {
    nbStack++;
    stackInput.value = nbStack;
  }
  updateConquerorAdBonus();
});

// Bouton "–" : décrémente la valeur (min 0), puis met à jour le bonus d'AD
subStackButton.addEventListener("click", () => {
  let nbStack = parseInt(stackInput.value) || 0;
  if (nbStack > 0) {
    nbStack--;
    stackInput.value = nbStack;
  }
  updateConquerorAdBonus();
});

// Calcule le bonus d'AD donné par Conqueror selon le nombre de stacks et le niveau
function updateConquerorAdBonus () {
  let nbStack = parseInt(stackInput.value) || 0;
  runeAdBonus = nbStack * (1.08 + 1.32 / 17 * (settLevel - 1));
  updateBloodMail();
}

/*****************************Last-Stand*******************************/

// Calcule le bonus de dégâts de Last Stand selon les PV manquants
function updateBonusLastStand() {
  const isInactive = lastStandIcon.classList.contains('grayscale');
  lastStandRatio = 0;
  if (!isInactive) {
    const percentMissing = missingHp / totalHp;
    if (percentMissing >= 0.7) {
      lastStandRatio = 0.11;
    } else if (percentMissing >= 0.6) {
      lastStandRatio = 0.09;
    } else if (percentMissing >= 0.5) {
      lastStandRatio = 0.07;
    } else if (percentMissing >= 0.4) {
      lastStandRatio = 0.05;
    }
  }
}

/*******************************Shard*********************************/

// Gestion du clic sur les boutons de runes (activation/désactivation)
runeButtons.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('grayscale');
    if (button.id === "pv-shard") {
      if (button.classList.contains('grayscale')) {
        bonusHp -= 65;
        totalHp -= 65;
      } else {
        bonusHp += 65;
        totalHp += 65;
      }
      updateGritBar();
      updateHealthBar();
    }
    if (button.classList.contains('ad-shard')) {
      if (button.classList.contains('grayscale')) {
        runeAdBonus -= 5.4;
      } else {
        runeAdBonus += 5.4;
      }
    }
    updateBonusLastStand();
    updateBloodMail();
  });
});


/*********************************************************************/
/*************************Uwwha Button********************************/
/*********************************************************************/

//Si on click sur le bouton, calcule total damage et affiche tout
uwwhaButton.addEventListener("click", () => {
  totalDamage = (1 + lastStandRatio) * (flatZDamage + (25 + (adBonus + bloodMailAdBonus + sterakAdBonus + runeAdBonus) * 0.25) / 100 * gritAmount);
  zDamage.textContent = parseInt(totalDamage);
  zDamage.removeAttribute("id");
  void zDamage.offsetWidth;
  zDamage.id = "z-damage";
});

let offsetX = 0, offsetY = 0, isDragging = false;

document.addEventListener("mousedown", (e) => {
  const shopContainer = document.getElementById("shop-container");
  const isItem = e.target.classList && e.target.classList.contains("shop-case");

  if (shopContainer && shopContainer.contains(e.target) && !isItem) {
    isDragging = true;
    const rect = shopContainer.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  }
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const shopContainer = document.getElementById("shop-container");
    shopContainer.style.left = `${e.clientX - offsetX}px`;
    shopContainer.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

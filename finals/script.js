// Game
const attackBtn = document.querySelector(".attackBtn");
const blockBtn = document.querySelector(".blockBtn");
const specialAttackBtn = document.querySelector(".specialAttackBtn"); // Added button for special attack

let hpMainPokemon = document.querySelector("#hpBar");
let hpEnemyPokemon = document.querySelector("#hpBarEnemy");

const marker = document.querySelector(".marker");
const skillCheck = document.querySelector(".skillCheck");

const result = document.querySelector(".result");

let baseBlock = 10;
let skillcheckStarted = false;
let blockStarted = false;
let currentBlock = 1;

let currentEnemyPokemon;
let currentPokemon;

let fightNumber = 0;

let gameLost = false;

class Pokemon {
  constructor(name, type, health, dmg, img, color) {
    this.name = "<span style='color:" + color + "'>" + name.toUpperCase() + "</span>";
    this.type = type;
    this.health = health;
    this.dmg = dmg;
    this.img = img;
    this.rawName = name;
    this.specialAbilities = [];
  }

  addSpecialAbility(ability) {
    this.specialAbilities.push(ability);
  }
}

function choosePokemons(mainPoke, enemyPoke) {
  fightNumber++; // Increment fight number for the new battle

  currentEnemyPokemon = enemyPoke;
  currentPokemon = mainPoke;

  document.querySelector(".namePokemon").innerHTML = mainPoke.rawName.toUpperCase();
  document.querySelector(".namePokemonEnemy").innerHTML = enemyPoke.rawName.toUpperCase();
  document.querySelector(".typePokemon").innerHTML = mainPoke.type.toUpperCase();
  document.querySelector(".typePokemonEnemy").innerHTML = enemyPoke.type.toUpperCase();
  document.querySelector(".imgMain").src = mainPoke.img;
  document.querySelector(".imgEnemy").src = enemyPoke.img;
  document.querySelector("#hpBar").max = mainPoke.health;
  document.querySelector("#hpBarEnemy").max = enemyPoke.health;
  hpMainPokemon.value = mainPoke.health;
  hpEnemyPokemon.value = enemyPoke.health;
  document.querySelector(".hpPoint").innerHTML = mainPoke.health + " HP";
  document.querySelector(".hpPointEnemy").innerHTML = enemyPoke.health + " HP";

  attackBtn.addEventListener("mousedown", skilcheckStartAttack);
  blockBtn.addEventListener("mousedown", skilcheckStartBlock);
  specialAttackBtn.addEventListener("mousedown", skilcheckStartSpecialAttack); // Add event listener for special attack
}

function enemyAttack() {
  let currentEnemyAttack = currentEnemyPokemon.dmg;
  let rnd = Math.random();
  if (rnd < 0.2) {
    result.innerHTML = currentEnemyPokemon.name.toUpperCase() + " MISSED!";
  } else if (rnd < 0.7) {
    hpMainPokemon.value -= (currentEnemyAttack * 0.5) * currentBlock;
    result.innerHTML = currentEnemyPokemon.name.toUpperCase() + " DEALS " + (currentEnemyAttack * 0.5 * currentBlock) + " DMG!";
  } else if (rnd >= 0.7) {
    hpMainPokemon.value -= currentEnemyAttack * currentBlock;
    if (currentBlock == 0) {
      result.innerHTML = currentEnemyPokemon.name.toUpperCase() + " DEALS 0 DMG!";
    } else {
      result.innerHTML = currentEnemyPokemon.name.toUpperCase() + " IS SUPER EFFECTIVE";
    }
  }
  currentBlock = 1;
  attackBtn.addEventListener("mousedown", skilcheckStartAttack);
  blockBtn.addEventListener("mousedown", skilcheckStartBlock);
  specialAttackBtn.addEventListener("mousedown", skilcheckStartSpecialAttack); // Add event listener for special attack
  document.querySelector(".hpPoint").innerHTML = hpMainPokemon.value + " HP";

  if (hpMainPokemon.value <= 0) {
    // Game Over
    fightNumber = 0;
    gameLost = true;
    result.innerHTML = currentPokemon.name.toUpperCase() + " FAINTED!";
    blockBtn.removeEventListener("mousedown", skilcheckStartBlock);
    specialAttackBtn.removeEventListener("mousedown", skilcheckStartSpecialAttack); // Remove event listener for special attack
    result.innerHTML = "<span style='color: white'>GAME OVER</span></br>CLICK ATTACK TO START AGAIN!";
  }
}

function skilcheckStartAttack() {
  if (gameLost) {
    choosePokemons(pikachu, bulbassaur);
    result.innerHTML = "";
    gameLost = false;
    blockBtn.addEventListener("mousedown", skilcheckStartBlock);
    specialAttackBtn.addEventListener("mousedown", skilcheckStartSpecialAttack); // Add event listener for special attack
  } else {
    skillcheckStarted = true;
    marker.classList.toggle("visibleMarker");
    skillCheck.classList.toggle("skillCheckVisible");
  }
}

function skilcheckStartBlock() {
  blockStarted = true;
  marker.classList.toggle("visibleMarker");
  skillCheck.classList.toggle("skillCheckVisible");
}

function skilcheckStartSpecialAttack() {
  let specialDamage = 50; // Example: Special attack deals 50 damage
  hpEnemyPokemon.value -= specialDamage;
  result.innerHTML = currentPokemon.name + " used Special Attack and dealt " + specialDamage + " DMG!";
  specialAttackBtn.removeEventListener("mousedown", skilcheckStartSpecialAttack); // Remove event listener for special attack
  displayHealth(); // Update enemy's health display

  // Check if the enemy is defeated
  if (hpEnemyPokemon.value <= 0) {
    result.innerHTML = currentEnemyPokemon.name + " FAINTED!";
    setTimeout(() => {
      if (fightNumber == 1) {
        result.innerHTML = currentEnemyPokemon.name + " FAINTED! </br> BUT BULBASAUR EVOLVED!";
        choosePokemons(pikachu, ivysaur);
      } else if (fightNumber == 2) {
        result.innerHTML = currentEnemyPokemon.name + " FAINTED! </br> BUT HE EVOLVED!";
        choosePokemons(pikachu, venusaur);
      } else if (fightNumber == 3) {
        result.innerHTML = "CONGRATULATIONS! </br> VERY ANGRY BULBASAUR IS DEFEATED!";
      }
    }, 3000);
  } else {
    setTimeout(enemyAttack, 2000);
  }
}

function skilcheckFinish(target) {
  if (skillcheckStarted) {
    let markerPos = (marker.offsetLeft * 100) / marker.parentElement.parentElement.offsetWidth;
    marker.classList.toggle("visibleMarker");
    skillCheck.classList.toggle("skillCheckVisible");
    skillcheckStarted = false;

    let currentAttack = currentPokemon.dmg;

    if (markerPos < 26.5 || markerPos > 72.5) {
      // red zone
      currentAttack *= 0;
      result.innerHTML = currentPokemon.name + " MISSED!";
    } else if (markerPos < 42 || markerPos > 57.1) {
      // orange zone
      currentAttack *= 0.3;
      hpEnemyPokemon.value -= currentAttack;
      result.innerHTML = currentPokemon.name + " IS NOT VERY EFFECTIVE";
    } else if (markerPos < 48 || markerPos > 51.1) {
      // yellow zone
      currentAttack *= 0.5;
      hpEnemyPokemon.value -= currentAttack;
      result.innerHTML = currentPokemon.name + " DEALS " + currentAttack + " DMG!";
    } else {
      // green zone
      currentAttack *= 1;
      hpEnemyPokemon.value -= currentAttack;
      result.innerHTML = currentPokemon.name + " IS SUPER EFFECTIVE";
    }

    if (checkIfAlive()) {
      document.querySelector(".hpPointEnemy").innerHTML = hpEnemyPokemon.value + " HP";
      attackBtn.removeEventListener("mousedown", skilcheckStartAttack);
      blockBtn.removeEventListener("mousedown", skilcheckStartBlock);
      specialAttackBtn.removeEventListener("mousedown", skilcheckStartSpecialAttack);
      setTimeout(enemyAttack, 2000);
    } else {
      attackBtn.removeEventListener("mousedown", skilcheckStartAttack);
      blockBtn.removeEventListener("mousedown", skilcheckStartBlock);
      specialAttackBtn.removeEventListener("mousedown", skilcheckStartSpecialAttack);
      if (fightNumber == 1) {
        result.innerHTML = currentEnemyPokemon.name + " FAINTED! </br> BUT BULBASAUR EVOLVED!";
        setTimeout(() => choosePokemons(pikachu, ivysaur), 3000);
      } else if (fightNumber == 2) {
        result.innerHTML = currentEnemyPokemon.name + " FAINTED! </br> BUT HE EVOLVED!";
        setTimeout(() => choosePokemons(pikachu, venusaur), 3000);
      } else if (fightNumber == 3) {
        result.innerHTML = "CONGRATULATIONS! </br> VERY ANGRY BULBASAUR IS DEFEATED!";
      }
    }
  } else if (blockStarted) {
    let markerPos = (marker.offsetLeft * 100) / marker.parentElement.parentElement.offsetWidth;
    marker.classList.toggle("visibleMarker");
    skillCheck.classList.toggle("skillCheckVisible");
    blockStarted = false;

    if (markerPos < 26.5 || markerPos > 72.5) {
      // red zone
      currentBlock *= 1;
      result.innerHTML = currentPokemon.name + " FAILS TO BLOCK!";
    } else if (markerPos < 42 || markerPos > 57.1) {
      // orange zone
      currentBlock *= 0.5;
      result.innerHTML = currentPokemon.name + " BLOCKS DMG!";
    } else if (markerPos < 48 || markerPos > 51.1) {
      // yellow zone
      currentBlock *= 0;
      result.innerHTML = currentPokemon.name + " BLOCKS ALL DMG!";
    } else {
      // green zone
      currentBlock *= 0;
      hpMainPokemon.value += 10;
      result.innerHTML = currentPokemon.name + " BLOCKS DMG, AND HEAL FOR 10HP!";
    }
    setTimeout(enemyAttack, 2000);
  }
}

function checkIfAlive() {
  if (hpEnemyPokemon.value <= 0) {
    return false;
  }
  return true;
}

// Define special abilities
const pikachuSpecialAbilities = ["Thunderbolt", "Quick Attack"];
const bulbasaurSpecialAbilities = ["Solar Beam", "Vine Whip"];

// Create instances of Pokemon
let pikachu = new Pokemon("Pikachu", "", 100, 25, "img/p2b.gif", "yellow");
let bulbassaur = new Pokemon("Bulbasaur", "", 100, 25, "img/b2b.gif", "green");
let ivysaur = new Pokemon("Ivysaur", "", 150, 35, "img/ivy2.gif", "green");
let venusaur = new Pokemon("Venusaur", "", 200, 40, "img/vfinal.gif", "green");

// Add special abilities to Pokemon
pikachuSpecialAbilities.forEach(ability => {
  pikachu.addSpecialAbility(ability);
});

bulbasaurSpecialAbilities.forEach(ability => {
  bulbassaur.addSpecialAbility(ability);
});

// Start the game with chosen Pokemons
choosePokemons(pikachu, bulbassaur);

// Add event listeners for attack, block, and special attack buttons
attackBtn.addEventListener("mousedown", skilcheckStartAttack);
blockBtn.addEventListener("mousedown", skilcheckStartBlock);
specialAttackBtn.addEventListener("mousedown", skilcheckStartSpecialAttack);
document.body.addEventListener("mouseup", skilcheckFinish);

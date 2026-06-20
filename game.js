const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const minimap = document.querySelector("#minimap");
const mini = minimap.getContext("2d");

const ui = {
  hud: document.querySelector("#hud"),
  menu: document.querySelector("#menu"),
  gameOver: document.querySelector("#gameOver"),
  playButton: document.querySelector("#playButton"),
  normalModeButton: document.querySelector("#normalModeButton"),
  nightModeButton: document.querySelector("#nightModeButton"),
  extractionModeButton: document.querySelector("#extractionModeButton"),
  retryButton: document.querySelector("#retryButton"),
  menuButton: document.querySelector("#menuButton"),
  renameButton: document.querySelector("#renameButton"),
  settingsButton: document.querySelector("#settingsButton"),
  playerName: document.querySelector("#playerName"),
  volumeSlider: document.querySelector("#volumeSlider"),
  showMinimapToggle: document.querySelector("#showMinimapToggle"),
  skinsGrid: document.querySelector("#skinsGrid"),
  lockerGrid: document.querySelector("#lockerGrid"),
  creditsCount: document.querySelector("#creditsCount"),
  sellLockerButton: document.querySelector("#sellLockerButton"),
  equipExtractionButton: document.querySelector("#equipExtractionButton"),
  lockerLoadout: document.querySelector("#lockerLoadout"),
  bagPanel: document.querySelector("#bagPanel"),
  bagGrid: document.querySelector("#bagGrid"),
  bagCloseButton: document.querySelector("#bagCloseButton"),
  profileStats: document.querySelector("#profileStats"),
  healthBar: document.querySelector("#healthBar"),
  shieldBar: document.querySelector("#shieldBar"),
  energyBar: document.querySelector("#energyBar"),
  aliveCount: document.querySelector("#aliveCount"),
  killCount: document.querySelector("#killCount"),
  ammoCount: document.querySelector("#ammoCount"),
  zoneTimer: document.querySelector("#zoneTimer"),
  materials: document.querySelector("#materials"),
  pickupPrompt: document.querySelector("#pickupPrompt"),
  hotbar: document.querySelector("#hotbar"),
  leaderboard: document.querySelector("#leaderboard"),
  feed: document.querySelector("#feed"),
  resultTag: document.querySelector("#resultTag"),
  resultTitle: document.querySelector("#resultTitle"),
  resultStats: document.querySelector("#resultStats"),
};

const WORLD = { width: 10000, height: 10000 };
const TAU = Math.PI * 2;
const PLAYER_RADIUS = 18;
const BOT_COUNT = 39;
const HOTBAR_SIZE = 4;
const GRID_SIZE = 120;
const BOT_LOOT_PHASE_TIME = 32;
const BOT_CLOSE_FIGHT_GRACE = 8;
const BUILD_COST = 10;
const BUILD_WALL_LENGTH = PLAYER_RADIUS * 6;
const BUILD_WALL_THICKNESS = 20;
const DASH_SPEED = 620;
const BOT_TRAVEL_DASH_DISTANCE = 520;
const BOT_GOAL_STALL_TIME = 1.65;
const BOT_IGNORED_GOAL_TIME = 5.5;
const MAX_ENERGY = 100;
const DASH_ENERGY_COST = 34;
const ENERGY_REGEN_RATE = 14;
const ENERGY_REGEN_DELAY = 0.55;
const OBSTACLE_GRID_SIZE = 260;
const IO_THEME = {
  grass: "#78ad43",
  grassDark: "#5f9035",
  grassLight: "#8fc95a",
  grid: "rgba(37, 77, 24, 0.14)",
  white: "#fff8df",
  road: "#c3a75e",
  roadEdge: "#9f8649",
  water: "#1674be",
  waterLight: "#69c6f3",
  sand: "#cfb270",
  ink: "#10140d",
  building: "#8d9292",
  buildingDark: "#5f6668",
  roof: "#a5abad",
  crate: "#a86c31",
  wood: "#9b6736",
  rock: "#8b8f8f",
  danger: "#ef2f36",
  exfil: "#65d137",
  safe: "#ffffff",
};
const GAME_MODES = {
  normal: { id: "normal", label: "Mode normal" },
  night: { id: "night", label: "Night Life" },
  extraction: { id: "extraction", label: "Extraction" },
};
const EXTRACTION_BOT_COUNT = 99;
const EXTRACTION_EXFIL_TIME = 6;
const DEFAULT_BACKPACK = { label: "Sac leger", rarity: "common", capacity: 4, color: "#b8bec6", price: 80 };
const BACKPACKS = {
  backpack_common: { label: "Sac tactique", rarity: "common", capacity: 6, color: "#b8bec6", price: 140 },
  backpack_rare: { label: "Sac militaire", rarity: "rare", capacity: 9, color: "#4aa7ff", price: 340 },
  backpack_epic: { label: "Sac operateur", rarity: "epic", capacity: 12, color: "#b39cff", price: 760 },
  backpack_legendary: { label: "Sac legendaire", rarity: "legendary", capacity: 16, color: "#f4cf67", price: 1450 },
};
const ARMORS = {
  helmet_rare: { label: "Casque renforce", slot: "helmet", rarity: "rare", color: "#4aa7ff", reduction: 0.08, ricochet: 0.02, price: 280 },
  helmet_epic: { label: "Casque lourd", slot: "helmet", rarity: "epic", color: "#b39cff", reduction: 0.12, ricochet: 0.05, price: 640 },
  helmet_legendary: { label: "Casque blindé", slot: "helmet", rarity: "legendary", color: "#f4cf67", reduction: 0.18, ricochet: 0.09, price: 1200 },
  vest_rare: { label: "Plastron renforce", slot: "vest", rarity: "rare", color: "#4aa7ff", reduction: 0.14, ricochet: 0.01, price: 360 },
  vest_epic: { label: "Plastron lourd", slot: "vest", rarity: "epic", color: "#b39cff", reduction: 0.22, ricochet: 0.04, price: 840 },
  vest_legendary: { label: "Plastron legendaire", slot: "vest", rarity: "legendary", color: "#f4cf67", reduction: 0.32, ricochet: 0.08, price: 1600 },
};
const VALUABLES = {
  watch: { label: "Montre ancienne", rarity: "common", color: "#b8bec6", price: 90 },
  circuit: { label: "Circuit crypte", rarity: "uncommon", color: "#50c878", price: 170 },
  meds_cache: { label: "Cache medicale", rarity: "rare", color: "#4aa7ff", price: 380 },
  encrypted_drive: { label: "Disque chiffre", rarity: "epic", color: "#b39cff", price: 820 },
  prototype_core: { label: "Noyau prototype", rarity: "legendary", color: "#f4cf67", price: 1800 },
};
const NIGHT_VIEW_RANGE = 430;
const NIGHT_VIEW_ANGLE = Math.PI * 0.26;
const NIGHT_CLOSE_RANGE = 46;
const NIGHT_LIGHT_RAYS = 54;
const NIGHT_BOT_SEARCH_SWEEP = 1.9;

const MATERIALS = {
  wood: { label: "Bois", short: "BOI", color: "#c99655", wallColor: "#9b6438", health: 95 },
  stone: { label: "Pierre", short: "PIE", color: "#a9b1ad", wallColor: "#777f7a", health: 140 },
  metal: { label: "Metal", short: "MET", color: "#8fc7d6", wallColor: "#607987", health: 190 },
};

const MATERIAL_ORDER = ["wood", "stone", "metal"];
const SAVE_KEY = "battleRoyale2DProfileV1";

const AMMO_TYPES = {
  pistol: { label: "Pistolet", short: "PST", color: "#d4d7dc", icon: "9mm", amount: 28 },
  smg: { label: "Mitraillette", short: "SMG", color: "#8ee9ff", icon: "4.6", amount: 36 },
  shotgun: { label: "Pompe", short: "CAL", color: "#ff9b73", icon: "12", amount: 10 },
  assault: { label: "Assaut", short: "AST", color: "#b7f07a", icon: "5.56", amount: 24 },
  sniper: { label: "Sniper", short: "SNP", color: "#c9b2ff", icon: "7.62", amount: 7 },
};

const RARITIES = {
  common: { label: "Commun", color: "#b8bec6", damage: 1, cooldown: 1, magBonus: 0, accuracy: 1 },
  uncommon: { label: "Ordinaire", color: "#50c878", damage: 1.1, cooldown: 0.97, magBonus: 2, accuracy: 0.9 },
  rare: { label: "Rare", color: "#4aa7ff", damage: 1.22, cooldown: 0.94, magBonus: 4, accuracy: 0.78 },
  epic: { label: "Epique", color: "#b39cff", damage: 1.36, cooldown: 0.91, magBonus: 6, accuracy: 0.66 },
  legendary: { label: "Legendaire", color: "#f4cf67", damage: 1.55, cooldown: 0.88, magBonus: 8, accuracy: 0.55 },
};

const RARITY_ROLLS = [
  ["common", 48],
  ["uncommon", 28],
  ["rare", 15],
  ["epic", 7],
  ["legendary", 2],
];

const CONSUMABLES = {
  shield: { label: "Bouclier", color: "#4aa7ff", icon: "SHD", amount: 36, pickupTime: 3, useTime: 2.2 },
  medkit: { label: "MedKIT", color: "#ff6b6b", icon: "MED", amount: 42, pickupTime: 3, useTime: 2.8 },
  smoke_grenade: { label: "Fumigene", color: "#cfd6d3", icon: "SMK", pickupTime: 1.5, useTime: 0.15, throwable: true },
};

const WEAPONS = {
  pickaxe: {
    label: "Pioche",
    color: "#d9c9a3",
    damage: 24,
    cooldown: 0.48,
    range: 64,
    arc: 1.15,
    melee: true,
    mag: 0,
    reload: 0,
  },
  pistol: {
    label: "Pistolet",
    color: "#d4d7dc",
    ammoType: "pistol",
    damage: 17,
    cooldown: 0.28,
    bulletSpeed: 780,
    bulletLife: 0.92,
    spread: 0.035,
    pellets: 1,
    mag: 12,
    reload: 0.9,
  },
  smg: {
    label: "Mitraillette",
    color: "#8ee9ff",
    ammoType: "smg",
    damage: 9,
    cooldown: 0.075,
    bulletSpeed: 720,
    bulletLife: 0.74,
    spread: 0.12,
    pellets: 1,
    mag: 30,
    reload: 1.3,
  },
  shotgun: {
    label: "Fusil a pompe",
    color: "#ff9b73",
    ammoType: "shotgun",
    damage: 11,
    cooldown: 0.62,
    bulletSpeed: 670,
    bulletLife: 0.42,
    spread: 0.48,
    pellets: 9,
    mag: 5,
    reload: 1.5,
  },
  assault_rifle: {
    label: "Fusil d'assaut",
    color: "#b7f07a",
    ammoType: "assault",
    damage: 23,
    cooldown: 0.22,
    bulletSpeed: 920,
    bulletLife: 0.95,
    spread: 0.025,
    pellets: 1,
    mag: 20,
    reload: 1.15,
  },
  sniper: {
    label: "Sniper",
    color: "#c9b2ff",
    ammoType: "sniper",
    damage: 62,
    cooldown: 1.05,
    bulletSpeed: 1180,
    bulletLife: 1.28,
    spread: 0.01,
    pellets: 1,
    mag: 5,
    reload: 1.75,
  },
};

const BOT_NAMES = [
  "Nova",
  "Pixel",
  "Orbit",
  "Kilo",
  "Dash",
  "Echo",
  "Rift",
  "Juno",
  "Vega",
  "Glitch",
  "Frost",
  "Bolt",
  "Mika",
  "Zero",
  "Flux",
  "Quill",
  "Rook",
  "Halo",
];

const keys = new Set();
const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  worldX: WORLD.width / 2,
  worldY: WORLD.height / 2,
  down: false,
};

const profile = {
  name: "Joueur",
  kills: 0,
  deaths: 0,
  wins: 0,
  games: 0,
  skin: "gold",
  credits: 0,
  stash: [],
  extractionLoadout: [],
};

const skins = [
  { id: "gold", label: "Survivant", color: "#ffd83d" },
  { id: "mint", label: "Recon", color: "#43d17b" },
  { id: "ember", label: "Ember", color: "#ff8c27" },
  { id: "violet", label: "Violet", color: "#8f5bff" },
];

const settings = {
  volume: 55,
  showMinimap: true,
  keybinds: {
    up: ["KeyW", "KeyZ", "ArrowUp"],
    left: ["KeyA", "KeyQ", "ArrowLeft"],
    down: ["KeyS", "ArrowDown"],
    right: ["KeyD", "ArrowRight"],
    reload: ["KeyR"],
    dash: ["ShiftLeft", "ShiftRight"],
    build: ["KeyB"],
    cycleMaterial: ["KeyX"],
  },
  waitingBind: null,
};

function loadSavedData() {
  try {
    const raw = window.localStorage && window.localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.profile && typeof saved.profile === "object") {
      Object.assign(profile, {
        name: typeof saved.profile.name === "string" ? saved.profile.name : profile.name,
        kills: Number(saved.profile.kills) || 0,
        deaths: Number(saved.profile.deaths) || 0,
        wins: Number(saved.profile.wins) || 0,
        games: Number(saved.profile.games) || 0,
        skin: typeof saved.profile.skin === "string" ? saved.profile.skin : profile.skin,
        credits: Number(saved.profile.credits) || 0,
        stash: Array.isArray(saved.profile.stash) ? saved.profile.stash : [],
        extractionLoadout: Array.isArray(saved.profile.extractionLoadout) ? saved.profile.extractionLoadout : [],
      });
    }
    if (saved.settings && typeof saved.settings === "object") {
      settings.volume = Number(saved.settings.volume) || settings.volume;
      settings.showMinimap = saved.settings.showMinimap !== false;
      if (saved.settings.keybinds && typeof saved.settings.keybinds === "object") {
        for (const action of Object.keys(settings.keybinds)) {
          if (Array.isArray(saved.settings.keybinds[action])) {
            settings.keybinds[action] = saved.settings.keybinds[action];
          }
        }
      }
    }
  } catch (error) {
    console.warn("Sauvegarde illisible", error);
  }
}

function saveData() {
  try {
    if (!window.localStorage) return;
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({
      profile,
      settings: {
        volume: settings.volume,
        showMinimap: settings.showMinimap,
        keybinds: settings.keybinds,
      },
    }));
  } catch (error) {
    console.warn("Sauvegarde impossible", error);
  }
}

loadSavedData();

let view = { width: 0, height: 0, dpr: 1 };
let game = null;
let lastGameMode = "normal";
const lockerSelection = new Set();
let lastFrame = 0;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clampCircleCenter(value, radius, size) {
  const margin = radius + 40;
  if (margin * 2 >= size) return size / 2;
  return clamp(value, margin, size - margin);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleTo(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function formatTime(value) {
  const safe = Math.max(0, Math.ceil(value));
  const minutes = Math.floor(safe / 60);
  const seconds = String(safe % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function rollRarity(minimum = "common") {
  const order = Object.keys(RARITIES);
  const minimumIndex = Math.max(0, order.indexOf(minimum));
  const filtered = RARITY_ROLLS.filter(([rarity]) => order.indexOf(rarity) >= minimumIndex);
  const total = filtered.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rand(0, total);

  for (const [rarity, weight] of filtered) {
    roll -= weight;
    if (roll <= 0) return rarity;
  }

  return filtered[filtered.length - 1][0];
}

function getRarity(rarity) {
  return RARITIES[rarity] || RARITIES.common;
}

function getWeaponDamage(type, rarity = "common") {
  return Math.round(WEAPONS[type].damage * getRarity(rarity).damage);
}

function getWeaponCooldown(type, rarity = "common") {
  return WEAPONS[type].cooldown * getRarity(rarity).cooldown;
}

function getWeaponMag(type, rarity = "common") {
  const weapon = WEAPONS[type];
  if (weapon.melee) return 0;
  return weapon.mag + getRarity(rarity).magBonus;
}

function getWeaponSpread(type, rarity = "common") {
  return WEAPONS[type].spread * getRarity(rarity).accuracy;
}

function angleDifference(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

function isAmmoPickup(type) {
  return type.startsWith("ammo_");
}

function ammoTypeFromPickup(type) {
  return type.replace("ammo_", "");
}

function pickupKind(type) {
  if (isAmmoPickup(type)) return "ammo";
  if (MATERIALS[type]) return "material";
  if (WEAPONS[type]) return "weapon";
  if (CONSUMABLES[type]) return "consumable";
  if (BACKPACKS[type]) return "backpack";
  if (ARMORS[type]) return "armor";
  if (VALUABLES[type]) return "valuable";
  return "misc";
}

function pickupTime(pickup) {
  if (pickup.kind === "ammo" || pickup.kind === "material") return 0.25;
  if (pickup.kind === "weapon") return 0.75;
  if (pickup.kind === "consumable") return CONSUMABLES[pickup.type].pickupTime * 0.5;
  return 0.5;
}

function makeAmmoPool(isPlayer) {
  return {
    pistol: isPlayer ? 0 : 999,
    smg: isPlayer ? 0 : 999,
    shotgun: isPlayer ? 0 : 999,
    assault: isPlayer ? 0 : 999,
    sniper: isPlayer ? 0 : 999,
  };
}

function makeWeaponItem(type, mag = null, rarity = "common") {
  const weapon = WEAPONS[type];
  const itemRarity = weapon.melee ? "common" : rarity;
  return {
    kind: "weapon",
    type,
    rarity: itemRarity,
    mag: weapon.melee ? 0 : mag ?? getWeaponMag(type, itemRarity),
  };
}

function makeConsumableItem(type) {
  return { kind: "consumable", type };
}

function pickupToItem(pickup) {
  if (pickup.kind === "weapon") return makeWeaponItem(pickup.type, pickup.mag, pickup.rarity);
  if (pickup.kind === "consumable") return makeConsumableItem(pickup.type);
  if (pickup.kind === "backpack") return { kind: "backpack", type: pickup.type };
  if (pickup.kind === "armor") return { kind: "armor", type: pickup.type };
  if (pickup.kind === "valuable") return { kind: "valuable", type: pickup.type };
  return null;
}

function itemLabel(item) {
  if (!item) return "Vide";
  if (item.kind === "weapon") {
    return item.type === "pickaxe"
      ? WEAPONS[item.type].label
      : `${WEAPONS[item.type].label} ${getRarity(item.rarity).label}`;
  }
  if (item.kind === "consumable") return CONSUMABLES[item.type].label;
  if (item.kind === "backpack") return BACKPACKS[item.type].label;
  if (item.kind === "armor") return ARMORS[item.type].label;
  if (item.kind === "valuable") return VALUABLES[item.type].label;
  return "Objet";
}

function itemColor(item) {
  if (!item) return "#d6d1ba";
  if (item.kind === "weapon") return item.type === "pickaxe" ? WEAPONS.pickaxe.color : getRarity(item.rarity).color;
  if (item.kind === "consumable") return CONSUMABLES[item.type].color;
  if (item.kind === "backpack") return BACKPACKS[item.type].color;
  if (item.kind === "armor") return ARMORS[item.type].color;
  if (item.kind === "valuable") return VALUABLES[item.type].color;
  return "#d6d1ba";
}

function itemIcon(item) {
  if (!item) return "";
  if (item.kind === "weapon") {
    return {
      pickaxe: "PX",
      pistol: "PST",
      smg: "SMG",
      assault_rifle: "AST",
      shotgun: "SG",
      sniper: "SNP",
    }[item.type] || "ARM";
  }
  return CONSUMABLES[item.type].icon;
}

function getActiveItem(fighter) {
  if (fighter.isPlayer) return fighter.hotbar[fighter.activeSlot] || null;
  return makeWeaponItem(fighter.weaponKey, fighter.mag, fighter.weaponRarity);
}

function getActiveWeaponItem(fighter) {
  const item = getActiveItem(fighter);
  return item && item.kind === "weapon" ? item : null;
}

function getEquippedWeapon(fighter) {
  const item = getActiveWeaponItem(fighter);
  return item ? WEAPONS[item.type] : null;
}

function getEquippedWeaponKey(fighter) {
  const item = getActiveWeaponItem(fighter);
  return item ? item.type : fighter.weaponKey;
}

function getEquippedWeaponRarity(fighter) {
  const item = getActiveWeaponItem(fighter);
  return item ? item.rarity : fighter.weaponRarity || "common";
}

function getMagazine(fighter) {
  const item = getActiveWeaponItem(fighter);
  if (fighter.isPlayer && item) return item.mag;
  return fighter.mag;
}

function setMagazine(fighter, value) {
  if (fighter.isPlayer) {
    const item = getActiveWeaponItem(fighter);
    if (item) item.mag = value;
  }
  fighter.mag = value;
}

function getAmmoCount(fighter, ammoType) {
  if (!ammoType) return 0;
  return fighter.ammo[ammoType] ?? 0;
}

function changeAmmo(fighter, ammoType, amount) {
  if (!ammoType) return;
  fighter.ammo[ammoType] = Math.max(0, (fighter.ammo[ammoType] ?? 0) + amount);
}

function changeMaterial(fighter, material, amount) {
  if (!fighter.materials || !MATERIALS[material]) return;
  fighter.materials[material] = Math.max(0, (fighter.materials[material] ?? 0) + amount);
}

function materialTotal(fighter) {
  if (!fighter.materials) return 0;
  return MATERIAL_ORDER.reduce((sum, material) => sum + (fighter.materials[material] ?? 0), 0);
}

function cycleBuildMaterial(player) {
  const current = MATERIAL_ORDER.indexOf(player.selectedMaterial);
  player.selectedMaterial = MATERIAL_ORDER[(current + 1 + MATERIAL_ORDER.length) % MATERIAL_ORDER.length];
  addFeed(`Materiau: ${MATERIALS[player.selectedMaterial].label}`);
  updateHud();
}

function getBuildWallRect(player) {
  const aim = player.aim;
  const forward = PLAYER_RADIUS + 58;
  const vertical = Math.abs(Math.cos(aim)) >= Math.abs(Math.sin(aim));
  const cx = player.x + Math.cos(aim) * forward;
  const cy = player.y + Math.sin(aim) * forward;
  return vertical
    ? { x: cx - BUILD_WALL_THICKNESS / 2, y: cy - BUILD_WALL_LENGTH / 2, w: BUILD_WALL_THICKNESS, h: BUILD_WALL_LENGTH }
    : { x: cx - BUILD_WALL_LENGTH / 2, y: cy - BUILD_WALL_THICKNESS / 2, w: BUILD_WALL_LENGTH, h: BUILD_WALL_THICKNESS };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function obstacleOverlapsRect(obstacle, rect, padding = 0) {
  const padded = {
    x: rect.x - padding,
    y: rect.y - padding,
    w: rect.w + padding * 2,
    h: rect.h + padding * 2,
  };
  if (obstacle.shape === "circle") {
    return circleRectOverlap(obstacle.x, obstacle.y, obstacle.radius + padding, padded);
  }
  return rectsOverlap(padded, obstacle);
}

function rectHitsSolidObstacles(rect, obstacles, padding = 0) {
  return obstacles.some((obstacle) => obstacle.solid !== false && obstacleOverlapsRect(obstacle, rect, padding));
}

function canPlaceRectObject(rect, obstacles, padding = 8) {
  if (rect.x < 24 || rect.y < 24 || rect.x + rect.w > WORLD.width - 24 || rect.y + rect.h > WORLD.height - 24) return false;
  return !rectHitsSolidObstacles(rect, obstacles, padding);
}

function findSafeRectPosition(rect, obstacles, attempts = 18) {
  if (canPlaceRectObject(rect, obstacles)) return rect;
  const center = { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };

  for (let i = 0; i < attempts; i += 1) {
    const angle = (i / attempts) * TAU + rand(-0.2, 0.2);
    const spread = 42 + Math.floor(i / 6) * 38;
    const moved = {
      ...rect,
      x: clamp(center.x + Math.cos(angle) * spread - rect.w / 2, 24, WORLD.width - rect.w - 24),
      y: clamp(center.y + Math.sin(angle) * spread - rect.h / 2, 24, WORLD.height - rect.h - 24),
    };
    if (canPlaceRectObject(moved, obstacles)) return moved;
  }

  return null;
}

function findSafePointAround(x, y, radius, obstacles, features = null, attempts = 20) {
  if (!circleHitsObstacles(x, y, radius + 8, obstacles) && !circleInWater(x, y, radius, features)) return { x, y };

  for (let i = 0; i < attempts; i += 1) {
    const angle = (i / attempts) * TAU + rand(-0.2, 0.2);
    const spread = 38 + Math.floor(i / 6) * 34;
    const point = {
      x: clamp(x + Math.cos(angle) * spread, 30, WORLD.width - 30),
      y: clamp(y + Math.sin(angle) * spread, 30, WORLD.height - 30),
    };
    if (!circleHitsObstacles(point.x, point.y, radius + 8, obstacles) && !circleInWater(point.x, point.y, radius, features)) return point;
  }

  return null;
}

function canPlaceBuildWall(player, rect) {
  if ((player.materials[player.selectedMaterial] ?? 0) < BUILD_COST) return false;
  if (rect.x < 12 || rect.y < 12 || rect.x + rect.w > WORLD.width - 12 || rect.y + rect.h > WORLD.height - 12) return false;
  if (circleRectOverlap(player.x, player.y, player.radius + 10, rect)) return false;
  if (circleInWater(rect.x + rect.w / 2, rect.y + rect.h / 2, Math.max(rect.w, rect.h) * 0.25)) return false;

  for (const fighter of aliveFighters()) {
    if (circleRectOverlap(fighter.x, fighter.y, fighter.radius + 6, rect)) return false;
  }

  for (const obstacle of nearbyObstaclesForRect(rect)) {
    if (obstacle.solid === false) continue;
    if (obstacle.shape === "circle") {
      if (circleRectOverlap(obstacle.x, obstacle.y, obstacle.radius + 4, rect)) return false;
    } else if (rectsOverlap(rect, obstacle)) {
      return false;
    }
  }

  return true;
}

function tryBuildWall(player, options = {}) {
  if (!game || game.state !== "playing" || !player.alive) return false;
  if ((player.materials[player.selectedMaterial] ?? 0) < BUILD_COST) {
    const fallbackMaterial = options.preferStrongest ? bestBuildMaterial(player) : firstAffordableBuildMaterial(player);
    if (fallbackMaterial) player.selectedMaterial = fallbackMaterial;
  }
  const material = player.selectedMaterial;
  const mat = MATERIALS[material];
  const rect = getBuildWallRect(player);

  if ((player.materials[material] ?? 0) < BUILD_COST) {
    if (!options.quiet) addFeed(`Pas assez de ${mat.label.toLowerCase()}`);
    return false;
  }

  if (!canPlaceBuildWall(player, rect)) {
    if (!options.quiet) addFeed("Impossible de construire ici");
    return false;
  }

  changeMaterial(player, material, -BUILD_COST);
  const wall = {
    type: "built_wall",
    shape: "rect",
    material,
    x: rect.x,
    y: rect.y,
    w: rect.w,
    h: rect.h,
    health: mat.health,
    maxHealth: mat.health,
  };
  game.obstacles.push(wall);
  addObstacleToGrid(wall);
  game.navGrid = null;
  spawnHit(rect.x + rect.w / 2, rect.y + rect.h / 2, mat.color, 8);
  if (!options.quiet) {
    addFeed(`Mur ${mat.label.toLowerCase()} construit`);
    updateHud();
  }
  return true;
}

function syncEquippedFromHotbar(fighter) {
  if (!fighter.isPlayer) return;
  const item = getActiveWeaponItem(fighter);
  if (!item) return;
  fighter.weaponKey = item.type;
  fighter.weaponRarity = item.rarity;
  fighter.mag = item.mag;
}

function firstEmptyHotbarSlot(player) {
  return player.hotbar.findIndex((item) => !item);
}

function switchHotbarSlot(index) {
  if (!game || game.state !== "playing") return;
  const player = game.player;
  if (index < 0 || index >= HOTBAR_SIZE) return;
  if (player.activeSlot === index) return;

  player.activeSlot = index;
  player.reload = 0;
  player.pendingReload = false;
  player.useHold = null;
  syncEquippedFromHotbar(player);
  updateHud();
}

function resize() {
  view.width = window.innerWidth;
  view.height = window.innerHeight;
  view.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.floor(view.width * view.dpr);
  canvas.height = Math.floor(view.height * view.dpr);
  canvas.style.width = `${view.width}px`;
  canvas.style.height = `${view.height}px`;
}

function makeFighter(name, x, y, isPlayer = false) {
  const weaponKey = "pickaxe";
  const weapon = WEAPONS[weaponKey];
  const hotbar = isPlayer
    ? [makeWeaponItem("pickaxe"), null, null, null]
    : null;
  return {
    id: makeId(name),
    name,
    x,
    y,
    radius: PLAYER_RADIUS,
    isPlayer,
    color: isPlayer ? (skins.find((skin) => skin.id === profile.skin) || skins[0]).color : pick(["#e83c3c", "#2f91ff", "#43d17b", "#ff8c27", "#8f5bff", "#f0469e"]),
    health: 100,
    maxHealth: 100,
    shield: isPlayer ? 40 : rand(0, 35),
    maxShield: 60,
    energy: MAX_ENERGY,
    maxEnergy: MAX_ENERGY,
    energyRegenDelay: 0,
    speed: isPlayer ? 245 : rand(150, 188),
    weaponKey,
    weaponRarity: "common",
    mag: weapon.mag,
    ammo: makeAmmoPool(isPlayer),
    materials: isPlayer
      ? { wood: 0, stone: 0, metal: 0 }
      : { wood: Math.floor(rand(10, 36)), stone: Math.floor(rand(0, 18)), metal: Math.floor(rand(0, 10)) },
    backpack: { ...DEFAULT_BACKPACK },
    backpackKey: "default",
    extractionBag: [],
    armor: { helmet: null, vest: null },
    exfilTimer: 0,
    selectedMaterial: "wood",
    hotbar,
    activeSlot: 0,
    pickupHold: null,
    useHold: null,
    aggroTimer: 0,
    lastAttacker: null,
    cooldown: 0,
    reload: 0,
    kills: 0,
    alive: true,
    aim: 0,
    moveX: 0,
    moveY: 0,
    aiTimer: 0,
    wanderX: x,
    wanderY: y,
    path: [],
    pathTimer: rand(0, 0.6),
    pathGoalX: x,
    pathGoalY: y,
    lastX: x,
    lastY: y,
    stuckTimer: 0,
    idleTimer: 0,
    unstuckTimer: 0,
    unstuckAngle: 0,
    scanAngle: rand(0, TAU),
    scanTurn: pick([-1, 1]),
    goalId: null,
    goalLastDistance: Infinity,
    goalStallTimer: 0,
    ignoredGoalId: null,
    ignoredGoalTimer: 0,
    stormTick: 0,
    invuln: 0,
    dashCooldown: 0,
    buildCooldown: isPlayer ? 0 : rand(1.8, 5.8),
    buildPanicTimer: 0,
    dashTime: 0,
    dashX: 0,
    dashY: 0,
    swingTimer: 0,
    swingDuration: 0,
  };
}

function makeZone() {
  return {
    x: WORLD.width / 2,
    y: WORLD.height / 2,
    radius: 4300,
    phase: 1,
    mode: "hidden",
    timer: 55,
    wait: 24,
    shrink: 18,
    damage: 5,
    startX: WORLD.width / 2,
    startY: WORLD.height / 2,
    startRadius: 4300,
    targetX: WORLD.width / 2,
    targetY: WORLD.height / 2,
    targetRadius: 3050,
  };
}

function newGame(mode = lastGameMode) {
  const selectedMode = GAME_MODES[mode] ? mode : "normal";
  lastGameMode = selectedMode;
  profile.games += 1;
  saveData();
  const mapFeatures = makeMapFeatures();
  const obstacles = makeObstacles();
  const chests = makeChests(obstacles);
  const zone = makeZone();
  const botCount = selectedMode === "extraction" ? EXTRACTION_BOT_COUNT : BOT_COUNT;
  const initialSpawnRadius = Math.min(WORLD.width, WORLD.height) * 0.49;
  const spawnAttempts = selectedMode === "extraction" ? 150 : 1200;
  const botSpawnDistance = selectedMode === "extraction" ? 560 : 840;
  const playerPoint = safeSpawn(obstacles, [], { minDistance: 980, features: mapFeatures, spawnRadius: initialSpawnRadius, attempts: spawnAttempts });
  const bots = [];
  const names = [...BOT_NAMES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < botCount; i += 1) {
    const point = safeSpawn(obstacles, [playerPoint, ...bots], { minDistance: botSpawnDistance, features: mapFeatures, spawnRadius: initialSpawnRadius, attempts: spawnAttempts });
    bots.push(makeFighter(names[i] || `Bot ${i + 1}`, point.x, point.y));
  }

  game = {
    state: "playing",
    mode: selectedMode,
    camera: { x: 0, y: 0 },
    player: makeFighter(profile.name, playerPoint.x, playerPoint.y, true),
    bots,
    bullets: [],
    pickups: makePickups(obstacles, selectedMode === "extraction" ? 260 : 160, mapFeatures),
    chests,
    obstacles,
    obstacleGrid: buildObstacleGrid(obstacles),
    mapFeatures,
    navGrid: null,
    particles: [],
    smokeGrenades: [],
    smokeClouds: [],
    grass: makeGrass(),
    groundPatches: makeGroundPatches(),
    zone,
    totalPlayers: botCount + 1,
    extractionZones: selectedMode === "extraction" ? makeExtractionZones() : [],
    placement: botCount + 1,
    feed: [],
    elapsed: 0,
    minimapTimer: 0,
    hotbarSignature: "",
    feedSignature: "",
    leaderboardSignature: "",
  };
  if (selectedMode === "extraction") addExtractionLoot(game);
  if (selectedMode === "extraction") applyExtractionLoadout(game.player);
  syncEquippedFromHotbar(game.player);

  ui.menu.classList.add("hidden");
  ui.gameOver.classList.add("hidden");
  ui.hud.classList.remove("hidden");
  addFeed(selectedMode === "extraction" ? "Extraction: trouve du stuff puis exfiltre." : selectedMode === "night" ? "Night Life: reste dans la lumiere." : "La partie commence. La zone apparaitra bientot.");
  if (selectedMode === "night") addFeed("La zone apparaitra bientot.");
  if (selectedMode === "extraction") addFeed("Reste 6s dans une zone verte pour extraire.");
  drawMinimap();
}

function applyExtractionLoadout(player) {
  const loadout = Array.isArray(profile.extractionLoadout) ? profile.extractionLoadout : [];
  if (!loadout.length) return;
  const failed = [];
  for (const stored of loadout) {
    const item = lockerItemToGameItem(stored);
    if (!item) continue;
    if (!equipBagItem(player, item, { silent: true, fromLoadout: true })) failed.push(stored);
  }
  if (failed.length) profile.stash.push(...failed);
  profile.extractionLoadout = [];
  saveData();
  addFeed("Equipement d'extraction charge.");
}

function safeSpawn(obstacles, blockers = [], options = {}) {
  const requestedDistance = options.minDistance ?? 90;
  const spawnRadius = options.spawnRadius ?? Math.min(WORLD.width, WORLD.height) * 0.56;
  const features = options.features || null;
  const maxAttempts = options.attempts ?? 1200;
  const relaxEvery = Math.max(120, Math.floor(maxAttempts / 5));
  let bestPoint = null;
  let bestDistance = 0;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const minDistance = Math.max(90, requestedDistance - Math.floor(attempt / relaxEvery) * 42);
    const point = {
      x: rand(120, WORLD.width - 120),
      y: rand(120, WORLD.height - 120),
    };

    if (distance(point, { x: WORLD.width / 2, y: WORLD.height / 2 }) > spawnRadius) {
      continue;
    }

    if (circleHitsObstacles(point.x, point.y, PLAYER_RADIUS + 12, obstacles) || circleInWater(point.x, point.y, PLAYER_RADIUS + 12, features)) {
      continue;
    }

    let nearest = Infinity;
    for (const blocker of blockers) {
      const d = distance(point, blocker);
      if (d < nearest) nearest = d;
      if (nearest < minDistance && nearest < bestDistance) break;
    }

    if (nearest > bestDistance) {
      bestDistance = nearest;
      bestPoint = point;
    }

    if (nearest < minDistance) {
      continue;
    }

    return point;
  }

  return bestPoint || { x: WORLD.width / 2 + rand(-240, 240), y: WORLD.height / 2 + rand(-180, 180) };
}

function makeObstacles() {
  const obstacles = [];

  addForestCluster(obstacles, 1540, 7440, 980, 150);
  addForestCluster(obstacles, 8420, 1600, 850, 105);
  addForestCluster(obstacles, 6120, 8280, 720, 80);
  addRockCluster(obstacles, 8220, 7420, 700, 85);
  addRockCluster(obstacles, 1960, 2140, 560, 55);

  for (let i = 0; i < 170; i += 1) {
    obstacles.push({
      type: "tree",
      shape: "circle",
      x: rand(70, WORLD.width - 70),
      y: rand(70, WORLD.height - 70),
      radius: rand(23, 38),
      tone: rand(0, 1),
      destructible: true,
      material: "wood",
      health: 54,
      maxHealth: 54,
      materialAmount: 28,
    });
  }

  for (let i = 0; i < 120; i += 1) {
    obstacles.push({
      type: "rock",
      shape: "circle",
      x: rand(90, WORLD.width - 90),
      y: rand(90, WORLD.height - 90),
      radius: rand(20, 34),
      tone: rand(0, 1),
      destructible: true,
      material: "stone",
      health: 72,
      maxHealth: 72,
      materialAmount: 32,
    });
  }

  const buildings = [
    ...makeTownBuildings(820, 760),
    ...makeIndustrialBuildings(6040, 760),
    ...makeFarmBuildings(1040, 3180),
    ...makeForestCabins(1160, 6820),
    ...makeHarborBuildings(7880, 5320),
    ...makeVillageBuildings(3820, 7920),
    ...makeMilitaryBaseBuildings(7960, 980),
    ...makeFireStationBuildings(5600, 6580),
    { x: 4620, y: 3480, w: 300, h: 210, variant: "large_house" },
    { x: 5200, y: 4520, w: 310, h: 190, variant: "large_house" },
    { x: 8460, y: 3020, w: 270, h: 180, variant: "shop" },
    { x: 9020, y: 8060, w: 300, h: 200, variant: "farm" },
  ];

  for (const building of buildings) {
    addBuilding(obstacles, building);
  }
  clearBuildingFootprints(obstacles);

  addCrateCluster(obstacles, 6400, 1140, 850, 75, 0.62);
  addCrateCluster(obstacles, 8120, 5480, 650, 45, 0.7);
  addCrateCluster(obstacles, 1220, 3520, 620, 35, 0.18);

  for (let i = 0; i < 85; i += 1) {
    const material = Math.random() < 0.36 ? "metal" : "wood";
    const w = rand(42, 72);
    const h = rand(42, 72);
    const rect = findSafeRectPosition({
      x: rand(110, WORLD.width - 160),
      y: rand(110, WORLD.height - 160),
      w,
      h,
    }, obstacles);
    if (!rect) continue;
    obstacles.push({
      type: "crate",
      shape: "rect",
      x: rect.x,
      y: rect.y,
      w: rect.w,
      h: rect.h,
      tone: rand(0, 1),
      destructible: true,
      material,
      health: material === "metal" ? 62 : 46,
      maxHealth: material === "metal" ? 62 : 46,
      materialAmount: material === "metal" ? 24 : 20,
    });
  }
  clearBuildingFootprints(obstacles);

  return obstacles.filter((obstacle) => {
    const center = obstacle.shape === "rect"
      ? { x: obstacle.x + obstacle.w / 2, y: obstacle.y + obstacle.h / 2 }
      : obstacle;
    return distance(center, { x: WORLD.width / 2, y: WORLD.height / 2 }) > 110;
  });
}

function addBuilding(obstacles, building) {
  building = scaleBuilding(building);
  building = separateBuildingFromOthers(building, obstacles);
  if (!building) return;
  obstacles.push({
    ...building,
    type: "building",
    shape: "rect",
    solid: false,
    x: building.x,
    y: building.y,
  });

  const wall = 14;
  const doorPadding = 8;
  const horizontalDoor = Math.min(132, Math.max(104, building.w * 0.3));
  const verticalDoor = Math.min(126, Math.max(98, building.h * 0.36));
  const doorX = building.x + building.w / 2 - horizontalDoor / 2;
  const doorY = building.y + building.h / 2 - verticalDoor / 2;
  const leftDoorX = doorX - doorPadding;
  const rightDoorX = doorX + horizontalDoor + doorPadding;
  const topDoorY = doorY - doorPadding;
  const bottomDoorY = doorY + verticalDoor + doorPadding;

  addWall(obstacles, building.x, building.y, leftDoorX - building.x, wall);
  addWall(obstacles, rightDoorX, building.y, building.x + building.w - rightDoorX, wall);
  addWall(obstacles, building.x, building.y + building.h - wall, leftDoorX - building.x, wall);
  addWall(obstacles, rightDoorX, building.y + building.h - wall, building.x + building.w - rightDoorX, wall);
  addWall(obstacles, building.x, building.y, wall, topDoorY - building.y);
  addWall(obstacles, building.x, bottomDoorY, wall, building.y + building.h - bottomDoorY);
  addWall(obstacles, building.x + building.w - wall, building.y, wall, topDoorY - building.y);
  addWall(obstacles, building.x + building.w - wall, bottomDoorY, wall, building.y + building.h - bottomDoorY);

  addInteriorRooms(obstacles, building, wall);
}

function separateBuildingFromOthers(building, obstacles) {
  const existing = obstacles.filter((obstacle) => obstacle.type === "building");
  if (!existing.length) return building;
  let current = { ...building };
  const padding = 36;

  for (let attempt = 0; attempt < 18; attempt += 1) {
    const blocker = existing.find((other) => rectsOverlap(
      { x: current.x - padding, y: current.y - padding, w: current.w + padding * 2, h: current.h + padding * 2 },
      other,
    ));
    if (!blocker) return current;

    const currentCenter = { x: current.x + current.w / 2, y: current.y + current.h / 2 };
    const blockerCenter = { x: blocker.x + blocker.w / 2, y: blocker.y + blocker.h / 2 };
    let dx = currentCenter.x - blockerCenter.x;
    let dy = currentCenter.y - blockerCenter.y;
    if (Math.abs(dx) + Math.abs(dy) < 0.001) {
      dx = Math.random() - 0.5;
      dy = Math.random() - 0.5;
    }
    const length = Math.hypot(dx, dy) || 1;
    current.x = clamp(current.x + (dx / length) * 54, 40, WORLD.width - current.w - 40);
    current.y = clamp(current.y + (dy / length) * 54, 40, WORLD.height - current.h - 40);
  }

  const stillOverlaps = existing.some((other) => rectsOverlap(
    { x: current.x - padding, y: current.y - padding, w: current.w + padding * 2, h: current.h + padding * 2 },
    other,
  ));
  return stillOverlaps ? null : current;
}

function clearBuildingFootprints(obstacles) {
  const buildings = obstacles.filter((obstacle) => obstacle.type === "building");
  for (let i = obstacles.length - 1; i >= 0; i -= 1) {
    const obstacle = obstacles[i];
    if (!["tree", "rock", "crate"].includes(obstacle.type)) continue;
    const center = obstacle.shape === "rect"
      ? { x: obstacle.x + obstacle.w / 2, y: obstacle.y + obstacle.h / 2, radius: Math.max(obstacle.w, obstacle.h) / 2 }
      : obstacle;
    const overlapsBuilding = buildings.some((building) => circleRectOverlap(
      center.x,
      center.y,
      (center.radius || 24) + PLAYER_RADIUS + 20,
      {
        x: building.x - 26,
        y: building.y - 26,
        w: building.w + 52,
        h: building.h + 52,
      },
    ));
    if (overlapsBuilding) obstacles.splice(i, 1);
  }
}

function scaleBuilding(building) {
  const scaleByVariant = {
    house: 1.42,
    shop: 1.38,
    large_house: 1.34,
    farm: 1.36,
    warehouse: 1.25,
    military: 1.26,
    barracks: 1.32,
    fire_station: 1.3,
    garage: 1.34,
  };
  const minByVariant = {
    house: { w: 270, h: 205 },
    shop: { w: 285, h: 205 },
    large_house: { w: 390, h: 280 },
    farm: { w: 410, h: 285 },
    warehouse: { w: 470, h: 300 },
    military: { w: 510, h: 330 },
    barracks: { w: 430, h: 285 },
    fire_station: { w: 520, h: 320 },
    garage: { w: 350, h: 245 },
  };
  const scale = scaleByVariant[building.variant] || 1.32;
  const minimum = minByVariant[building.variant] || { w: 285, h: 205 };
  const centerX = building.x + building.w / 2;
  const centerY = building.y + building.h / 2;
  const w = Math.max(minimum.w, Math.round(building.w * scale));
  const h = Math.max(minimum.h, Math.round(building.h * scale));
  return {
    ...building,
    x: clamp(centerX - w / 2, 40, WORLD.width - w - 40),
    y: clamp(centerY - h / 2, 40, WORLD.height - h - 40),
    w,
    h,
  };
}

function addWall(obstacles, x, y, w, h, solid = true) {
  if (w <= 10 || h <= 10) return;
  obstacles.push({
    type: "wall",
    shape: "rect",
    x,
    y,
    w,
    h,
    solid,
  });
}

function addInteriorRooms(obstacles, building, wall) {
  const x = building.x;
  const y = building.y;
  const w = building.w;
  const h = building.h;
  const roomGap = Math.max(88, Math.min(132, Math.min(w, h) * 0.38));

  if (["house", "large_house", "farm", "fire_station"].includes(building.variant)) {
    const splitX = x + w * 0.28;
    const splitY = y + h * 0.52;
    if (w > 330 && h > 240) {
      addWall(obstacles, splitX, y + wall + 44, wall, Math.max(46, h * 0.24));
      addWall(obstacles, x + w * 0.72, y + h * 0.66, wall, Math.max(42, h * 0.18));
    }
    if (w > 360 && h > 260) {
      addWall(obstacles, x + wall + 34, splitY, Math.max(48, w * 0.28 - roomGap / 2), wall);
    }
  }

  if (building.variant === "warehouse" || building.variant === "military" || building.variant === "barracks") {
    const splitX = x + w * 0.27;
    const splitY = y + h * 0.45;
    addWall(obstacles, splitX, y + wall + 44, wall, h * 0.24);
    addWall(obstacles, x + w * 0.73, y + h * 0.66, wall, h * 0.18);
    addWall(obstacles, x + w * 0.62, splitY, Math.max(58, w * 0.18), wall);
    if (w > 440) addWall(obstacles, x + wall + 34, y + h * 0.74, Math.max(54, w * 0.14), wall);
  }
}

function makeTownBuildings(originX, originY) {
  const buildings = [];
  const rows = [
    ["shop", "house", "large_house", "shop"],
    ["house", "house", "shop", "house"],
    ["large_house", "shop", "house", "large_house"],
  ];
  for (let y = 0; y < rows.length; y += 1) {
    for (let x = 0; x < rows[y].length; x += 1) {
      const variant = rows[y][x];
      const large = variant === "large_house";
      buildings.push({
        x: originX + x * 360 + rand(-22, 22),
        y: originY + y * 330 + rand(-18, 18),
        w: large ? rand(270, 330) : rand(170, 230),
        h: large ? rand(190, 240) : rand(130, 180),
        variant,
      });
    }
  }
  return buildings;
}

function makeIndustrialBuildings(originX, originY) {
  return [
    { x: originX, y: originY, w: 390, h: 250, variant: "warehouse" },
    { x: originX + 520, y: originY + 40, w: 350, h: 220, variant: "warehouse" },
    { x: originX + 1040, y: originY + 20, w: 330, h: 240, variant: "warehouse" },
    { x: originX + 160, y: originY + 430, w: 260, h: 170, variant: "shop" },
    { x: originX + 660, y: originY + 410, w: 420, h: 260, variant: "warehouse" },
    { x: originX + 1180, y: originY + 430, w: 260, h: 190, variant: "shop" },
  ];
}

function makeFarmBuildings(originX, originY) {
  return [
    { x: originX, y: originY, w: 320, h: 210, variant: "farm" },
    { x: originX + 460, y: originY + 70, w: 250, h: 170, variant: "house" },
    { x: originX + 820, y: originY + 20, w: 300, h: 200, variant: "farm" },
    { x: originX + 160, y: originY + 420, w: 260, h: 180, variant: "warehouse" },
    { x: originX + 620, y: originY + 460, w: 230, h: 160, variant: "house" },
  ];
}

function makeForestCabins(originX, originY) {
  return [
    { x: originX, y: originY, w: 220, h: 160, variant: "house" },
    { x: originX + 460, y: originY + 260, w: 250, h: 180, variant: "large_house" },
    { x: originX + 920, y: originY + 20, w: 210, h: 150, variant: "house" },
  ];
}

function makeHarborBuildings(originX, originY) {
  return [
    { x: originX, y: originY, w: 320, h: 210, variant: "warehouse" },
    { x: originX + 430, y: originY + 80, w: 260, h: 170, variant: "shop" },
    { x: originX + 170, y: originY + 420, w: 370, h: 230, variant: "warehouse" },
  ];
}

function makeVillageBuildings(originX, originY) {
  return [
    { x: originX, y: originY, w: 240, h: 170, variant: "house" },
    { x: originX + 360, y: originY - 70, w: 270, h: 190, variant: "shop" },
    { x: originX + 720, y: originY + 40, w: 250, h: 170, variant: "house" },
    { x: originX + 200, y: originY + 360, w: 310, h: 220, variant: "large_house" },
    { x: originX + 620, y: originY + 380, w: 260, h: 170, variant: "house" },
  ];
}

function makeMilitaryBaseBuildings(originX, originY) {
  return [
    { x: originX, y: originY, w: 410, h: 260, variant: "military" },
    { x: originX + 540, y: originY + 40, w: 340, h: 210, variant: "barracks" },
    { x: originX + 150, y: originY + 430, w: 300, h: 190, variant: "barracks" },
    { x: originX + 620, y: originY + 420, w: 380, h: 240, variant: "military" },
  ];
}

function makeFireStationBuildings(originX, originY) {
  return [
    { x: originX, y: originY, w: 420, h: 250, variant: "fire_station" },
    { x: originX + 520, y: originY + 40, w: 260, h: 180, variant: "garage" },
    { x: originX + 160, y: originY + 430, w: 260, h: 180, variant: "house" },
  ];
}

function addForestCluster(obstacles, centerX, centerY, radius, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = rand(0, TAU);
    const d = Math.sqrt(Math.random()) * radius;
    obstacles.push({
      type: "tree",
      shape: "circle",
      x: clamp(centerX + Math.cos(angle) * d, 70, WORLD.width - 70),
      y: clamp(centerY + Math.sin(angle) * d, 70, WORLD.height - 70),
      radius: rand(24, 42),
      tone: rand(0, 1),
      destructible: true,
      material: "wood",
      health: 54,
      maxHealth: 54,
      materialAmount: 28,
    });
  }
}

function addRockCluster(obstacles, centerX, centerY, radius, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = rand(0, TAU);
    const d = Math.sqrt(Math.random()) * radius;
    obstacles.push({
      type: "rock",
      shape: "circle",
      x: clamp(centerX + Math.cos(angle) * d, 90, WORLD.width - 90),
      y: clamp(centerY + Math.sin(angle) * d, 90, WORLD.height - 90),
      radius: rand(20, 36),
      tone: rand(0, 1),
      destructible: true,
      material: "stone",
      health: 72,
      maxHealth: 72,
      materialAmount: 32,
    });
  }
}

function addCrateCluster(obstacles, centerX, centerY, radius, count, metalChance = 0.36) {
  for (let i = 0; i < count; i += 1) {
    const angle = rand(0, TAU);
    const d = Math.sqrt(Math.random()) * radius;
    const material = Math.random() < metalChance ? "metal" : "wood";
    const w = rand(42, 78);
    const h = rand(42, 78);
    const rect = findSafeRectPosition({
      x: clamp(centerX + Math.cos(angle) * d, 110, WORLD.width - 160),
      y: clamp(centerY + Math.sin(angle) * d, 110, WORLD.height - 160),
      w,
      h,
    }, obstacles);
    if (!rect) continue;
    obstacles.push({
      type: "crate",
      shape: "rect",
      x: rect.x,
      y: rect.y,
      w: rect.w,
      h: rect.h,
      tone: rand(0, 1),
      destructible: true,
      material,
      health: material === "metal" ? 62 : 46,
      maxHealth: material === "metal" ? 62 : 46,
      materialAmount: material === "metal" ? 24 : 20,
    });
  }
}

function makeMapFeatures() {
  return {
    zones: [
      { id: "town", label: "Ville", x: 640, y: 560, w: 1720, h: 1280, color: "rgba(255, 255, 255, 0.08)" },
      { id: "industrial", label: "Hangars", x: 5840, y: 560, w: 1760, h: 1260, color: "rgba(255, 255, 255, 0.07)" },
      { id: "farm", label: "Ferme", x: 760, y: 2860, w: 1760, h: 1260, color: "rgba(213, 185, 69, 0.12)" },
      { id: "forest", label: "Foret", x: 520, y: 6280, w: 2480, h: 2320, color: "rgba(42, 121, 43, 0.14)" },
      { id: "quarry", label: "Carriere", x: 7520, y: 6680, w: 1460, h: 1260, color: "rgba(255, 255, 255, 0.09)" },
      { id: "harbor", label: "Docks", x: 7600, y: 5000, w: 1320, h: 1100, color: "rgba(22, 116, 190, 0.08)" },
      { id: "village", label: "Village", x: 3540, y: 7600, w: 1340, h: 1220, color: "rgba(195, 167, 94, 0.1)" },
      { id: "military", label: "Base militaire", x: 7740, y: 760, w: 1440, h: 1140, color: "rgba(41, 83, 34, 0.12)" },
      { id: "fire_station", label: "Caserne", x: 5400, y: 6360, w: 1160, h: 980, color: "rgba(209, 76, 60, 0.08)" },
    ],
    rivers: [
      { x: 0, y: 1760, w: WORLD.width, h: 150 },
      { x: 3520, y: 0, w: 150, h: WORLD.height },
      { x: 0, y: 6120, w: WORLD.width, h: 170 },
      { x: 7460, y: 0, w: 160, h: WORLD.height },
    ],
    bridges: [
      { x: 700, y: 1728, w: 250, h: 214 },
      { x: 2080, y: 1728, w: 270, h: 214 },
      { x: 3920, y: 1728, w: 280, h: 214 },
      { x: 5660, y: 1728, w: 290, h: 214 },
      { x: 8120, y: 1728, w: 310, h: 214 },
      { x: 3488, y: 520, w: 214, h: 250 },
      { x: 3488, y: 2260, w: 214, h: 270 },
      { x: 3488, y: 3300, w: 214, h: 250 },
      { x: 3488, y: 4380, w: 214, h: 280 },
      { x: 3488, y: 6640, w: 214, h: 300 },
      { x: 3488, y: 8400, w: 214, h: 300 },
      { x: 900, y: 6080, w: 300, h: 250 },
      { x: 2820, y: 6080, w: 310, h: 250 },
      { x: 5120, y: 6080, w: 310, h: 250 },
      { x: 8320, y: 6080, w: 320, h: 250 },
      { x: 7420, y: 640, w: 240, h: 300 },
      { x: 7420, y: 3120, w: 240, h: 320 },
      { x: 7420, y: 7280, w: 240, h: 320 },
    ],
    stealthZones: [
      { type: "field", x: 940, y: 3080, w: 520, h: 300 },
      { type: "field", x: 1530, y: 2970, w: 680, h: 330 },
      { type: "field", x: 870, y: 3660, w: 730, h: 320 },
      { type: "field", x: 1710, y: 3720, w: 620, h: 300 },
      { type: "field", x: 3950, y: 2660, w: 620, h: 310 },
      { type: "field", x: 2460, y: 520, w: 480, h: 260 },
      { type: "field", x: 5860, y: 3760, w: 620, h: 330 },
      { type: "field", x: 1240, y: 4380, w: 540, h: 300 },
      { type: "field", x: 7800, y: 2520, w: 720, h: 360 },
      { type: "field", x: 840, y: 7420, w: 680, h: 340 },
      { type: "field", x: 4320, y: 7860, w: 720, h: 360 },
      { type: "field", x: 7440, y: 8500, w: 760, h: 390 },
      { type: "bush", x: 760, y: 1720, r: 120 },
      { type: "bush", x: 3180, y: 960, r: 150 },
      { type: "bush", x: 4800, y: 3440, r: 140 },
      { type: "bush", x: 1760, y: 2660, r: 130 },
      { type: "bush", x: 6420, y: 1160, r: 150 },
      { type: "bush", x: 6940, y: 4620, r: 135 },
      { type: "bush", x: 8720, y: 3720, r: 150 },
      { type: "bush", x: 2140, y: 7200, r: 145 },
      { type: "bush", x: 5900, y: 8120, r: 165 },
      { type: "bush", x: 9120, y: 8860, r: 150 },
    ],
  };
}

function makeGroundPatches() {
  const patches = [];
  const colors = ["#6ba13d", "#86bd50", "#5f963a", "#8db957"];
  for (let i = 0; i < 260; i += 1) {
    patches.push({
      x: rand(0, WORLD.width),
      y: rand(0, WORLD.height),
      radius: rand(70, 190),
      color: pick(colors),
      alpha: rand(0.07, 0.15),
    });
  }
  return patches;
}

function makeGrass() {
  const blades = [];
  for (let i = 0; i < 1500; i += 1) {
    blades.push({
      x: rand(0, WORLD.width),
      y: rand(0, WORLD.height),
      length: rand(5, 13),
      rot: rand(-0.9, 0.9),
      tone: rand(0, 1),
    });
  }
  return blades;
}

function makePickups(obstacles, count, features) {
  const pickups = [];
  const lootTable = [
    "ammo_pistol",
    "ammo_pistol",
    "ammo_smg",
    "ammo_smg",
    "ammo_shotgun",
    "ammo_shotgun",
    "ammo_assault",
    "ammo_assault",
    "ammo_sniper",
    "ammo_sniper",
    "shield",
    "medkit",
    "smoke_grenade",
    "pistol",
    "smg",
    "shotgun",
    "assault_rifle",
    "sniper",
  ];

  for (let i = 0; i < count; i += 1) {
    const point = safeSpawn(obstacles, pickups, { minDistance: 72, features, attempts: 170 });
    const type = pick(lootTable);
    const safePoint = findSafePointAround(point.x, point.y, 21, obstacles, features) || point;
    pickups.push(makePickup(type, safePoint.x, safePoint.y));
  }

  return pickups;
}

function makeChests(obstacles) {
  const chests = [];
  const buildings = obstacles.filter((obstacle) => obstacle.type === "building");

  for (const building of buildings) {
    const candidates = [
      { x: building.x + building.w / 2, y: building.y - 34 },
      { x: building.x + building.w / 2, y: building.y + building.h + 34 },
      { x: building.x - 34, y: building.y + building.h / 2 },
      { x: building.x + building.w + 34, y: building.y + building.h / 2 },
      { x: building.x + 38, y: building.y + 38 },
      { x: building.x + building.w - 38, y: building.y + building.h - 38 },
    ].sort(() => Math.random() - 0.5);

    const point = candidates
      .map((candidate) => findSafePointAround(candidate.x, candidate.y, 22, obstacles))
      .find(Boolean);
    if (!point) continue;

    chests.push({
      id: makeId("chest"),
      x: clamp(point.x, 34, WORLD.width - 34),
      y: clamp(point.y, 34, WORLD.height - 34),
      radius: 22,
      opened: false,
      pulse: rand(0, TAU),
    });
  }

  return chests;
}

function makeExtractionZones() {
  return [
    { x: 820, y: 9020, radius: 180, label: "Exfil Ouest" },
    { x: 9380, y: 880, radius: 180, label: "Exfil Nord-Est" },
    { x: 8700, y: 5420, radius: 190, label: "Exfil Docks" },
  ];
}

function randomValuableType() {
  return rollWeighted([
    ["watch", 36],
    ["circuit", 28],
    ["meds_cache", 20],
    ["encrypted_drive", 11],
    ["prototype_core", 5],
  ]);
}

function randomBackpackType() {
  return rollWeighted([
    ["backpack_common", 48],
    ["backpack_rare", 30],
    ["backpack_epic", 16],
    ["backpack_legendary", 6],
  ]);
}

function randomArmorType() {
  return rollWeighted([
    ["helmet_rare", 18],
    ["helmet_epic", 8],
    ["helmet_legendary", 3],
    ["vest_rare", 18],
    ["vest_epic", 8],
    ["vest_legendary", 3],
  ]);
}

function rollWeighted(entries) {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rand(0, total);
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries[0][0];
}

function addExtractionLoot(targetGame) {
  const buildings = targetGame.obstacles.filter((obstacle) => obstacle.type === "building");
  const anchors = [...targetGame.chests, ...buildings.map((building) => ({
    x: building.x + building.w / 2,
    y: building.y + building.h / 2,
  }))];
  for (let i = 0; i < 170; i += 1) {
    const anchor = pick(anchors);
    const angle = rand(0, TAU);
    const spread = rand(26, 130);
    const point = findSafePointAround(
      clamp(anchor.x + Math.cos(angle) * spread, 40, WORLD.width - 40),
      clamp(anchor.y + Math.sin(angle) * spread, 40, WORLD.height - 40),
      20,
      targetGame.obstacles,
      targetGame.mapFeatures,
    );
    if (!point) continue;
    const type = i % 9 === 0 ? randomBackpackType() : i % 7 === 0 ? randomArmorType() : randomValuableType();
    targetGame.pickups.push(makePickup(type, point.x, point.y));
  }
}

function randomWeaponType() {
  return pick(["pistol", "smg", "shotgun", "assault_rifle", "sniper"]);
}

function randomAmmoPickup() {
  return pick(["ammo_pistol", "ammo_smg", "ammo_shotgun", "ammo_assault", "ammo_sniper"]);
}

function ammoPickupForWeapon(weaponType) {
  const weapon = WEAPONS[weaponType];
  return weapon && weapon.ammoType ? `ammo_${weapon.ammoType}` : null;
}

function randomMaterialType() {
  return pick(MATERIAL_ORDER);
}

function openChest(chest) {
  if (chest.opened) return;
  chest.opened = true;
  spawnHit(chest.x, chest.y, "#f4cf67", 18);

  const primaryWeapon = randomWeaponType();
  const drops = [
    { type: primaryWeapon, minimumRarity: Math.random() < 0.22 ? "rare" : "common" },
    { type: ammoPickupForWeapon(primaryWeapon) },
    { type: randomAmmoPickup() },
    { type: randomAmmoPickup() },
    { type: randomAmmoPickup() },
    { type: randomMaterialType(), amount: pick([10, 20, 20, 30]) },
    { type: randomMaterialType(), amount: pick([10, 10, 20]) },
  ];

  if (Math.random() < 0.65) drops.push({ type: pick(["shield", "medkit", "smoke_grenade"]) });
  if (Math.random() < 0.08) drops.push({ type: "smoke_grenade" });
  if (game && game.mode === "extraction") {
    if (Math.random() < 0.72) drops.push({ type: randomValuableType() });
    if (Math.random() < 0.24) drops.push({ type: randomBackpackType() });
    if (Math.random() < 0.28) drops.push({ type: randomArmorType() });
  }
  if (Math.random() < 0.28) {
    const bonusWeapon = randomWeaponType();
    drops.push({ type: bonusWeapon, minimumRarity: "uncommon" });
    drops.push({ type: ammoPickupForWeapon(bonusWeapon) });
  }

  for (let i = 0; i < drops.length; i += 1) {
    if (!drops[i].type) continue;
    const angle = (i / drops.length) * TAU + rand(-0.24, 0.24);
    const spread = rand(38, 74);
    const drop = drops[i];
    const rawX = clamp(chest.x + Math.cos(angle) * spread, 30, WORLD.width - 30);
    const rawY = clamp(chest.y + Math.sin(angle) * spread, 30, WORLD.height - 30);
    const point = findSafePointAround(rawX, rawY, 19, game.obstacles, game.mapFeatures) || { x: rawX, y: rawY };
    game.pickups.push(makePickup(
      drop.type,
      point.x,
      point.y,
      { minimumRarity: drop.minimumRarity, amount: drop.amount },
    ));
  }
}

function updateChests(dt) {
  for (const chest of game.chests) {
    chest.pulse += dt * 2.2;
    if (chest.opened) continue;

    for (const fighter of aliveFighters()) {
      if (distance(fighter, chest) <= fighter.radius + chest.radius + 10) {
        openChest(chest);
        break;
      }
    }
  }
}

function makePickup(type, x, y, options = {}) {
  const weapon = WEAPONS[type];
  const ammoType = isAmmoPickup(type) ? ammoTypeFromPickup(type) : null;
  const ammo = ammoType ? AMMO_TYPES[ammoType] : null;
  const material = MATERIALS[type];
  const consumable = CONSUMABLES[type];
  const backpack = BACKPACKS[type];
  const armor = ARMORS[type];
  const valuable = VALUABLES[type];
  const kind = pickupKind(type);
  const rarity = kind === "weapon" && type !== "pickaxe" ? options.rarity ?? rollRarity(options.minimumRarity) : "common";
  return {
    id: makeId(type),
    type,
    kind,
    x,
    y,
    radius: kind === "ammo" || kind === "material" ? 19 : 15,
    pulse: rand(0, TAU),
    rarity,
    mag: options.mag ?? (weapon && !weapon.melee ? getWeaponMag(type, rarity) : 0),
    amount: options.amount ?? (ammo ? ammo.amount : material ? 20 : 1),
    label: weapon ? `${weapon.label}${weapon.melee ? "" : ` ${getRarity(rarity).label}`}` : ammo ? `Mun. ${ammo.label}` : material ? `${material.label} +${options.amount ?? 20}` : consumable ? consumable.label : backpack ? backpack.label : armor ? armor.label : valuable ? valuable.label : type,
    color: weapon ? (weapon.melee ? weapon.color : getRarity(rarity).color) : ammo ? ammo.color : material ? material.color : consumable ? consumable.color : backpack ? backpack.color : armor ? armor.color : valuable ? valuable.color : "#f4cf67",
  };
}

function makeId(prefix) {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${prefix}-${Math.random().toString(16).slice(2)}`;
}

function addFeed(text) {
  if (!game) return;
  game.feed.unshift({ text, time: 4.4 });
  game.feed = game.feed.slice(0, 5);
}

function update(dt) {
  if (!game || game.state !== "playing") return;

  game.elapsed += dt;
  updateMouseWorld();
  updateZone(dt);
  updatePlayer(dt);
  updateBots(dt);
  updateChests(dt);
  updateBullets(dt);
  updateSmoke(dt);
  updatePickups(dt);
  updateParticles(dt);
  updateExtraction(dt);
  updateCamera();
  checkVictory();
  game.minimapTimer += dt;
  updateHud();
}

function updateMouseWorld() {
  if (!game) return;
  mouse.worldX = mouse.x + game.camera.x;
  mouse.worldY = mouse.y + game.camera.y;
}

function updatePlayer(dt) {
  const player = game.player;
  if (!player.alive) return;

  tickFighter(player, dt);
  const input = readMovementInput();
  player.moveX = input.x;
  player.moveY = input.y;
  player.aim = Math.atan2(mouse.worldY - player.y, mouse.worldX - player.x);

  if (isActionPressed("dash")) {
    startDash(player, input.x, input.y);
  }

  let speed = player.speed;
  let moveX = input.x;
  let moveY = input.y;

  if (player.dashTime > 0) {
    speed = DASH_SPEED;
    moveX = player.dashX;
    moveY = player.dashY;
    spawnParticle(player.x - moveX * 14, player.y - moveY * 14, "#f4cf67", 0.22, 16);
  }
  speed *= terrainSpeedMultiplier(player);

  moveFighter(player, moveX * speed * dt, moveY * speed * dt);

  const actionPressed = mouse.down || keys.has("Space");
  const activeItem = getActiveItem(player);

  if (activeItem && activeItem.kind === "consumable") {
    updateConsumableUse(player, dt, actionPressed);
  } else if (actionPressed) {
    tryShoot(player, player.aim);
  } else {
    player.useHold = null;
  }

  if (isActionPressed("reload")) {
    startReload(player);
  }

  updatePickupHold(player, dt);
  applyStormDamage(player, dt);
}

function readMovementInput() {
  let x = 0;
  let y = 0;
  if (isActionPressed("left")) x -= 1;
  if (isActionPressed("right")) x += 1;
  if (isActionPressed("up")) y -= 1;
  if (isActionPressed("down")) y += 1;

  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function isActionPressed(action) {
  return (settings.keybinds[action] || []).some((code) => keys.has(code));
}

function isNightMode() {
  return game && game.mode === "night";
}

function pointInFlashlight(observer, x, y, range = NIGHT_VIEW_RANGE, cone = NIGHT_VIEW_ANGLE) {
  const d = Math.hypot(x - observer.x, y - observer.y);
  if (d <= NIGHT_CLOSE_RANGE) return true;
  if (d > range) return false;
  const angle = Math.atan2(y - observer.y, x - observer.x);
  return Math.abs(angleDifference(angle, observer.aim)) <= cone / 2;
}

function canSeeByLight(observer, target, options = {}) {
  if (!isNightMode()) return true;
  const x = target.x;
  const y = target.y;
  const range = options.range ?? NIGHT_VIEW_RANGE;
  const cone = options.cone ?? NIGHT_VIEW_ANGLE;
  if (!pointInFlashlight(observer, x, y, range, cone)) return false;
  if (options.requireLineOfSight === false) return true;
  return hasLineOfSight(observer, target);
}

function playerCanSeeEntity(entity, options = {}) {
  if (!game || !game.player) return true;
  if (!isNightMode()) return true;
  return canSeeByLight(game.player, entity, options);
}

function startDash(fighter, x, y) {
  if (fighter.dashCooldown > 0 || fighter.dashTime > 0) return;
  if ((fighter.energy ?? MAX_ENERGY) < DASH_ENERGY_COST) return;
  if (Math.hypot(x, y) < 0.2) {
    x = Math.cos(fighter.aim);
    y = Math.sin(fighter.aim);
  }
  const length = Math.hypot(x, y) || 1;
  x /= length;
  y /= length;

  fighter.energy = Math.max(0, (fighter.energy ?? MAX_ENERGY) - DASH_ENERGY_COST);
  fighter.energyRegenDelay = ENERGY_REGEN_DELAY;
  fighter.dashCooldown = 1.25;
  fighter.dashTime = 0.13;
  fighter.dashX = x;
  fighter.dashY = y;
}

function tickFighter(fighter, dt) {
  fighter.cooldown = Math.max(0, fighter.cooldown - dt);
  fighter.reload = Math.max(0, fighter.reload - dt);
  fighter.dashCooldown = Math.max(0, fighter.dashCooldown - dt);
  fighter.energyRegenDelay = Math.max(0, (fighter.energyRegenDelay ?? 0) - dt);
  if (fighter.energyRegenDelay <= 0) {
    fighter.energy = Math.min(fighter.maxEnergy ?? MAX_ENERGY, (fighter.energy ?? MAX_ENERGY) + ENERGY_REGEN_RATE * dt);
  }
  fighter.buildCooldown = Math.max(0, fighter.buildCooldown - dt);
  fighter.buildPanicTimer = Math.max(0, fighter.buildPanicTimer - dt);
  fighter.dashTime = Math.max(0, fighter.dashTime - dt);
  fighter.swingTimer = Math.max(0, fighter.swingTimer - dt);
  fighter.invuln = Math.max(0, fighter.invuln - dt);
  fighter.aggroTimer = Math.max(0, fighter.aggroTimer - dt);
  if (fighter.aggroTimer === 0) fighter.lastAttacker = null;

  if (fighter.reload === 0 && fighter.pendingReload) {
    const weapon = getEquippedWeapon(fighter);
    if (!weapon || weapon.melee) {
      fighter.pendingReload = false;
      return;
    }

    const currentMag = getMagazine(fighter);
    const needed = getWeaponMag(getEquippedWeaponKey(fighter), getEquippedWeaponRarity(fighter)) - currentMag;
    const refill = fighter.isPlayer ? Math.min(needed, getAmmoCount(fighter, weapon.ammoType)) : needed;
    setMagazine(fighter, currentMag + refill);
    if (fighter.isPlayer) changeAmmo(fighter, weapon.ammoType, -refill);
    fighter.pendingReload = false;
  }
}

function updateBots(dt) {
  game.pathRequestsThisFrame = 0;
  for (const bot of game.bots) {
    if (!bot.alive) continue;
    tickFighter(bot, dt);
    bot.unstuckTimer = Math.max(0, bot.unstuckTimer - dt);
    bot.ignoredGoalTimer = Math.max(0, bot.ignoredGoalTimer - dt);
    if (bot.ignoredGoalTimer === 0) bot.ignoredGoalId = null;
    const beforeX = bot.x;
    const beforeY = bot.y;

    bot.aiTimer -= dt;
    const defensiveTarget = bot.lastAttacker && bot.lastAttacker.alive && bot.aggroTimer > 0 && distance(bot, bot.lastAttacker) < 920
      ? bot.lastAttacker
      : null;
    const canCloseFight = game.elapsed > BOT_CLOSE_FIGHT_GRACE;
    const closeThreat = bot.unstuckTimer > 0 || !canCloseFight ? null : findNearestOpponent(bot, 95);
    const canHunt = botCombatReady(bot) && game.elapsed > BOT_LOOT_PHASE_TIME;
    const target = bot.unstuckTimer > 0
      ? null
      : defensiveTarget || closeThreat || (canHunt ? findNearestOpponent(bot, 880) : null);
    if (closeThreat) {
      bot.lastAttacker = closeThreat;
      bot.aggroTimer = Math.max(bot.aggroTimer, 2.4);
    }
    const outsideZone = !insideZone(bot);

    if (outsideZone) {
      bot.wanderX = game.zone.x;
      bot.wanderY = game.zone.y;
      setBotGoal(bot, "zone", { x: bot.wanderX, y: bot.wanderY });
    } else if (target && bot.aiTimer <= 0) {
      bot.aiTimer = rand(0.25, 0.55);
      const away = angleTo(target, bot) + rand(-0.8, 0.8);
      bot.wanderX = bot.x + Math.cos(away) * rand(100, 190);
      bot.wanderY = bot.y + Math.sin(away) * rand(100, 190);
      setBotGoal(bot, `fight:${target.id}`, { x: bot.wanderX, y: bot.wanderY });
    } else if (!target && bot.aiTimer <= 0) {
      bot.aiTimer = rand(0.9, 1.8);
      const chest = nearestChest(bot, botCombatReady(bot) ? 520 : 980);
      const loot = nearestPriorityPickup(bot, botCombatReady(bot) ? 560 : 920);
      if (!botCombatReady(bot) && loot && (!chest || distance(bot, loot) < distance(bot, chest) + 220)) {
        bot.wanderX = loot.x;
        bot.wanderY = loot.y;
        setBotGoal(bot, `pickup:${loot.id}`, loot);
      } else if (chest) {
        bot.wanderX = chest.x;
        bot.wanderY = chest.y;
        setBotGoal(bot, `chest:${chest.id}`, chest);
      } else if (loot) {
        bot.wanderX = loot.x;
        bot.wanderY = loot.y;
        setBotGoal(bot, `pickup:${loot.id}`, loot);
      } else {
        bot.wanderX = clamp(bot.x + rand(-330, 330), 60, WORLD.width - 60);
        bot.wanderY = clamp(bot.y + rand(-250, 250), 60, WORLD.height - 60);
        setBotGoal(bot, `roam:${Math.round(bot.wanderX)}:${Math.round(bot.wanderY)}`, { x: bot.wanderX, y: bot.wanderY });
      }
    }

    let moveAngle = Math.atan2(bot.wanderY - bot.y, bot.wanderX - bot.x);
    let speed = bot.speed;
    const weapon = getEquippedWeapon(bot) || WEAPONS.pickaxe;
    let pathDestination = { x: bot.wanderX, y: bot.wanderY };
    speed *= terrainSpeedMultiplier(bot);

    if (bot.unstuckTimer > 0) {
      moveAngle = bot.unstuckAngle;
      speed *= 1.12;
      bot.aim = moveAngle;
    } else if (target) {
      bot.aim = angleTo(bot, target) + rand(-0.04, 0.04);
      const targetDistance = distance(bot, target);
      const preferredDistance = weapon.melee ? 46 : 280;
      const attackDistance = weapon.melee ? weapon.range + 12 : 720;
      const canSeeTarget = hasLineOfSight(bot, target);
      pathDestination = target;
      setBotGoal(bot, `target:${target.id}`, target);

      if (targetDistance > preferredDistance) {
        moveAngle = angleTo(bot, target);
      } else if (!weapon.melee && targetDistance < 160) {
        moveAngle = angleTo(target, bot);
      }

      if (!canSeeTarget && targetDistance > 170) {
        const side = Math.sign(angleDifference(angleTo(bot, target), moveAngle)) || pick([-1, 1]);
        moveAngle = angleTo(bot, target) + side * rand(0.65, 1.1);
      }

      if (targetDistance < attackDistance && canSeeTarget) {
        tryShoot(bot, bot.aim);
      }

      maybeBotBuild(bot, target, targetDistance, canSeeTarget, defensiveTarget);
    } else {
      bot.aim = moveAngle;
    }

    if (isNightMode() && !target && bot.unstuckTimer <= 0) {
      bot.scanAngle += bot.scanTurn * NIGHT_BOT_SEARCH_SWEEP * dt;
      if (Math.random() < 0.006) bot.scanTurn *= -1;
      bot.aim = moveAngle + Math.sin(bot.scanAngle) * 1.15;
    }

    if (!weapon.melee && bot.reload <= 0 && bot.mag <= Math.ceil(getWeaponMag(bot.weaponKey, bot.weaponRarity) * 0.28)) {
      startReload(bot);
    }

    if (!target && findPickupUnderFighter(bot)) {
      speed = 0;
      bot.path = [];
    }

    if (bot.unstuckTimer <= 0) {
      moveAngle = followBotPath(bot, pathDestination, moveAngle, dt);
    }
    moveAngle = steerAroundObstacles(bot, moveAngle);

    maybeBotDash(bot, moveAngle, pathDestination, target, weapon);
    if (bot.dashTime > 0) {
      speed = DASH_SPEED * 0.94;
      moveAngle = Math.atan2(bot.dashY, bot.dashX);
      spawnParticle(bot.x - bot.dashX * 14, bot.y - bot.dashY * 14, "#ffdf7e", 0.2, 14);
    }

    moveFighter(bot, Math.cos(moveAngle) * speed * dt, Math.sin(moveAngle) * speed * dt);
    updateBotGoalProgress(bot, pathDestination, target, dt);
    updateBotStuck(bot, beforeX, beforeY, moveAngle, dt);
    updatePickupHold(bot, dt);
    applyStormDamage(bot, dt);
  }
}

function maybeBotDash(bot, moveAngle, destination, target, weapon) {
  if (bot.dashCooldown > 0 || bot.dashTime > 0 || bot.pickupHold) return;
  if (findPickupUnderFighter(bot)) return;

  const bulletThreat = incomingBulletThreatInfo(bot);
  if (bulletThreat && Math.random() < 0.5) {
    const bulletAngle = Math.atan2(bulletThreat.bullet.vy, bulletThreat.bullet.vx);
    const preferredSide = Math.sign(angleDifference(moveAngle, bulletAngle)) || pick([-1, 1]);
    const dodgeAngles = [
      bulletAngle + preferredSide * Math.PI / 2,
      bulletAngle - preferredSide * Math.PI / 2,
      angleTo(bulletThreat.bullet, bot),
    ];
    const dodgeAngle = dodgeAngles.find((angle) => pathIsClear(bot, angle, 145));
    if (Number.isFinite(dodgeAngle)) startDash(bot, Math.cos(dodgeAngle), Math.sin(dodgeAngle));
    return;
  }

  const destinationDistance = distance(bot, destination);
  const outsideZone = !insideZone(bot);
  const wantsTravelDash = !target && destinationDistance > BOT_TRAVEL_DASH_DISTANCE && (outsideZone || Math.random() < 0.45);
  if (wantsTravelDash && pathIsClear(bot, moveAngle, 155)) {
    startDash(bot, Math.cos(moveAngle), Math.sin(moveAngle));
    return;
  }

  if (!target || weapon.melee) return;

  const targetDistance = distance(bot, target);
  if (targetDistance < 170 && Math.random() < 0.55) {
    const awayAngle = angleTo(target, bot) + rand(-0.35, 0.35);
    if (pathIsClear(bot, awayAngle, 145)) startDash(bot, Math.cos(awayAngle), Math.sin(awayAngle));
  } else if (targetDistance > 500 && targetDistance < 820 && Math.random() < 0.25 && pathIsClear(bot, moveAngle, 155)) {
    startDash(bot, Math.cos(moveAngle), Math.sin(moveAngle));
  }
}

function setBotGoal(bot, goalId, destination) {
  if (!goalId) return;
  if (bot.goalId === goalId) return;
  bot.goalId = goalId;
  bot.goalLastDistance = destination ? distance(bot, destination) : Infinity;
  bot.goalStallTimer = 0;
}

function ignoreCurrentBotGoal(bot) {
  if (bot.goalId && !bot.goalId.startsWith("target:") && !bot.goalId.startsWith("fight:") && bot.goalId !== "zone") {
    bot.ignoredGoalId = bot.goalId;
    bot.ignoredGoalTimer = BOT_IGNORED_GOAL_TIME;
  }
  bot.goalId = null;
  bot.goalLastDistance = Infinity;
  bot.goalStallTimer = 0;
  bot.path = [];
  bot.pathTimer = 0;
  bot.aiTimer = 0;
}

function updateBotGoalProgress(bot, destination, target, dt) {
  if (!bot.goalId || target || bot.pickupHold || findPickupUnderFighter(bot)) return;
  const currentDistance = distance(bot, destination);
  if (currentDistance < 70) {
    bot.goalStallTimer = 0;
    bot.goalLastDistance = currentDistance;
    return;
  }

  if (currentDistance < bot.goalLastDistance - 18) {
    bot.goalStallTimer = 0;
    bot.goalLastDistance = currentDistance;
    return;
  }

  bot.goalStallTimer += dt;
  if (bot.goalStallTimer > BOT_GOAL_STALL_TIME) {
    ignoreCurrentBotGoal(bot);
    forceBotUnstuck(bot, angleTo(destination, bot));
  }
}

function botIgnoresGoal(bot, kind, id) {
  return bot.ignoredGoalTimer > 0 && bot.ignoredGoalId === `${kind}:${id}`;
}

function bestBuildMaterial(fighter) {
  if (!fighter.materials) return null;
  return [...MATERIAL_ORDER]
    .filter((material) => (fighter.materials[material] ?? 0) >= BUILD_COST)
    .sort((a, b) => MATERIALS[b].health - MATERIALS[a].health)[0] || null;
}

function firstAffordableBuildMaterial(fighter) {
  if (!fighter.materials) return null;
  return MATERIAL_ORDER.find((material) => (fighter.materials[material] ?? 0) >= BUILD_COST) || null;
}

function maybeBotBuild(bot, target, targetDistance, canSeeTarget, defensiveTarget) {
  if (bot.buildCooldown > 0 || !target) return;
  if (targetDistance < 105 || targetDistance > 920) return;
  const material = bestBuildMaterial(bot);
  if (!material) return;

  const recentlyHit = defensiveTarget === target && bot.buildPanicTimer > 0;
  const bulletThreat = incomingBulletThreat(bot, target);
  if (!recentlyHit && !bulletThreat) return;
  if (!canSeeTarget && !bulletThreat) return;

  bot.selectedMaterial = material;
  bot.aim = angleTo(bot, target);
  if (tryBuildWall(bot, { quiet: true, preferStrongest: true })) {
    bot.buildCooldown = rand(3.4, 6.8);
    bot.path = [];
    bot.aiTimer = Math.min(bot.aiTimer, 0.2);
  } else {
    bot.buildCooldown = rand(0.8, 1.6);
  }
}

function incomingBulletThreat(bot, attacker) {
  return Boolean(incomingBulletThreatInfo(bot, attacker));
}

function incomingBulletThreatInfo(bot, attacker = null) {
  for (const bullet of game.bullets) {
    if (bullet.owner === bot || bullet.life <= 0) continue;
    if (attacker && bullet.owner !== attacker) continue;
    const dx = bot.x - bullet.x;
    const dy = bot.y - bullet.y;
    const speedSq = bullet.vx * bullet.vx + bullet.vy * bullet.vy;
    if (speedSq <= 0.0001) continue;
    const closing = dx * bullet.vx + dy * bullet.vy;
    if (closing <= 0) continue;
    const timeToClosest = closing / speedSq;
    if (timeToClosest > 0.55) continue;
    const closestX = bullet.x + bullet.vx * timeToClosest;
    const closestY = bullet.y + bullet.vy * timeToClosest;
    if (Math.hypot(bot.x - closestX, bot.y - closestY) <= bot.radius + 42) {
      return { bullet, closestX, closestY, timeToClosest };
    }
  }
  return null;
}

function pathIsClear(fighter, angle, distanceToCheck = 96) {
  const steps = 4;
  for (let i = 1; i <= steps; i += 1) {
    const d = (distanceToCheck / steps) * i;
    const x = fighter.x + Math.cos(angle) * d;
    const y = fighter.y + Math.sin(angle) * d;

    if (
      x < fighter.radius + 12 ||
      y < fighter.radius + 12 ||
      x > WORLD.width - fighter.radius - 12 ||
      y > WORLD.height - fighter.radius - 12 ||
      circleHitsObstacles(x, y, fighter.radius + 5, game.obstacles) ||
      circleHitsMapFeatures(x, y, fighter.radius + 5)
    ) {
      return false;
    }
  }

  return true;
}

function steerAroundObstacles(fighter, desiredAngle) {
  if (pathIsClear(fighter, desiredAngle)) return desiredAngle;

  const probes = [0.38, -0.38, 0.76, -0.76, 1.18, -1.18, 1.58, -1.58, Math.PI];
  for (const offset of probes) {
    const angle = desiredAngle + offset;
    if (pathIsClear(fighter, angle)) return angle;
  }

  return desiredAngle + rand(-Math.PI, Math.PI);
}

function updateBotStuck(bot, beforeX, beforeY, moveAngle, dt) {
  if (bot.pickupHold || findPickupUnderFighter(bot)) {
    bot.stuckTimer = 0;
    bot.idleTimer = 0;
    bot.lastX = bot.x;
    bot.lastY = bot.y;
    return;
  }
  const moved = Math.hypot(bot.x - beforeX, bot.y - beforeY);
  const wantedMove = Math.hypot(Math.cos(moveAngle), Math.sin(moveAngle)) > 0.1;

  if (moved < 0.45) {
    bot.idleTimer += dt;
  } else {
    bot.idleTimer = Math.max(0, bot.idleTimer - dt * 2);
  }

  if (wantedMove && moved < bot.speed * dt * 0.18) {
    bot.stuckTimer += dt;
  } else {
    bot.stuckTimer = Math.max(0, bot.stuckTimer - dt * 2.5);
  }

  if (bot.stuckTimer > 0.45 || bot.idleTimer > 1.35) {
    bot.stuckTimer = 0;
    bot.idleTimer = 0;
    ignoreCurrentBotGoal(bot);
    forceBotUnstuck(bot, moveAngle);
  }

  bot.lastX = bot.x;
  bot.lastY = bot.y;
}

function forceBotUnstuck(bot, moveAngle) {
  bot.unstuckTimer = rand(0.9, 1.35);
  const baseAngle = Number.isFinite(moveAngle) ? moveAngle : rand(0, TAU);
  const probes = [1.35, -1.35, 2.15, -2.15, Math.PI, 0.65, -0.65, 0];
  let chosen = baseAngle + rand(-Math.PI, Math.PI);

  for (const offset of probes) {
    const angle = baseAngle + offset;
    if (pathIsClear(bot, angle, 130)) {
      chosen = angle;
      break;
    }
  }

  bot.unstuckAngle = chosen;
  bot.path = [];
  bot.pathTimer = 0;
  bot.aiTimer = 0;
  bot.wanderX = clamp(bot.x + Math.cos(chosen) * rand(260, 430), 60, WORLD.width - 60);
  bot.wanderY = clamp(bot.y + Math.sin(chosen) * rand(260, 430), 60, WORLD.height - 60);
}

function findNearestOpponent(fighter, range) {
  let best = null;
  let bestDistance = range;
  const fighters = aliveFighters();
  for (const other of fighters) {
    if (other === fighter || !other.alive) continue;
    if (isHiddenFrom(fighter, other)) continue;
    if (!canSeeByLight(fighter, other)) continue;
    const d = distance(fighter, other);
    if (d < bestDistance) {
      best = other;
      bestDistance = d;
    }
  }
  return best;
}

function nearestPickup(fighter, range) {
  let best = null;
  let bestDistance = range;
  for (const pickup of game.pickups) {
    if (!canPickup(fighter, pickup)) continue;
    const d = distance(fighter, pickup);
    if (d < bestDistance) {
      best = pickup;
      bestDistance = d;
    }
  }
  return best;
}

function nearestPriorityPickup(bot, range) {
  let best = null;
  let bestScore = -Infinity;
  for (const pickup of game.pickups) {
    if (!canPickup(bot, pickup)) continue;
    if (botIgnoresGoal(bot, "pickup", pickup.id)) continue;
    if (!canSeeByLight(bot, pickup, { range: NIGHT_VIEW_RANGE, requireLineOfSight: true })) continue;
    const d = distance(bot, pickup);
    if (d > range) continue;
    const score = pickupPriorityForBot(bot, pickup) - d * 0.018;
    if (score > bestScore) {
      best = pickup;
      bestScore = score;
    }
  }
  return best;
}

function rarityScore(rarity) {
  return Object.keys(RARITIES).indexOf(rarity || "common");
}

function weaponScore(type, rarity = "common") {
  if (!type || type === "pickaxe") return 0;
  return getWeaponDamage(type, rarity) + getWeaponMag(type, rarity) * 0.8 + rarityScore(rarity) * 18;
}

function botCombatReady(bot) {
  return bot.weaponKey !== "pickaxe" && bot.shield >= 28;
}

function canPickup(fighter, pickup) {
  if (!pickup || pickup.taken) return false;
  if (fighter.isPlayer) {
    if (game.mode !== "extraction") return true;
    if (pickup.kind === "ammo" || pickup.kind === "material") return true;
    if (pickup.kind === "backpack") {
      return backpackIsBetter(fighter, pickup.type) || fighter.extractionBag.length < fighter.backpack.capacity;
    }
    if (pickup.kind === "weapon" || pickup.kind === "consumable") {
      return firstEmptyHotbarSlot(fighter) !== -1 || fighter.extractionBag.length < fighter.backpack.capacity;
    }
    return fighter.extractionBag.length < fighter.backpack.capacity;
  }

  if (pickup.kind === "ammo") return false;
  if (pickup.kind === "material") return materialTotal(fighter) < 90;
  if (pickup.kind === "valuable") return fighter.extractionBag.length < fighter.backpack.capacity;
  if (pickup.kind === "backpack") return BACKPACKS[pickup.type].capacity > fighter.backpack.capacity;
  if (pickup.kind === "armor") return !fighter.armor[ARMORS[pickup.type].slot] || rarityScore(ARMORS[pickup.type].rarity) > rarityScore(fighter.armor[ARMORS[pickup.type].slot].rarity);
  if (pickup.kind === "consumable" && pickup.type === "medkit") return fighter.health < fighter.maxHealth - 18;
  if (pickup.kind === "consumable" && pickup.type === "shield") return fighter.shield < fighter.maxShield - 8;
  if (pickup.kind === "weapon" && pickup.type !== "pickaxe") {
    return weaponScore(pickup.type, pickup.rarity) > weaponScore(fighter.weaponKey, fighter.weaponRarity) + 4;
  }

  return false;
}

function pickupPriorityForBot(bot, pickup) {
  if (pickup.kind === "weapon") {
    if (bot.weaponKey === "pickaxe") return 420 + weaponScore(pickup.type, pickup.rarity);
    return 140 + weaponScore(pickup.type, pickup.rarity) - weaponScore(bot.weaponKey, bot.weaponRarity);
  }

  if (pickup.kind === "consumable" && pickup.type === "shield") {
    return bot.shield < 28 ? 360 : 160;
  }

  if (pickup.kind === "consumable" && pickup.type === "medkit") {
    return bot.health < 55 ? 330 : 90;
  }

  if (pickup.kind === "material") {
    return materialTotal(bot) < 30 ? 310 : 110;
  }

  return 0;
}

function nearestChest(fighter, range) {
  let best = null;
  let bestDistance = range;
  for (const chest of game.chests) {
    if (chest.opened) continue;
    if (botIgnoresGoal(fighter, "chest", chest.id)) continue;
    if (!fighter.isPlayer && !canSeeByLight(fighter, chest, { range: NIGHT_VIEW_RANGE, requireLineOfSight: true })) continue;
    const d = distance(fighter, chest);
    if (d < bestDistance) {
      best = chest;
      bestDistance = d;
    }
  }
  return best;
}

function buildNavGrid() {
  const cols = Math.ceil(WORLD.width / GRID_SIZE);
  const rows = Math.ceil(WORLD.height / GRID_SIZE);
  const blocked = new Array(cols * rows).fill(false);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const wx = x * GRID_SIZE + GRID_SIZE / 2;
      const wy = y * GRID_SIZE + GRID_SIZE / 2;
      blocked[y * cols + x] = circleHitsObstacles(wx, wy, PLAYER_RADIUS + 8, game.obstacles)
        || circleHitsMapFeatures(wx, wy, PLAYER_RADIUS + 8);
    }
  }

  game.navGrid = { cols, rows, blocked };
}

function navCell(point) {
  return {
    x: clamp(Math.floor(point.x / GRID_SIZE), 0, game.navGrid.cols - 1),
    y: clamp(Math.floor(point.y / GRID_SIZE), 0, game.navGrid.rows - 1),
  };
}

function navIndex(x, y) {
  return y * game.navGrid.cols + x;
}

function cellCenter(cell) {
  return {
    x: cell.x * GRID_SIZE + GRID_SIZE / 2,
    y: cell.y * GRID_SIZE + GRID_SIZE / 2,
  };
}

function buildObstacleGrid(obstacles) {
  const cols = Math.ceil(WORLD.width / OBSTACLE_GRID_SIZE);
  const rows = Math.ceil(WORLD.height / OBSTACLE_GRID_SIZE);
  const cells = new Array(cols * rows).fill(null).map(() => []);
  const grid = { cols, rows, cells };
  for (const obstacle of obstacles) addObstacleToGrid(obstacle, grid);
  return grid;
}

function obstacleBounds(obstacle) {
  if (obstacle.shape === "circle") {
    return {
      x: obstacle.x - obstacle.radius,
      y: obstacle.y - obstacle.radius,
      w: obstacle.radius * 2,
      h: obstacle.radius * 2,
    };
  }
  return { x: obstacle.x, y: obstacle.y, w: obstacle.w, h: obstacle.h };
}

function addObstacleToGrid(obstacle, grid = game && game.obstacleGrid) {
  if (!grid) return;
  const bounds = obstacleBounds(obstacle);
  const minX = clamp(Math.floor(bounds.x / OBSTACLE_GRID_SIZE), 0, grid.cols - 1);
  const maxX = clamp(Math.floor((bounds.x + bounds.w) / OBSTACLE_GRID_SIZE), 0, grid.cols - 1);
  const minY = clamp(Math.floor(bounds.y / OBSTACLE_GRID_SIZE), 0, grid.rows - 1);
  const maxY = clamp(Math.floor((bounds.y + bounds.h) / OBSTACLE_GRID_SIZE), 0, grid.rows - 1);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      grid.cells[y * grid.cols + x].push(obstacle);
    }
  }
}

function nearbyObstacles(x, y, radius) {
  if (!game || !game.obstacleGrid) return game ? game.obstacles : [];
  const grid = game.obstacleGrid;
  const minX = clamp(Math.floor((x - radius) / OBSTACLE_GRID_SIZE), 0, grid.cols - 1);
  const maxX = clamp(Math.floor((x + radius) / OBSTACLE_GRID_SIZE), 0, grid.cols - 1);
  const minY = clamp(Math.floor((y - radius) / OBSTACLE_GRID_SIZE), 0, grid.rows - 1);
  const maxY = clamp(Math.floor((y + radius) / OBSTACLE_GRID_SIZE), 0, grid.rows - 1);
  const result = [];
  const seen = new Set();

  for (let cy = minY; cy <= maxY; cy += 1) {
    for (let cx = minX; cx <= maxX; cx += 1) {
      for (const obstacle of grid.cells[cy * grid.cols + cx]) {
        if (seen.has(obstacle)) continue;
        seen.add(obstacle);
        result.push(obstacle);
      }
    }
  }

  return result;
}

function nearbyObstaclesForRect(rect) {
  const x = rect.x + rect.w / 2;
  const y = rect.y + rect.h / 2;
  return nearbyObstacles(x, y, Math.hypot(rect.w, rect.h) / 2 + 90);
}

function findPath(start, goal) {
  if (!game.navGrid) buildNavGrid();
  const startCell = navCell(start);
  const goalCell = navCell(goal);
  const startIndex = navIndex(startCell.x, startCell.y);
  const goalIndex = navIndex(goalCell.x, goalCell.y);
  if (game.navGrid.blocked[startIndex] || game.navGrid.blocked[goalIndex]) return [];

  const open = [{ ...startCell, g: 0, f: Math.hypot(goalCell.x - startCell.x, goalCell.y - startCell.y), parent: -1 }];
  const cameFrom = new Map();
  const best = new Map([[startIndex, 0]]);
  const closed = new Set();
  const dirs = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    const currentIndex = navIndex(current.x, current.y);
    if (closed.has(currentIndex)) continue;
    closed.add(currentIndex);

    if (currentIndex === goalIndex) {
      const path = [];
      let key = currentIndex;
      while (key !== startIndex && cameFrom.has(key)) {
        const x = key % game.navGrid.cols;
        const y = Math.floor(key / game.navGrid.cols);
        path.unshift(cellCenter({ x, y }));
        key = cameFrom.get(key);
      }
      return path.slice(0, 12);
    }

    for (const [dx, dy] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (nx < 0 || ny < 0 || nx >= game.navGrid.cols || ny >= game.navGrid.rows) continue;
      const nextIndex = navIndex(nx, ny);
      if (closed.has(nextIndex) || game.navGrid.blocked[nextIndex]) continue;

      const center = cellCenter({ x: nx, y: ny });
      const waterCost = circleInWater(center.x, center.y, PLAYER_RADIUS + 8) ? 2.4 : 1;
      const stepCost = (dx !== 0 && dy !== 0 ? 1.42 : 1) * waterCost;
      const g = current.g + stepCost;
      if (g >= (best.get(nextIndex) ?? Infinity)) continue;

      best.set(nextIndex, g);
      cameFrom.set(nextIndex, currentIndex);
      const h = Math.hypot(goalCell.x - nx, goalCell.y - ny);
      open.push({ x: nx, y: ny, g, f: g + h, parent: currentIndex });
    }
  }

  return [];
}

function followBotPath(bot, destination, fallbackAngle, dt) {
  bot.pathTimer -= dt;
  const goalMoved = Math.hypot(destination.x - bot.pathGoalX, destination.y - bot.pathGoalY) > 170;
  const destinationDistance = distance(bot, destination);

  if (destinationDistance < 260) {
    bot.path = [];
    bot.pathTimer = Math.max(bot.pathTimer, 0.28);
    return fallbackAngle;
  }

  if (bot.pathTimer <= 0 || goalMoved || !bot.path.length) {
    if (pathIsClear(bot, fallbackAngle, Math.min(180, destinationDistance))) {
      bot.path = [];
      bot.pathTimer = rand(0.45, 0.75);
      return fallbackAngle;
    }
    if ((game.pathRequestsThisFrame ?? 0) >= 5) {
      bot.pathTimer = rand(0.18, 0.36);
      return fallbackAngle;
    }
    game.pathRequestsThisFrame = (game.pathRequestsThisFrame ?? 0) + 1;
    bot.pathTimer = rand(1.1, 1.8);
    bot.pathGoalX = destination.x;
    bot.pathGoalY = destination.y;
    bot.path = findPath(bot, destination);
    if (!bot.path.length && distance(bot, destination) > 150) {
      bot.pathTimer = 0.22;
      bot.stuckTimer += dt * 1.5;
    }
  }

  while (bot.path.length && distance(bot, bot.path[0]) < 38) {
    bot.path.shift();
  }

  if (bot.path.length) {
    return angleTo(bot, bot.path[0]);
  }

  return fallbackAngle;
}

function getStealthZoneAt(x, y) {
  if (!game || !game.mapFeatures) return null;
  for (const zone of game.mapFeatures.stealthZones) {
    if (zone.type === "field") {
      if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) return zone;
    } else if (Math.hypot(x - zone.x, y - zone.y) <= zone.r) {
      return zone;
    }
  }
  return null;
}

function isHiddenFrom(observer, target) {
  const smoke = getSmokeAt(target.x, target.y);
  if (smoke) {
    const observerSmoke = getSmokeAt(observer.x, observer.y);
    const d = distance(observer, target);
    if (observerSmoke === smoke) return d > 70;
    return d > 24;
  }

  const zone = getStealthZoneAt(target.x, target.y);
  if (!zone) return false;
  const observerZone = getStealthZoneAt(observer.x, observer.y);
  const d = distance(observer, target);
  if (observerZone === zone) return d > 220;
  return d > 95;
}

function getSmokeAt(x, y) {
  if (!game || !game.smokeClouds) return null;
  return game.smokeClouds.find((cloud) => Math.hypot(x - cloud.x, y - cloud.y) <= cloud.radius) || null;
}

function moveFighter(fighter, dx, dy) {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
  fighter.x += dx;
  resolveFighterCollision(fighter);
  fighter.y += dy;
  resolveFighterCollision(fighter);
}

function resolveFighterCollision(fighter) {
  fighter.x = clamp(fighter.x, fighter.radius, WORLD.width - fighter.radius);
  fighter.y = clamp(fighter.y, fighter.radius, WORLD.height - fighter.radius);

  for (const obstacle of nearbyObstacles(fighter.x, fighter.y, fighter.radius + 95)) {
    if (obstacle.solid === false) continue;
    if (obstacle.shape === "circle") {
      const dx = fighter.x - obstacle.x;
      const dy = fighter.y - obstacle.y;
      const minDistance = fighter.radius + obstacle.radius;
      const d = Math.hypot(dx, dy);
      if (d < minDistance && d > 0.0001) {
        const push = minDistance - d;
        fighter.x += (dx / d) * push;
        fighter.y += (dy / d) * push;
      }
    } else if (circleRectOverlap(fighter.x, fighter.y, fighter.radius, obstacle)) {
      const nearestX = clamp(fighter.x, obstacle.x, obstacle.x + obstacle.w);
      const nearestY = clamp(fighter.y, obstacle.y, obstacle.y + obstacle.h);
      let dx = fighter.x - nearestX;
      let dy = fighter.y - nearestY;
      let d = Math.hypot(dx, dy);

      if (d < 0.0001) {
        const left = Math.abs(fighter.x - obstacle.x);
        const right = Math.abs(obstacle.x + obstacle.w - fighter.x);
        const top = Math.abs(fighter.y - obstacle.y);
        const bottom = Math.abs(obstacle.y + obstacle.h - fighter.y);
        const min = Math.min(left, right, top, bottom);
        if (min === left) dx = -1;
        if (min === right) dx = 1;
        if (min === top) dy = -1;
        if (min === bottom) dy = 1;
        d = Math.hypot(dx, dy);
      }

      const push = fighter.radius - d + 0.6;
      fighter.x += (dx / d) * push;
      fighter.y += (dy / d) * push;
    }
  }

  if (circleHitsMapFeatures(fighter.x, fighter.y, fighter.radius)) {
    const away = angleTo({ x: WORLD.width / 2, y: WORLD.height / 2 }, fighter);
    const probes = [away, away + Math.PI / 2, away - Math.PI / 2, away + Math.PI];
    for (const angle of probes) {
      const x = clamp(fighter.x + Math.cos(angle) * 16, fighter.radius, WORLD.width - fighter.radius);
      const y = clamp(fighter.y + Math.sin(angle) * 16, fighter.radius, WORLD.height - fighter.radius);
      if (!circleHitsMapFeatures(x, y, fighter.radius) && !circleHitsObstacles(x, y, fighter.radius, game.obstacles)) {
        fighter.x = x;
        fighter.y = y;
        break;
      }
    }
  }
}

function circleRectOverlap(cx, cy, radius, rect) {
  const nearestX = clamp(cx, rect.x, rect.x + rect.w);
  const nearestY = clamp(cy, rect.y, rect.y + rect.h);
  return Math.hypot(cx - nearestX, cy - nearestY) < radius;
}

function circleHitsObstacles(x, y, radius, obstacles) {
  const candidates = game && obstacles === game.obstacles
    ? nearbyObstacles(x, y, radius + OBSTACLE_GRID_SIZE * 0.55)
    : obstacles;
  return candidates.some((obstacle) => {
    if (obstacle.solid === false) return false;
    if (obstacle.shape === "circle") {
      return Math.hypot(x - obstacle.x, y - obstacle.y) < radius + obstacle.radius;
    }
    return circleRectOverlap(x, y, radius, obstacle);
  });
}

function circleHitsMapFeatures(x, y, radius, features = game && game.mapFeatures) {
  return false;
}

function circleInWater(x, y, radius, features = game && game.mapFeatures) {
  if (!features) return false;
  const inRiver = features.rivers.some((river) => circleRectOverlap(x, y, radius, river));
  if (!inRiver) return false;
  return !features.bridges.some((bridge) => circleRectOverlap(x, y, radius, bridge));
}

function terrainSpeedMultiplier(fighter) {
  return circleInWater(fighter.x, fighter.y, fighter.radius) ? 0.48 : 1;
}

function tryShoot(fighter, baseAngle) {
  if (!fighter.alive || fighter.cooldown > 0 || fighter.reload > 0) return;
  const weapon = getEquippedWeapon(fighter);
  if (!weapon) return;
  const weaponKey = getEquippedWeaponKey(fighter);
  const rarity = getEquippedWeaponRarity(fighter);

  if (weapon.melee) {
    swingMelee(fighter, baseAngle, weapon, rarity);
    return;
  }

  const currentMag = getMagazine(fighter);
  if (currentMag <= 0) {
    startReload(fighter);
    return;
  }

  setMagazine(fighter, currentMag - 1);
  fighter.cooldown = getWeaponCooldown(weaponKey, rarity);

  for (let i = 0; i < weapon.pellets; i += 1) {
    const spread = getWeaponSpread(weaponKey, rarity);
    const angle = baseAngle + rand(-spread, spread);
    const startX = fighter.x + Math.cos(angle) * (fighter.radius + 10);
    const startY = fighter.y + Math.sin(angle) * (fighter.radius + 10);
    game.bullets.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * weapon.bulletSpeed,
      vy: Math.sin(angle) * weapon.bulletSpeed,
      radius: weapon.pellets > 1 ? 3.2 : 4,
      life: weapon.bulletLife,
      damage: getWeaponDamage(weaponKey, rarity),
      owner: fighter,
      color: weapon.color,
    });
  }

  spawnMuzzle(fighter.x + Math.cos(baseAngle) * 26, fighter.y + Math.sin(baseAngle) * 26, weapon.color);
}

function startReload(fighter) {
  if (fighter.reload > 0 || fighter.pendingReload) return;
  const weapon = getEquippedWeapon(fighter);
  if (!weapon || weapon.melee) return;
  if (getMagazine(fighter) >= getWeaponMag(getEquippedWeaponKey(fighter), getEquippedWeaponRarity(fighter))) return;
  if (fighter.isPlayer && getAmmoCount(fighter, weapon.ammoType) <= 0) return;
  fighter.reload = weapon.reload;
  fighter.pendingReload = true;
  spawnParticle(fighter.x, fighter.y - 18, "#dce5e8", 0.35, 24);
}

function swingMelee(fighter, baseAngle, weapon, rarity = "common") {
  fighter.cooldown = getWeaponCooldown(getEquippedWeaponKey(fighter), rarity);
  fighter.swingTimer = 0.22;
  fighter.swingDuration = 0.22;
  let hit = false;

  for (const target of aliveFighters()) {
    if (target === fighter || target.invuln > 0) continue;
    const targetDistance = distance(fighter, target);
    if (targetDistance > weapon.range + target.radius) continue;
    const delta = Math.abs(angleDifference(angleTo(fighter, target), baseAngle));
    if (delta > weapon.arc / 2) continue;
    if (!hasLineOfSight(fighter, target)) continue;

    damageFighter(target, getWeaponDamage(getEquippedWeaponKey(fighter), rarity), fighter);
    spawnHit(
      target.x - Math.cos(baseAngle) * target.radius * 0.4,
      target.y - Math.sin(baseAngle) * target.radius * 0.4,
      weapon.color,
      11,
    );
    hit = true;
  }

  if (getEquippedWeaponKey(fighter) === "pickaxe") {
    hit = hitHarvestableObstacle(fighter, baseAngle, weapon) || hit;
  }

  const fx = fighter.x + Math.cos(baseAngle) * weapon.range * 0.55;
  const fy = fighter.y + Math.sin(baseAngle) * weapon.range * 0.55;
  spawnHit(fx, fy, hit ? "#f4cf67" : weapon.color, hit ? 5 : 3);
}

function obstacleCenter(obstacle) {
  return obstacle.shape === "circle"
    ? { x: obstacle.x, y: obstacle.y }
    : { x: obstacle.x + obstacle.w / 2, y: obstacle.y + obstacle.h / 2 };
}

function obstacleHitRadius(obstacle) {
  return obstacle.shape === "circle"
    ? obstacle.radius
    : Math.hypot(obstacle.w, obstacle.h) / 2;
}

function hitHarvestableObstacle(fighter, baseAngle, weapon) {
  let target = null;
  let bestDistance = Infinity;

  for (const obstacle of nearbyObstacles(fighter.x, fighter.y, weapon.range + 80)) {
    if (!obstacle.destructible && obstacle.type !== "built_wall") continue;
    if (obstacle.solid === false) continue;
    const center = obstacleCenter(obstacle);
    const targetDistance = distance(fighter, center);
    if (targetDistance > weapon.range + obstacleHitRadius(obstacle)) continue;
    const delta = Math.abs(angleDifference(angleTo(fighter, center), baseAngle));
    if (delta > weapon.arc / 2) continue;
    if (targetDistance < bestDistance) {
      target = obstacle;
      bestDistance = targetDistance;
    }
  }

  if (!target) return false;
  damageObstacle(target, getWeaponDamage("pickaxe"), fighter);
  return true;
}

function damageObstacle(obstacle, amount, source) {
  if (typeof obstacle.health !== "number") return;
  obstacle.health -= amount;
  const center = obstacleCenter(obstacle);
  const material = obstacle.material;

  if (source && source.isPlayer && material && obstacle.materialAmount > 0) {
    const gain = Math.min(obstacle.materialAmount, Math.max(4, Math.ceil((obstacle.maxHealth || 60) / 10)));
    obstacle.materialAmount -= gain;
    changeMaterial(source, material, gain);
    addFeed(`+${gain} ${MATERIALS[material].label.toLowerCase()}`);
  }

  spawnHit(center.x, center.y, material && MATERIALS[material] ? MATERIALS[material].color : "#d6d1ba", 8);

  if (obstacle.health <= 0) {
    if (source && source.isPlayer && material && obstacle.materialAmount > 0) {
      changeMaterial(source, material, obstacle.materialAmount);
      addFeed(`+${obstacle.materialAmount} ${MATERIALS[material].label.toLowerCase()}`);
    }
    game.obstacles = game.obstacles.filter((item) => item !== obstacle);
    game.obstacleGrid = buildObstacleGrid(game.obstacles);
    game.navGrid = null;
    spawnHit(center.x, center.y, material && MATERIALS[material] ? MATERIALS[material].color : "#f4cf67", 16);
  }
}

function updateBullets(dt) {
  for (const bullet of game.bullets) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;

    if (
      bullet.x < -40 ||
      bullet.y < -40 ||
      bullet.x > WORLD.width + 40 ||
      bullet.y > WORLD.height + 40 ||
      bulletHitsObstacle(bullet)
    ) {
      bullet.life = -1;
      spawnHit(bullet.x, bullet.y, "#d6d1ba", 4);
      continue;
    }

    for (const fighter of aliveFighters()) {
      if (fighter === bullet.owner || fighter.invuln > 0) continue;
      if (Math.hypot(fighter.x - bullet.x, fighter.y - bullet.y) < fighter.radius + bullet.radius) {
        bullet.life = -1;
        damageFighter(fighter, bullet.damage, bullet.owner);
        spawnHit(bullet.x, bullet.y, bullet.color, 9);
        break;
      }
    }
  }

  game.bullets = game.bullets.filter((bullet) => bullet.life > 0);
}

function bulletHitsObstacle(bullet) {
  return game.obstacles.some((obstacle) => {
    if (obstacle.solid === false) return false;
    if (obstacle.shape === "circle") {
      const hit = Math.hypot(bullet.x - obstacle.x, bullet.y - obstacle.y) < obstacle.radius + bullet.radius;
      if (hit && obstacle.type === "built_wall") damageObstacle(obstacle, bullet.damage * 0.55, bullet.owner);
      return hit;
    }
    const hit = circleRectOverlap(bullet.x, bullet.y, bullet.radius, obstacle);
    if (hit && obstacle.type === "built_wall") damageObstacle(obstacle, bullet.damage * 0.55, bullet.owner);
    return hit;
  });
}

function damageFighter(fighter, amount, source) {
  if (!fighter.alive) return;
  if (source && source !== fighter && source.alive) {
    fighter.lastAttacker = source;
    fighter.aggroTimer = 6;
    fighter.buildPanicTimer = 2.4;
  }

  let remaining = applyArmorMitigation(fighter, amount);
  if (remaining <= 0) {
    spawnHit(fighter.x, fighter.y, "#f4cf67", 8);
    return;
  }
  if (fighter.shield > 0) {
    const absorbed = Math.min(fighter.shield, remaining);
    fighter.shield -= absorbed;
    remaining -= absorbed;
  }
  fighter.health -= remaining;

  if (fighter.health <= 0) {
    eliminateFighter(fighter, source);
  }
}

function applyArmorMitigation(fighter, amount) {
  const pieces = fighter.armor ? Object.values(fighter.armor).filter(Boolean) : [];
  if (!pieces.length) return amount;
  const ricochet = pieces.reduce((sum, armor) => sum + (armor.ricochet || 0), 0);
  if (Math.random() < ricochet) return 0;
  const reduction = clamp(pieces.reduce((sum, armor) => sum + (armor.reduction || 0), 0), 0, 0.55);
  return amount * (1 - reduction);
}

function damageByStorm(fighter, amount) {
  if (!fighter.alive) return;
  fighter.health -= amount;
  if (fighter.health <= 0) {
    eliminateFighter(fighter, null, true);
  }
}

function eliminateFighter(fighter, source, storm = false) {
  if (!fighter.alive) return;
  fighter.alive = false;
  fighter.health = 0;
  fighter.shield = 0;
  game.placement = aliveFighters().length + 1;

  for (let i = 0; i < 16; i += 1) {
    spawnParticle(fighter.x + rand(-10, 10), fighter.y + rand(-10, 10), fighter.color, rand(0.35, 0.7), rand(18, 44));
  }

  dropLoot(fighter);

  if (source && source.alive) {
    source.kills += 1;
    addFeed(`${source.name} a elimine ${fighter.name}`);
  } else if (storm) {
    addFeed(`${fighter.name} a ete pris par la zone`);
  }

  if (fighter.isPlayer) {
    endGame(false);
  }
}

function dropLoot(fighter) {
  const drops = [];

  if (fighter.isPlayer) {
    for (const item of fighter.hotbar) {
      if (item && item.kind === "weapon" && item.type !== "pickaxe") drops.push(item);
      if (item && item.kind === "consumable") drops.push(item);
    }
  } else if (fighter.weaponKey !== "pickaxe") {
    drops.push(makeWeaponItem(fighter.weaponKey, fighter.mag, fighter.weaponRarity));
  }

  if (Math.random() < 0.5) drops.push({ kind: "ammo", type: randomAmmoPickup() });
  if (Math.random() < 0.34) drops.push({ kind: "ammo", type: randomAmmoPickup() });
  if (Math.random() < 0.22) drops.push({ kind: "ammo", type: randomAmmoPickup() });
  if (Math.random() < 0.36) drops.push("shield");
  if (Math.random() < 0.2) drops.push("medkit");
  if (Math.random() < 0.18) drops.push("smoke_grenade");

  for (const drop of drops) {
    const angle = rand(0, TAU);
    const distanceFromBody = rand(26, 56);
    const x = clamp(fighter.x + Math.cos(angle) * distanceFromBody, 30, WORLD.width - 30);
    const y = clamp(fighter.y + Math.sin(angle) * distanceFromBody, 30, WORLD.height - 30);

    if (typeof drop === "string") {
      game.pickups.push(makePickup(drop, x, y));
    } else if (drop.kind === "weapon") {
      game.pickups.push(makePickup(drop.type, x, y, { mag: drop.mag, rarity: drop.rarity }));
    } else {
      game.pickups.push(makePickup(drop.type, x, y));
    }
  }
}

function collectPickups(fighter) {
  for (const pickup of game.pickups) {
    if (pickup.taken || distance(fighter, pickup) > fighter.radius + pickup.radius + 9) continue;
    if (pickup.kind === "consumable" && pickup.type === "medkit") {
      if (fighter.health >= fighter.maxHealth) continue;
      fighter.health = Math.min(fighter.maxHealth, fighter.health + CONSUMABLES.medkit.amount);
    } else if (pickup.kind === "consumable" && pickup.type === "shield") {
      if (fighter.shield >= fighter.maxShield) continue;
      fighter.shield = Math.min(fighter.maxShield, fighter.shield + CONSUMABLES.shield.amount);
    } else if (pickup.kind === "ammo") {
      changeAmmo(fighter, ammoTypeFromPickup(pickup.type), pickup.amount);
    } else if (pickup.kind === "material") {
      changeMaterial(fighter, pickup.type, pickup.amount);
    } else if (pickup.kind === "weapon" && pickup.type !== "pickaxe") {
      fighter.weaponKey = pickup.type;
      fighter.weaponRarity = pickup.rarity;
      fighter.mag = pickup.mag ?? getWeaponMag(pickup.type, pickup.rarity);
      fighter.cooldown = 0;
      fighter.reload = 0;
      fighter.pendingReload = false;
    }

    pickup.taken = true;
    spawnPickupBurst(pickup);
    if (fighter.isPlayer) addFeed(`Loot: ${pickup.label}`);
  }

  game.pickups = game.pickups.filter((pickup) => !pickup.taken);
}

function updatePickupHold(fighter, dt) {
  const pickup = findPickupUnderFighter(fighter);
  if (!pickup) {
    fighter.pickupHold = null;
    return;
  }
  if (fighter.isPlayer && game.mode === "extraction" && !keys.has("KeyE")) {
    fighter.pickupHold = null;
    return;
  }

  const duration = pickupTime(pickup);
  if (!fighter.pickupHold || fighter.pickupHold.id !== pickup.id) {
    fighter.pickupHold = { id: pickup.id, progress: 0, duration };
  }

  fighter.pickupHold.duration = duration;
  fighter.pickupHold.progress = Math.min(duration, fighter.pickupHold.progress + dt);

  if (fighter.pickupHold.progress >= duration) {
    if (fighter.isPlayer) {
      finishPlayerPickup(fighter, pickup);
    } else {
      finishBotPickup(fighter, pickup);
    }
    fighter.pickupHold = null;
  }
}

function findPickupUnderFighter(fighter) {
  let best = null;
  let bestDistance = Infinity;
  for (const pickup of game.pickups) {
    if (pickup.taken) continue;
    if (!canPickup(fighter, pickup)) continue;
    if (fighter.isPlayer && !playerCanSeeEntity(pickup, { range: NIGHT_VIEW_RANGE, requireLineOfSight: true })) continue;
    const d = distance(fighter, pickup);
    if (d <= fighter.radius + pickup.radius + 8 && d < bestDistance) {
      best = pickup;
      bestDistance = d;
    }
  }
  return best;
}

function finishPlayerPickup(player, pickup) {
  if (pickup.kind === "ammo") {
    const ammoType = ammoTypeFromPickup(pickup.type);
    changeAmmo(player, ammoType, pickup.amount);
    pickup.taken = true;
    spawnPickupBurst(pickup);
    addFeed(`+${pickup.amount} munitions ${AMMO_TYPES[ammoType].label}`);
    game.pickups = game.pickups.filter((item) => !item.taken);
    return;
  }

  if (pickup.kind === "material") {
    changeMaterial(player, pickup.type, pickup.amount);
    pickup.taken = true;
    spawnPickupBurst(pickup);
    addFeed(`+${pickup.amount} ${MATERIALS[pickup.type].label.toLowerCase()}`);
    game.pickups = game.pickups.filter((item) => !item.taken);
    return;
  }

  if (game.mode === "extraction") {
    finishExtractionPickup(player, pickup);
    return;
  }

  if (pickup.kind === "valuable") {
    if (player.extractionBag.length >= player.backpack.capacity) {
      addFeed("Sac plein");
      return;
    }
    const item = pickupToItem(pickup);
    player.extractionBag.push(item);
    pickup.taken = true;
    spawnPickupBurst(pickup);
    addFeed(`${itemLabel(item)} range dans le sac`);
    game.pickups = game.pickups.filter((item) => !item.taken);
    return;
  }

  if (pickup.kind === "backpack") {
    const oldKey = player.backpackKey;
    player.backpack = { ...BACKPACKS[pickup.type] };
    player.backpackKey = pickup.type;
    pickup.taken = true;
    spawnPickupBurst(pickup);
    addFeed(`${player.backpack.label} equipe (${player.backpack.capacity} slots)`);
    if (oldKey && oldKey !== "default") dropExtractionItem({ kind: "backpack", type: oldKey }, pickup.x, pickup.y);
    game.pickups = game.pickups.filter((item) => !item.taken);
    return;
  }

  if (pickup.kind === "armor") {
    const armor = ARMORS[pickup.type];
    const old = player.armor[armor.slot];
    player.armor[armor.slot] = { ...armor, type: pickup.type };
    pickup.taken = true;
    spawnPickupBurst(pickup);
    addFeed(`${armor.label} equipe`);
    if (old) dropExtractionItem({ kind: "armor", type: old.type }, pickup.x, pickup.y);
    game.pickups = game.pickups.filter((item) => !item.taken);
    return;
  }

  const newItem = pickupToItem(pickup);
  if (!newItem) return;

  const emptySlot = firstEmptyHotbarSlot(player);
  const activeItem = player.hotbar[player.activeSlot];
  const canBagExtra = game.mode === "extraction"
    && emptySlot === -1
    && activeItem
    && activeItem.type === "pickaxe"
    && ["weapon", "consumable"].includes(pickup.kind);

  if (canBagExtra) {
    if (player.extractionBag.length >= player.backpack.capacity) {
      addFeed("Sac plein");
      return;
    }
    player.extractionBag.push(newItem);
    pickup.taken = true;
    spawnPickupBurst(pickup);
    addFeed(`${itemLabel(newItem)} range dans le sac`);
    game.pickups = game.pickups.filter((item) => !item.taken);
    return;
  }

  const targetSlot = emptySlot === -1 ? player.activeSlot : emptySlot;
  const oldItem = player.hotbar[targetSlot];
  player.hotbar[targetSlot] = newItem;
  pickup.taken = true;
  spawnPickupBurst(pickup);
  addFeed(oldItem
    ? `${itemLabel(newItem)} equipe, ${itemLabel(oldItem)} depose`
    : `${itemLabel(newItem)} ajoute au slot ${targetSlot + 1}`);

  if (oldItem) {
    dropItemFromSlot(oldItem, pickup.x, pickup.y);
  }

  if (targetSlot === player.activeSlot) {
    player.reload = 0;
    player.pendingReload = false;
    syncEquippedFromHotbar(player);
  }
  game.pickups = game.pickups.filter((item) => !item.taken);
}

function finishExtractionPickup(player, pickup) {
  const item = pickupToItem(pickup);
  if (!item) return;

  if (pickup.kind === "backpack" && backpackIsBetter(player, pickup.type)) {
    const oldKey = player.backpackKey;
    player.backpack = { ...BACKPACKS[pickup.type] };
    player.backpackKey = pickup.type;
    pickup.taken = true;
    spawnPickupBurst(pickup);
    addFeed(`${player.backpack.label} equipe`);
    if (oldKey && oldKey !== "default") dropExtractionItem({ kind: "backpack", type: oldKey }, pickup.x, pickup.y);
    game.pickups = game.pickups.filter((drop) => !drop.taken);
    renderBagPanel();
    return;
  }

  if (pickup.kind === "weapon" || pickup.kind === "consumable") {
    const emptySlot = firstEmptyHotbarSlot(player);
    if (emptySlot !== -1) {
      player.hotbar[emptySlot] = item;
      pickup.taken = true;
      spawnPickupBurst(pickup);
      addFeed(`${itemLabel(item)} ajoute au slot ${emptySlot + 1}`);
      if (emptySlot === player.activeSlot) {
        player.reload = 0;
        player.pendingReload = false;
        syncEquippedFromHotbar(player);
      }
      game.hotbarSignature = "";
      game.pickups = game.pickups.filter((drop) => !drop.taken);
      renderHotbar();
      return;
    }
  }

  if (!addItemToBag(player, item)) return;
  pickup.taken = true;
  spawnPickupBurst(pickup);
  addFeed(`${itemLabel(item)} range dans le sac`);
  game.pickups = game.pickups.filter((drop) => !drop.taken);
  renderBagPanel();
}

function finishBotPickup(bot, pickup) {
  if (!canPickup(bot, pickup)) return;
  if (pickup.kind === "consumable" && pickup.type === "medkit") {
    if (bot.health >= bot.maxHealth) return;
    bot.health = Math.min(bot.maxHealth, bot.health + CONSUMABLES.medkit.amount);
  } else if (pickup.kind === "consumable" && pickup.type === "shield") {
    if (bot.shield >= bot.maxShield) return;
    bot.shield = Math.min(bot.maxShield, bot.shield + CONSUMABLES.shield.amount);
  } else if (pickup.kind === "ammo") {
    changeAmmo(bot, ammoTypeFromPickup(pickup.type), pickup.amount);
  } else if (pickup.kind === "material") {
    changeMaterial(bot, pickup.type, pickup.amount);
  } else if (pickup.kind === "backpack") {
    bot.backpack = { ...BACKPACKS[pickup.type] };
    bot.backpackKey = pickup.type;
  } else if (pickup.kind === "armor") {
    const armor = ARMORS[pickup.type];
    bot.armor[armor.slot] = { ...armor, type: pickup.type };
  } else if (pickup.kind === "valuable") {
    if (bot.extractionBag.length >= bot.backpack.capacity) return;
    bot.extractionBag.push(pickupToItem(pickup));
  } else if (pickup.kind === "weapon" && pickup.type !== "pickaxe") {
    bot.weaponKey = pickup.type;
    bot.weaponRarity = pickup.rarity;
    bot.mag = pickup.mag ?? getWeaponMag(pickup.type, pickup.rarity);
    bot.cooldown = 0;
    bot.reload = 0;
    bot.pendingReload = false;
  }

  pickup.taken = true;
  spawnPickupBurst(pickup);
  game.pickups = game.pickups.filter((item) => !item.taken);
}

function addItemToBag(player, item) {
  if (!item) return false;
  if (player.extractionBag.length >= player.backpack.capacity) {
    addFeed("Sac plein");
    return false;
  }
  player.extractionBag.push(item);
  return true;
}

function equipBagItem(player, item, options = {}) {
  if (!item) return false;
  if (item.kind === "weapon" || item.kind === "consumable") {
    const emptySlot = firstEmptyHotbarSlot(player);
    const slot = emptySlot === -1 ? player.activeSlot : emptySlot;
    const oldItem = player.hotbar[slot];
    if (oldItem && oldItem.kind === "weapon" && oldItem.type === "pickaxe") {
      if (!options.silent) addFeed("Selectionne un slot a remplacer");
      return false;
    }
    if (oldItem && !addItemToBag(player, oldItem)) return false;
    player.hotbar[slot] = item;
    if (!options.silent) {
      addFeed(oldItem
        ? `${itemLabel(item)} equipe, ${itemLabel(oldItem)} dans le sac`
        : `${itemLabel(item)} equipe slot ${slot + 1}`);
    }
    syncEquippedFromHotbar(player);
    return true;
  }

  if (item.kind === "backpack") {
    const oldKey = player.backpackKey;
    const nextBackpack = BACKPACKS[item.type];
    if (!nextBackpack) return false;
    player.backpack = { ...nextBackpack };
    player.backpackKey = item.type;
    if (oldKey && oldKey !== "default" && !options.fromLoadout) {
      addItemToBag(player, { kind: "backpack", type: oldKey });
    }
    if (!options.silent) addFeed(`${nextBackpack.label} equipe`);
    return true;
  }

  if (item.kind === "armor") {
    const armor = ARMORS[item.type];
    if (!armor) return false;
    const old = player.armor[armor.slot];
    player.armor[armor.slot] = { ...armor, type: item.type };
    if (old && !options.fromLoadout) addItemToBag(player, { kind: "armor", type: old.type });
    if (!options.silent) addFeed(`${armor.label} equipe`);
    return true;
  }

  if (!options.silent) addFeed("Objet stocke, pas equipable");
  return false;
}

function backpackIsBetter(fighter, backpackType) {
  const next = BACKPACKS[backpackType];
  if (!next) return false;
  return rarityScore(next.rarity) > rarityScore(fighter.backpack.rarity);
}

function lockerItemToGameItem(item) {
  if (!item) return null;
  if (item.kind === "weapon") return makeWeaponItem(item.type, item.mag, item.rarity || "common");
  if (item.kind === "consumable") return makeConsumableItem(item.type);
  if (item.kind === "backpack") return { kind: "backpack", type: item.type };
  if (item.kind === "armor") return { kind: "armor", type: item.type };
  if (item.kind === "valuable") return { kind: "valuable", type: item.type };
  return null;
}

function dropItemFromSlot(item, x, y) {
  const angle = rand(0, TAU);
  const dropX = clamp(x + Math.cos(angle) * 34, 28, WORLD.width - 28);
  const dropY = clamp(y + Math.sin(angle) * 34, 28, WORLD.height - 28);

  if (item.kind === "weapon") {
    game.pickups.push(makePickup(item.type, dropX, dropY, { mag: item.mag, rarity: item.rarity }));
  } else if (item.kind === "consumable") {
    game.pickups.push(makePickup(item.type, dropX, dropY));
  }
}

function dropExtractionItem(item, x, y) {
  const angle = rand(0, TAU);
  const dropX = clamp(x + Math.cos(angle) * 38, 28, WORLD.width - 28);
  const dropY = clamp(y + Math.sin(angle) * 38, 28, WORLD.height - 28);
  if (item.kind === "weapon") {
    game.pickups.push(makePickup(item.type, dropX, dropY, { mag: item.mag, rarity: item.rarity }));
  } else {
    game.pickups.push(makePickup(item.type, dropX, dropY));
  }
}

function updateConsumableUse(fighter, dt, actionPressed) {
  if (!actionPressed) {
    fighter.useHold = null;
    return;
  }

  const item = getActiveItem(fighter);
  if (!item || item.kind !== "consumable") return;
  const consumable = CONSUMABLES[item.type];

  if (consumable.throwable) {
    throwSmokeGrenade(fighter);
    fighter.hotbar[fighter.activeSlot] = null;
    fighter.useHold = null;
    addFeed(`${consumable.label} lancee`);
    return;
  }

  if (item.type === "medkit" && fighter.health >= fighter.maxHealth) return;
  if (item.type === "shield" && fighter.shield >= fighter.maxShield) return;

  if (!fighter.useHold || fighter.useHold.slot !== fighter.activeSlot || fighter.useHold.type !== item.type) {
    fighter.useHold = { slot: fighter.activeSlot, type: item.type, progress: 0, duration: consumable.useTime };
  }

  fighter.useHold.progress = Math.min(fighter.useHold.duration, fighter.useHold.progress + dt);

  if (fighter.useHold.progress >= fighter.useHold.duration) {
    if (item.type === "medkit") {
      fighter.health = Math.min(fighter.maxHealth, fighter.health + consumable.amount);
    } else if (item.type === "shield") {
      fighter.shield = Math.min(fighter.maxShield, fighter.shield + consumable.amount);
    }

    fighter.hotbar[fighter.activeSlot] = null;
    fighter.useHold = null;
    addFeed(`${consumable.label} utilise`);
  }
}

function updatePickups(dt) {
  for (const pickup of game.pickups) {
    pickup.pulse += dt * 3.4;
  }
}

function throwSmokeGrenade(fighter) {
  const angle = fighter.aim;
  const targetDistance = 300;
  game.smokeGrenades.push({
    x: fighter.x + Math.cos(angle) * (fighter.radius + 14),
    y: fighter.y + Math.sin(angle) * (fighter.radius + 14),
    vx: Math.cos(angle) * 460,
    vy: Math.sin(angle) * 460,
    targetX: clamp(fighter.x + Math.cos(angle) * targetDistance, 40, WORLD.width - 40),
    targetY: clamp(fighter.y + Math.sin(angle) * targetDistance, 40, WORLD.height - 40),
    life: 0.62,
    pulse: 0,
  });
}

function updateSmoke(dt) {
  for (const grenade of game.smokeGrenades) {
    grenade.x += grenade.vx * dt;
    grenade.y += grenade.vy * dt;
    grenade.vx *= Math.pow(0.12, dt);
    grenade.vy *= Math.pow(0.12, dt);
    grenade.life -= dt;
    grenade.pulse += dt * 10;

    if (grenade.life <= 0 || Math.hypot(grenade.x - grenade.targetX, grenade.y - grenade.targetY) < 28) {
      spawnSmokeCloud(grenade.x, grenade.y);
      grenade.done = true;
    }
  }
  game.smokeGrenades = game.smokeGrenades.filter((grenade) => !grenade.done);

  for (const cloud of game.smokeClouds) {
    cloud.life -= dt;
    cloud.age += dt;
    cloud.radius = Math.min(cloud.maxRadius, cloud.radius + dt * 125);
  }
  game.smokeClouds = game.smokeClouds.filter((cloud) => cloud.life > 0);
}

function spawnSmokeCloud(x, y) {
  game.smokeClouds.push({
    x,
    y,
    radius: 54,
    maxRadius: 230,
    life: 9.5,
    maxLife: 9.5,
    age: 0,
    seed: rand(0, TAU),
  });
  for (let i = 0; i < 18; i += 1) {
    spawnParticle(x + rand(-20, 20), y + rand(-20, 20), "rgba(205, 214, 211, 0.78)", rand(0.45, 0.9), rand(20, 95));
  }
}

function updateParticles(dt) {
  for (const particle of game.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
    particle.age += dt;
  }

  game.particles = game.particles.filter((particle) => particle.life > 0);
  for (const item of game.feed) item.time -= dt;
  game.feed = game.feed.filter((item) => item.time > 0);
}

function spawnParticle(x, y, color, life, speed) {
  const angle = rand(0, TAU);
  game.particles.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    color,
    radius: rand(2, 5),
    life,
    age: 0,
  });
}

function spawnHit(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    spawnParticle(x, y, color, rand(0.16, 0.38), rand(30, 125));
  }
}

function spawnMuzzle(x, y, color) {
  for (let i = 0; i < 5; i += 1) {
    spawnParticle(x + rand(-3, 3), y + rand(-3, 3), color, rand(0.08, 0.18), rand(30, 90));
  }
}

function spawnPickupBurst(pickup) {
  for (let i = 0; i < 9; i += 1) {
    spawnParticle(pickup.x, pickup.y, pickup.color, rand(0.18, 0.34), rand(30, 110));
  }
}

function updateZone(dt) {
  if (game.mode === "extraction") return;
  const zone = game.zone;
  zone.timer -= dt;

  if (zone.mode === "hidden" && zone.timer <= 0) {
    zone.mode = "waiting";
    zone.timer = zone.wait;
    addFeed("La zone est apparue");
    return;
  }

  if (zone.mode === "waiting" && zone.timer <= 0) {
    zone.mode = "shrinking";
    zone.timer = zone.shrink;
    zone.startX = zone.x;
    zone.startY = zone.y;
    zone.startRadius = zone.radius;
    zone.targetRadius = Math.max(230, zone.radius * 0.72);

    const angle = rand(0, TAU);
    const offset = Math.max(0, zone.radius - zone.targetRadius - 80);
    zone.targetX = clampCircleCenter(zone.x + Math.cos(angle) * rand(0, offset), zone.targetRadius, WORLD.width);
    zone.targetY = clampCircleCenter(zone.y + Math.sin(angle) * rand(0, offset), zone.targetRadius, WORLD.height);
  }

  if (zone.mode === "shrinking") {
    const t = 1 - clamp(zone.timer / zone.shrink, 0, 1);
    const eased = t * t * (3 - 2 * t);
    zone.x = zone.startX + (zone.targetX - zone.startX) * eased;
    zone.y = zone.startY + (zone.targetY - zone.startY) * eased;
    zone.radius = zone.startRadius + (zone.targetRadius - zone.startRadius) * eased;

    if (zone.timer <= 0) {
      zone.mode = "waiting";
      zone.timer = Math.max(9, zone.wait - zone.phase * 2);
      zone.phase += 1;
      zone.damage += 1.8;
      addFeed(`Zone ${zone.phase}: deplacement imminent`);
    }
  }
}

function insideZone(fighter) {
  if (game.zone.mode === "hidden") return true;
  return Math.hypot(fighter.x - game.zone.x, fighter.y - game.zone.y) <= game.zone.radius - fighter.radius;
}

function applyStormDamage(fighter, dt) {
  if (game.zone.mode === "hidden") {
    fighter.stormTick = 0;
    return;
  }
  if (insideZone(fighter)) {
    fighter.stormTick = 0;
    return;
  }

  fighter.stormTick += dt;
  if (fighter.stormTick >= 0.42) {
    fighter.stormTick = 0;
    damageByStorm(fighter, game.zone.damage);
    spawnParticle(fighter.x + rand(-14, 14), fighter.y + rand(-14, 14), "#66b2ff", 0.32, 28);
  }
}

function aliveFighters() {
  if (!game) return [];
  return [game.player, ...game.bots].filter((fighter) => fighter.alive);
}

function checkVictory() {
  if (game.mode === "extraction") return;
  const alive = aliveFighters();
  if (game.player.alive && alive.length === 1) {
    endGame(true);
  }
}

function updateExtraction(dt) {
  if (!game || game.mode !== "extraction" || !game.player.alive) return;
  const player = game.player;
  const zone = game.extractionZones.find((item) => Math.hypot(player.x - item.x, player.y - item.y) <= item.radius);
  if (!zone) {
    player.exfilTimer = 0;
    return;
  }
  player.exfilTimer += dt;
  if (player.exfilTimer >= EXTRACTION_EXFIL_TIME) {
    completeExtraction(zone);
  }
}

function completeExtraction(zone) {
  if (!game || game.state !== "playing") return;
  const player = game.player;
  const saved = [
    ...player.hotbar.filter((item) => item && item.type !== "pickaxe"),
    ...player.extractionBag,
  ];
  if (player.backpackKey && player.backpackKey !== "default") saved.push({ kind: "backpack", type: player.backpackKey });
  for (const item of Object.values(player.armor)) {
    if (item) saved.push({ kind: "armor", type: item.type });
  }
  profile.stash.push(...saved.map(stashEntryFromItem));
  saveData();
  endGame(true, { extracted: true, zone: zone.label, saved: saved.length });
}

function stashEntryFromItem(item) {
  const label = itemLabel(item);
  const color = itemColor(item);
  const price = item.kind === "valuable" ? VALUABLES[item.type].price
    : item.kind === "backpack" ? BACKPACKS[item.type].price
      : item.kind === "armor" ? ARMORS[item.type].price
        : item.kind === "weapon" ? Math.round(120 + weaponScore(item.type, item.rarity) * 6)
          : 60;
  return { label, color, price, kind: item.kind, type: item.type, rarity: item.rarity };
}

function endGame(won, details = {}) {
  if (!game || game.state !== "playing") return;
  game.state = "gameover";
  if (won) profile.wins += 1;
  else profile.deaths += 1;
  profile.kills += game.player.kills;
  saveData();
  renderProfile();
  ui.hud.classList.add("hidden");
  ui.gameOver.classList.remove("hidden");
  ui.resultTag.textContent = details.extracted ? "extraction reussie" : won ? "victoire royale" : `top ${game.placement}`;
  ui.resultTitle.textContent = details.extracted ? "Extrait" : won ? "Victoire" : "Elimine";
  ui.resultStats.textContent = details.extracted
    ? `${details.saved} objet${details.saved > 1 ? "s" : ""} securise${details.saved > 1 ? "s" : ""} depuis ${details.zone}.`
    : game.mode === "extraction"
      ? `${game.player.kills} elimination${game.player.kills > 1 ? "s" : ""} - butin perdu.`
    : `${game.player.kills} elimination${game.player.kills > 1 ? "s" : ""} - ${game.totalPlayers - game.placement} adversaire${game.totalPlayers - game.placement > 1 ? "s" : ""} battu${game.totalPlayers - game.placement > 1 ? "s" : ""}`;
}

function updateCamera() {
  const target = game.player.alive ? game.player : aliveFighters()[0] || game.player;
  game.camera.x = clamp(target.x - view.width / 2, 0, Math.max(0, WORLD.width - view.width));
  game.camera.y = clamp(target.y - view.height / 2, 0, Math.max(0, WORLD.height - view.height));
}

function leaderboardScore(fighter) {
  const survival = Math.round((fighter.health + fighter.shield) * 4);
  const loot = fighter.isPlayer ? materialTotal(fighter) * 2 + fighter.extractionBag.length * 120 : materialTotal(fighter);
  return fighter.kills * 1000 + survival + loot;
}

function updateLeaderboard() {
  if (!ui.leaderboard) return;
  const rows = aliveFighters()
    .map((fighter) => ({
      fighter,
      score: leaderboardScore(fighter),
    }))
    .sort((a, b) => b.score - a.score || a.fighter.name.localeCompare(b.fighter.name))
    .slice(0, 5);
  const signature = rows.map((row, index) => `${index}:${row.fighter.id}:${row.score}:${row.fighter.isPlayer}`).join("|");
  if (game.leaderboardSignature === signature) return;
  game.leaderboardSignature = signature;

  ui.leaderboard.innerHTML = "";
  const title = document.createElement("div");
  title.className = "leaderboard-title";
  const label = document.createElement("span");
  label.textContent = "Top";
  const score = document.createElement("span");
  score.textContent = "Score";
  title.append(label, score);
  ui.leaderboard.appendChild(title);

  rows.forEach((row, index) => {
    const line = document.createElement("div");
    line.className = `leaderboard-row${row.fighter.isPlayer ? " you" : ""}`;
    const rank = document.createElement("span");
    rank.textContent = `${index + 1}`;
    const name = document.createElement("span");
    name.textContent = row.fighter.isPlayer ? "You" : row.fighter.name;
    const points = document.createElement("span");
    points.textContent = `${row.score}`;
    line.append(rank, name, points);
    ui.leaderboard.appendChild(line);
  });
}

function updateHud() {
  const player = game.player;
  if ((player.materials[player.selectedMaterial] ?? 0) < BUILD_COST) {
    const fallbackMaterial = firstAffordableBuildMaterial(player);
    if (fallbackMaterial) player.selectedMaterial = fallbackMaterial;
  }
  const activeItem = getActiveItem(player);
  const weapon = getEquippedWeapon(player);
  const alive = aliveFighters().length;
  ui.healthBar.style.transform = `scaleX(${clamp(player.health / player.maxHealth, 0, 1)})`;
  ui.shieldBar.style.transform = `scaleX(${clamp(player.shield / player.maxShield, 0, 1)})`;
  ui.energyBar.style.transform = `scaleX(${clamp(player.energy / player.maxEnergy, 0, 1)})`;
  ui.aliveCount.textContent = `${alive} vivant${alive > 1 ? "s" : ""}`;
  ui.killCount.textContent = `${player.kills} elim.`;
  if (!activeItem) {
    ui.ammoCount.textContent = "Slot vide";
  } else if (activeItem.kind === "consumable") {
    const hold = player.useHold;
    ui.ammoCount.textContent = hold
      ? `${CONSUMABLES[activeItem.type].label} ${Math.ceil((hold.duration - hold.progress) * 10) / 10}s`
      : `${CONSUMABLES[activeItem.type].label}`;
  } else if (weapon && weapon.melee) {
    ui.ammoCount.textContent = `${weapon.label} melee`;
  } else if (weapon) {
    const ammo = AMMO_TYPES[weapon.ammoType];
    ui.ammoCount.textContent = player.reload > 0
      ? `Recharge ${Math.ceil(player.reload * 10) / 10}s`
      : `${weapon.label} ${getMagazine(player)}/${getAmmoCount(player, weapon.ammoType)} ${ammo.short}`;
  }
  ui.zoneTimer.textContent = game.zone.mode === "hidden"
    ? game.mode === "extraction"
      ? `Sac ${player.extractionBag.length}/${player.backpack.capacity}${player.exfilTimer > 0 ? ` - Exfil ${Math.ceil(EXTRACTION_EXFIL_TIME - player.exfilTimer)}s` : ""}`
      : `Zone cachee ${formatTime(game.zone.timer)}`
    : `${game.zone.mode === "shrinking" ? "Zone bouge" : "Zone"} ${formatTime(game.zone.timer)}`;
  ui.materials.innerHTML = MATERIAL_ORDER.map((material) => {
    const mat = MATERIALS[material];
    const active = material === player.selectedMaterial ? " active" : "";
    return `<span class="material-pill${active}" style="--mat:${mat.color}">${mat.short} ${player.materials[material] ?? 0}</span>`;
  }).join("") + `<span class="material-cost">Mur: ${BUILD_COST}</span>`;

  updateLeaderboard();
  updatePickupPrompt();
  const hotbarSignature = getHotbarSignature(player);
  if (game.hotbarSignature !== hotbarSignature) {
    game.hotbarSignature = hotbarSignature;
    renderHotbar();
  }
  if (game.mode === "extraction" && game.bagOpen) renderBagPanel();

  const feedSignature = game.feed.map((item) => item.text).join("|");
  if (game.feedSignature !== feedSignature) {
    game.feedSignature = feedSignature;
    ui.feed.innerHTML = "";
    for (const item of game.feed) {
      const line = document.createElement("div");
      line.textContent = item.text;
      ui.feed.appendChild(line);
    }
  }

  if (game.minimapTimer >= 0.18) {
    game.minimapTimer = 0;
    drawMinimap();
  }
}

function getHotbarSignature(player) {
  return `${player.activeSlot}|${player.hotbar.map((item) => {
    if (!item) return "empty";
    if (item.kind === "weapon") return `w:${item.type}:${item.rarity}:${item.mag}`;
    if (item.kind === "consumable") return `c:${item.type}`;
    return `${item.kind}:${item.type}`;
  }).join("|")}`;
}

function updatePickupPrompt() {
  const player = game.player;
  const hold = player.pickupHold;
  const pickup = hold ? game.pickups.find((item) => item.id === hold.id) : null;
  const nearbyPickup = game.mode === "extraction" ? findPickupUnderFighter(player) : null;

  if (!pickup) {
    if (nearbyPickup) {
      ui.pickupPrompt.classList.remove("hidden");
      ui.pickupPrompt.innerHTML = `
        <div class="pickup-title"><span>${nearbyPickup.label}</span><span>Maintiens E</span></div>
        <div class="pickup-bar"><span style="transform: scaleX(0)"></span></div>
      `;
      return;
    }
    if (player.useHold) {
      const item = getActiveItem(player);
      const progress = player.useHold.progress / player.useHold.duration;
      ui.pickupPrompt.classList.remove("hidden");
      ui.pickupPrompt.innerHTML = `
        <div class="pickup-title"><span>Utilisation: ${itemLabel(item)}</span><span>${Math.round(progress * 100)}%</span></div>
        <div class="pickup-bar"><span style="transform: scaleX(${clamp(progress, 0, 1)})"></span></div>
      `;
      return;
    }

    ui.pickupPrompt.classList.add("hidden");
    ui.pickupPrompt.innerHTML = "";
    return;
  }

  const progress = hold.progress / hold.duration;
  const emptySlot = firstEmptyHotbarSlot(player);
  const slotText = game.mode === "extraction"
    ? (pickup.kind === "ammo" || pickup.kind === "material" ? "ajout direct" : "vers le sac")
    : pickup.kind === "ammo"
      ? "ajout direct"
      : emptySlot === -1
        ? `remplace slot ${player.activeSlot + 1}`
        : `ajoute slot ${emptySlot + 1}`;
  ui.pickupPrompt.classList.remove("hidden");
  ui.pickupPrompt.innerHTML = `
    <div class="pickup-title"><span>${pickup.label}</span><span>${slotText} - ${Math.round(progress * 100)}%</span></div>
    <div class="pickup-bar"><span style="transform: scaleX(${clamp(progress, 0, 1)})"></span></div>
  `;
}

function renderHotbar() {
  const player = game.player;
  ui.hotbar.innerHTML = "";

  for (let i = 0; i < HOTBAR_SIZE; i += 1) {
    const item = player.hotbar[i];
    const slot = document.createElement("div");
    slot.className = `slot${i === player.activeSlot ? " active" : ""}`;
    slot.style.borderColor = i === player.activeSlot ? itemColor(item) : "";

    const key = document.createElement("span");
    key.className = "slot-key";
    key.textContent = `${i + 1}`;
    const iconCanvas = document.createElement("canvas");
    iconCanvas.className = "slot-canvas";
    iconCanvas.width = 88;
    iconCanvas.height = 56;
    drawHotbarIcon(iconCanvas, item);
    const name = document.createElement("span");
    name.className = "slot-name";
    name.textContent = itemLabel(item);
    const meta = document.createElement("span");
    meta.className = "slot-meta";
    meta.textContent = item && item.kind === "weapon" && !WEAPONS[item.type].melee
      ? `${item.mag}/${getAmmoCount(player, WEAPONS[item.type].ammoType)}`
      : item && item.kind === "consumable"
        ? "soin"
        : item && item.kind === "weapon"
          ? "melee"
          : "";
    slot.append(key, iconCanvas, name, meta);
    ui.hotbar.appendChild(slot);
  }
}

function toggleBagPanel(force = null) {
  if (!game || game.state !== "playing" || game.mode !== "extraction") return;
  game.bagOpen = force === null ? !game.bagOpen : Boolean(force);
  renderBagPanel();
}

function renderBagPanel() {
  if (!ui.bagPanel || !ui.bagGrid) return;
  if (!game || game.mode !== "extraction" || !game.bagOpen) {
    ui.bagPanel.classList.add("hidden");
    return;
  }
  const player = game.player;
  ui.bagPanel.classList.remove("hidden");
  ui.bagGrid.innerHTML = "";

  const header = document.createElement("div");
  header.className = "bag-summary";
  header.textContent = `${player.backpack.label} - ${player.extractionBag.length}/${player.backpack.capacity} slots`;
  ui.bagGrid.appendChild(header);

  if (!player.extractionBag.length) {
    const empty = document.createElement("div");
    empty.className = "bag-item bag-empty";
    empty.textContent = "Sac vide";
    ui.bagGrid.appendChild(empty);
    return;
  }

  player.extractionBag.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "bag-item";
    card.style.setProperty("--rarity", itemColor(item));

    const iconCanvas = document.createElement("canvas");
    iconCanvas.className = "bag-icon";
    iconCanvas.width = 96;
    iconCanvas.height = 72;
    drawHotbarIcon(iconCanvas, item);

    const info = document.createElement("div");
    info.className = "bag-info";
    const name = document.createElement("strong");
    name.textContent = itemLabel(item);
    const type = document.createElement("small");
    type.textContent = item.kind === "valuable" ? "objet de valeur" : item.kind;
    info.append(name, type);

    const actions = document.createElement("div");
    actions.className = "bag-actions";
    const equip = document.createElement("button");
    equip.type = "button";
    equip.textContent = "Equiper";
    equip.disabled = item.kind === "valuable";
    equip.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      equipBagIndex(index);
    });
    const drop = document.createElement("button");
    drop.type = "button";
    drop.textContent = "Jeter";
    drop.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      dropBagIndex(index);
    });
    actions.append(equip, drop);

    card.append(iconCanvas, info, actions);
    ui.bagGrid.appendChild(card);
  });
}

function equipBagIndex(index) {
  if (!game || game.mode !== "extraction") return;
  const player = game.player;
  const item = player.extractionBag[index];
  if (!item) return;
  player.extractionBag.splice(index, 1);
  if (!equipBagItem(player, item)) {
    player.extractionBag.splice(index, 0, item);
    renderBagPanel();
    return;
  }
  game.hotbarSignature = "";
  renderHotbar();
  renderBagPanel();
}

function dropBagIndex(index) {
  if (!game || game.mode !== "extraction") return;
  const player = game.player;
  const item = player.extractionBag[index];
  if (!item) return;
  player.extractionBag.splice(index, 1);
  dropExtractionItem(item, player.x, player.y);
  addFeed(`${itemLabel(item)} jete`);
  renderBagPanel();
}

function drawHotbarIcon(canvasElement, item) {
  const icon = canvasElement.getContext("2d");
  icon.clearRect(0, 0, canvasElement.width, canvasElement.height);
  icon.save();
  icon.translate(44, 28);
  icon.lineCap = "round";
  icon.lineJoin = "round";

  if (!item) {
    icon.strokeStyle = "rgba(255,255,255,0.18)";
    icon.lineWidth = 4;
    icon.strokeRect(-18, -11, 36, 22);
    icon.restore();
    return;
  }

  if (item.kind === "weapon") {
    drawWeaponSilhouette(icon, item.type, itemColor(item), 1.12, { label: true });
  } else if (item.kind === "consumable") {
    drawConsumableHotbarIcon(icon, item.type);
  } else {
    drawStashIcon(icon, item);
  }

  icon.restore();
}

function drawStashIcon(icon, item) {
  const color = itemColor(item);
  icon.save();
  icon.shadowBlur = 0;
  icon.lineWidth = 4;
  icon.strokeStyle = "rgba(4, 7, 10, 0.78)";
  icon.fillStyle = color;

  if (item.kind === "backpack") {
    fillRoundRect(icon, -18, -20, 36, 40, 7, color);
    icon.strokeRect(-18, -20, 36, 40);
    icon.fillStyle = "rgba(0,0,0,0.26)";
    icon.fillRect(-11, -8, 22, 13);
    icon.strokeStyle = "rgba(4,7,8,0.75)";
    icon.beginPath();
    icon.arc(-10, -20, 8, Math.PI, TAU);
    icon.arc(10, -20, 8, Math.PI, TAU);
    icon.stroke();
  } else if (item.kind === "armor") {
    const armor = ARMORS[item.type];
    icon.beginPath();
    if (armor && armor.slot === "helmet") {
      icon.arc(0, 1, 20, Math.PI, 0);
      icon.lineTo(20, 11);
      icon.lineTo(-20, 11);
    } else {
      icon.moveTo(0, -22);
      icon.lineTo(20, -10);
      icon.lineTo(14, 18);
      icon.lineTo(0, 24);
      icon.lineTo(-14, 18);
      icon.lineTo(-20, -10);
    }
    icon.closePath();
    icon.fill();
    icon.stroke();
  } else if (item.kind === "valuable") {
    icon.beginPath();
    icon.moveTo(0, -22);
    icon.lineTo(20, 0);
    icon.lineTo(0, 22);
    icon.lineTo(-20, 0);
    icon.closePath();
    icon.fill();
    icon.stroke();
    icon.fillStyle = "rgba(255,255,255,0.36)";
    icon.beginPath();
    icon.arc(-5, -6, 5, 0, TAU);
    icon.fill();
  }

  icon.restore();
}

function drawConsumableHotbarIcon(icon, type) {
  const color = CONSUMABLES[type].color;
  icon.save();
  icon.shadowBlur = 0;
  icon.lineWidth = 4;
  icon.strokeStyle = "rgba(4, 7, 10, 0.78)";

  if (type === "medkit") {
    fillRoundRect(icon, -18, -18, 36, 36, 5, "#f4f2ea");
    icon.strokeRect(-18, -18, 36, 36);
    icon.fillStyle = color;
    icon.fillRect(-5, -14, 10, 28);
    icon.fillRect(-14, -5, 28, 10);
  } else if (type === "shield") {
    icon.fillStyle = color;
    icon.beginPath();
    icon.moveTo(0, -22);
    icon.lineTo(20, -11);
    icon.lineTo(14, 14);
    icon.lineTo(0, 24);
    icon.lineTo(-14, 14);
    icon.lineTo(-20, -11);
    icon.closePath();
    icon.fill();
    icon.stroke();

    icon.fillStyle = "rgba(255,255,255,0.34)";
    icon.beginPath();
    icon.moveTo(0, -14);
    icon.lineTo(10, -8);
    icon.lineTo(6, 7);
    icon.lineTo(0, 12);
    icon.closePath();
    icon.fill();
  } else if (type === "smoke_grenade") {
    icon.rotate(-0.35);
    fillRoundRect(icon, -10, -20, 20, 40, 6, color);
    icon.strokeRect(-10, -20, 20, 40);
    icon.fillStyle = "#66716e";
    icon.fillRect(-9, -12, 18, 8);
    icon.fillStyle = "rgba(255,255,255,0.5)";
    icon.beginPath();
    icon.arc(-2, -2, 4, 0, TAU);
    icon.fill();
    icon.rotate(0.35);
    drawWeaponCode(icon, "SMK", color);
  }

  icon.restore();
}

function hasLineOfSight(from, to) {
  const steps = Math.ceil(distance(from, to) / 32);
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t;
    if (circleHitsObstacles(x, y, 4, game.obstacles)) return false;
    const smoke = getSmokeAt(x, y);
    if (smoke && distance(from, to) > 120 && !getSmokeAt(from.x, from.y)) return false;
  }
  return true;
}

function render() {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.clearRect(0, 0, view.width, view.height);

  if (!game) {
    drawMenuBackdrop();
    return;
  }

  ctx.save();
  ctx.translate(-game.camera.x, -game.camera.y);
  drawWorld();
  if (game.zone.mode !== "hidden") drawZone();
  drawExtractionZones();
  drawNightLighting();
  drawSmoke();
  drawChests();
  drawPickups();
  drawBuildPreview();
  drawBullets();
  drawFighters();
  drawSmoke(true);
  drawParticles();
  ctx.restore();
}

function drawMenuBackdrop() {
  ctx.fillStyle = IO_THEME.grass;
  ctx.fillRect(0, 0, view.width, view.height);
  ctx.save();
  ctx.strokeStyle = "rgba(37, 77, 24, 0.18)";
  ctx.lineWidth = 2;
  for (let x = -40; x < view.width + 80; x += 76) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, view.height);
    ctx.stroke();
  }
  for (let y = -40; y < view.height + 80; y += 76) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(view.width, y);
    ctx.stroke();
  }
  for (let i = 0; i < 28; i += 1) {
    const x = (i * 211) % Math.max(1, view.width);
    const y = (i * 137) % Math.max(1, view.height);
    ctx.fillStyle = i % 3 === 0 ? "#5f9035" : "#8fc95a";
    ctx.strokeStyle = IO_THEME.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 16 + (i % 4) * 5, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawWorld() {
  ctx.fillStyle = IO_THEME.grass;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  drawIoGrid();

  for (const patch of game.groundPatches) {
    const gradient = ctx.createRadialGradient(patch.x, patch.y, 0, patch.x, patch.y, patch.radius);
    gradient.addColorStop(0, patch.color);
    gradient.addColorStop(1, "rgba(85, 100, 74, 0)");
    ctx.globalAlpha = patch.alpha;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(patch.x, patch.y, patch.radius, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  drawRoads();
  drawMapFeatures();
  drawGrass();
  drawStealthZones();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, WORLD.width - 8, WORLD.height - 8);

  for (const obstacle of game.obstacles) {
    drawObstacle(obstacle);
  }
}

function drawIoGrid() {
  const step = 120;
  const startX = Math.floor(game.camera.x / step) * step;
  const endX = Math.min(WORLD.width, game.camera.x + view.width + step);
  const startY = Math.floor(game.camera.y / step) * step;
  const endY = Math.min(WORLD.height, game.camera.y + view.height + step);
  ctx.save();
  ctx.strokeStyle = IO_THEME.grid;
  ctx.lineWidth = 2;
  for (let x = startX; x <= endX; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, game.camera.y - step);
    ctx.lineTo(x, game.camera.y + view.height + step);
    ctx.stroke();
  }
  for (let y = startY; y <= endY; y += step) {
    ctx.beginPath();
    ctx.moveTo(game.camera.x - step, y);
    ctx.lineTo(game.camera.x + view.width + step, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawRoads() {
  ctx.save();
  applyRoadExclusions();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = IO_THEME.roadEdge;
  ctx.lineWidth = 74;
  for (const road of [
    [[560, 1210], [2540, 1210]],
    [[1510, 500], [1510, 2000]],
    [[5840, 1180], [7620, 1180]],
    [[6740, 520], [6740, 1960]],
    [[960, 3520], [2580, 3520]],
    [[1640, 2840], [1640, 4280]],
    [[7620, 5520], [9000, 5520]],
    [[8180, 4860], [8180, 6280]],
    [[3460, 8220], [5060, 8220]],
  ]) {
    ctx.beginPath();
    ctx.moveTo(road[0][0], road[0][1]);
    ctx.lineTo(road[1][0], road[1][1]);
    ctx.stroke();
  }

  ctx.strokeStyle = IO_THEME.road;
  ctx.lineWidth = 58;
  for (const road of [
    [[560, 1210], [2540, 1210]],
    [[1510, 500], [1510, 2000]],
    [[5840, 1180], [7620, 1180]],
    [[6740, 520], [6740, 1960]],
    [[960, 3520], [2580, 3520]],
    [[1640, 2840], [1640, 4280]],
    [[7620, 5520], [9000, 5520]],
    [[8180, 4860], [8180, 6280]],
    [[3460, 8220], [5060, 8220]],
  ]) {
    ctx.beginPath();
    ctx.moveTo(road[0][0], road[0][1]);
    ctx.lineTo(road[1][0], road[1][1]);
    ctx.stroke();
  }

  ctx.strokeStyle = IO_THEME.roadEdge;
  ctx.lineWidth = 42;
  for (const road of [
    [[760, 6840], [2920, 8260]],
    [[1260, 6640], [2420, 7240]],
    [[7600, 7420], [9120, 7420]],
  ]) {
    ctx.beginPath();
    ctx.moveTo(road[0][0], road[0][1]);
    ctx.lineTo(road[1][0], road[1][1]);
    ctx.stroke();
  }

  ctx.strokeStyle = IO_THEME.road;
  ctx.lineWidth = 30;
  for (const road of [
    [[760, 6840], [2920, 8260]],
    [[1260, 6640], [2420, 7240]],
    [[7600, 7420], [9120, 7420]],
  ]) {
    ctx.beginPath();
    ctx.moveTo(road[0][0], road[0][1]);
    ctx.lineTo(road[1][0], road[1][1]);
    ctx.stroke();
  }

  ctx.strokeStyle = IO_THEME.roadEdge;
  ctx.lineWidth = 62;
  ctx.beginPath();
  ctx.moveTo(-80, 900);
  ctx.bezierCurveTo(420, 760, 720, 1040, 1100, 880);
  ctx.bezierCurveTo(1480, 720, 1770, 880, 2680, 610);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.road;
  ctx.lineWidth = 50;
  ctx.beginPath();
  ctx.moveTo(-80, 900);
  ctx.bezierCurveTo(420, 760, 720, 1040, 1100, 880);
  ctx.bezierCurveTo(1480, 720, 1770, 880, 2680, 610);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.roadEdge;
  ctx.lineWidth = 42;
  ctx.beginPath();
  ctx.moveTo(1260, -80);
  ctx.bezierCurveTo(1160, 420, 1380, 730, 1310, 1040);
  ctx.bezierCurveTo(1240, 1370, 1370, 1600, 1450, 1880);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.road;
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(1260, -80);
  ctx.bezierCurveTo(1160, 420, 1380, 730, 1310, 1040);
  ctx.bezierCurveTo(1240, 1370, 1370, 1600, 1450, 1880);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.roadEdge;
  ctx.lineWidth = 54;
  ctx.beginPath();
  ctx.moveTo(2320, 120);
  ctx.bezierCurveTo(2900, 520, 3220, 1180, 4200, 980);
  ctx.bezierCurveTo(4880, 850, 5300, 1400, 5700, 1680);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.road;
  ctx.lineWidth = 42;
  ctx.beginPath();
  ctx.moveTo(2320, 120);
  ctx.bezierCurveTo(2900, 520, 3220, 1180, 4200, 980);
  ctx.bezierCurveTo(4880, 850, 5300, 1400, 5700, 1680);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.roadEdge;
  ctx.lineWidth = 46;
  ctx.beginPath();
  ctx.moveTo(360, 3400);
  ctx.bezierCurveTo(1120, 3100, 2020, 3560, 2860, 3000);
  ctx.bezierCurveTo(3500, 2580, 4280, 3050, 5460, 2860);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.road;
  ctx.lineWidth = 34;
  ctx.beginPath();
  ctx.moveTo(360, 3400);
  ctx.bezierCurveTo(1120, 3100, 2020, 3560, 2860, 3000);
  ctx.bezierCurveTo(3500, 2580, 4280, 3050, 5460, 2860);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.roadEdge;
  ctx.lineWidth = 56;
  ctx.beginPath();
  ctx.moveTo(5400, 2860);
  ctx.bezierCurveTo(6500, 2460, 7300, 3160, 8350, 2940);
  ctx.bezierCurveTo(9100, 2780, 9560, 3540, 10120, 3860);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.road;
  ctx.lineWidth = 44;
  ctx.beginPath();
  ctx.moveTo(5400, 2860);
  ctx.bezierCurveTo(6500, 2460, 7300, 3160, 8350, 2940);
  ctx.bezierCurveTo(9100, 2780, 9560, 3540, 10120, 3860);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.roadEdge;
  ctx.lineWidth = 50;
  ctx.beginPath();
  ctx.moveTo(620, 6220);
  ctx.bezierCurveTo(1620, 5740, 2480, 6640, 3840, 6100);
  ctx.bezierCurveTo(5240, 5540, 6600, 6500, 8120, 6100);
  ctx.bezierCurveTo(9020, 5860, 9560, 6660, 10100, 7060);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.road;
  ctx.lineWidth = 38;
  ctx.beginPath();
  ctx.moveTo(620, 6220);
  ctx.bezierCurveTo(1620, 5740, 2480, 6640, 3840, 6100);
  ctx.bezierCurveTo(5240, 5540, 6600, 6500, 8120, 6100);
  ctx.bezierCurveTo(9020, 5860, 9560, 6660, 10100, 7060);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.roadEdge;
  ctx.lineWidth = 50;
  ctx.beginPath();
  ctx.moveTo(2440, 10020);
  ctx.bezierCurveTo(2820, 8700, 4020, 8420, 5220, 9020);
  ctx.bezierCurveTo(6420, 9620, 7640, 8740, 9300, 9180);
  ctx.stroke();

  ctx.strokeStyle = IO_THEME.road;
  ctx.lineWidth = 38;
  ctx.beginPath();
  ctx.moveTo(2440, 10020);
  ctx.bezierCurveTo(2820, 8700, 4020, 8420, 5220, 9020);
  ctx.bezierCurveTo(6420, 9620, 7640, 8740, 9300, 9180);
  ctx.stroke();
  ctx.restore();
}

function applyRoadExclusions() {
  if (!game || !game.mapFeatures) return;
  ctx.beginPath();
  ctx.rect(-200, -200, WORLD.width + 400, WORLD.height + 400);
  for (const river of game.mapFeatures.rivers || []) {
    ctx.rect(river.x - 12, river.y - 12, river.w + 24, river.h + 24);
  }
  for (const obstacle of game.obstacles || []) {
    if (obstacle.type !== "building") continue;
    ctx.rect(obstacle.x - 34, obstacle.y - 34, obstacle.w + 68, obstacle.h + 68);
  }
  ctx.clip("evenodd");
}

function drawMapFeatures() {
  const features = game.mapFeatures;
  ctx.save();
  for (const zone of features.zones || []) {
    ctx.fillStyle = zone.color;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
  }

  for (const river of features.rivers) {
    ctx.fillStyle = IO_THEME.waterLight;
    ctx.fillRect(river.x - 12, river.y - 12, river.w + 24, river.h + 24);
    ctx.fillStyle = IO_THEME.water;
    ctx.fillRect(river.x, river.y, river.w, river.h);
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    for (let i = 0; i < Math.ceil((river.w + river.h) / 180); i += 1) {
      const x = river.x + (i * 173) % Math.max(1, river.w);
      const y = river.y + (i * 97) % Math.max(1, river.h);
      ctx.fillRect(x, y + river.h * 0.42, Math.min(90, river.w), 5);
    }
  }

  for (const bridge of features.bridges) {
    roundRect(bridge.x, bridge.y, bridge.w, bridge.h, 6, IO_THEME.ink);
    roundRect(bridge.x + 4, bridge.y + 4, bridge.w - 8, bridge.h - 8, 4, IO_THEME.wood);
    ctx.fillStyle = "rgba(16, 20, 13, 0.32)";
    const planks = bridge.w > bridge.h ? Math.floor(bridge.w / 28) : Math.floor(bridge.h / 28);
    for (let i = 1; i < planks; i += 1) {
      if (bridge.w > bridge.h) {
        ctx.fillRect(bridge.x + i * 28, bridge.y + 6, 3, bridge.h - 12);
      } else {
        ctx.fillRect(bridge.x + 6, bridge.y + i * 28, bridge.w - 12, 3);
      }
    }
  }
  ctx.restore();
}

function drawStealthZones() {
  const features = game.mapFeatures;
  ctx.save();
  applyStealthZoneExclusions();
  for (const zone of features.stealthZones) {
    if (zone.type === "field") {
      ctx.fillStyle = "rgba(130, 153, 48, 0.5)";
      ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
      ctx.strokeStyle = "rgba(16, 20, 13, 0.3)";
      ctx.lineWidth = 3;
      ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
      ctx.lineWidth = 2;
      for (let x = zone.x + 18; x < zone.x + zone.w; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, zone.y + 10);
        ctx.lineTo(x + 10, zone.y + zone.h - 12);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = "rgba(38, 104, 41, 0.56)";
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, zone.r, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = IO_THEME.ink;
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }
  ctx.restore();
}

function applyStealthZoneExclusions() {
  if (!game || !game.mapFeatures) return;
  ctx.beginPath();
  ctx.rect(-200, -200, WORLD.width + 400, WORLD.height + 400);
  for (const road of mapRoadRects()) {
    ctx.rect(road.x, road.y, road.w, road.h);
  }
  for (const river of game.mapFeatures.rivers || []) {
    ctx.rect(river.x - 10, river.y - 10, river.w + 20, river.h + 20);
  }
  for (const bridge of game.mapFeatures.bridges || []) {
    ctx.rect(bridge.x - 12, bridge.y - 12, bridge.w + 24, bridge.h + 24);
  }
  for (const obstacle of game.obstacles || []) {
    if (obstacle.type !== "building" && obstacle.type !== "wall") continue;
    ctx.rect(obstacle.x - 10, obstacle.y - 10, obstacle.w + 20, obstacle.h + 20);
  }
  ctx.clip("evenodd");
}

function mapRoadRects() {
  return [
    { x: 520, y: 1168, w: 2060, h: 104 },
    { x: 1468, y: 460, w: 104, h: 1580 },
    { x: 5800, y: 1138, w: 1860, h: 104 },
    { x: 6698, y: 480, w: 104, h: 1520 },
    { x: 920, y: 3478, w: 1700, h: 104 },
    { x: 1598, y: 2800, w: 104, h: 1520 },
    { x: 7580, y: 5478, w: 1460, h: 104 },
    { x: 8138, y: 4820, w: 104, h: 1500 },
    { x: 3420, y: 8178, w: 1680, h: 104 },
  ];
}

function drawGrass() {
  ctx.save();
  ctx.lineWidth = 2;
  for (const blade of game.grass) {
    ctx.strokeStyle = blade.tone > 0.5 ? "rgba(38, 82, 30, 0.24)" : "rgba(190, 219, 113, 0.2)";
    ctx.beginPath();
    ctx.moveTo(blade.x, blade.y);
    ctx.lineTo(blade.x + Math.sin(blade.rot) * blade.length, blade.y - blade.length);
    ctx.stroke();
  }
  ctx.restore();
}

function drawObstacle(obstacle) {
  if (obstacle.type === "tree") {
    ctx.fillStyle = "#6b4428";
    ctx.beginPath();
    ctx.arc(obstacle.x + 3, obstacle.y + 8, obstacle.radius * 0.34, 0, TAU);
    ctx.fill();
    ctx.fillStyle = obstacle.tone > 0.5 ? "#437b2e" : "#57943a";
    ctx.strokeStyle = IO_THEME.ink;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(211, 255, 158, 0.22)";
    ctx.beginPath();
    ctx.arc(obstacle.x - obstacle.radius * 0.28, obstacle.y - obstacle.radius * 0.28, obstacle.radius * 0.46, 0, TAU);
    ctx.fill();
    return;
  }

  if (obstacle.type === "rock") {
    ctx.fillStyle = obstacle.tone > 0.5 ? "#a0a5a2" : IO_THEME.rock;
    ctx.strokeStyle = IO_THEME.ink;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(obstacle.x, obstacle.y, obstacle.radius * 1.12, obstacle.radius * 0.82, -0.3, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.arc(obstacle.x - obstacle.radius * 0.25, obstacle.y - obstacle.radius * 0.25, obstacle.radius * 0.22, 0, TAU);
    ctx.fill();
    return;
  }

  if (obstacle.type === "wall") {
    roundRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 4, IO_THEME.ink);
    roundRect(obstacle.x + 3, obstacle.y + 3, obstacle.w - 6, obstacle.h - 6, 2, IO_THEME.buildingDark);
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fillRect(obstacle.x + 2, obstacle.y + 2, Math.max(0, obstacle.w - 4), 2);
    return;
  }

  if (obstacle.type === "built_wall") {
    const material = MATERIALS[obstacle.material] || MATERIALS.wood;
    const healthRatio = clamp(obstacle.health / obstacle.maxHealth, 0, 1);
    roundRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 5, IO_THEME.ink);
    roundRect(obstacle.x + 3, obstacle.y + 3, obstacle.w - 6, obstacle.h - 6, 3, material.wallColor);
    ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
    if (obstacle.w > obstacle.h) {
      for (let x = obstacle.x + 10; x < obstacle.x + obstacle.w - 4; x += 24) {
        ctx.fillRect(x, obstacle.y + 3, 4, obstacle.h - 6);
      }
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.h - 5, (obstacle.w - 10) * healthRatio, 3);
    } else {
      for (let y = obstacle.y + 10; y < obstacle.y + obstacle.h - 4; y += 24) {
        ctx.fillRect(obstacle.x + 3, y, obstacle.w - 6, 4);
      }
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.h - 5, obstacle.w - 10, 3);
    }
    ctx.strokeStyle = material.color;
    ctx.globalAlpha = 0.55;
    ctx.strokeRect(obstacle.x + 1, obstacle.y + 1, obstacle.w - 2, obstacle.h - 2);
    ctx.globalAlpha = 1;
    return;
  }

  if (obstacle.type === "crate") {
    roundRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 5, IO_THEME.ink);
    roundRect(obstacle.x + 4, obstacle.y + 4, obstacle.w - 8, obstacle.h - 8, 3, IO_THEME.crate);
    ctx.strokeStyle = "rgba(42, 29, 20, 0.78)";
    ctx.lineWidth = 4;
    ctx.strokeRect(obstacle.x + 10, obstacle.y + 10, obstacle.w - 20, obstacle.h - 20);
    ctx.beginPath();
    ctx.moveTo(obstacle.x + 11, obstacle.y + 11);
    ctx.lineTo(obstacle.x + obstacle.w - 11, obstacle.y + obstacle.h - 11);
    ctx.moveTo(obstacle.x + obstacle.w - 11, obstacle.y + 11);
    ctx.lineTo(obstacle.x + 11, obstacle.y + obstacle.h - 11);
    ctx.stroke();
    return;
  }

  const style = buildingStyle(obstacle.variant);
  ctx.fillStyle = "rgba(16, 20, 13, 0.22)";
  ctx.fillRect(obstacle.x + 18, obstacle.y + 18, obstacle.w, obstacle.h);
  roundRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 7, IO_THEME.ink);
  roundRect(obstacle.x + 5, obstacle.y + 5, obstacle.w - 10, obstacle.h - 10, 4, style.floor);
  ctx.fillStyle = style.inner;
  ctx.fillRect(obstacle.x + 24, obstacle.y + 24, obstacle.w - 48, obstacle.h - 48);
  if (obstacle.variant === "military" || obstacle.variant === "barracks") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
    for (let x = obstacle.x + 36; x < obstacle.x + obstacle.w - 24; x += 48) {
      ctx.fillRect(x, obstacle.y + 18, 18, obstacle.h - 36);
    }
  }
  if (obstacle.variant === "fire_station") {
    ctx.fillStyle = "#d14c3c";
    ctx.fillRect(obstacle.x + 22, obstacle.y + 20, obstacle.w - 44, 18);
    ctx.fillStyle = "#fff0ad";
    ctx.fillRect(obstacle.x + obstacle.w * 0.62, obstacle.y + obstacle.h - 42, 70, 26);
  }
  if (obstacle.variant === "garage") {
    ctx.fillStyle = "#cad4d4";
    ctx.fillRect(obstacle.x + 20, obstacle.y + obstacle.h - 44, obstacle.w - 40, 22);
  }
  ctx.fillStyle = "#2f7ebd";
  ctx.fillRect(obstacle.x + obstacle.w * 0.18, obstacle.y + 12, 34, 18);
  ctx.fillRect(obstacle.x + obstacle.w * 0.62, obstacle.y + obstacle.h - 32, 38, 18);
  ctx.strokeStyle = IO_THEME.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(obstacle.x + obstacle.w * 0.18, obstacle.y + 12, 34, 18);
  ctx.strokeRect(obstacle.x + obstacle.w * 0.62, obstacle.y + obstacle.h - 32, 38, 18);
}

function buildingStyle(variant) {
  const styles = {
    farm: { floor: "#b08443", inner: "#8f6530" },
    large_house: { floor: "#a5abad", inner: "#7c8588" },
    military: { floor: "#72835f", inner: "#566647" },
    barracks: { floor: "#879071", inner: "#667255" },
    fire_station: { floor: "#a0655c", inner: "#7d4d48" },
    garage: { floor: "#a5abad", inner: "#7d8588" },
  };
  return styles[variant] || { floor: IO_THEME.roof, inner: IO_THEME.building };
}

function roundRect(x, y, w, h, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.fill();
}

function fillRoundRect(target, x, y, w, h, radius, color) {
  target.fillStyle = color;
  target.beginPath();
  target.moveTo(x + radius, y);
  target.lineTo(x + w - radius, y);
  target.quadraticCurveTo(x + w, y, x + w, y + radius);
  target.lineTo(x + w, y + h - radius);
  target.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  target.lineTo(x + radius, y + h);
  target.quadraticCurveTo(x, y + h, x, y + h - radius);
  target.lineTo(x, y + radius);
  target.quadraticCurveTo(x, y, x + radius, y);
  target.fill();
}

function drawZone() {
  const zone = game.zone;
  ctx.save();
  ctx.fillStyle = "rgba(239, 47, 54, 0.28)";
  ctx.beginPath();
  ctx.rect(-600, -600, WORLD.width + 1200, WORLD.height + 1200);
  ctx.arc(zone.x, zone.y, zone.radius, 0, TAU, true);
  ctx.fill("evenodd");

  ctx.strokeStyle = IO_THEME.danger;
  ctx.lineWidth = zone.mode === "shrinking" ? 8 : 6;
  ctx.setLineDash(zone.mode === "shrinking" ? [16, 13] : []);
  ctx.beginPath();
  ctx.arc(zone.x, zone.y, zone.radius, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawExtractionZones() {
  if (!game.extractionZones || !game.extractionZones.length) return;
  ctx.save();
  for (const zone of game.extractionZones) {
    ctx.fillStyle = "rgba(101, 209, 55, 0.2)";
    ctx.strokeStyle = IO_THEME.exfil;
    ctx.lineWidth = 5;
    ctx.setLineDash([18, 12]);
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();
}

function drawNightLighting() {
  if (!isNightMode() || !game.player.alive) return;
  const player = game.player;
  const lightPath = getFlashlightPath(player, NIGHT_VIEW_RANGE, NIGHT_VIEW_ANGLE);
  ctx.save();
  ctx.fillStyle = "rgba(1, 4, 10, 0.84)";
  ctx.fillRect(game.camera.x, game.camera.y, view.width, view.height);

  ctx.globalCompositeOperation = "destination-out";
  const nearGradient = ctx.createRadialGradient(player.x, player.y, 6, player.x, player.y, NIGHT_CLOSE_RANGE + 16);
  nearGradient.addColorStop(0, "rgba(255,255,255,0.75)");
  nearGradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = nearGradient;
  ctx.beginPath();
  ctx.arc(player.x, player.y, NIGHT_CLOSE_RANGE + 16, 0, TAU);
  ctx.fill();

  const range = NIGHT_VIEW_RANGE;
  const gradient = ctx.createRadialGradient(player.x, player.y, 24, player.x, player.y, range);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.78)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  drawPolygonPath(lightPath);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(255, 231, 145, 0.18)";
  drawPolygonPath(lightPath);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 237, 166, 0.2)";
  ctx.lineWidth = 2;
  drawPolygonPath(lightPath);
  ctx.stroke();
  ctx.restore();
}

function getFlashlightPath(observer, range = NIGHT_VIEW_RANGE, cone = NIGHT_VIEW_ANGLE) {
  const points = [{ x: observer.x, y: observer.y }];
  const start = observer.aim - cone / 2;
  for (let i = 0; i <= NIGHT_LIGHT_RAYS; i += 1) {
    const angle = start + (cone * i) / NIGHT_LIGHT_RAYS;
    points.push(traceLightRay(observer, angle, range));
  }
  return points;
}

function traceLightRay(observer, angle, range) {
  const step = 10;
  let last = { x: observer.x, y: observer.y };
  for (let d = step; d <= range; d += step) {
    const point = {
      x: observer.x + Math.cos(angle) * d,
      y: observer.y + Math.sin(angle) * d,
    };
    if (
      point.x < 0 ||
      point.y < 0 ||
      point.x > WORLD.width ||
      point.y > WORLD.height ||
      circleHitsObstacles(point.x, point.y, 5, game.obstacles)
    ) {
      return point;
    }
    last = point;
  }
  return {
    x: observer.x + Math.cos(angle) * range,
    y: observer.y + Math.sin(angle) * range,
  };
}

function drawPolygonPath(points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
}

function drawPickups() {
  for (const pickup of game.pickups) {
    if (!playerCanSeeEntity(pickup, { range: NIGHT_VIEW_RANGE, requireLineOfSight: true })) continue;
    const bob = Math.sin(pickup.pulse) * 4;
    ctx.save();
    ctx.translate(pickup.x, pickup.y + bob);
    ctx.shadowColor = pickup.color;
    ctx.shadowBlur = 7;
    ctx.fillStyle = pickup.color;
    ctx.strokeStyle = IO_THEME.ink;
    ctx.lineWidth = 3;

    if (pickup.kind === "weapon") {
      drawWeaponPickup(pickup.type, pickup.color);
    } else if (pickup.kind === "ammo") {
      drawAmmoPickup(ammoTypeFromPickup(pickup.type), pickup.color);
    } else if (pickup.kind === "material") {
      drawMaterialPickup(pickup.type, pickup.color);
    } else if (pickup.kind === "consumable") {
      drawConsumablePickup(pickup.type, pickup.color);
    } else if (pickup.kind === "backpack") {
      drawBackpackPickup(pickup.type, pickup.color);
    } else if (pickup.kind === "armor") {
      drawArmorPickup(pickup.type, pickup.color);
    } else if (pickup.kind === "valuable") {
      drawValuablePickup(pickup.type, pickup.color);
    }

    if (game.player && game.player.pickupHold && game.player.pickupHold.id === pickup.id) {
      const progress = game.player.pickupHold.progress / game.player.pickupHold.duration;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 27, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(progress, 0, 1));
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawBuildPreview() {
  if (!game || game.state !== "playing" || !game.player.alive) return;
  const player = game.player;
  if ((player.materials[player.selectedMaterial] ?? 0) < BUILD_COST) return;
  const rect = getBuildWallRect(player);
  const material = MATERIALS[player.selectedMaterial];
  const canBuild = canPlaceBuildWall(player, rect);
  ctx.save();
  ctx.globalAlpha = canBuild ? 0.46 : 0.34;
  roundRect(rect.x, rect.y, rect.w, rect.h, 5, canBuild ? material.wallColor : "#d94b5f");
  ctx.globalAlpha = 0.92;
  ctx.strokeStyle = canBuild ? material.color : "#ff5a66";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.setLineDash([]);
  ctx.restore();
}

function drawMaterialPickup(material, color) {
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(5, 8, 8, 0.72)";
  ctx.lineWidth = 3;
  if (material === "wood") {
    roundRect(-18, -10, 36, 20, 5, color);
    ctx.strokeRect(-18, -10, 36, 20);
    ctx.strokeStyle = "rgba(84, 48, 25, 0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-13, -3);
    ctx.lineTo(12, -5);
    ctx.moveTo(-9, 5);
    ctx.lineTo(15, 3);
    ctx.stroke();
  } else if (material === "stone") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-18, 9);
    ctx.lineTo(-11, -11);
    ctx.lineTo(9, -16);
    ctx.lineTo(21, 0);
    ctx.lineTo(13, 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    roundRect(-17, -13, 34, 26, 4, color);
    ctx.strokeRect(-17, -13, 34, 26);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(-10, -7, 20, 4);
    ctx.fillRect(-10, 3, 20, 4);
  }
  ctx.restore();
}

function drawChests() {
  for (const chest of game.chests) {
    if (!playerCanSeeEntity(chest, { range: NIGHT_VIEW_RANGE, requireLineOfSight: true })) continue;
    const bob = Math.sin(chest.pulse) * 2;
    ctx.save();
    ctx.translate(chest.x, chest.y + bob);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    roundRect(-22, -16, 44, 32, 5, IO_THEME.ink);
    roundRect(-18, -12, 36, 24, 3, chest.opened ? "#7a522b" : "#ffcb38");
    ctx.fillStyle = chest.opened ? "#4d3823" : "#fff0ad";
    ctx.fillRect(-20, -3, 40, 7);
    ctx.fillStyle = IO_THEME.ink;
    ctx.fillRect(-5, -6, 10, 13);
    ctx.restore();
  }
}

function drawWeaponPickup(type, color) {
  ctx.save();
  ctx.rotate(-0.42);
  drawWeaponSilhouette(ctx, type, color, 0.78);
  ctx.restore();
}

function drawWeaponSilhouette(target, type, color, scale = 1, options = {}) {
  target.save();
  target.scale(scale, scale);
  target.lineCap = "round";
  target.lineJoin = "round";
  target.shadowBlur = 0;

  const dark = "#1a2024";
  const metal = "#dce5e8";
  const wood = "#7a4f32";
  target.strokeStyle = "rgba(4, 7, 8, 0.78)";
  target.lineWidth = 3.6;

  if (type === "pickaxe") {
    target.strokeStyle = dark;
    target.lineWidth = 8;
    target.beginPath();
    target.moveTo(-17, 19);
    target.lineTo(17, -17);
    target.stroke();
    target.strokeStyle = color;
    target.lineWidth = 5;
    target.beginPath();
    target.moveTo(-17, 19);
    target.lineTo(17, -17);
    target.stroke();
    target.strokeStyle = dark;
    target.lineWidth = 9;
    target.beginPath();
    target.moveTo(-22, -11);
    target.quadraticCurveTo(3, -27, 29, -8);
    target.stroke();
    target.strokeStyle = metal;
    target.lineWidth = 5;
    target.beginPath();
    target.moveTo(-22, -11);
    target.quadraticCurveTo(3, -27, 29, -8);
    target.stroke();
    if (options.label) drawWeaponCode(target, "PX", color);
    target.restore();
    return;
  }

  const fill = (x, y, w, h, radius, fillColor = color) => {
    fillRoundRect(target, x, y, w, h, radius, fillColor);
    target.strokeRect(x, y, w, h);
  };

  if (type === "pistol") {
    fill(-24, -9, 39, 15, 4, color);
    fill(7, 2, 10, 20, 3, dark);
    target.fillStyle = metal;
    target.fillRect(-18, -4, 18, 4);
    target.fillStyle = dark;
    target.fillRect(14, -5, 9, 5);
    if (options.label) drawWeaponCode(target, "PI", color);
  } else if (type === "smg") {
    fill(-30, -8, 53, 14, 4, color);
    fill(-3, 5, 10, 22, 3, dark);
    fill(17, -13, 19, 7, 3, color);
    target.fillStyle = metal;
    target.fillRect(-23, -3, 30, 4);
    target.fillStyle = dark;
    target.fillRect(26, -4, 10, 4);
    if (options.label) drawWeaponCode(target, "SMG", color);
  } else if (type === "assault_rifle") {
    fill(-36, -7, 72, 13, 4, color);
    fill(-43, -11, 16, 20, 3, dark);
    fill(10, 5, 12, 26, 3, dark);
    target.fillStyle = metal;
    target.fillRect(-18, -13, 22, 5);
    target.fillStyle = dark;
    target.fillRect(35, -3, 16, 5);
    if (options.label) drawWeaponCode(target, "AR", color);
  } else if (type === "shotgun") {
    fill(-38, -8, 74, 16, 5, color);
    fill(-48, -6, 16, 12, 3, wood);
    target.fillStyle = wood;
    target.fillRect(-24, 8, 25, 7);
    target.fillStyle = metal;
    target.fillRect(-31, -13, 61, 4);
    target.fillRect(-31, -9, 61, 3);
    target.fillStyle = dark;
    target.fillRect(34, -2, 15, 4);
    if (options.label) drawWeaponCode(target, "PMP", color);
  } else if (type === "sniper") {
    fill(-47, -5, 91, 10, 4, color);
    fill(-56, -8, 18, 16, 3, dark);
    target.fillStyle = dark;
    target.fillRect(42, -2, 24, 4);
    fill(-10, -18, 26, 7, 3, metal);
    target.strokeStyle = metal;
    target.lineWidth = 3;
    target.beginPath();
    target.moveTo(-1, -10);
    target.lineTo(-6, -5);
    target.moveTo(10, -10);
    target.lineTo(16, -5);
    target.stroke();
    if (options.label) drawWeaponCode(target, "SNP", color);
  }

  target.restore();
}

function drawWeaponCode(target, text, color) {
  target.save();
  target.shadowBlur = 0;
  target.font = "900 9px Segoe UI, sans-serif";
  target.textAlign = "center";
  target.textBaseline = "middle";
  target.lineWidth = 3;
  target.strokeStyle = "rgba(0,0,0,0.8)";
  target.fillStyle = color;
  target.strokeText(text, 0, 22);
  target.fillText(text, 0, 22);
  target.restore();
}

function drawAmmoPickup(ammoType, color) {
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(5, 8, 8, 0.78)";
  ctx.lineWidth = 3;
  if (ammoType === "pistol" || ammoType === "smg") {
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = color;
      roundRect(-17 + i * 10, -12, 6, 24, 3, color);
      ctx.strokeRect(-17 + i * 10, -12, 6, 24);
      ctx.fillStyle = "#4a3620";
      ctx.fillRect(-17 + i * 10, 7, 6, 5);
    }
  } else if (ammoType === "assault") {
    roundRect(-19, -13, 38, 26, 5, color);
    ctx.strokeRect(-19, -13, 38, 26);
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.fillRect(-12, -6, 24, 4);
    ctx.fillRect(-12, 2, 24, 4);
  } else if (ammoType === "shotgun") {
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = color;
      roundRect(-17 + i * 12, -13, 8, 26, 4, color);
      ctx.strokeRect(-17 + i * 12, -13, 8, 26);
      ctx.fillStyle = "#f4cf67";
      ctx.fillRect(-17 + i * 12, -13, 8, 6);
    }
  } else if (ammoType === "sniper") {
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = color;
      roundRect(-18 + i * 13, -15, 7, 30, 4, color);
      ctx.strokeRect(-18 + i * 13, -15, 7, 30);
      ctx.fillStyle = "#2d243a";
      ctx.fillRect(-18 + i * 13, 8, 7, 6);
    }
  }
  ctx.restore();
}

function drawConsumablePickup(type, color) {
  if (type === "medkit") {
    roundRect(-15, -15, 30, 30, 5, "#f4f2ea");
    ctx.fillStyle = color;
    ctx.fillRect(-4, -11, 8, 22);
    ctx.fillRect(-11, -4, 22, 8);
  } else if (type === "shield") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -17);
    ctx.lineTo(15, -8);
    ctx.lineTo(11, 13);
    ctx.lineTo(0, 19);
    ctx.lineTo(-11, 13);
    ctx.lineTo(-15, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    ctx.beginPath();
    ctx.arc(-4, -6, 5, 0, TAU);
    ctx.fill();
  } else if (type === "smoke_grenade") {
    ctx.save();
    ctx.rotate(-0.35);
    roundRect(-9, -18, 18, 36, 6, color);
    ctx.stroke();
    ctx.fillStyle = "#6f7976";
    ctx.fillRect(-8, -11, 16, 7);
    ctx.fillStyle = "rgba(255,255,255,0.42)";
    ctx.beginPath();
    ctx.arc(-2, -2, 4, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

function drawBackpackPickup(type, color) {
  roundRect(-16, -18, 32, 36, 6, color);
  ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(-10, -8, 20, 12);
  ctx.strokeStyle = "rgba(4,7,8,0.75)";
  ctx.beginPath();
  ctx.arc(-10, -18, 8, Math.PI, TAU);
  ctx.arc(10, -18, 8, Math.PI, TAU);
  ctx.stroke();
}

function drawArmorPickup(type, color) {
  const armor = ARMORS[type];
  ctx.fillStyle = color;
  ctx.beginPath();
  if (armor.slot === "helmet") {
    ctx.arc(0, 0, 18, Math.PI, 0);
    ctx.lineTo(18, 9);
    ctx.lineTo(-18, 9);
  } else {
    ctx.moveTo(0, -20);
    ctx.lineTo(18, -10);
    ctx.lineTo(13, 18);
    ctx.lineTo(0, 23);
    ctx.lineTo(-13, 18);
    ctx.lineTo(-18, -10);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawValuablePickup(type, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(18, 0);
  ctx.lineTo(0, 20);
  ctx.lineTo(-18, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(-4, -5, 5, 0, TAU);
  ctx.fill();
}

function drawHeldItem(fighter) {
  const item = fighter.isPlayer ? getActiveItem(fighter) : makeWeaponItem(fighter.weaponKey, fighter.mag);
  if (!item) return;
  const swingProgress = fighter.swingDuration ? 1 - fighter.swingTimer / fighter.swingDuration : 1;
  const swing = fighter.swingTimer > 0 ? Math.sin(swingProgress * Math.PI) : 0;
  const reload = fighter.reload > 0 ? Math.sin(fighter.reload * 18) : 0;

  if (item.kind === "weapon") {
    if (item.type === "pickaxe") {
      ctx.save();
      ctx.translate(23, 0);
      ctx.rotate(-0.85 * swing);
      drawWeaponSilhouette(ctx, "pickaxe", WEAPONS.pickaxe.color, 0.76);
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(27, reload * 3);
      ctx.rotate(reload * 0.08);
      drawWeaponSilhouette(ctx, item.type, WEAPONS[item.type].color, 0.62);
      ctx.restore();
    }
  } else if (item.kind === "consumable") {
    ctx.save();
    ctx.translate(25, 0);
    if (item.type === "smoke_grenade") {
      ctx.rotate(-0.35);
      roundRect(-6, -11, 12, 22, 4, CONSUMABLES[item.type].color);
      ctx.fillStyle = "#66716e";
      ctx.fillRect(-5, -7, 10, 4);
    } else {
      ctx.fillStyle = CONSUMABLES[item.type].color;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawBullets() {
  for (const bullet of game.bullets) {
    ctx.save();
    ctx.translate(bullet.x, bullet.y);
    const angle = Math.atan2(bullet.vy, bullet.vx);
    ctx.rotate(angle);
    ctx.lineCap = "round";
    ctx.strokeStyle = IO_THEME.ink;
    ctx.lineWidth = Math.max(5, bullet.radius + 3);
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();
    ctx.strokeStyle = bullet.color;
    ctx.lineWidth = Math.max(3, bullet.radius);
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();
    ctx.fillStyle = "#fff7b7";
    ctx.beginPath();
    ctx.arc(9, 0, 2.2, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

function drawFighters() {
  const fighters = aliveFighters().sort((a, b) => a.y - b.y);
  for (const fighter of fighters) {
    if (!fighter.isPlayer && isHiddenFrom(game.player, fighter)) continue;
    if (!fighter.isPlayer && !playerCanSeeEntity(fighter, { range: NIGHT_VIEW_RANGE, requireLineOfSight: true })) continue;
    drawFighter(fighter);
  }
}

function drawFighter(fighter) {
  ctx.save();
  const stealthZone = getStealthZoneAt(fighter.x, fighter.y);
  if (stealthZone) ctx.globalAlpha = fighter.isPlayer ? 0.78 : 0.58;
  ctx.translate(fighter.x, fighter.y);
  ctx.rotate(fighter.aim);

  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 11, fighter.radius * 0.95, fighter.radius * 0.48, 0, 0, TAU);
  ctx.fill();

  drawHeldItem(fighter);

  ctx.fillStyle = fighter.color;
  ctx.strokeStyle = IO_THEME.ink;
  ctx.lineWidth = fighter.isPlayer ? 5 : 4;
  ctx.beginPath();
  ctx.arc(0, 0, fighter.radius, 0, TAU);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
  ctx.beginPath();
  ctx.arc(6, -7, fighter.radius * 0.34, 0, TAU);
  ctx.fill();

  ctx.restore();

  drawFighterName(fighter);
  drawFighterBars(fighter);
}

function drawFighterName(fighter) {
  const label = fighter.isPlayer ? "You" : fighter.name;
  ctx.save();
  ctx.font = "900 16px Segoe UI, Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.lineWidth = 5;
  ctx.strokeStyle = IO_THEME.ink;
  ctx.fillStyle = IO_THEME.white || "#fff8df";
  ctx.strokeText(label, fighter.x, fighter.y - fighter.radius - 25);
  ctx.fillText(label, fighter.x, fighter.y - fighter.radius - 25);
  ctx.restore();
}

function drawFighterBars(fighter) {
  const width = 42;
  const x = fighter.x - width / 2;
  const y = fighter.y - fighter.radius - 17;
  ctx.fillStyle = IO_THEME.ink;
  ctx.fillRect(x - 2, y - 1, width + 4, 7);
  ctx.fillStyle = "#65d137";
  ctx.fillRect(x, y + 1, width * clamp(fighter.health / fighter.maxHealth, 0, 1), 3);
  if (fighter.shield > 0) {
    ctx.fillStyle = IO_THEME.ink;
    ctx.fillRect(x - 2, y - 8, width + 4, 6);
    ctx.fillStyle = "#2787df";
    ctx.fillRect(x, y - 7, width * clamp(fighter.shield / fighter.maxShield, 0, 1), 3);
  }
  if (fighter.reload > 0) {
    const weapon = getEquippedWeapon(fighter);
    const progress = weapon ? 1 - fighter.reload / weapon.reload : 0;
    ctx.fillStyle = IO_THEME.ink;
    ctx.fillRect(x - 2, y - 15, width + 4, 6);
    ctx.fillStyle = "#ffe368";
    ctx.fillRect(x, y - 14, width * clamp(progress, 0, 1), 3);
  }
}

function drawParticles() {
  for (const particle of game.particles) {
    const alpha = clamp(particle.life / Math.max(0.001, particle.life + particle.age), 0, 1);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawSmoke(overlay = false) {
  if (!game.smokeClouds && !game.smokeGrenades) return;

  if (!overlay) {
    for (const grenade of game.smokeGrenades) {
      ctx.save();
      ctx.translate(grenade.x, grenade.y);
      ctx.rotate(grenade.pulse);
      ctx.fillStyle = "#cfd6d3";
      ctx.strokeStyle = "rgba(3, 5, 6, 0.78)";
      ctx.lineWidth = 3;
      roundRect(-7, -11, 14, 22, 5, "#cfd6d3");
      ctx.strokeRect(-7, -11, 14, 22);
      ctx.restore();
    }
  }

  for (const cloud of game.smokeClouds) {
    const alpha = clamp(cloud.life / cloud.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = overlay ? 0.46 * alpha : 0.62 * alpha;
    for (let i = 0; i < 9; i += 1) {
      const angle = cloud.seed + i * 1.7 + cloud.age * 0.18;
      const offset = Math.sin(cloud.age * 0.7 + i) * cloud.radius * 0.18;
      const x = cloud.x + Math.cos(angle) * offset;
      const y = cloud.y + Math.sin(angle) * offset;
      const r = cloud.radius * (0.58 + (i % 3) * 0.13);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, "rgba(214, 222, 219, 0.92)");
      gradient.addColorStop(1, "rgba(151, 161, 158, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawMinimap() {
  if (!settings.showMinimap) {
    minimap.style.display = "none";
    return;
  }
  minimap.style.display = "";
  const width = minimap.width;
  const height = minimap.height;
  const sx = width / WORLD.width;
  const sy = height / WORLD.height;
  mini.clearRect(0, 0, width, height);
  mini.fillStyle = IO_THEME.ink;
  mini.fillRect(0, 0, width, height);

  mini.fillStyle = IO_THEME.grass;
  mini.fillRect(3, 3, width - 6, height - 6);

  if (game.mapFeatures) {
    for (const zone of game.mapFeatures.zones || []) {
      mini.fillStyle = zone.color.replace(/[\d.]+\)$/, "0.55)");
      mini.fillRect(zone.x * sx, zone.y * sy, Math.max(2, zone.w * sx), Math.max(2, zone.h * sy));
    }

    mini.fillStyle = IO_THEME.water;
    for (const river of game.mapFeatures.rivers) {
      mini.fillRect(river.x * sx, river.y * sy, Math.max(1, river.w * sx), Math.max(1, river.h * sy));
    }

    mini.fillStyle = IO_THEME.road;
    for (const bridge of game.mapFeatures.bridges) {
      mini.fillRect(bridge.x * sx, bridge.y * sy, Math.max(2, bridge.w * sx), Math.max(2, bridge.h * sy));
    }

    mini.fillStyle = "rgba(58, 126, 42, 0.8)";
    for (const zone of game.mapFeatures.stealthZones) {
      if (zone.type === "field") {
        mini.fillRect(zone.x * sx, zone.y * sy, Math.max(2, zone.w * sx), Math.max(2, zone.h * sy));
      } else {
        mini.beginPath();
        mini.arc(zone.x * sx, zone.y * sy, Math.max(2, (zone.r || zone.radius || 80) * sx), 0, TAU);
        mini.fill();
      }
    }
  }

  for (const obstacle of game.obstacles) {
    if (obstacle.type !== "building" && obstacle.type !== "wall") continue;
    mini.fillStyle = obstacle.type === "building" ? "#747b7b" : "#343a39";
    mini.fillRect(obstacle.x * sx, obstacle.y * sy, Math.max(1, obstacle.w * sx), Math.max(1, obstacle.h * sy));
  }

  if (game.zone.mode !== "hidden") {
    mini.strokeStyle = IO_THEME.danger;
    mini.lineWidth = 2;
    mini.beginPath();
    mini.arc(game.zone.x * sx, game.zone.y * sy, game.zone.radius * sx, 0, TAU);
    mini.stroke();
  }

  if (game.extractionZones && game.extractionZones.length) {
    mini.strokeStyle = IO_THEME.exfil;
    mini.lineWidth = 2;
    for (const zone of game.extractionZones) {
      mini.beginPath();
      mini.arc(zone.x * sx, zone.y * sy, Math.max(3, zone.radius * sx), 0, TAU);
      mini.stroke();
    }
  }

  for (const fighter of aliveFighters()) {
    if (!fighter.isPlayer && distance(fighter, game.player) > 1400) continue;
    mini.fillStyle = fighter.color;
    mini.strokeStyle = IO_THEME.ink;
    mini.lineWidth = fighter.isPlayer ? 2 : 1;
    mini.beginPath();
    mini.arc(fighter.x * sx, fighter.y * sy, fighter.isPlayer ? 4.2 : 2.8, 0, TAU);
    mini.fill();
    mini.stroke();
  }

  mini.fillStyle = IO_THEME.white;
  mini.beginPath();
  mini.moveTo(game.player.x * sx, game.player.y * sy - 7);
  mini.lineTo(game.player.x * sx + 5, game.player.y * sy + 5);
  mini.lineTo(game.player.x * sx - 5, game.player.y * sy + 5);
  mini.closePath();
  mini.fill();
}

function showMenu() {
  game = null;
  mouse.down = false;
  ui.hud.classList.add("hidden");
  ui.gameOver.classList.add("hidden");
  ui.menu.classList.remove("hidden");
  showMenuTab("home");
  renderProfile();
}

function showMenuTab(tab) {
  const target = tab || "home";
  document.querySelectorAll("[data-menu-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.menuPanel === target);
  });
}

function renderProfile() {
  ui.playerName.textContent = profile.name;
  const kd = profile.deaths === 0 ? profile.kills : profile.kills / profile.deaths;
  ui.profileStats.innerHTML = `
    <span>Nom: ${profile.name}</span>
    <span>Credits: ${profile.credits}</span>
    <span>Casier: ${profile.stash.length} objet${profile.stash.length > 1 ? "s" : ""}</span>
    <span>Parties: ${profile.games}</span>
    <span>Victoires: ${profile.wins}</span>
    <span>Eliminations: ${profile.kills}</span>
    <span>Morts: ${profile.deaths}</span>
    <span>K/D: ${kd.toFixed(2)}</span>
  `;
  renderLocker();
}

function renderLocker() {
  if (!ui.lockerGrid) return;
  ensureLockerIds();
  ui.creditsCount.textContent = `${profile.credits} credits`;
  if (ui.lockerLoadout) {
    const count = profile.extractionLoadout.length;
    ui.lockerLoadout.textContent = count
      ? `${count} objet${count > 1 ? "s" : ""} equipe${count > 1 ? "s" : ""} pour la prochaine extraction.`
      : "Selectionne des equipements pour la prochaine extraction.";
  }
  ui.lockerGrid.innerHTML = "";

  if (!profile.stash.length) {
    const empty = document.createElement("div");
    empty.className = "locker-item locker-empty";
    empty.style.setProperty("--rarity", "#b8bec6");
    empty.innerHTML = `<strong>Casier vide</strong><small>Extrais-toi avec du loot pour le remplir.</small>`;
    ui.lockerGrid.appendChild(empty);
    return;
  }

  for (const item of profile.stash) {
    const card = document.createElement("div");
    const selected = lockerSelection.has(item.id);
    card.className = `locker-item${selected ? " selected" : ""}`;
    card.style.setProperty("--rarity", item.color || itemColor(item));
    card.tabIndex = 0;

    const iconCanvas = document.createElement("canvas");
    iconCanvas.className = "locker-icon";
    iconCanvas.width = 96;
    iconCanvas.height = 72;
    drawHotbarIcon(iconCanvas, item);

    const text = document.createElement("div");
    text.className = "locker-info";
    const name = document.createElement("strong");
    name.textContent = item.label || itemLabel(item);
    const meta = document.createElement("small");
    meta.textContent = `${item.price || 0} credits`;
    text.append(name, meta);

    card.append(iconCanvas, text);
    card.addEventListener("click", () => toggleLockerItem(item.id));
    card.addEventListener("keydown", (event) => {
      if (event.code !== "Space" && event.code !== "Enter") return;
      event.preventDefault();
      toggleLockerItem(item.id);
    });
    ui.lockerGrid.appendChild(card);
  }
}

function ensureLockerIds() {
  let changed = false;
  for (const item of [...profile.stash, ...profile.extractionLoadout]) {
    if (!item.id) {
      item.id = makeId("stash");
      changed = true;
    }
  }
  if (changed) saveData();
}

function toggleLockerItem(id) {
  if (!id) return;
  if (lockerSelection.has(id)) lockerSelection.delete(id);
  else lockerSelection.add(id);
  renderLocker();
}

function sellSelectedLockerItems() {
  ensureLockerIds();
  const selected = profile.stash.filter((item) => lockerSelection.has(item.id));
  if (!selected.length) {
    addMenuNotice("Selectionne au moins un objet a vendre.");
    return;
  }
  profile.credits += selected.reduce((sum, item) => sum + (item.price || 0), 0);
  profile.stash = profile.stash.filter((item) => !lockerSelection.has(item.id));
  lockerSelection.clear();
  saveData();
  renderProfile();
}

function equipSelectedForExtraction() {
  ensureLockerIds();
  const selected = profile.stash.filter((item) => lockerSelection.has(item.id));
  const equipable = selected.filter((item) => item.kind === "weapon" || item.kind === "consumable" || item.kind === "backpack" || item.kind === "armor");
  if (!equipable.length) {
    addMenuNotice("Selectionne une arme, un soin, une armure ou un sac.");
    return;
  }
  const hotbarAlreadyReserved = profile.extractionLoadout.filter((item) => item.kind === "weapon" || item.kind === "consumable").length;
  let hotbarSlotsLeft = Math.max(0, HOTBAR_SIZE - 1 - hotbarAlreadyReserved);
  const picked = [];
  for (const item of equipable) {
    if (item.kind === "weapon" || item.kind === "consumable") {
      if (hotbarSlotsLeft <= 0) continue;
      hotbarSlotsLeft -= 1;
    }
    picked.push(item);
  }
  if (!picked.length) {
    addMenuNotice("La hotbar de depart est deja pleine.");
    return;
  }
  const pickedIds = new Set(picked.map((item) => item.id));
  profile.extractionLoadout.push(...picked);
  profile.stash = profile.stash.filter((item) => !pickedIds.has(item.id));
  lockerSelection.clear();
  saveData();
  renderProfile();
}

function addMenuNotice(text) {
  if (!ui.lockerLoadout) return;
  ui.lockerLoadout.textContent = text;
}

function renderSkins() {
  ui.skinsGrid.innerHTML = "";
  for (const skin of skins) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "skin-card";
    card.innerHTML = `
      <span class="skin-swatch" style="background:${skin.color}"></span>
      <span>${skin.label}</span>
      <span>${profile.skin === skin.id ? "Equipe" : "Equiper"}</span>
    `;
    card.addEventListener("click", () => {
      profile.skin = skin.id;
      saveData();
      renderSkins();
    });
    ui.skinsGrid.appendChild(card);
  }
}

function setKeybind(action, code) {
  if (!settings.keybinds[action]) return;
  settings.keybinds[action] = [code];
  settings.waitingBind = null;
  saveData();
  renderKeybindButtons();
}

function formatCode(code) {
  return code
    .replace("Key", "")
    .replace("Arrow", "")
    .replace("ShiftLeft", "Shift")
    .replace("ShiftRight", "Shift")
    .replace("Space", "Espace");
}

function renderKeybindButtons() {
  document.querySelectorAll(".keybind").forEach((button) => {
    const action = button.dataset.action;
    const labels = {
      up: "Avancer",
      left: "Gauche",
      down: "Reculer",
      right: "Droite",
      reload: "Recharger",
      dash: "Esquive",
      build: "Construire",
      cycleMaterial: "Materiau",
    };
    button.textContent = settings.waitingBind === action
      ? `${labels[action]}: appuie sur une touche`
      : `${labels[action]}: ${settings.keybinds[action].map(formatCode).join("/")}`;
  });
}

function loop(time) {
  const now = time / 1000;
  const dt = Math.min(0.033, now - lastFrame || 0);
  lastFrame = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  if (settings.waitingBind) {
    event.preventDefault();
    setKeybind(settings.waitingBind, event.code);
    return;
  }

  const playKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "KeyZ", "KeyQ", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "Space", "ShiftLeft", "ShiftRight", "KeyR", "KeyB", "KeyE", "KeyI", "KeyX", "Digit1", "Digit2", "Digit3", "Digit4", ...Object.values(settings.keybinds).flat()];
  if (playKeys.includes(event.code)) event.preventDefault();
  if (game && game.state === "playing" && !event.repeat) {
    if (event.code === "KeyI" && game.mode === "extraction") {
      toggleBagPanel();
      return;
    }
    if ((settings.keybinds.build || []).includes(event.code)) {
      tryBuildWall(game.player);
      return;
    }
    if ((settings.keybinds.cycleMaterial || []).includes(event.code)) {
      cycleBuildMaterial(game.player);
      return;
    }
  }
  if (event.code.startsWith("Digit")) {
    switchHotbarSlot(Number(event.code.replace("Digit", "")) - 1);
  }
  keys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

canvas.addEventListener("pointermove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

canvas.addEventListener("pointerdown", (event) => {
  if (game && game.state === "playing") {
    if (event.button === 2) {
      event.preventDefault();
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      updateMouseWorld();
      game.player.aim = Math.atan2(mouse.worldY - game.player.y, mouse.worldX - game.player.x);
      tryBuildWall(game.player);
      return;
    }
    if (event.button !== 0) return;
    canvas.setPointerCapture(event.pointerId);
    mouse.down = true;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }
});

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

canvas.addEventListener("pointerup", () => {
  mouse.down = false;
});

canvas.addEventListener("pointercancel", () => {
  mouse.down = false;
});

canvas.addEventListener("wheel", (event) => {
  if (!game || game.state !== "playing") return;
  event.preventDefault();
  const direction = event.deltaY > 0 ? 1 : -1;
  const next = (game.player.activeSlot + direction + HOTBAR_SIZE) % HOTBAR_SIZE;
  switchHotbarSlot(next);
}, { passive: false });

document.querySelectorAll("[data-menu-tab]").forEach((button) => {
  button.addEventListener("click", () => showMenuTab(button.dataset.menuTab));
});

document.querySelectorAll(".keybind").forEach((button) => {
  button.addEventListener("click", () => {
    settings.waitingBind = button.dataset.action;
    renderKeybindButtons();
  });
});

ui.renameButton.addEventListener("click", () => {
  const nextName = window.prompt("Nouveau pseudo", profile.name);
  if (!nextName) return;
  profile.name = nextName.trim().slice(0, 18) || profile.name;
  saveData();
  renderProfile();
});

ui.volumeSlider.addEventListener("input", () => {
  settings.volume = Number(ui.volumeSlider.value);
  saveData();
});

ui.showMinimapToggle.addEventListener("change", () => {
  settings.showMinimap = ui.showMinimapToggle.checked;
  minimap.style.display = settings.showMinimap ? "" : "none";
  saveData();
});

ui.playButton.addEventListener("click", () => showMenuTab("modes"));
ui.normalModeButton.addEventListener("click", () => newGame("normal"));
ui.nightModeButton.addEventListener("click", () => newGame("night"));
ui.extractionModeButton.addEventListener("click", () => newGame("extraction"));
ui.retryButton.addEventListener("click", () => newGame(lastGameMode));
ui.menuButton.addEventListener("click", showMenu);
ui.sellLockerButton.addEventListener("click", sellSelectedLockerItems);
ui.equipExtractionButton.addEventListener("click", equipSelectedForExtraction);
ui.bagCloseButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  event.stopPropagation();
  toggleBagPanel(false);
});

ui.volumeSlider.value = settings.volume;
ui.showMinimapToggle.checked = settings.showMinimap;
minimap.style.display = settings.showMinimap ? "" : "none";
renderProfile();
renderSkins();
renderKeybindButtons();
resize();
requestAnimationFrame(loop);

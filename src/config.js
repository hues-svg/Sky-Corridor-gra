export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

export const CONFIG = {
  scrollSpeed: 130,
  player: {
    speed: 280,
    fireRate: 130,
    hp: 5,
    bulletSpeed: 620,
  },
  enemy: {
    baseSpeed: 120,
    bulletSpeed: 260,
    fireRateMin: 850,
    fireRateMax: 1450,
    spawnRate: 1600,
    hp: 2,
  },
  turret: {
    spawnRate: 2200,
    bulletSpeed: 300,
    fireRate: 1200,
    hp: 3,
  },
  difficulty: {
    rampEveryMs: 10000,
    spawnRateFloor: 780,
    turretRateFloor: 1300,
    enemyBulletCap: 380,
  },
  world: {
    terrainWidth: 88,
  },
};

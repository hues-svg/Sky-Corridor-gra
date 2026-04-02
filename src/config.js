export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

export const CONFIG = {
  scrollSpeed: 130,
  player: {
    speed: 300,
    touchFollowLerp: 0.3,
    fireRate: 115,
    hp: 5,
    bulletSpeed: 650,
  },
  enemy: {
    baseSpeed: 120,
    bulletSpeed: 265,
    fireRateMin: 800,
    fireRateMax: 1350,
    spawnRate: 1600,
    hp: 2,
  },
  turret: {
    spawnRate: 2100,
    bulletSpeed: 320,
    fireRate: 1180,
    hp: 3,
  },
  difficulty: {
    rampEveryMs: 10000,
    spawnRateFloor: 760,
    turretRateFloor: 1250,
    enemyBulletCap: 390,
  },
  fx: {
    impactParticles: 24,
    bigImpactParticles: 42,
  },
  world: {
    terrainWidth: 88,
  },
};

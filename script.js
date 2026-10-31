
import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x090316);
scene.fog = new THREE.FogExp2(0x10051f, 0.018);

const camera = new THREE.PerspectiveCamera(
  65, window.innerWidth / window.innerHeight, 0.1, 200
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// LIGHTS
scene.add(new THREE.HemisphereLight(0x9d8aff, 0x170b25, 2));

const moon = new THREE.DirectionalLight(0xc4caff, 2);
moon.position.set(-15, 25, 10);
moon.castShadow = true;
scene.add(moon);

function pointLight(color, intensity, distance, x, y, z) {
  const light = new THREE.PointLight(color, intensity, distance);
  light.position.set(x, y, z);
  scene.add(light);
  return light;
}

// MATERIALS
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x171024, roughness: 0.9
});

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(90, 90), groundMat
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// WORLD DECORATION
function box(w, h, d, color, x, y, z, glow = false) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: glow ? color : 0x000000,
    emissiveIntensity: glow ? 1.5 : 0
  });

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d), mat
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

// CARNIVAL FENCE
for (let i = -18; i <= 18; i += 2) {
  box(0.12, 2, 0.12, 0x8d2cff, i, 1, -20);
  box(0.12, 2, 0.12, 0x8d2cff, i, 1, 20);
  box(0.12, 2, 0.12, 0x8d2cff, -20, 1, i);
  box(0.12, 2, 0.12, 0x8d2cff, 20, 1, i);
}

box(40, 0.12, 0.15, 0xff24d2, 0, 2, -20, true);
box(40, 0.12, 0.15, 0xff24d2, 0, 2, 20, true);

// FERRIS WHEEL
const wheel = new THREE.Group();
wheel.position.set(-12, 7, -11);
scene.add(wheel);

const ringMat = new THREE.MeshStandardMaterial({
  color: 0xff37db,
  emissive: 0xff00bb,
  emissiveIntensity: 1.5
});

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(5, 0.13, 12, 64), ringMat
);
wheel.add(ring);

const hub = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 24, 24),
  new THREE.MeshStandardMaterial({
    color: 0x55faff,
    emissive: 0x00dfff,
    emissiveIntensity: 2
  })
);
wheel.add(hub);

for (let i = 0; i < 12; i++) {
  const angle = i * Math.PI / 6;

  const spoke = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 5, 0.09),
    new THREE.MeshStandardMaterial({
      color: 0x75faff,
      emissive: 0x00aaff,
      emissiveIntensity: 1
    })
  );

  spoke.rotation.z = angle;
  wheel.add(spoke);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    new THREE.MeshStandardMaterial({
      color: i % 2 ? 0xff28c8 : 0x32eaff,
      emissive: i % 2 ? 0xff0088 : 0x0088ff,
      emissiveIntensity: 1
    })
  );

  cabin.position.set(
    Math.sin(angle) * 5,
    -Math.cos(angle) * 5,
    0
  );
  wheel.add(cabin);
}

box(0.5, 7, 0.5, 0x7715a8, -14, 3.5, -11);
box(0.5, 7, 0.5, 0x7715a8, -10, 3.5, -11);

pointLight(0xff00cc, 35, 25, -12, 7, -11);

// CIRCUS TENT
const tent = new THREE.Group();
tent.position.set(10, 0, -10);
scene.add(tent);

const tentMat = new THREE.MeshStandardMaterial({
  color: 0xff168f,
  roughness: 0.65
});

const tentBody = new THREE.Mesh(
  new THREE.ConeGeometry(5, 7, 8),
  tentMat
);
tentBody.position.y = 3.5;
tentBody.castShadow = true;
tent.add(tentBody);

const tentTop = new THREE.Mesh(
  new THREE.SphereGeometry(0.45, 16, 16),
  new THREE.MeshStandardMaterial({
    color: 0xffff44,
    emissive: 0xffaa00,
    emissiveIntensity: 2
  })
);
tentTop.position.y = 7;
tent.add(tentTop);

pointLight(0xff2288, 25, 20, 10, 4, -10);

// DECORATIVE TREES
for (let i = 0; i < 18; i++) {
  const x = (Math.random() - 0.5) * 36;
  const z = (Math.random() - 0.5) * 36;

  if (Math.abs(x) < 7 && Math.abs(z) < 7) continue;

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.3, 2.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x3c2141 })
  );
  trunk.position.set(x, 1.25, z);
  scene.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1.4, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0x172c35 })
  );
  leaves.position.set(x, 4, z);
  scene.add(leaves);
}

// PLAYER
const player = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.45, 0.8, 5, 12),
  new THREE.MeshStandardMaterial({
    color: 0x24eaff,
    emissive: 0x006b99,
    emissiveIntensity: 0.8
  })
);
body.position.y = 0.9;
body.castShadow = true;
player.add(body);

const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.38, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0xffd5b5 })
);
head.position.y = 1.8;
player.add(head);

const playerLight = new THREE.PointLight(0x00ddff, 4, 6);
playerLight.position.y = 1.5;
player.add(playerLight);

player.position.set(0, 0, 8);
scene.add(player);

// CLOWN ENEMY
const clown = new THREE.Group();

const clownBody = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.55, 0.8, 5, 12),
  new THREE.MeshStandardMaterial({
    color: 0x9c092f,
    emissive: 0x460010
  })
);
clownBody.position.y = 0.9;
clown.add(clownBody);

const clownHead = new THREE.Mesh(
  new THREE.SphereGeometry(0.48, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0xf1e4d9 })
);
clownHead.position.y = 1.9;
clown.add(clownHead);

const nose = new THREE.Mesh(
  new THREE.SphereGeometry(0.14, 16, 16),
  new THREE.MeshStandardMaterial({
    color: 0xff1515,
    emissive: 0xff0000,
    emissiveIntensity: 1.5
  })
);
nose.position.set(0, 1.85, 0.44);
clown.add(nose);

for (const x of [-0.2, 0.2]) {
  const eye = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0x080008 })
  );
  eye.position.set(x, 2, 0.42);
  clown.add(eye);
}

clown.position.set(12, 0, 12);
scene.add(clown);

pointLight(0xff0033, 8, 8, 12, 2, 12);

// KEYS
const keys = [];
const keyPositions = [
  [-12, 0.8, 4],
  [11, 0.8, -4],
  [0, 0.8, -15]
];

keyPositions.forEach(pos => {
  const key = new THREE.Group();

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.09, 10, 20),
    new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffaa00,
      emissiveIntensity: 2
    })
  );
  key.add(ring);

  const stem = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.55, 0.12),
    new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffaa00
    })
  );
  stem.position.y = -0.35;
  key.add(stem);

  key.position.set(...pos);
  scene.add(key);
  keys.push(key);
});

// EXIT GATE
const exit = new THREE.Group();
exit.position.set(0, 0, -18);
scene.add(exit);

box(0.5, 4, 0.5, 0x00ffbb, -1.8, 2, -18, true);
box(0.5, 4, 0.5, 0x00ffbb, 1.8, 2, -18, true);
box(4.1, 0.4, 0.5, 0x00ffbb, 0, 4, -18, true);

const exitLight = pointLight(0x00ffbb, 12, 10, 0, 3, -18);

// INPUT
const pressed = {};
let running = false;
let keyCount = 0;
let lives = 3;
let ended = false;

window.addEventListener("keydown", e => {
  pressed[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
  pressed[e.key.toLowerCase()] = false;
});

// MOBILE BUTTONS
document.querySelectorAll("#mobileControls button").forEach(btn => {
  const key = btn.dataset.key.toLowerCase();

  btn.addEventListener("pointerdown", e => {
    e.preventDefault();
    pressed[key] = true;
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach(event => {
    btn.addEventListener(event, () => pressed[key] = false);
  });
});

// START GAME
document.getElementById("startBtn").addEventListener("click", () => {
  running = true;
  document.getElementById("startScreen").classList.add("hidden");
});

// END GAME
function finish(win) {
  if (ended) return;
  ended = true;
  running = false;

  document.getElementById("endTitle").textContent =
    win ? "YOU ESCAPED!" : "THE CLOWN CAUGHT YOU!";

  document.getElementById("endMessage").textContent =
    win ? "You escaped the cursed carnival!" :
    "The carnival has claimed another visitor.";

  document.getElementById("endScreen").classList.remove("hidden");
}

// ANIMATION LOOP
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.04);
  const time = clock.elapsedTime;

  wheel.rotation.z += delta * 0.25;

  keys.forEach((key, i) => {
    if (key.visible) {
      key.rotation.y += delta * 2;
      key.position.y = 0.9 + Math.sin(time * 2 + i) * 0.2;
    }
  });

  if (running && !ended) {
    let dx = 0;
    let dz = 0;

    if (pressed["w"] || pressed["arrowup"]) dz -= 1;
    if (pressed["s"] || pressed["arrowdown"]) dz += 1;
    if (pressed["a"] || pressed["arrowleft"]) dx -= 1;
    if (pressed["d"] || pressed["arrowright"]) dx += 1;

    const length = Math.hypot(dx, dz);

    if (length > 0) {
      dx /= length;
      dz /= length;

      player.position.x += dx * 6 * delta;
      player.position.z += dz * 6 * delta;
      player.rotation.y = Math.atan2(dx, dz);
    }

    player.position.x = THREE.MathUtils.clamp(
      player.position.x, -18, 18
    );
    player.position.z = THREE.MathUtils.clamp(
      player.position.z, -18, 18
    );

    // CLOWN CHASE
    const distance = clown.position.distanceTo(player.position);

    if (distance > 1.5) {
      const direction = new THREE.Vector3()
        .subVectors(player.position, clown.position)
        .normalize();

      clown.position.addScaledVector(direction, 2.3 * delta);
      clown.rotation.y = Math.atan2(direction.x, direction.z);
    }

    // COLLECT KEYS
    keys.forEach(key => {
      if (key.visible &&
          key.position.distanceTo(player.position) < 1.5) {
        key.visible = false;
        keyCount++;
        document.getElementById("keys").textContent =
          `${keyCount} / 3`;
        document.getElementById("message").textContent =
          "Key collected! Keep exploring!";
      }
    });

    // CLOWN CONTACT
    if (distance < 1.3) {
      lives--;
      document.getElementById("lives").textContent = lives;

      player.position.set(0, 0, 8);
      clown.position.set(12, 0, 12);

      if (lives <= 0) finish(false);
    }

    // ESCAPE
    if (
      keyCount === 3 &&
      Math.abs(player.position.x) < 2.5 &&
      player.position.z < -16
    ) {
      finish(true);
    }

    if (keyCount === 3) {
      document.getElementById("message").textContent =
        "EXIT UNLOCKED! Reach the glowing gate!";
    }
  }

  // FOLLOW CAMERA
  const cameraTarget = new THREE.Vector3(
    player.position.x,
    5.5,
    player.position.z + 8
  );

  camera.position.lerp(cameraTarget, 0.08);
  camera.lookAt(
    player.position.x,
    1.2,
    player.position.z - 2
  );

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

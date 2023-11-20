import * as THREE from "three";
import * as lil from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CANNON, { Vec3 } from "cannon";
import sounds from "../static/sounds/hit.mp3"
/**
 * 基础
 */
const canvas = document.querySelector("#webgl");
const scene = new THREE.Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * 调试器
 */
const gui = new lil.GUI();
const debugObject = {};
debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
debugObject.createBox = () => {
  createBox(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(debugObject, "createSphere");
gui.add(debugObject, "createBox");

/**
 * 纹理
 */
const textureLoader = new THREE.TextureLoader();
/**
 * 声音
 */
const hitSound = new Audio(sounds)
const playSound = (collision) =>{
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()
  if(impactStrength > 1.5){
    hitSound.volume = Math.random()
    hitSound.currentTime = 0
    hitSound.play()
  }
}
/**
 * cannon  物理世界
 */
const world = new CANNON.World();
// 设置物体碰撞检测模式
world.broadphase = new CANNON.SAPBroadphase(world)
// 静止的物体设置静止属性
world.allowSleep = true 
//设置重力
world.gravity.set(0, -9.82, 0);

//地板
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape,
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);
//材料
const defalutMaterial = new CANNON.Material();
const defalutContactMaterial = new CANNON.ContactMaterial(
  defalutMaterial,
  defalutMaterial,
  {
    friction: 0.1,
    restitution: 0.6,
  }
);
world.addContactMaterial(defalutContactMaterial);
world.defaultContactMaterial = defalutContactMaterial;
/**
 * 对象
 */
const objectToUpdate = [];
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
});
//sphere
const createSphere = (radius, position) => {
  // threejs
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);
  //cannon
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defalutMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide",playSound)
  world.addBody(body);

  objectToUpdate.push({
    mesh: mesh,
    body: body,
  });
};
//box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
});
const createBox = (width, height, depth, position) => {
  // threejs
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  //cannon
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defalutMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide",playSound)
  world.addBody(body);

  objectToUpdate.push({
    mesh: mesh,
    body: body,
  });
};
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
  })
);
floor.receiveShadow = true;

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);
/**
 * 灯光
 */
const light = new THREE.DirectionalLight("#ffffff", 1);
light.castShadow = true;
light.position.set(2, 2, 0);
scene.add(light);

/**
 * 鼠标事件
 */
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});
//双击全屏
// window.addEventListener("dblclick", () => {
//   const fullscreenElement =
//     document.fullscreenElement || document.webkitFullscreenElement;

//   if (!fullscreenElement) {
//     if (canvas.requestFullscreen) {
//       canvas.requestFullscreen();
//     } else if (canvas.webkitRequestFullscreen) {
//       canvas.webkitRequestFullscreen();
//     }
//   } else {
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if (document.webkitExitFullscreen) {
//       document.webkitExitFullscreen();
//     }
//   }
// });

/**
 * 相机
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 3, 3);
scene.add(camera);
/**
 * 渲染器
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
/**
 * 更新屏幕变化
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  //处理像素比
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/**
 * 内置控制
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();
let oldTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldTime;
  oldTime = deltaTime;

  world.step(1 / 60, oldTime, 3);

  for (const object of objectToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

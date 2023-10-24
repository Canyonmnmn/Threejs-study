import * as THREE from "three";
import * as lil from "lil-gui";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import color from "../static/door/color.jpg";
import alpha from "../static/door/alpha.jpg";
import ambientOcclusion from "../static/door/ambientOcclusion.jpg";
import height from "../static/door/height.jpg";
import normal from "../static/door/normal.jpg";
import metalness from "../static/door/metalness.jpg";
import roughness from "../static/door/roughness.jpg";
import bricksColor from "../static/bricks/color.jpg";
import bricksAmbientOcclusion from "../static/bricks/ambientOcclusion.jpg";
import bricksNormal from "../static/bricks/normal.jpg";
import bricksRoughness from "../static/bricks/roughness.jpg";
import grassColor from "../static/grass/color.jpg";
import grassAmbientOcclusion from "../static/grass/ambientOcclusion.jpg";
import grassNormal from "../static/grass/normal.jpg";
import grassRoughness from "../static/grass/roughness.jpg";

/**
 * 基础
 */
const canvas = document.querySelector("#webgl");
const scene = new THREE.Scene();
// 雾
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;
/**
 * 调试器
 */
const gui = new lil.GUI();
/**
 * 纹理
 */
//门
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load(color);
const doorAlphaTexture = textureLoader.load(alpha);
const doorAmbientOcclusionTexture = textureLoader.load(ambientOcclusion);
const doorHeightTexture = textureLoader.load(height);
const doorNormalTexture = textureLoader.load(normal);
const doorMetalnessTexture = textureLoader.load(metalness);
const doorRoughnessTexture = textureLoader.load(roughness);
//墙
const bricksColorTexture = textureLoader.load(bricksColor);
const bricksAmbientOcclusionTexture = textureLoader.load(
  bricksAmbientOcclusion
);
const bricksNormalTexture = textureLoader.load(bricksNormal);
const bricksRoughnessTexture = textureLoader.load(bricksRoughness);
//草地
const grassColorTexture = textureLoader.load(grassColor);
const grassAmbientOcclusionTexture = textureLoader.load(grassAmbientOcclusion);
const grassNormalTexture = textureLoader.load(grassNormal);
const grassRoughnessTexture = textureLoader.load(grassRoughness);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * 材质
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
/**
 * 对象
 */
// 房子
const house = new THREE.Group();
scene.add(house);
// 房子的墙
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    transparent: true,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25;
//房子的顶
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 3;
roof.rotation.y = Math.PI * 0.25;
//房子的门
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 2.001;
door.position.y = 1;
house.add(walls, roof, door);
//灌木丛
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);
//墓地
const graves = new THREE.Group();
scene.add(graves);
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2bb6b1" });
for (let i = 1; i <= 50; i++) {
  const angle = Math.PI * 2 * Math.random();
  const radius = Math.random() * 6 + 3;
  const graveX = Math.sin(angle) * radius;
  const graveZ = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(graveX, 0.3, graveZ);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;
  graves.add(grave);
}
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    roughnessMap: grassRoughnessTexture,
    normalMap: grassNormalTexture,
    aoMap: grassAmbientOcclusionTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.array, 2)
);
floor.position.y = 0;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

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
  // console.log(cursor);
});
//双击全屏
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

/**
 * 相机
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 2, 7);
// camera.lookAt(cube.position);
scene.add(camera);
/**
 * 灯
 */
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

const doorLight = new THREE.PointLight("#ff7d46", 1.5, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

//鬼魂
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);

scene.add(ghost1, ghost2, ghost3);

/**
 * 渲染器
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor("#262837");
/**
 * 阴影
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;

floor.receiveShadow = true;

moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 7;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

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
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
const clock = new THREE.Clock();
const tick = () => {
  const time = clock.getElapsedTime();
  const ghost1Angel = time * 0.5;
  ghost1.position.x = Math.sin(ghost1Angel) * 4;
  ghost1.position.z = Math.cos(ghost1Angel) * 4;
  ghost1.position.y = Math.sin(ghost1Angel * 3);

  const ghost2Angel = -time * 0.35;
  ghost2.position.x = Math.sin(ghost2Angel) * 6;
  ghost2.position.z = Math.cos(ghost2Angel) * 6;
  ghost2.position.y = Math.sin(ghost2Angel * 4);

  const ghost3Angel = time * 0.25;
  ghost3.position.x = Math.sin(ghost3Angel) * 8;
  ghost3.position.z = Math.cos(ghost3Angel) * 8;
  ghost3.position.y = Math.sin(ghost3Angel * 3);

  control.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

import * as THREE from "three";
import gsap from "gsap";
import * as lil from "lil-gui";
import "./style.css";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import color from "../static/color.jpg";
import alpha from "../static/alpha.jpg";
import ambientOcclusion from "../static/ambientOcclusion.jpg";
import height from "../static/height.png";
import roughness from "../static/roughness.jpg";
import metalness from "../static/metalness.jpg";
import matcaps from "../static/1.jpg";
import gradients from "../static/3.jpg";
/**
 * 基础
 */
const canvas = document.querySelector("#webgl");
const scene = new THREE.Scene();
/**
 * 调试器
 */
const gui = new lil.GUI();
const defaultSet = {
  metalness: 0.65,
  roughness: 0.45,
};
/**
 * 材质
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load(color);
const doorAlphaTexture = textureLoader.load(alpha);
const doorAmbientOcclusionTexture = textureLoader.load(ambientOcclusion);
const doorHeightTexture = textureLoader.load(height);
const doorMetalnessTexture = textureLoader.load(metalness);
const doorRoughnessTexture = textureLoader.load(roughness);
const matcapTexture = textureLoader.load(matcaps);
const gradientTexture = textureLoader.load(gradients);
/**
 * 对象
 */
// const material = new THREE.MeshBasicMaterial({ map: matcapTexture });
// const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);
// const material = new THREE.MeshToonMaterial();
const material = new THREE.MeshStandardMaterial({
  metalness: defaultSet.metalness,
  roughness: defaultSet.roughness,
  map: doorColorTexture,
});
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.x = 1.5;

gui.add(material, "metalness").min(0).max(1).step(0.001).name("金属度");
gui.add(material, "roughness").min(0).max(1).step(0.001).name("粗糙度");

scene.add(sphere, plane, torus);
/**
 * 灯光
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
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
camera.position.set(0, 0, 3);
camera.lookAt(sphere.position);
scene.add(camera);

/**
 * 渲染器
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
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
  const elapsedTime = clock.getElapsedTime();
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;
  control.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

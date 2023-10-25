import * as THREE from "three";
import * as lil from "lil-gui";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import particle from "../static/textures/particles/2.png";

/**
 * 基础
 */
const canvas = document.querySelector("#webgl");
const scene = new THREE.Scene();

/**
 * 调试器
 */
const gui = new lil.GUI();
/**
 * 纹理
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load(particle);
/**
 * 材质
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
/**
 * 对象
 */
//geometry

const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  positions[i] = (Math.random() - 0.5) * 5;
  colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particlesMatrial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  // color: "#ff88cc",
  transparent: true,
  alphaMap: particleTexture,
  // alphaTest: 0.01,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMatrial);
scene.add(particles);
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
camera.position.set(1, 2, 5);
// camera.lookAt(cube.position);
scene.add(camera);
/**
 * 灯
 */
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

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
  const time = clock.getElapsedTime();

  control.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

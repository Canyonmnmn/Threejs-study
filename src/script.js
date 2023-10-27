import * as THREE from "three";
import * as lil from "lil-gui";
import "./style.css";
import gradientImg from "../static/textures/gradient/3.jpg";
import { gsap } from "gsap";

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
const parameters = {};
parameters.color = "#ffeded";

gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});
/**
 * 纹理
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load(gradientImg);
gradientTexture.magFilter = THREE.NearestFilter;
/**
 * 对象
 */
const objectDistance = 6;

const material = new THREE.MeshToonMaterial({
  color: parameters.color,
  gradientMap: gradientTexture,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
mesh1.position.y = 0;
mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 2;

mesh1.position.x = 3;
mesh2.position.x = -3;
mesh3.position.x = 3;

scene.add(mesh1, mesh2, mesh3);
const meshArray = [mesh1, mesh2, mesh3];
//粒子
const count = 200;
const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial({
  sizeAttenuation: true,
  size: 0.03,
  color: parameters.color,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

const positions = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  positions[i3 + 0] = (Math.random() - 0.5) * 10;
  positions[i3 + 1] = (Math.random() - 0.5) * 30;
  positions[i3 + 2] = Math.random() * 3;
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
scene.add(particles);

/**
 * 灯光
 */
const light = new THREE.DirectionalLight("#ffffff", 1);
light.position.set(1, 1, 0);
scene.add(light);

const directionalLightHelper = new THREE.DirectionalLightHelper(light, 0.2);
scene.add(directionalLightHelper);
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
const cameraGroup = new THREE.Group();

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 5);
cameraGroup.add(camera);
scene.add(cameraGroup);
/**
 * 滚动
 */
let scrollY = window.scrollY;
let currentPage = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const page = Math.round(scrollY / sizes.height);
  if (page != currentPage) {
    currentPage = page;
    gsap.to(meshArray[currentPage].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});
/**
 * 渲染器
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
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
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const time = clock.getElapsedTime();
  const deltaTime = time - previousTime;
  previousTime = time;
  camera.position.y = (-scrollY / sizes.height) * objectDistance;

  cameraGroup.position.x += (cursor.x - cameraGroup.position.x) * 2 * deltaTime;
  cameraGroup.position.y +=
    (-cursor.y - cameraGroup.position.y) * 2 * deltaTime;

  for (const item of meshArray) {
    item.rotation.x += deltaTime * 0.1;
    item.rotation.y += deltaTime * 0.2;
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

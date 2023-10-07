import * as THREE from "three";
import gsap from "gsap";
import * as lil from "lil-gui";
import "./style.css";
import imageSource from "../static/color.jpg";
import imageSource2 from "../static/ambientOcclusion.jpg";
import imageSource3 from "../static/roughness.jpg";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * 基础
 */
const canvas = document.querySelector("#webgl");
const scene = new THREE.Scene();
// 调试器配置
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(cube1.rotation, { duration: 3, y: cube1.rotation.y + 10 });
  },
};
//纹理配置
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
loadingManager.onStart = () => {
  console.log("loading started");
};
loadingManager.onLoad = () => {
  console.log("loading finished");
};
loadingManager.onProgress = () => {
  console.log("loading progressing");
};
loadingManager.onError = () => {
  console.log("loading error");
};

// const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(imageSource2);
// texture.repeat.x = 2;
// texture.repeat.y = 3;
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
texture.rotation = Math.PI / 4;
texture.center.x = 0.5;
texture.center.y = 0.5;
// texture.minFilter = THREE.NearestFilter;
/**
 * 组
 */
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
  // new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ map: texture })
);

//自己创建顶点
// const geometry = new THREE.BufferGeometry();

// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// geometry.setAttribute("position", positionsAttribute);
// const cube1 = new THREE.Mesh(
//   geometry,
//   new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
// );
group.add(cube1);
/**
 * 调试器
 */
const gui = new lil.GUI();
gui.add(cube1.position, "y").min(-1).max(1).step(0.01).name("物体Y值");
gui.add(cube1, "visible").name("物体是否可见");
gui.add(cube1.material, "wireframe").name("物体模式");

gui
  .addColor(parameters, "color")
  .name("物体颜色")
  .onChange(() => {
    cube1.material.color.set(parameters.color);
  });
gui.add(parameters, "spin");
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
camera.lookAt(cube1.position);
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
const tick = () => {
  control.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

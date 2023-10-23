import * as THREE from "three";
import gsap from "gsap";
import * as lil from "lil-gui";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import matcapIMG from "../static/8.png";
import bakedShadowimg from "../static/bakedShadow.jpg";
import simpleShadowimg from "../static/simpleShadow.jpg";
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
const bakedShadow = textureLoader.load(bakedShadowimg);
const simpleShadow = textureLoader.load(simpleShadowimg);

/**
 * 材质
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
/**
 * 对象
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  // new THREE.MeshBasicMaterial({ map: bakedShadow })
  material
);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
scene.add(sphere, plane);

const planeShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
);
planeShadow.position.y = plane.position.y + 0.01;
planeShadow.rotation.x = -Math.PI * 0.5;
scene.add(planeShadow);
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
camera.position.set(1, 1, 2);
// camera.lookAt(cube.position);
scene.add(camera);
/**
 * 灯
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionLight.position.set(2, 2, -1);
gui.add(directionLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionLight.position, "x").min(-5).max(5).step(1);
gui.add(directionLight.position, "y").min(-5).max(5).step(1);
gui.add(directionLight.position, "z").min(-5).max(5).step(1);

scene.add(directionLight);

directionLight.castShadow = false;
//阴影面积大小
directionLight.shadow.mapSize.width = 1024;
directionLight.shadow.mapSize.height = 1024;
//设置阴影相机的远近面 以及 面积
directionLight.shadow.camera.near = 1;
directionLight.shadow.camera.far = 6;
directionLight.shadow.camera.right = 2;
directionLight.shadow.camera.top = 2;
directionLight.shadow.camera.bottom = -2;
directionLight.shadow.camera.left = -2;
directionLight.shadow.radius = 10;

//threejs中是利用相机来来渲染阴影地图
const directionLightCameraHelper = new THREE.CameraHelper(
  directionLight.shadow.camera
);
directionLightCameraHelper.visible = false;
scene.add(directionLightCameraHelper);

const spotLight = new THREE.SpotLight(0xffffff, 2.5, 10, Math.PI * 0.3);
spotLight.castShadow = false;

spotLight.position.set(0, 2, 2);
gui.add(spotLight, "intensity").min(0).max(4).step(0.01);
scene.add(spotLight);
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 5;

//这个是什么？
scene.add(spotLight.target);
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

const pointLight = new THREE.PointLight(0xffffff, 0.4);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = false;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);
/**
 * 渲染器
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = false;

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
  sphere.position.x = Math.cos(time) * 1.5;
  sphere.position.z = Math.sin(time) * 1.5;
  sphere.position.y = Math.abs(Math.sin(time));

  planeShadow.position.x = sphere.position.x;
  planeShadow.position.z = sphere.position.z;
  planeShadow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.5;
  control.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

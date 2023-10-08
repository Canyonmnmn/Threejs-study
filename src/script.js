import * as THREE from "three";
import gsap from "gsap";
import * as lil from "lil-gui";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import matcapIMG from "../static/8.png";
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
const matcapTexture = textureLoader.load(matcapIMG);
/**
 * 字体
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log("字体加载完毕");
  const textGeometry = new TextGeometry("Hello THREEJS!", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  // textGeometry.computeBoundingBox();

  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) / 2,
  //   -(textGeometry.boundingBox.max.y - 0.02) / 2,
  //   -(textGeometry.boundingBox.max.z - 0.03) / 2
  // );
  // console.log(textGeometry.boundingBox);
  textGeometry.center();
  const matrial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, matrial);
  scene.add(text);
  const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 20, 45);

  for (let i = 0; i < 300; i++) {
    const donut = new THREE.Mesh(donutGeometry, matrial);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
  }
});
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
  control.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

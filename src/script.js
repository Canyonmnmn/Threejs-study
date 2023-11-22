import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import "./style.css"
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('#webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

const objectsToTest = [object1,object2,object3]
//射线
const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3,0,0)
// const rayDirection = new THREE.Vector3(10,0,0)

// rayDirection.normalize();

// raycaster.set(rayOrigin,rayDirection)


scene.add(object1, object2, object3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
/**
 * 鼠标坐标
 */
const mouse = new THREE.Vector2();
let currentObject = null
window.addEventListener("mousemove",(event)=>{
  mouse.x = event.clientX / sizes.width * 2 - 1
  mouse.y =  - (event.clientY / sizes.height) * 2 + 1
})
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)
/**
 * lights
 */
const light1 = new THREE.AmbientLight("#ffffff",0.3)
scene.add(light1)
const light2 = new THREE.DirectionalLight("#ffffff",0.3)
light2.position.set(1,2,3)
scene.add(light2)
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * models
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  '/models/Duck/glTF-Binary/Duck.glb',
  (gltf)=>{
    gltf.scene.position.y = -1.2
    scene.add(gltf.scene)
  }
)
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // 球的动画
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    const intersects = raycaster.intersectObjects([...objectsToTest])

    raycaster.setFromCamera(mouse,camera)
  
    for(const intersect of intersects){
      intersect.object.material.color.set('#0000ff')
    }

    for(const object of objectsToTest){
      if(!intersects.find(intersect => intersect.object === object)){
          object.material.color.set('#ff0000')
      }
    }

// for(const object of objectsToTest)
// {
// object.material.color.set('#ff0000')
// }
// for(let intersect of intersects){
//   intersect.object.material.color.set("#0000ff")
// }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
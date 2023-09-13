import * as THREE from 'three'
// 轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// lil-gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// Hdr 加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// gltf 加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// draco 解析器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 补间动画
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'



// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,  // 近平面
  1000
)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true

document.body.appendChild(renderer.domElement)


// 设置相机位置
camera.position.z = 15
camera.position.x = 2
camera.position.y = 2
// 视角
camera.lookAt(0, 0, 0)


// 世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 设置时钟
const clock  = new THREE.Clock()

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼惯性
controls.enableDamping = true
// 阻尼系数
controls.dampingFactor = 0.05
// 旋转速度
// controls.autoRotate = true


const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
smallBall.position.set(2, 2, 2)
// scene.add(smallBall)


// 渲染函数 
function render() {

  let time = clock.getElapsedTime()
  smallBall.position.x= Math.sin(time) * 3
  smallBall.position.z = Math.cos(time) * 3
  smallBall.position.y = Math.sin(time * 10) + 2
  controls.update()
  requestAnimationFrame(render)
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera) 
  // 更新 tween
  TWEEN.update()
}
render()


// 监听窗口的变化
window.addEventListener("resize", () => {

  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight

  // 更新相机投影矩阵
  camera.updateProjectionMatrix()

})



// 创建球
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
  // color: 0x00ff00,
})
const sphere = new THREE.Mesh(sphereGeometry, material)
// sphere.position.x = -3
// 物体投射阴影
sphere.castShadow = true
scene.add(sphere)

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(10, 10)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
// 设置接收阴影
plane.receiveShadow = true
scene.add(plane)

// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)



// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(2, 2, 2)
// 光照投射阴影
pointLight.castShadow = true
// 阴影模糊度
pointLight.shadow.radius = 20
// 阴影题图分辨率
pointLight.shadow.mapSize.set(512, 512)

// pointLight.target = sphere
// pointLight.angle = Math.PI / 6
pointLight.distance = 0
// pointLight.penumbra = 0
pointLight.decay = 0
// 透视相机属性
// scene.add(pointLight)

smallBall.add(pointLight)
scene.add(smallBall)


const gui = new GUI()
gui
  .add(sphere.position, "x")
  .min(-5)
  .max(5)
  .step(0.1)

gui
  .add(pointLight, "distance")
  .min(0)
  .max(10)
  .step(0.001)
gui
  .add(pointLight, "decay")
  .min(0)
  .max(10)
  .step(0.01)
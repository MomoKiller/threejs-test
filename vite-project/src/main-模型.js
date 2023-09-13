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
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


// 设置相机位置
camera.position.z = 5
camera.position.x = 2
camera.position.y = 2
// 视角
camera.lookAt(0, 0, 0)


// 世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼惯性
controls.enableDamping = true
// 阻尼系数
controls.dampingFactor = 0.05
// 旋转速度
// controls.autoRotate = true


// 渲染函数 
function animate() {
  controls.update()
  requestAnimationFrame(animate)
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera) 
}
animate()


// 监听窗口的变化
window.addEventListener("resize", () => {

  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight

  // 更新相机投影矩阵
  camera.updateProjectionMatrix()

})


// 创建场景 fog
// scene.fog = new THREE.Fog(0x999999, 0.1, 50)

// 指数 fog
// scene.fog = new THREE.FogExp2(0x999999, 0.1)
// scene.background = new THREE.Color(0x999999)


// 实例化 gltf
const gltfLoader = new GLTFLoader()
gltfLoader.load(
  // 路径
  "./model/ex01/DamagedHelmet.gltf",  // JSON 格式
  // 加载完成回调
  (gltf) => {
    console.log(gltf)
    scene.add(gltf.scene)
  }
)

gltfLoader.load(
  // 路径
  "./model/tokyo/LittlestTokyo.glb",  // JSON 格式
  // 加载完成回调
  (gltf) => {
    console.log(gltf)
    scene.add(gltf.scene)
  }
)

// 实例化 draco 解析器
const dracoLoader = new DRACOLoader()
// 设置解析器文件路径
dracoLoader.setDecoderPath('./draco/')
// 加载解码器
gltfLoader.setDRACOLoader(dracoLoader)

// 加载环境贴图
let rgbeLoder = new RGBELoader()
rgbeLoder.load('./texture/ex02/HDRI08.hdr', (envMap) => {
  // 设置球形映射
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置背景贴图
  scene.background = envMap
  // 设置环境贴图
  scene.environment = envMap
  // 设置 plane 环境贴图
  planeMaterial.envMap = envMap
})
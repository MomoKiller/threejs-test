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
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
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
  // 更新 tween
  TWEEN.update()
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



// 创建球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  })
)
sphere1.position.x = -3
scene.add(sphere1)

// 补间对象
const tween = new TWEEN.Tween(sphere1.position)
tween.to({ x: 3 }, 1000)
// 循环次数
// tween.repeat(Infinity)
// 循环往复
// tween.yoyo(true)
// 延迟
// tween.delay(3000)
// 缓动函数
tween.easing(TWEEN.Easing.Quadratic.InOut)

// 设置第二个补间对象
const tween2 = new TWEEN.Tween(sphere1.position)
tween2.to({ x: -3 }, 1000)
// 链接补间对象
tween.chain(tween2)
tween2.chain(tween)
tween.start()
// 回调函数
tween.onStart(() => {
  console.log(sphere1.position.x)
})
tween.onComplete(() => {
  console.log(sphere1.position.x)
})
// 暂停
tween.onStop(() => {
  console.log(sphere1.position.x)
})
tween.onUpdate(() => {
  console.log(sphere1.position.x)
})


let params = {
  stop: function() {
    tween.stop()
  }
}



// 创建 GUI
const gui = new GUI()
gui.add(params, 'stop')
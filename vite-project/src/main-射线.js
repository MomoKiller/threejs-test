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



// 创建三个球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  })
)
sphere1.position.x = -3
scene.add(sphere1)

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  })
)
scene.add(sphere2)

const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xff00ff,
  })
)
sphere3.position.x = 3
scene.add(sphere3)

// 创建射线
const raycaster = new THREE.Raycaster()
// 创建鼠标向量
const mouse = new THREE.Vector2()

// 点击事件
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // 通过相机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera)
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3])

  if(intersects.length > 0) {
    if(intersects[0].object._isSelect) {
      intersects[0].object._isSelect = false
      intersects[0].object.material.color.set(
        intersects[0].object._originColor
      )
      return
    }
    // 自定义属性
    intersects[0].object._isSelect = true 
    intersects[0].object._originColor =  intersects[0].object.material.color.getHex()
    intersects[0].object.material.color.set(0xff0000)
  }
}) 

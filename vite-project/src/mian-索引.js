import * as THREE from 'three'

// 轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// lil-gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'


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


/**
// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 材质
const meterial = new THREE.MeshBasicMaterial({ color: 0x00ff00})
meterial.wireframe = true
// 网格
const cube = new THREE.Mesh(geometry, meterial)
// 位移
cube.position.set(0, 0, 0)
// 绕 X 轴旋转
cube.rotation.x = Math.PI / 4
// 网格添加到场景中
scene.add(cube)
*/


// 创建几何体
const geometry = new THREE.BufferGeometry()
/*
// 创建顶点数据
const vertice = new Float32Array([
  -1.0, -1.0, 0.0, 
  1.0, -1.0, 0.0,
  1.0, 1.0, 0.0,

  1.0, 1.0, 0.0,
  -1.0, 1.0, 0,
  -1.0, -1.0, 0
])
// 顶点属性
geometry.setAttribute("position", new THREE.BufferAttribute(vertice, 3))
*/


// 使用索引绘制
const vertice = new Float32Array([
  -1.0, -1.0, 0.0, 
  1.0, -1.0, 0.0,
  1.0, 1.0, 0.0,
  -1.0, 1.0, 0.0,
])
geometry.setAttribute("position", new THREE.BufferAttribute(vertice, 3))
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0 ])
// 索引属性
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

// 创建材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
  wireframe: true
})

const plance = new THREE.Mesh(geometry, material)
scene.add(plance)


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

/** 手动按钮
var btn = document.createElement("button")
btn.innerHTML = '点击全屏'
btn.style.position = 'absolute'
btn.style.top = '10px'
btn.style.left = '10px'
btn.style.zIndex = '999'
btn.onclick = function() {
  // 画布全屏
  // renderer.domElement.requestFullscreen()
  // body 全屏
  document.body.requestFullscreen()
}
document.body.appendChild(btn)


// 退出全屏
var exitBtn = document.createElement("button")
exitBtn.innerHTML = '退出全屏'
exitBtn.style.position = 'absolute'
exitBtn.style.top = '10px'
exitBtn.style.left = '100px'
exitBtn.style.zIndex = '999'
exitBtn.onclick = function() {
  document.exitFullscreen()
}
document.body.appendChild(exitBtn)

*/

// 使用gui控制器
let eventObj = {
  Fullscreen: function() {
    document.body.requestFullscreen()
  },
  ExitFullscreen: function() {
    document.exitFullscreen()
  }
}


// 创建 GUI
const gui = new GUI()
// 添加按钮
gui.add(eventObj, "Fullscreen").name("全屏")
gui.add(eventObj, "ExitFullscreen").name("退出全屏")


// 控制几何体位置
// gui.add(cube.position, "x", -5, 5).name("立方体位置")

let folder = gui.addFolder("立方体位置")
folder
  .add(cube.position, "x")
  .min(-10)
  .max(10)
  .step(1)
  .name("立方体x轴位置")
  .onChange(val => {
    // 立方体x轴位置
  })
folder
  .add(cube.position, "y")
  .min(-10)
  .max(10)
  .step(1)
  .name("立方体y轴位置")
  .onFinishChange(val => {
    // 改变后的数值

  })
folder
  .add(cube.position, "z")
  .min(-10)
  .max(10)
  .step(1)
  .name("立方体z轴位置")



gui.add(meterial, "wireframe").name("父元素的线框模式")


let colorParams = {
  cubeColor: "#00ff00"
}
gui
  .addColor(colorParams, "cubeColor")
  .name("立方体颜色")
  .onChange(val => {
    cube.material.color.set(val)
  })


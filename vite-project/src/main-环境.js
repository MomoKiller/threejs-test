import * as THREE from 'three'

// 轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// lil-gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

// Hdr 加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'


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


// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// 材质
const cubeMeterial0 = new THREE.MeshBasicMaterial({ 
  color: 0x00ff00,
  // wireframe: true
})
const cubeMeterial1 = new THREE.MeshBasicMaterial({ 
  color: 0xff0000,
})
const cubeMeterial2 = new THREE.MeshBasicMaterial({ 
  color: 0x0000ff,
})
const cubeMeterial3 = new THREE.MeshBasicMaterial({ 
  color: 0xff00ff,
})
const cubeMeterial4 = new THREE.MeshBasicMaterial({ 
  color: 0x00ffff,
})
const cubeMeterial5 = new THREE.MeshBasicMaterial({ 
  color: 0xffff00,
})

// 网格
const cube = new THREE.Mesh(cubeGeometry, [
  cubeMeterial0,
  cubeMeterial1,
  cubeMeterial2,
  cubeMeterial3,
  cubeMeterial4,
  cubeMeterial5
])
// 位移
cube.position.set(2, 0, 0)
// 绕 X 轴旋转
cube.rotation.x = Math.PI / 4
// 网格添加到场景中
// scene.add(cube)



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

// 设置两个顶点租 startIndex, count, index
geometry.addGroup(0, 3, 0)
geometry.addGroup(3, 3, 1)


// 创建材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
  // wireframe: true
})

const material1 = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
  // wireframe: true
})

// const plance = new THREE.Mesh(geometry, material)
// 按索引设置两个材质
// const plance = new THREE.Mesh(geometry, [material,material1])
// scene.add(plance)


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


/*
// 使用gui控制器
let eventObj = {
  Fullscreen: function() {
    document.body.requestFullscreen()
  },
  ExitFullscreen: function() {
    document.exitFullscreen()
  }
}
*/


// 创建 GUI
const gui = new GUI()

// 纹理加载器
let textureLoader = new THREE.TextureLoader()
// 加载纹理
let texture = textureLoader.load('./texture/ex02/news-1.png')
// 纹理彩色空间
texture.colorSpace = THREE.SRGBColorSpace
// texture.colorSpace = THREE.LinearSRGBColorSpace
// texture.colorSpace = THREE.NoColorSpace

// 加载 ao 贴图
let aoMap = textureLoader.load('./texture/ex02/app-1.png')

// 透明度贴图
let alphaMap = textureLoader.load('./texture/ex02/style-2.png')

// 光照贴图
let lightMap = textureLoader.load('./texture/ex02/duty-6.png')
// 高光贴图
let specularMap = textureLoader.load('./texture/ex02/style-5.png')

// RGBLoader
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

let planeGeometry = new THREE.PlaneGeometry(1, 1)
let planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: texture,
  // 允许透明度
  transparent: true,
  // 设置 ao
  aoMap: aoMap,
  aoMapIntensity: 1,
  // 透明度贴图
  // alphaMap: alphaMap,
  // 光照贴图
  // lightMap: lightMap,
  // 高光贴图
  specularMap: specularMap,
  // 反射强度
  reflectivity: 0.5,

})
let plance = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plance)

gui.add(planeMaterial, "aoMapIntensity").min(0).max(1).name("ao贴图强度")

gui
  .add(texture, "colorSpace", {
    sRGB: THREE.SRGBColorSpace,
    Linear: THREE.LinearSRGBColorSpace
  })
  .onChange(() =>{
    texture.needsUpdate = true
  })


/*
// 添加按钮
gui.add(eventObj, "Fullscreen").name("全屏")
gui.add(eventObj, "ExitFullscreen").name("退出全屏")


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

*/
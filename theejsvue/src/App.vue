<script setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { Water } from "three/examples/jsm/objects/Water2"
import gsap from "gsap"
import { ref } from 'vue'

// 创建场景
const scene = new THREE.Scene()


// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,  // 近平面
  1000
)
// 设置相机位置
camera.position.set(-3.23, 3, 4.06)
// camera.position.set(0, 0, 0)
// camera.aspect = window.innerWidth / window.innerHeight
// 更新投影矩阵
camera.updateProjectionMatrix()
// 视角
camera.lookAt(0, 0, 0)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.outputEncoding = THREE.sRGBEncoding
// 设置色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 色调映射亮度
renderer.toneMappingExposure = 0.5
// 投影题图
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(-8, 2, 0)
controls.enableDamping = true

// 解压模型
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("./draco/")
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


// 加载环境纹理
let rgbeLoader = new RGBELoader()
rgbeLoader.load("./texture/HDRI08.hdr", (texture)=> {
  // 设置球面映射
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})


// 加载模型
// gltfLoader.load("./model/tokyo/LittlestTokyo.glb", (gltf) => {
gltfLoader.load("./model/ex01/DamagedHelmet.gltf", (gltf) => {
  const model = gltf.scene
  // model.scale.set(0.1, 0.1, 0.1)
  // 遍历
  model.traverse((child) => {
    if(child.name === 'Plane'){
      child.visible = false
    }
    // 是物体能投射和 接受阴影
    if(child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  // model.scale.set(0.01, 0.01, 0.01)
  scene.add(model)
})


// 创建水面
const waterGeometry = new THREE.CircleGeometry(300, 32)
const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeght: 10254,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 1
})
water.rotation.x = -Math.PI / 2
water.position.y = -2
scene.add(water)


// 平行光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 50, 0)
scene.add(light)

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 50)
pointLight.position.set(0.5, 2.3, 0)
pointLight.castShadow = true
scene.add(pointLight)

// 创建点光源组
const pointLightGroup = new THREE.Group()
pointLightGroup.position.set(-8, 2.5, -1.5)
let radius= 3
let pointLightArr = []
for(let i=0; i<3; i++){

  const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 10
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

  pointLightArr.push(sphere)

  // 位置
  sphere.position.set(
    radius * Math.cos((i * 2 * Math.PI) / 3),
    Math.cos((i * 2 * Math.PI) / 3),
    radius * Math.sin((i * 2 * Math.PI) / 3)
  )
  let pointLight = new THREE.PointLight(0xffffff, 10)

  // 添加点光源
  sphere.add(pointLight)

  pointLightGroup.add(sphere)
}
scene.add(pointLightGroup)

// 补间函数 0-2Π
let options = {
  angle: 0,
}

gsap.to(options, {
  angle: Math.PI * 2,
  duration: 10,
  repeat: -1,
  ease: "linear",
  onUpdate: () => {
    pointLightGroup.rotation.y = options.angle
    pointLightArr.forEach((item, index) => {
      item.position.set(
        radius * Math.cos((index * 2 * Math.PI) / 3),
        Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5),
        radius * Math.sin((index * 2 * Math.PI) / 3)
      )
    })
  }
})

// 渲染函数
function render() {
  requestAnimationFrame(render)
  // 渲染
  renderer.render(scene, camera) 
  controls.update()
}

render()

// 使用补间动画移动相机
let timeLine1 = gsap.timeline()
let timeLine2 = gsap.timeline()

// 相机移动函数
function tranlateCamera(position, target) {
  timeLine1.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z
  })
  timeLine2.to(controls.target, {
    x: target.x,
    y: target.y,
    z: target.z
  })
}

let scenes = [{
  text: "Hello World",
  callback: () => {
    // 执行函数，切换位置
    tranlateCamera(
      new THREE.Vector3(-3.23, 3, 4.06),
      new THREE.Vector3(-8, 2, 0)
    )
    // makeHeart()
  }
},{
  text: "Hello Vue",
  callback: () => {
    // 执行函数，切换位置
    tranlateCamera(
      new THREE.Vector3(7, 0, 23),
      new THREE.Vector3(0, 0, 0)
    )
  }
},{
  text: "Hello React",
  callback: () => {
    // 执行函数，切换位置
    tranlateCamera(
      new THREE.Vector3(10, 3, 0),
      new THREE.Vector3(5, 2, 0)
    )
    // makeHeart()
  }
},{
  text: "Hello Cat",
  callback: () => {
    // 执行函数，切换位置
    tranlateCamera(
      new THREE.Vector3(10, 3, 0),
      new THREE.Vector3(5, 2, 0)
    )
  }
},{
  text: "Hello java",
  callback: () => {
    // 执行函数，切换位置
    tranlateCamera(
      new THREE.Vector3(-20, 1.3, 6.6),
      new THREE.Vector3(5, 2, 0)
    )
  }
}]

let wordsIndex = ref(0)
let isAnimate = false

// 鼠标滚轮事件
window.addEventListener(
  "wheel",
  (e) => {
    if(isAnimate) return
    isAnimate = true
    if(e.deltaY > 0) {
      wordsIndex.value ++
      if(wordsIndex.value > scenes.length -1) {
        wordsIndex.value = 0
      }
    }
    console.log(wordsIndex.value)
    scenes[wordsIndex.value].callback()
  },
  false
)


// 实例化创建漫天星星
let startInstance = new THREE.InstancedMesh(
  new THREE.SphereGeometry(0.1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 10
  }),
  100
)

// 随机分布到天上
let startArr = []
let endArr = []

for(let i=0; i< 100; i++) {
  let x = Math.random() * 100 - 50
  let y = Math.random() * 100 - 50 
  let z = Math.random() * 100 - 50
  startArr.push(new THREE.Vector2(x, y, z))

  let matrix  = new THREE.Matrix4()
  matrix.setPosition(x,y,z)
  startInstance.setMatrixAt(i, matrix)
}

scene.add(startInstance)


// 创建爱心路径
let heartShap = new THREE.Shape()
heartShap.moveTo(25, 25)
heartShap.bezierCurveTo(25, 25, 20, 0, 0, 0)
heartShap.bezierCurveTo(-30, 0, -30, 35, -30, 35)
heartShap.bezierCurveTo(-30, 55, -10, 77, 25, 95)
heartShap.bezierCurveTo(60, 77, 80, 55, 80, 35)
heartShap.bezierCurveTo(80, 35, 80, 0, 50, 0)
heartShap.bezierCurveTo(35, 0, 25, 25, 25, 25)

let center = new THREE.Vector3(0, 2, 10)

// 根据爱心路径获取点
for(let i=0; i< 100; i++) {
  let point = heartShap.getPoint(i/100)
  endArr.push(
    new THREE.Vector3(
      point.x * 0.1 + center.x,
      point.y * 0.1 + center.y,
      center.z
    )
  )
}

// 创建爱心
function makeHeart() {
  let params = {
    time: 0
  }

  gsap.to(
    params,
    {
      time: 1,
      duration: 1,
      onUpdate: () => {
        for(let i=0; i< 100; i++) {
          let x = startArr[i].x + (endArr[i].x - startArr[i].x) * params.time
          let y = startArr[i].y + (endArr[i].y - startArr[i].y) * params.time
          let z = startArr[i].z + (endArr[i].z - startArr[i].z) * params.time

          let matrix = new THREE.Matrix4()
          matrix.setPosition(x, y, z)
          startInstance.setMatrixAt(i, matrix)
        }
        startInstance.instanceMatrix.needsUpdate = true
      }
    }
  )
}


</script>

<template>
  <div 
    class="scenes" 
    style="
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      pointer-events: none;
      transition: all 1s;
    "
    :style="{
      transform: `translate3d(0, ${-wordsIndex * 100}vh 0);`
    }"
  >
    <div 
      v-for="item in scenes"
      style="
        width: 100vw;
        height: 100vh;
      "
    >
      <h1 
        style="
          padding: 100px 50px;
          font-size: 50px;
          color: #fff;
        "
      >{{ item.text }}</h1>
    </div>
  </div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}

canvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>

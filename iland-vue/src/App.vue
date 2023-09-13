<script setup>
import { ref, onMounted } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// 水面
import { Water } from "three/examples/jsm/objects/Water2"
// gltf 加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// draco 解析器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"


// 初始化场景
const scene = new THREE.Scene()

// 透视 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
)
camera.position.set(-50, 50, 130)
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight
// 更新摄像头矩阵
camera.updateProjectionMatrix()

scene.add(camera)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  // 对数深度缓冲区
  logarithmicDepthBuffer: true
})
// 输出编码模式
renderer.outputColorSpace = THREE.outputColorSpace

renderer.setSize(window.innerWidth, window.innerHeight)

window.addEventListener("resize", ()=> {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

document.body.appendChild(renderer.domElement)

const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}



const canvasContainer = ref(null)

onMounted(() => {
  canvasContainer.value.appendChild(renderer.domElement)

  render()

  // 平面
  const planeGeometry = new THREE.PlaneGeometry(100, 100)
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  // scene.add(plane)

  // 控制器实例
  const controls = new OrbitControls(camera, renderer.domElement)

  // 创建天空球
  const skyGeometry = new THREE.SphereGeometry(1000, 60, 60)
  const texture = new THREE.TextureLoader().load('./texture/sky.jpg')
  const skyMaterial = new THREE.MeshBasicMaterial({
    map: texture
  })
  skyGeometry.scale(1, 1, -1)
  const sky = new THREE.Mesh(skyGeometry, skyMaterial)
  // scene.add(sky)

  // scene.background = texture
  // scene.environment = texture

  // 视频纹理
  const video = document.createElement("video")
  video.src = "./texture/helwo.mp4"
  video.loop = true

  // window.addEventListener("click", (e)=> {
  //   // 鼠标移动播放视频
  //   // 判断视频播放状态
  //   if(video.paused) {
  //     video.play()
  //     let texture = new THREE.VideoTexture(video)
  //     skyMaterial.map = texture
  //     skyMaterial.map.needsUpdate = true
  //   }
  // })

  // HDR 环境纹理
  const hdrLoader = new RGBELoader()
  hdrLoader.loadAsync('./texture/sunflowers_puresky_2k.hdr').then((texture)=> {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  })

  // 创建水面
  const waterGeometry = new THREE.CircleGeometry(300, 64)
  const water = new Water(waterGeometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0xeeeeff,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 1
  })
  water.position.y = 1
  water.rotation.x = -Math.PI / 2 
  scene.add(water)

  // 机器人模型
  // 实例化 gltf 
  const gltfLoader = new GLTFLoader()
  // 实例化 draco 解析器
  const dracoLoader = new DRACOLoader()
  // 设置解析器文件路径
  dracoLoader.setDecoderPath('./draco/')
  // 加载解码器
  gltfLoader.setDRACOLoader(dracoLoader)
  gltfLoader.load(
    // "./model/robot/RobotExpressive.glb",
    "./model/coast_rocks/coast_rocks_05_4k.gltf",
    (gltf) => {
      const robotScene = gltf.scene
      robotScene.scale.set(50, 50, 50)
      scene.add(robotScene)
    }
  )

})



</script>

<template>
  <div class="canvasContainer" ref="canvasContainer">
  </div>
</template>

<style scoped>
.canvasContainer {
  width: 100vw;
  height: 100vh;
}
</style>

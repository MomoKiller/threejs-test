<script setup>
import * as THREE from "three"
import { ref, onMounted, onUnmounted } from "vue"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// gltf 加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// draco 解析器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Reflector } from "three/examples/jsm/objects/Reflector"

let screenDom = ref(null)

onMounted(() => {
  let scene = new THREE.Scene()
  let camera = new THREE.PerspectiveCamera(
    75,
    screenDom.value.clientWidth / screenDom.value.clientHeight,
    0.1,
    1000
  )

  camera.position.set(0, 1.5, 6)

  // 渲染器
  let renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(screenDom.value.clientWidth, screenDom.value.clientHeight)
  screenDom.value.appendChild(renderer.domElement)

  // 辅助坐标轴
  let axes = new THREE.AxesHelper(5)
  scene.add(axes)

  // 控制器
  let control = new OrbitControls(camera, renderer.domElement)


  // 纹理加载器
  let textureLoader = new THREE.TextureLoader()
  // RGBLoader
  // let rgbeLoder = new RGBELoader()
  // rgbeLoder.load('./texture/ex02/HDRI08.hdr', (envMap) => {
  textureLoader.load('./texture/ke/HDRI08.jpg', (envMap) => {
    // 设置球形映射
    envMap.mapping = THREE.EquirectangularReflectionMapping
    // 设置背景贴图
    scene.background = envMap
    // 设置环境贴图
    scene.environment = envMap
  })


  // 添加机器人
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
    "./model/ex01/DamagedHelmet.gltf",
    (gltf) => {
      const robotScene = gltf.scene
      // robotScene.scale.set()
      scene.add(robotScene)
    }
  )

  // 灯光
  const light1 = new THREE.DirectionalLight(0xffffff, 1)
  light1.position.set(0, 0, 10)
  const light2 = new THREE.DirectionalLight(0xffffff, 1)
  light2.position.set(0, 0, -10)
  const light3 = new THREE.DirectionalLight(0xffffff, 1)
  light3.position.set(10, 0, 0)
  scene.add(light1, light2, light3)

  // 光阵
  let video = document.createElement("video")
  video.src = "./helwo.mp4"
  video.loop = true // 循环
  video.muted = true  
  video.play()

  let videoTexture = new THREE.VideoTexture(video)
  const videoGeoPlane = new THREE.PlaneGeometry(16, 9)
  const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true,  
    side: THREE.DoubleSide,
    alphaMap: videoTexture
  })
  const videoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial)
  videoMesh.position.set(0, -1, 0)
  videoMesh.rotation.set(-Math.PI / 2, 0, 0)
  scene.add(videoMesh)

  // 镜面反射
  let reflectorGeometry = new THREE.PlaneGeometry(100, 100)
  let reflectorPlane = new Reflector(reflectorGeometry, {
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight,
    color: 0x332222,
  })
  reflectorPlane.position.set(0, -1.2, 0)
  reflectorPlane.rotation.x = -Math.PI / 2
  scene.add(reflectorPlane)



  // 渲染
  function render(){
    requestAnimationFrame(render)
    renderer.render(scene, camera)
  }
  render()

})

</script>

<template>
  <div class="canvas-container" ref="screenDom"></div>
</template>

<style scoped>

.canvas-container {
  width: 100vw;
  height: 100vh;
}
</style>

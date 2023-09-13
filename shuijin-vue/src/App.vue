<script setup>
import { onMounted, ref, render } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const canvasContainer = ref(null)



onMounted(() => {

  // 初始化场景
  const scene = new THREE.Scene()
  // 相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  // 相机位置
  camera.position.set(1.5, 1, 1.5)
  // 相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 相机矩阵更新
  camera.updateProjectionMatrix()

  // 加载背景纹理
  const loader = new THREE.TextureLoader()
  const bgTexture = loader.load("./texture/ke/HDRI08.jpg")
  bgTexture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = bgTexture
  scene.environment = bgTexture


  // 环境光
  const ambient = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambient)


  // 加载物体
  const gltfLoader = new GLTFLoader()
  gltfLoader.load(
    "./model/ex01/DamagedHelmet.gltf",
    (gltf) => {

      const model = gltf.scene.children[0]
      // 更改水晶材质
      model.material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        envMap: bgTexture,  // 反射映射
        refractionRatio: 0.7,
        reflectivity: 0.99,
      })

      // model.scale.set(0.1, 0.1, 0.1)
      scene.add(model)
    }
  )

  // 初始化渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  // 渲染器大小
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 今天屏幕变化
  window.addEventListener("resize", ()=>{
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })

  // 渲染器加入 dom
  canvasContainer.value.appendChild(renderer.domElement)
  // 控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  // 阻尼
  controls.enableDamping = true

  // 渲染函数
  const render = () => {
    // 更新控制器
    controls.update()
    // 渲染场景
    renderer.render(scene, camera)
    // 循环渲染
    requestAnimationFrame(render)
  }

  render()

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

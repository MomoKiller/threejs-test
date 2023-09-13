<script setup>
import { ref, onMounted } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"

const canvasContainer = ref(null)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
)
camera.position.set(0, 0, 800)

const renderer = new THREE.WebGLRenderer({
  antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 渲染函数
const render = () => {
  requestAnimationFrame(render)
  controls.update()
  renderer.render(scene, camera)
}

onMounted(() => {
  canvasContainer.value.appendChild(renderer.domElement)

  // 环境纹理
  const texture = new THREE.TextureLoader().load('./texture/sky.jpg')
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
  // 背景模糊度
  scene.backgroundBlurriness = 0.5


  render()

  // 加载字体
  const loader = new FontLoader()
  loader.load(
    "./font/optimer_bold.typeface.json",
    (font) => {
      const geometry = new TextGeometry(
        "Hello world",
        { 
          font: font,
          size: 80,
          height: 5,
          curveSegments: 12,
          bevelEnabled: true, // 启用斜角
          bevelThickness: 1, // 斜角厚度
          bevelSize: 8,
          bevelSegments: 5
        }
      )
      geometry.center()
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xeeeeff,
        roughness: 0,
        reflectivity: 1,
        thickness: 80,
        ior: 1.5,
        transmission: 1,
        side: THREE.DoubleSide
      })

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
    }
  )

})

</script>

<template>
  <div class="canvas-container" ref="canvasContainer">
  </div>
</template>

<style scoped>

.canvas-container {
  width: 100vw;
  height: 100vh;
}
</style>

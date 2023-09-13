<script setup>
import { ref, onMounted } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"


const canvasContainer = ref(null)

let material

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 3

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

// 实例化 gltf 
const gltfLoader = new GLTFLoader()
// 实例化 draco 解析器
const dracoLoader = new DRACOLoader()
// 设置解析器文件路径
dracoLoader.setDecoderPath('./draco/')
//
dracoLoader.setDecoderConfig({ type: "js" })
// 加载解码器
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load(
  "./model/coast_rocks/coast_rocks_05_4k.gltf",
  (gltf) => {

    let text = gltf.scene.children[0]
    // scene.add(gltf.scene)

    let geometry = text.geometry
    const position = geometry.attributes.position
    const vertexCount = position.count
    const triangleCount = vertexCount / 3

    const randomDirections = []
    const randomStrengths = []

    for(let i=0; i< triangleCount; i++) {
      const dir = new THREE.Vector3(
        Math.random() * 2 -1,
        Math.random() * 2 -1,
        Math.random() * 2 -1
      )
      .normalize()
      .toArray()
      randomDirections.push(dir[0], dir[1], dir[2])
      const str = Math.random() 
      randomStrengths.push(str, str, str)
    }

    const randomDirectionsAttribute = new THREE.Float32BufferAttribute(
      new Float32Array(randomDirections),
      3
    )
    geometry.setAttribute("randomDirection", randomDirectionsAttribute)

    const randomStrengthsAttribute = new THREE.Float32BufferAttribute(
      new Float32Array(randomStrengths),
      1
    )
    geometry.setAttribute("randomStrengths", randomStrengthsAttribute)

    material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1 }
      }
    })

    text.material = material
    scene.add(text)
  }
)

// 
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const animate = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

onMounted(() => {
  canvasContainer.value.appendChild(renderer.domElement)

  animate()
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

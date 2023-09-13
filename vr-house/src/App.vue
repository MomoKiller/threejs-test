<script setup>
import * as THREE from "three"
import { onMounted, ref } from "vue"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

// 场景
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
// 设置相机位置
camera.position.z = 5

// 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)



const container = ref(null)

// 渲染函数
const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}


/*
// 添加立方体
const geometry = new THREE.BoxGeometry(10, 10, 10)
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00})

// 背景 左右 上下 前后
let arr = ['px', 'nx', 'py', 'ny', 'pz', 'nz']
let boxMaterial = []
arr.forEach((item) =>{
  // 纹理加载
  let texture = new THREE.TextureLoader().load(`./cubemap/${item}.png`)
  // 创建材质
  // boxMaterial.push(new THREE.MeshBasicMaterial({ map: texture }))
  // if(item === 'py' || item === "ny"){
  //   texture.rotation = Math.PI
  //   texture.center = new THREE.Vector2(0.5, 0.5)
  // }
  boxMaterial.push(new THREE.MeshBasicMaterial({ map: texture }))
})
const cube = new THREE.Mesh(geometry, boxMaterial)
cube.geometry.scale(1, 1, -1)
scene.add(cube)
*/

// 添加球
const geometry = new THREE.SphereGeometry(5, 32, 32)
const loader = new RGBELoader()
loader.load(
  "./ex02/HDRI08.hdr",
  (texture) => {
    const material = new THREE.MeshBasicMaterial({ map: texture })
    const sphere = new THREE.Mesh(geometry,  material)
    sphere.geometry.scale(1, 1, -1)
    scene.add(sphere)
  }
)


onMounted(() => {
  // 控制器
  const controls = new OrbitControls(camera, container.value)
  controls.enableDamping = true
  container.value.appendChild(renderer.domElement)
  render()
})


</script>

<template>
  <div class="container" ref="container">
  </div>
</template>

<style scoped>
  .container {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
  }
</style>

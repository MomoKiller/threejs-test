<script setup>
import { ref, onMounted } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { gsap } from "gsap"


const canvasContainer = ref(null)
const pages = ref(null)

onMounted(()=> {

  // 场景
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 10)

  // 渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 将画布添加到页面
  canvasContainer.value.appendChild(renderer.domElement)

  // 星空背景
  let url = './texture/style-2.png'
  let envTexture = new THREE.TextureLoader().load(url)
  envTexture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envTexture
  scene.environment = envTexture

  // 渲染函数
  const render = () => {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
  }
  render()


  // 添加灯光
  let light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(0, 0, 1)
  scene.add(light)

  // 加载模型
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
      gltf.scene.scale.set(0.5, 0.5, 0.5)
      gltf.scene.position.set(3, 0, 0)
      scene.add(gltf.scene)

      window.addEventListener("mousemove", (e) => {
        let x = e.clientX / window.innerWidth * 2 - 1
        let y = e.clientY / window.innerHeight * 2 - 1

        let timeline = gsap.timeline()
        timeline.to(
          gltf.scene.rotation, {
            duration: 0.5,
            x: y,
            y: x,
            duration: 1
          }
        )
      })
    }
  )

  gltfLoader.load(
    "./model/ex01/DamagedHelmet.gltf",
    (gltf) => {
      gltf.scene.scale.set(0.5, 0.5, 0.5)
      gltf.scene.position.set(3, -8, 0)
      scene.add(gltf.scene)

      window.addEventListener("mousemove", (e) => {
        let x = e.clientX / window.innerWidth * 2 - 1
        let y = e.clientY / window.innerHeight * 2 - 1

        let timeline = gsap.timeline()
        timeline.to(
          gltf.scene.rotation, {
            duration: 0.5,
            x: y,
            y: x,
            duration: 1
          }
        )
      })
    }
  )

  gltfLoader.load(
    "./model/robot/RobotExpressive.glb",
    (gltf) => {
      gltf.scene.scale.set(0.5, 0.5, 0.5)
      gltf.scene.position.set(3, -16, 0)
      scene.add(gltf.scene)

      window.addEventListener("mousemove", (e) => {
        let x = e.clientX / window.innerWidth * 2 - 1
        let y = e.clientY / window.innerHeight * 2 - 1

        let timeline = gsap.timeline()
        timeline.to(
          gltf.scene.rotation, {
            duration: 0.5,
            x: y,
            y: x,
            duration: 1
          }
        )
      })
    }
  )

  let page = 0
  let timeline2 = gsap.timeline()
  // 鼠标滚动事件
  window.addEventListener("mousewheel", (e) => {
    if(e.wheelDelta < 0) {
      page ++
      if(page > 2) {
        page = 2
      }
    }
    if(e.wheelDelta > 0) {
      page --;
      if(page < 0) {
        page = 0
      }
    }

    if(!timeline2.isActive()) {
      timeline2.to(
        camera.position,
        {
          duration: 0.5,
          y: page * -8,
          duration: 1
        }
      )
      // 文字
      gsap.to(pages.value, {
        duration: 1,
        z: - page * window.innerHeight,
        duration: 1
      })
    }
  })

  // 加载小黄鸭
  gltfLoader.load(
    "./model/rubber_duck/rubber_duck_toy_4k.gltf",
    (gltf) => {
      let duck = gltf.scene.children[0]
      for(let j=0; j<10; j++) {

        let duckInstance = new THREE.InstancedMesh(
          duck.geometry,
          duck.material,
          100
        )
        // scene.add(gltf.scene)
        
        // 50 个鸭子
        for(let i=0; i<100; i++){
          let x = Math.random() * 100 - 50
          let y = Math.random() * 100 - 50
          let z = Math.random() * 100 - 50
  
          let matrix = new THREE.Matrix4()
          let size = Math.random() * 20 - 8
          matrix.makeScale(size, size, size)
          matrix.makeTranslation(x, y, z)
          duckInstance.setMatrixAt(i, matrix)
        }
        gsap.to(
          duckInstance.position,
          {
            duration: Math.random() * 10 + 2,
            z: -100,
            ease: 'linear',
            repeat: -1
          }
        )
        scene.add(duckInstance)
      }
    }
  )
})



</script>

<template>
  <div class="canvas-container" ref="canvasContainer">
  </div>
  <div class="pages" ref="pages"></div>
</template>

<style scoped>
.canvas-container {
  width: 100vw;
  height: 100vh;
}
</style>

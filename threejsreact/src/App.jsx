import { useEffect } from 'react'
import './App.css'
import * as THREE from 'three'

function App() {

  useEffect(() => {

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
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    // 材质
    const meterial = new THREE.MeshBasicMaterial({ color:  0x00ff00})
    // 网格
    const cube = new THREE.Mesh(geometry,meterial)

    // 网格添加到场景中
    scene.add(cube)

    // 设置相机位置
    camera.position.z = 5
    // 视角
    camera.lookAt(0, 0, 0)

    // 渲染函数
    function animate() {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      // 渲染
      renderer.render(scene, camera) 
    }

    animate()
  }, [])

  return (
    <>
      <div className='App'></div>
    </>
  )
}

export default App

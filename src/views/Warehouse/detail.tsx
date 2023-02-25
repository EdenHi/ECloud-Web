import React, {useRef, useEffect, useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

import gsap from 'gsap'
import {useLocation} from "react-router-dom";
import {getWarehouseInfo} from "@/request/api";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {Input} from "antd";

const transNumberToChar = (number) => String.fromCharCode(65 + number)

const Cube = () => {
    const location = useLocation()
    const {state} = location
    const containerRef = useRef(null);
    const [code, setCode] = new useState<string>('')
    const isFocusRef = useRef(false);
    const floor = Math.ceil(state.zNum / 4)

// 创建从0到4*x的数组
    const arr = [];
    for (let i = 0; i < 4 * floor; i++) {
        arr.push(i);
    }

// 每隔4个元素分成一个小数组
    const result = [];
    for (let i = 0; i < arr.length; i += 4) {
        const subArr = arr.slice(i, i + 4);
        result.push(subArr);
    }

    useEffect(() => {
        let dataList = []
        window.addEventListener("resize", () => {

            // 更新摄像头
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            //   更新摄像机的投影矩阵
            camera.updateProjectionMatrix();
            //   更新渲染器
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            // renderer.setSize(100,100)
            //   设置渲染器的像素比
            renderer.setPixelRatio(window.devicePixelRatio);
        });


        // 创建场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('skyblue')
        //请求数据
        getWarehouseInfo({tableName: state.tableName}).then(
            res => {
                if (res.code === 0) {
                    dataList = res.list
                    // 创建一个立方体
                    const boxGeometry = new THREE.BoxGeometry(5, 2.5, 5);

                    // 创建纹理和材质
                    const textureLoader = new THREE.TextureLoader();
                    const texture = textureLoader.load('/boxTexture.jpg');
                    const material = new THREE.MeshBasicMaterial({map: texture});

                    // 创建网格并添加到场景中
                    const boxMesh = new THREE.Mesh(boxGeometry, material);
                    dataList.forEach(box => {
                        if (box.QRCode) {
                            // console.log('有箱子，放在', transNumberToChar(box.x_coordinate), box.y_coordinate, box.z_coordinate)
                            const boxItem = boxMesh.clone()
                            //x红  y 绿 z 蓝
                            boxItem.position.set(box.x_coordinate * 15, box.z_coordinate * 3 - 10.5, box.y_coordinate * 14 + 0.2)
                            boxItem.name = 'box'
                            boxItem.userData.id = `${transNumberToChar(box.x_coordinate)}${box.y_coordinate}-${box.z_coordinate} `
                            scene.add(boxItem)
                        } else {
                            // console.log('暂时没有箱子，在', transNumberToChar(box.x_coordinate), box.y_coordinate, box.z_coordinate)
                        }
                    })
                } else {
                    throw new Error('错误')
                }
            }
        )
        //坐标
        const axesHelper = new THREE.AxesHelper(100);
        scene.add(axesHelper);
        const gui = new dat.GUI()
        // 创建相机
        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        // 设置摄像机的初始位置和方向
        camera.position.set(0, 1.6, 0); // 初始位置
        camera.lookAt(new THREE.Vector3(0, 1.6, -1)); // 初始方向
        scene.add(camera);

        // 创建环境光
        const color = 0xFFFFFF;
        const intensity = 1.5;
        const alight = new THREE.AmbientLight(color, intensity);
        scene.add(alight);
        const gltfLoader = new GLTFLoader()
        const objLoader = new OBJLoader()
        // // 创建 Canvas 元素

        gltfLoader.load('/gltf/shelf/scene.gltf', gltf => {
            for (let i = 0; i < state.xNum; i++) {
                for (let j = 0; j < state.yNum; j++) {
                    // 向场景中添加货架
                    result.forEach(((item, index) => {
                        const clone = gltf.scene.clone()
                        clone.name = 'shelf'
                        clone.rotation.set(0, 0, 0)
                        clone.scale.set(0.1, 0.15, 0.2)
                        clone.position.set(15 * i, 12 * index - 12.5, 14 * j)
                        scene.add(clone);
                        // 添加号码标牌
                        item.forEach((subItem, subIndex) => {
                            const canvas = document.createElement('canvas');
                            canvas.width = 100;
                            canvas.height = 50;
                            const ctx = canvas.getContext('2d');
                            ctx.font = 'bold 32px Arial';
                            ctx.textAlign = 'center'; // 文本水平居中
                            ctx.textBaseline = 'middle'; // 文本垂直居中
                            ctx.fillStyle = "blue"
                            // 计算文本宽度和高度
                            const text = `${transNumberToChar(i)}${j}-${subItem}`;
                            const textWidth = ctx.measureText(text).width;
                            const textHeight = ctx.measureText('M').width; // 使用一个高度等于字符M的文本来计算高度
                            // 绘制文本
                            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
                            // 将 Canvas 元素转换为纹理
                            const texture = new THREE.CanvasTexture(canvas);
                            // 创建平面并将纹理应用于其表面
                            const geometry = new THREE.PlaneGeometry(10, 5, 1);
                            const material = new THREE.MeshBasicMaterial({map: texture});
                            const plane = new THREE.Mesh(geometry, material);
                            plane.position.set(3, 7 + subIndex * 20, 16)
                            plane.name = 'text'
                            clone.add(plane);
                        })
                    }))
                }
            }

        })

        // Create the building geometry
        const buildingGeometry = new THREE.BoxGeometry(state.xNum * 16, floor * 10 + 5, state.yNum * 15);
        const buildingMaterial = new THREE.MeshPhongMaterial({
            color: 0x4c4c4c,
            side: THREE.BackSide
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial)
        building.position.set((state.xNum) * 7.5 - 6, 0, (state.yNum) * 7 - 6)
        scene.add(building);
        // Create the hole geometry
        const holeGeometry = new THREE.BoxGeometry(state.xNum * 16, floor * 10 + 5, state.yNum * 15);
        const holeMaterial = new THREE.MeshPhongMaterial({
            color: 0x4c4c4c,
            shininess: 50,
            side: THREE.BackSide
        });
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.position.set(0, 0, 0);
        building.add(hole);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 20, 40);
        scene.add(light);


        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);
        renderer.render(scene, camera);


        // 监听键盘按键事件
        const keyboard = {};
        document.addEventListener('keydown', (event) => {
            keyboard[event.code] = true;
        });
        document.addEventListener('keyup', (event) => {
            keyboard[event.code] = false;
        });
        document.addEventListener('mousedown', (event) => {
            // 获取容器元素的位置和尺寸
            const rect = containerRef.current.getBoundingClientRect();
            // 获取鼠标点击位置相对于容器元素的坐标
            const mouseX = (event.clientX - rect.left) / rect.width * 2 - 1;
            const mouseY = -(event.clientY - rect.top) / rect.height * 2 + 1;
            // 创建一个射线
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera({x: mouseX, y: mouseY}, camera);
            const shelfs = scene.getObjectsByProperty('name', 'box')
            // console.log(shelfs)
            // shelfs[1].visible = false
            // 检查射线是否与模型相交
            const intersects = raycaster.intersectObjects(shelfs);
            // camera.lookAt(intersects[0].object)
            console.log(intersects[0].object.userData.id)
            // console.log(intersects.map(item => item.object.name))
            // 如果射线与模型相交，则触发点击事件
            // if (intersects.length > 0) {
            //     console.log('您点击了模型！');
            // }
        });

        function updateCameraPosition() {
            if (isFocusRef.current) {
                return
            } else {
                // 计算摄像机的前向矢量和侧向矢量
                const frontVector = new THREE.Vector3(0, 0, -1);
                frontVector.applyQuaternion(camera.quaternion);
                const sideVector = new THREE.Vector3(-1, 0, 0);
                sideVector.applyQuaternion(camera.quaternion);

                // 根据按键移动摄像机的位置
                if (keyboard['KeyW']) {
                    camera.position.add(frontVector.multiplyScalar(0.1));
                }
                if (keyboard['KeyS']) {
                    camera.position.sub(frontVector.multiplyScalar(0.1));
                }
                if (keyboard['KeyA']) {
                    camera.position.add(sideVector.multiplyScalar(0.1));
                }
                if (keyboard['KeyD']) {
                    camera.position.sub(sideVector.multiplyScalar(0.1));
                }
            }
        }

        // 设置 OrbitControls，并将其绑定到摄像头和渲染器上
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, -10, -10)
        camera.position.set(0, -8, 5);

        function render() {
            updateCameraPosition()
            controls.update()
            renderer.render(scene, camera);
            requestAnimationFrame(render)
        }

        render()
    }, []);

    return <div style={{width: '100%', height: '100%', position: 'relative'}} ref={containerRef}>
        <div style={{
            position: 'absolute',
            background: 'rgba(255,255,255,0.7)',
            fontSize: 18,
            fontWeight: 'bold'
        }}>使用WASD前后左右移动，QE上下移动
        </div>
        <div style={{
            position: 'absolute',
            right: 0,
            background: 'rgba(255,255,255,0.7)',
            width: 150,
            height: 200,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{fontSize: 18, fontWeight: 'bold'}}>搜索面板</div>
            <hr/>
            <div style={{border: '1px solid red'}}>
                <Input value={code}
                       onFocus={() => {
                           isFocusRef.current = true
                       }}
                       onBlur={() => {
                           isFocusRef.current = false
                       }}
                       onChange={(e) => {
                           setCode(e.target.text)
                       }}>
                </Input>
            </div>
        </div>
    </div>;
};

export default Cube;


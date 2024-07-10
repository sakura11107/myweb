<template>
  <div ref="threejsContainer"></div>
</template>

<script>
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import * as d3 from 'd3';
  import { ref, onMounted } from 'vue';

  export default {
    setup() {
      const threejsContainer = ref(null);

      onMounted(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (threejsContainer.value) {
          threejsContainer.value.appendChild(renderer.domElement);
        }

        // 添加灯光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // 创建地球球体
        const radius = 1;
        const segments = 64;
        const earthGeometry = new THREE.SphereGeometry(radius, segments, segments);
        const earthMaterial = new THREE.MeshPhongMaterial({
          color: 0xaaaaaa,
          wireframe: false,
        });
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earthMesh);

        // 使用 D3.js 加载 GeoJSON 数据并投影到球体上
        d3.json('world.zh.json').then((geojson) => {
        geojson.features.forEach((feature) => {
          const geometryType = feature.geometry.type;
          const coordinates = feature.geometry.coordinates;

          if (geometryType === 'MultiPolygon') {
            coordinates.forEach((polygon) => {
              polygon.forEach((ring) => {
                const points = convertCoordinatesToSpherePoints(ring);
                drawLine(points);
              });
            });
          } else if (geometryType === 'Polygon') {
            coordinates.forEach((ring) => {
              const points = convertCoordinatesToSpherePoints(ring);
              drawLine(points);
            });
          }
        });
      });

      function convertCoordinatesToSpherePoints(ring) {
        // 检查 ring 是否为预期的数组结构，如果不是，则直接使用 ring
        if (typeof ring[0][0] !== 'number') {
          ring = ring[0];
        }
        return ring.map(([lon, lat]) => {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon - 180) * (Math.PI / 180);
          const z = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const x = radius * Math.sin(phi) * Math.sin(theta);
          return new THREE.Vector3(x, y, z);
        });
      }

      function drawLine(points) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      }


        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 3;
        controls.maxDistance = 10;

        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };

        animate();
      });

      return {
        threejsContainer,
      };
    },
  };
</script>

<style scoped>
#threejsContainer {
  width: 100%;
  height: 100%;
}
</style>

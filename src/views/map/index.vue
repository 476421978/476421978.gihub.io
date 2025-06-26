<template>
  <div class="test-demo">
    <div id="container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import XIANGXIA from '@/assets/map/xiangxia.png'
import MAPMARKER from '@/assets/map/map_marker.png'
import ICONOPENEYE from '@/assets/map/icon_open_eye.png'
import ICONCLOSEEYE from '@/assets/map/icon_close_eye.png'
import ICONUP from '@/assets/map/icon_up.png'
import ICONDOWN from '@/assets/map/icon_down.png'

let map
const isHideOther = ref(false)
const labelDefault = `
  <div class="marker-arrows">
    <img class="img" src="${XIANGXIA}"  />
  </div>
  <div class="marker-points">
    <img class="img" src="${MAPMARKER}"/>
  </div>
`

// 初始化地图
const init = () => {
  map = new BMap.Map('container', {
    coordsType: 5
  })
  const point = new BMap.Point(116.404, 39.915)
  map.centerAndZoom(point, 15)
  map.addControl(new BMap.NavigationControl())
  map.addControl(new BMap.ScaleControl())
  map.addControl(new BMap.OverviewMapControl())
  map.addControl(new BMap.MapTypeControl())
  map.setCurrentCity('北京')
}

// 创建默认标记
const defaultMarker = ({ lat, lag, point, title }) => {
  let pointMarker
  if (lat && lag) new BMap.Point(lat, lag)
  if (point) pointMarker = point
  if (!pointMarker) return false
  let marker
  if (title) {
    const markerIcon = new BMap.Icon(title === 'start' ? ICONUP : ICONDOWN, new BMap.Size(30, 42))
    marker = new BMap.Marker(pointMarker, {
      icon: markerIcon,
      offset: new BMap.Size(0, -20),
      title: title
    })
  } else {
    marker = new BMap.Marker(pointMarker)
  }
  map.addOverlay(marker)
  marker.addEventListener('click', function () {
    alert('您点击了标注')
  })
}

// 创建司机标记
const setLabelMarker = ({ lat, lag, num = 3, name = 'Label' }) => {
  const pointLabel = new BMap.Point(lat, lag)
  const content = `
    <div class="map-marker-box">
      <img class="img" src='${ICONOPENEYE}' />
      <span>${name}</span>
      <span>${num}</span>
    </div>
    ${labelDefault}
  `
  const label = new BMap.Label(content, {
    position: pointLabel,
    offset: new BMap.Size(10, 10),
    zIndex: 101
  })
  label.setStyle({
    color: '#333',
    background: 'transparent',
    border: 'none'
  })
  label.addEventListener('click', () => {
    if (!isHideOther.value) {
      label.disableMassClear()
      label.setContent(`
        <div class="map-marker-box">
          <img class="img" src='${ICONCLOSEEYE}' />
          <span>${name}</span>
          <span>${num}</span>
        </div>
        ${labelDefault}
      `)
      map.clearOverlays()
      setOrderLine()
    } else {
      map.clearOverlays()
      label.enableMassClear()
      getOrderList()
    }
    isHideOther.value = !isHideOther.value
  })
  label.addEventListener('mouseover', () => {
    label.setStyle({ color: 'red' })
  })
  label.addEventListener('mouseout', () => {
    label.setStyle({ color: '#333' })
  })
  map.addOverlay(label)
  return label
}

// 标记订单
const getOrderList = () => {
  for (let i = 0; i < 3; i++) {
    const num = 0.005 * i
    setLabelMarker({ lat: 116.404 + num, lag: 39.915 + num })
  }
}

// 设置订单起点和终点线
const setOrderLine = () => {
  const startP = new BMap.Point(116.399, 39.91)
  defaultMarker({ point: startP, title: 'mark - title ——start' })

  const endP = new BMap.Point(116.425, 39.9)
  defaultMarker({ point: endP, title: 'end' })

  const polyline = new BMap.Polyline([startP, endP], {
    strokeColor: '#6d7278',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    strokeStyle: 'dashed'
  })
  map.addOverlay(polyline)
}

const overlay = ref(null)
const setCustomOverlay = () => {
  // 创建自定义覆盖物
  const point = new BMap.Point(116.404, 39.915)
  const CustomOverlay = function (point) {
    this._point = point
  }

  // 继承覆盖物类的方法
  CustomOverlay.prototype = new BMap.Overlay()
  CustomOverlay.prototype.initialize = function (map) {
    this._map = map
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.width = 'auto'
    div.style.minWidth = '100px'
    div.style.height = 'auto'
    // div.style.background = 'red'
    // div.style.opacity = '0.5'
    // div.style.borderRadius = '50%'
    div.style.transform = 'translate(-50%,-50%)'

    div.innerHTML = `<div class="map-marker-box">
          <img class="img" src='${ICONCLOSEEYE}' />
          <span>自定义覆盖物</span>
        </div>
        ${labelDefault}`

    map.getPanes().labelPane.appendChild(div)
    this._div = div
    return div
  }
  CustomOverlay.prototype.draw = function () {
    const pixel = this._map.pointToOverlayPixel(this._point)
    this._div.style.left = pixel.x + 'px'
    this._div.style.top = pixel.y + 'px'
  }

  // 创建覆盖物实例并添加到地图中
  overlay.value = new CustomOverlay(new BMap.Point(116.404, 39.915))
  map.addOverlay(overlay.value)
}

// 页面加载时执行
onMounted(() => {
  init()
  getOrderList()
  setCustomOverlay()
})
</script>

<style lang="scss">
.map-marker-box {
  width: 200px;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #eaf0fe;
  border-radius: 4px;
  border: 1px solid #7dbde9;
  .img {
    width: 42px;
    height: 32px;
  }
}
.marker-arrows,
.marker-points {
  position: relative;
  height: 14px;
  .img {
    position: absolute;
    width: 24px;
    height: 14px;
    bottom: 1px;
    left: 10px;
  }
}
.marker-points {
  .img {
    bottom: 0;
  }
}

.test-demo {
  height: 75vh;
  width: 75vw;
  margin: 0px;
  padding: 0px;
}
#container {
  height: 100%;
  width: 100%;
  border: 1px solid red;
}
.fit-picture {
  width: 32px;
  height: 32px;
}
</style>

<template>
  <div class="content">
    <div id="container"></div>
  </div>
</template>

<script setup>
onMounted(() => {
  try {
    var map = new BMapGL.Map('container')
    map.centerAndZoom(new BMapGL.Point(116.401952, 40.032704), 12)
    map.enableScrollWheelZoom()

    var htm1 =
        "<div id='overLay' style='width:93px;height:116px;background:url(images/back.png) left top no-repeat; position: absolute;'>" +
        "<img style='margin-left:9px;margin-top: 8px;' src='images/small.jpg' />" +
        '</div>',
      myRichMarker1 = new BMapGLLib.RichMarker(htm1, new BMapGL.Point(116.30816, 40.056863), { anchor: new BMapGL.Size(-47, -116), enableDragging: true })
    map.addOverlay(myRichMarker1)

    var html2 =
        '<div style="position: absolute; margin: 0pt; padding: 0pt; width: 80px; height: 26px; left: -10px; top: -35px; overflow: hidden;">' +
        '<img id="rm3_image" style="border:none;left:0px; top:0px; position:absolute;" src="images/back1.png">' +
        '</div>' +
        '<label class=" BMapLabel" unselectable="on" style="position: absolute; -moz-user-select: none; display: inline; cursor: inherit; border: 0px none; padding: 2px 1px 1px; white-space: nowrap; font: 12px arial,simsun; z-index: 80; color: rgb(255, 102, 0); left: 15px; top: -35px;">$ 20 B</label>',
      myRichMarker2 = new BMapGLLib.RichMarker(html2, new BMapGL.Point(116.402922, 39.99908), {
        anchor: new BMapGL.Size(-18, -27),
        enableDragging: true
      })
    map.addOverlay(myRichMarker2)

    myRichMarker2.addEventListener('onmouseover', function (e) {
      document.getElementById('rm3_image').src = 'images/back2.png'
    })
    myRichMarker2.addEventListener('onmouseout', function (e) {
      document.getElementById('rm3_image').src = 'images/back1.png'
    })
  } catch (error) {
    console.log('error---', error)
  }
})
</script>

<style lang="scss" scoped>
#container {
  width: 800px;
  height: 800px;
  border: 1px solid gray;
  margin: 10px 0 0 10px;
}
</style>

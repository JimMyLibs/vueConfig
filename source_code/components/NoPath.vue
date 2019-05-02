<template>
<div  class="no-path">
  <Empty>
    <h1>访问的路径不存在！</h1>
  </Empty>
</div>
</template>
<script>
import Empty from 'components/Empty'
export default {
  components: {
    Empty
  }
}
</script>
<style scoped>
.no-path{
  position: absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  background:#fff;
}
</style>

<template>
<div class="example">
  <h1>
    example
  </h1>
  <p>
    通过设置“PROJECT_DIR_NAME”，
  </p>
  <p data-event_id="测试id">
    执行npm run create创建项目
  </p>
</div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    // this.$utm.device()
    // this.$utm.page('测试一个页面信息')
    // this.$post('myCustomer/searchProblem').then(res=>{
    //   console.log('res: ')
    //   console.log(res)
    // })

  }

}
</script>
<style scoped>
.example {
  text-align: center;
  padding: 1rem;
}
</style>

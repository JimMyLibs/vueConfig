<template>
  <div class="example">
    <h1 @click="test">
      fetch
    </h1>
    <p>
      通过设置“PROJECT_DIR_NAME”，
    </p>
    <p>
      执行npm run create创建项目
    </p>
    <router-link to="/index">index</router-link>
  </div>
</template>
<script>
import Native from 'comm/utils/Native'
import Http from 'comm/utils/Http'
// import toMock from 'comm/utils/toMock'

const native = new Native()

// let pathDir = '/Users/jp007/Documents/work/niiwoo-3.0/code/mock/document/example/test.json'
//
// import(`${pathDir}`)

// let pathDir = ''
//
// import(`${mockPath}/test.json`)

// let pathDir = '/Users/jp007/Documents/work/niiwoo-3.0/code/mock'
//
// import(`${pathDir}/document/example/test.json`)

const http = new Http({
  apiType: 'utm'
})
//
// http.toGet = (...options) =>{
//   return new Promise((resolve, reject) => {
//     resolve('succ from toGet')
//   })
// }
// http.toPost = (...options) =>{
//   return new Promise((resolve, reject) => {
//     resolve('succ from toPost')
//   })
// }
// http.toUpload = (...options) =>{
//   return new Promise((resolve, reject) => {
//     resolve('succ from toUpload')
//   })
// }

http.$post('homeBannerAndPopup/homeBannerAndPopup', {
  apiType: 'activity'
}).then(res=>{
  console.log('$get a/b => ', res)
})
//
// http.$post('a/b').then(res=>{
//   console.log('$post a/b => ', res)
// })
//
// http.$upload('a/b', {
//   file: 'someObjFile'
// }).then(res=>{
//   console.log('$post a/b => ', res)
// })

export default {
  data() {
    return {

    }
  },
  mounted() {
    // console.log(process.env.ISDEV)
  },
  methods: {
    test() {
      // native.getDetail().then(res => {
      //   alert(JSON.stringify(res))
      // })
    }
  },

}
</script>
<style scoped>
.example {
  text-align: center;
  padding: 1rem;
  p {
    text-align: center;
    color: orange;
  }
}
</style>

<template>
  <div class="example">
    <h1 @click="test">
      index
    </h1>
    <p>
      通过设置“PROJECT_DIR_NAME”，
    </p>
    {{$store.state.moduleA}}
    {{'2019-01-01' | dateFilter('yyyy-MM')}}
    {{'hello'|myFilter(' hi')}}
    <p>
      执行npm run create创建项目
    </p>
    <router-link to="/fetch">fetch</router-link>
    <FixedBox :isShow="isShow" position="center">
      <div>
        <p>
          2
        </p>
        <p>
          2
        </p>
        <p>
          2
        </p>
        <p>
          2
        </p>
        <p>
          2
        </p>
      </div>
    </FixedBox>
  </div>
</template>
<script>
// import Native from 'comm/utils/Native'
// import Http from 'comm/utils/Http'
import FixedBox from 'comm/components/FixedBox'
// import toMock from 'comm/utils/toMock'

// const native = new Native()

// let pathDir = '/Users/jp007/Documents/work/niiwoo-3.0/code/mock/document/example/test.json'
//
// import(`${pathDir}`)

// let pathDir = ''
//
// import(`${mockPath}/test.json`)

// let pathDir = '/Users/jp007/Documents/work/niiwoo-3.0/code/mock'
//
// import(`${pathDir}/document/example/test.json`)

// const http = new Http({
//   apiType: 'utm'
// })
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

// http.$post('homeBannerAndPopup/homeBannerAndPopup', {
//   apiType: 'activity'
// }).then(res=>{
//   console.log('$get a/b => ', res)
// })
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
  components: {
    FixedBox
  },
  data() {
    return {
      isShow: false
    }
  },
  mounted() {
    this.$utm.page('666666')
    this.$tip('hello', ()=>{
      console.log('hei')
    })

    this.$post('homeBannerAndPopup/homeBannerAndPopup', {
      apiType: 'activity'
    }).then(res=>{
      console.log(res)
    })

    // this.$native('login').then(res=>{
    //   alert(JSON.stringify(res))
    // })
    // console.log(this.$utils)
    // console.log(this.$store.state.moduleA)
    // this.G_Utils.say('hhh----------->>>>>>>')
    // this.$utm.page('666666')
    // this.$utm.device()
  },
  methods: {
    test() {
      let {isShow} = this
      this.isShow = !isShow
      // this.$store.commit('increment')
      // this.$log('abc')
      // this.$who('abc')
      // this.$utm.device()
      // this.$utm.page('666666')
      // console.log(this.$utm)
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

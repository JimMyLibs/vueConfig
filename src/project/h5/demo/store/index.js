
export default {
  moduleA: {
    state: {
      count: 0
    },
    mutations: {
      increment(state, ...other) {
        state.count++
      }
    }
  }
}

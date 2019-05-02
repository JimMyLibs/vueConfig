<template>
  <div class="empty">
    <p>
      <img src="../assets/cry.png" />
    </p>
    <div class="empty-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style scoped>
.empty {
  padding: 1rem 0 2rem 0;
  text-align: center;
  color: #ABABAB;
  font-size: .28rem;
  background:#FFFFFF;
  .empty-content{
    margin:.3rem 0 .6rem 0;
  }
  img {
    width: 2rem;
  }
}
</style>

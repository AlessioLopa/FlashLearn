<template>
  <div id="page">
    <div class="endReview">
      <h1>{{ props.message }}</h1>
      <router-link to="/home" class="register-link">
        Revenir à l'accueil
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.endReview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

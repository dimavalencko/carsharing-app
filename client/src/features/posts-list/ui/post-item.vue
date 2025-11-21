<script setup lang="ts">
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: false,
    default: '',
  },
  body: {
    type: String,
    required: false,
    default: '',
  },
});
</script>

<template>
  <div class="post-item">
    <b>{{ id }}. {{ title }}</b>
    <p>{{ body }}</p>
  </div>
</template>

<style scoped>
.post-item {
  border-radius: 12px;
  padding: 16px;
  border: 1px #ccc solid;
  width: 100%;
}
</style>

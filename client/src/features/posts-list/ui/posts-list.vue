<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import PostItem from './post-item.vue';
import { usePostsStore } from '@entities/posts';

const postsStore = usePostsStore();

const posts = computed(() => postsStore.posts); // Чтобы иметь актуальный readonly список постов

onBeforeMount(async () => {
  await postsStore.getPosts();
});
</script>

<template>
  <div class="posts-container">
    <div class="test">Posts list</div>
    <PostItem
      v-for="post in posts"
      :id="post.id"
      :key="post.id"
      :title="post.title"
      :body="post.body"
    />
  </div>
</template>

<style scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
</style>

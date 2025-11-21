import { defineStore } from 'pinia';
import { ref } from 'vue';

import { postsService } from '@/shared/api/posts/posts.service';
import type { Post } from '@/entities';

const usePostsStore = defineStore('posts-store', () => {
  const posts = ref<Post[]>([]);

  async function getPosts() {
    try {
      const result = await postsService.getPosts();
      posts.value = result;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  return {
    // state
    posts,

    // actions
    getPosts,
  };
});

export { usePostsStore };

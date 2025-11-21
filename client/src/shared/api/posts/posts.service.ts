import type { Post } from '@entities/posts';
import { posts } from './mock-data';

class PostsService {
  async getPosts(): Promise<Post[]> {
    try {
      // Вот так должно быть в случае с апи
      // const response = await defaultHttpClient.get<Post[]>('/posts')
      // return response.data

      return posts;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при загрузке постов');
    }
  }

  // TODO other CRUD methods:

  // async getPostById(id: number): Promise<Post> {}
  // async createPost(data: CreatePostData): Promise<Post> {}
  // async updatePost(id: number, data: UpdatePostData): Promise<Post> {}
  // async deletePost(id: number): Promise<void> {}
}

export const postsService = new PostsService();

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type PostShape = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  userId: number;
  views: number;
  reactions: {
    likes: number;
    dislikes: number;
  };
  image: string | null;
  ours: boolean;
};

type PostsResponse = {
  posts: Omit<PostShape, "image">[];
  total: 251;
  skip: 0;
  limit: 30;
};

export type CommentShape = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
};

type CommentsResponse = {
  comments: CommentShape[];
  total: 251;
  skip: 0;
  limit: 30;
};

type State = {
  pagination: Omit<PostsResponse, "posts"> | null;
  posts: PostShape[];
  postsComments: Record<number, CommentShape[]>;
  postsCommentsShown: Record<number, boolean>;
  loading: boolean;
};

type Actions = {
  loadNextPage: () => Promise<void>;
  showComments: (postId: number) => Promise<void>;
  hideComments: (postId: number) => void;
  createPost: (title: string, body: string, file: File) => Promise<void>;
};

export const usePostsStore = create<State & Actions>()(
  immer((set, get) => ({
    pagination: null,
    posts: [],
    postsComments: {},
    postsCommentsShown: {},
    loading: false,
    loadNextPage: async () => {
      if (get().loading) return;
      set({ loading: true });
      const pagination = get().pagination;
      const data: PostsResponse = await fetch(
        `https://dummyjson.com/posts${
          pagination
            ? `?limit=${pagination.limit}&skip=${get().posts.length}`
            : ""
        }`
      ).then((res) => res.json());
      set((draft) => {
        draft.posts.push(
          ...data.posts.map((post) => ({
            ...post,
            ours: false,
            image: `https://dummyjson.com/image/400x40?type=webp&text=${post.title}`,
          }))
        );
        draft.pagination = {
          total: data.total,
          skip: data.skip,
          limit: data.limit,
        };
        draft.loading = false;
      });
    },
    createPost: async (title: string, body: string, file?: File) => {
      if (!title || !body) return;
      const data: PostShape = await fetch("https://dummyjson.com/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          userId: 5,
        }),
      }).then((res) => res.json());
      set((draft) => {
        draft.posts.unshift({
          ...data,
          ours: true,
          image: file ? window.URL.createObjectURL(file) : null,
        });
      });
    },
    showComments: async (postId: number) => {
      if (get().postsComments[postId])
        set((draft) => {
          draft.postsCommentsShown[postId] = true;
        });
      const data: CommentsResponse = await fetch(
        `https://dummyjson.com/posts/${postId}/comments`
      ).then((res) => res.json());
      set((draft) => {
        draft.postsComments[postId] = data.comments;
        draft.postsCommentsShown[postId] = true;
      });
    },
    hideComments: (postId: number) =>
      set((draft) => {
        draft.postsCommentsShown[postId] = false;
      }),
  }))
);

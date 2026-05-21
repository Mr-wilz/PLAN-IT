import { create } from "zustand";
import { supabase } from "@/components/services/supabase";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  author: string;
  published_at: string;
}

interface BlogStore {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  fetchPosts: () => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
}

export const useBlogStore = create<BlogStore>((set) => ({
  posts: [],
  currentPost: null,
  loading: false,

  fetchPosts: async () => {
    set({ loading: true });
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    set({ posts: data || [], loading: false });
  },

  fetchPostBySlug: async (slug) => {
    set({ loading: true });
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();
    set({ currentPost: data, loading: false });
  },
}));

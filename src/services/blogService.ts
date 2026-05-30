import { supabase } from '../lib/supabaseClient';
import { ServiceResponse } from './types';

export interface BlogContentBlock {
  heading: string;
  body: string;
}

export interface BlogRaw {
  id: number;
  title: string;
  slug: string;
  content: string; // Serialized JSON string from database
  image_url: string;
  category: string;
  published: boolean;
  created_at: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: BlogContentBlock[]; // Deserialized object array
  image_url: string;
  category: string;
  published: boolean;
  created_at: string;
}

/**
 * Parses raw blog content into structured JSON
 */
function parseBlogContent(rawBlog: BlogRaw): Blog {
  let contentParsed: BlogContentBlock[] = [];
  try {
    if (rawBlog.content) {
      contentParsed = JSON.parse(rawBlog.content);
    }
  } catch (err) {
    console.error(`Failed to parse content JSON for blog ${rawBlog.id}:`, err);
    contentParsed = [{ heading: 'Content Error', body: String(rawBlog.content) }];
  }
  return {
    ...rawBlog,
    content: contentParsed
  };
}

export const blogService = {
  /**
   * Fetches all published blogs
   */
  async getBlogs(): Promise<ServiceResponse<Blog[]>> {
    console.log("Fetch start: blogs");
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('id', { ascending: true });

      if (error) throw error;

      const blogs = (data as BlogRaw[]).map(parseBlogContent);
      console.log("Fetch complete: blogs. Count:", blogs.length);
      return { data: blogs, error: null };
    } catch (err: any) {
      console.error("Fetch error: blogs failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetches a blog post by its unique slug
   */
  async getBlogBySlug(slug: string): Promise<ServiceResponse<Blog>> {
    console.log("Fetch start: getBlogBySlug", slug);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;

      const blog = parseBlogContent(data as BlogRaw);
      console.log("Fetch complete: getBlogBySlug success");
      return { data: blog, error: null };
    } catch (err: any) {
      console.error("Fetch error: getBlogBySlug failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetches a blog post by its ID
   */
  async getBlogById(id: number): Promise<ServiceResponse<Blog>> {
    console.log("Fetch start: getBlogById", id);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;

      const blog = parseBlogContent(data as BlogRaw);
      console.log("Fetch complete: getBlogById success");
      return { data: blog, error: null };
    } catch (err: any) {
      console.error("Fetch error: getBlogById failed", err);
      return { data: null, error: err };
    }
  }
};

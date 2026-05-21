// features/blog/hooks/useBlogGenerator.ts
import { generateBlogPost, generateDestinationFacts } from "@/components/services/ai";
import toast from "react-hot-toast";

export const useBlogGenerator = () => {
  const generatePost = async (topic: string) => {
    try {
      const post = await generateBlogPost(topic);
      toast.success("New AI blog post generated!");
      return post;
    } catch (err) {
      toast.error("Failed to generate post");
      console.error(err);
      return null;
    }
  };

  const generateFacts = async (destination: string) => {
    try {
      const facts = await generateDestinationFacts(destination);
      return facts;
    } catch (err) {
      toast.error("Failed to generate facts");
      return [];
    }
  };

  return { generatePost, generateFacts };
};

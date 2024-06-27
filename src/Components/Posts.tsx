import { useMount } from "react-use";
import { usePostsStore } from "../postsStore";
import { Spinner } from "./Spinner";
import { Post } from "./Post";
import "./Posts.css";

export const Posts: React.FC = () => {
  const { posts, loading, loadNextPage } = usePostsStore();
  useMount(loadNextPage);

  return (
    <div className="posts">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {loading ? (
        <Spinner />
      ) : (
        <button onClick={loadNextPage}>Load more</button>
      )}
    </div>
  );
};

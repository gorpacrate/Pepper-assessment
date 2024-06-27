import { PostShape, usePostsStore } from "../postsStore";
import "./Post.css";

export const Post: React.FC<{ post: PostShape }> = ({ post }) => {
  const { comments, commentsShown, showComments, hideComments } = usePostsStore(
    (state) => ({
      comments: state.postsComments[post.id],
      commentsShown: state.postsCommentsShown[post.id],
      showComments: () => state.showComments(post.id),
      hideComments: () => state.hideComments(post.id),
    })
  );

  return (
    <div className="post">
      {post.image && <img src={post.image} alt={post.title} />}
      <h2>{post.title}</h2>
      <p>{post.body}</p>

      {commentsShown && (
        <div className="comments">
          {comments.map((comment) => (
            <div key={comment.id}>
              {comment.user.username}: {comment.body}
            </div>
          ))}
        </div>
      )}
      {!post.ours && (
        <button onClick={commentsShown ? hideComments : showComments}>
          {commentsShown ? "Hide" : "Show"} Comments
        </button>
      )}
    </div>
  );
};

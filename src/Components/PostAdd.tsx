import { useRef, useState } from "react";
import { usePostsStore } from "../postsStore";
import "./PostAdd.css";

export const PostAdd: React.FC = () => {
  const [shown, setShown] = useState(false);
  const { createPost } = usePostsStore();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const post = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost(
      titleRef.current!.value,
      bodyRef.current!.value,
      fileRef.current!.files![0]
    );
    titleRef.current!.value = "";
    bodyRef.current!.value = "";
    fileRef.current!.value = "";
  };
  return (
    <div className="postAdd">
      {!shown ? (
        <button onClick={() => setShown(true)}>Create Post</button>
      ) : (
        <form onSubmit={post} className="form">
          <input ref={titleRef} type="text" placeholder="Title" />
          <textarea ref={bodyRef} placeholder="Body"></textarea>
          <input ref={fileRef} type="file" />
          <button type="submit">Add New Post</button>
        </form>
      )}
    </div>
  );
};

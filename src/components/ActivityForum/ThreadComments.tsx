import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

interface ThreadCommentsProps {
  threadId: string;
}

export const ThreadComments: React.FC<ThreadCommentsProps> = ({ threadId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth0();

  useEffect(() => {
    const q = query(
      collection(db, "threadComments"),
      where("threadId", "==", threadId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Comment[];
      comments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      setComments(comments);
    });

    return () => unsubscribe();
  }, [threadId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !newComment.trim()) return;

    try {
      await addDoc(collection(db, "threadComments"), {
        threadId,
        content: newComment.trim(),
        createdAt: serverTimestamp(),
        createdBy: user.email,
      });
      setNewComment("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  return (
    <div className="mt-4">
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-800">{comment.content}</p>
                <div className="text-sm text-gray-500 mt-2">
                  {comment.createdBy} • {comment.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009982]"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="bg-[#009982] text-white px-4 py-2 rounded hover:bg-[#007a6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comentar
          </button>
        </div>
      </form>
    </div>
  );
};

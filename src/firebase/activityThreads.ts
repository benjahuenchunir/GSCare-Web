import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface Thread {
  id: string;
  activityId: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  members: string[];
  membersId: string[]; 
}

export const createThread = async (
  activityId: number,
  title: string,
  description: string,
  userName: string,
  userId: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "activityThreads"), {
      activityId,
      title,
      description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userName,
      createdById: userId,
      members: [userName],
      membersId: [userId],
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al crear hilo:", error);
    throw error;
  }
};

export const subscribeToThreads = (
  activityId: number,
  callback: (threads: Thread[]) => void
) => {
  const q = query(
    collection(db, "activityThreads"),
    where("activityId", "==", activityId)
  );

  return onSnapshot(q, (querySnapshot) => {
    const threads = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Thread[];
    // Ordenar los hilos por fecha de creación (más recientes primero)
    threads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    callback(threads);
  });
};

export const joinThread = async (
  threadId: string,
  userName: string,
  userId: string
) => {
  try {
    const threadRef = doc(db, "activityThreads", threadId);
    const threadDoc = await getDoc(threadRef);
    if (!threadDoc.exists()) throw new Error("Thread not found");

    const currentMembers = threadDoc.data().members || [];
    const currentMembersId = threadDoc.data().membersId || [];
    const needsUpdate = !currentMembersId.includes(userId);

    if (needsUpdate) {
      await updateDoc(threadRef, {
        members: [...currentMembers, userName],
        membersId: [...currentMembersId, userId],
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error al unirse al hilo:", error);
    throw error;
  }
};

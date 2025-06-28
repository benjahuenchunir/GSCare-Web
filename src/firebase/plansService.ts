import { collection, getDocs, doc, updateDoc, getDoc, DocumentReference } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface PlanData {
  id: string;
  title: string;
  price: string;
  currency: string;
  features: string[];
}

export const getAllPlans = async (): Promise<PlanData[]> => {
  const snapshot = await getDocs(collection(db, "plans"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<PlanData, "id">)
  }));
};

export const updatePlan = async (id: string, data: Omit<PlanData, "id">) => {
  const ref: DocumentReference = doc(db, "plans", id);
  await updateDoc(ref, data);
};

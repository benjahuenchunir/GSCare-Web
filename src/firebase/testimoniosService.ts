// src/firebase/testimoniosService.ts
import { collection, getDocs, addDoc, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface Testimonio {
  id?: string;
  nombre: string;
  contenido: string;
  fecha: string;
  userId?: string;
  aprobado?: boolean;
}

const testimoniosRef = collection(db, 'testimonios');

export const getTestimoniosAprobados = async (): Promise<Testimonio[]> => {
  const q = query(testimoniosRef, where('aprobado', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Testimonio));
};

export const addTestimonio = async (testimonio: Omit<Testimonio, 'id' | 'aprobado' | 'fecha'>) => {
  await addDoc(testimoniosRef, {
    ...testimonio,
    aprobado: false, // que lo apruebe un admin después
    fecha: new Date().toISOString(),
  });
};

export const updateTestimonio = async (id: string, data: { nombre: string; contenido: string }) => {
  const ref = doc(db, 'testimonios', id);
  await updateDoc(ref, data);
};

export const aprobarTestimonio = async (id: string) => {
  const ref = doc(db, 'testimonios', id);
  await updateDoc(ref, { aprobado: true });
};

export const eliminarTestimonio = async (id: string) => {
  const ref = doc(db, 'testimonios', id);
  await deleteDoc(ref);
};

export const getTestimoniosPendientes = async (): Promise<Testimonio[]> => {
  const q = query(testimoniosRef, where('aprobado', '==', false));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Testimonio));
};

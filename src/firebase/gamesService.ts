// src/firebase/gamesService.ts
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from './firebaseConfig'

export type Game = {
  id?: string
  title: string
  description: string
  image: string
  link: string
}

const juegosRef = collection(db, 'juegos')

export const getAllGames = async (): Promise<Game[]> => {
  const snapshot = await getDocs(juegosRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Game[]
}

export const addGame = async (game: Omit<Game, 'id'>) => {
  await addDoc(juegosRef, game)
}

export const updateGame = async (id: string, data: Partial<Game>) => {
  await updateDoc(doc(db, 'juegos', id), data)
}

export const deleteGame = async (id: string) => {
  await deleteDoc(doc(db, 'juegos', id))
}

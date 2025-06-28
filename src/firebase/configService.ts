// src/firebase/configService.ts
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebaseConfig'

export interface Config {
  contactPhone: string
  contactEmail: string
  address: string
  landingImage: string
  landingTitle: string
  landingSubtitle: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    x?: string
    linkedin?: string
  }
  supportHours?: string
}

const configRef = doc(db, 'config', 'global')

export const getConfig = async () => {
  const snapshot = await getDoc(configRef)
  return snapshot.exists() ? snapshot.data() : null
}

export const updateConfig = async (newConfig: Partial<Config>) => {
  try {
    await setDoc(configRef, newConfig, { merge: true })
  } catch (error) {
    console.error("Error actualizando configuración:", error)
    throw error
  }
}


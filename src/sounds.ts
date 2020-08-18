import Sound from './modules/Sound'

// Sound storage
export interface Sounds {
  [key: string]: Sound | null
}

export const sounds: Sounds = {}

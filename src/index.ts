import { sounds } from './sounds'
import Sound from './modules/Sound'
import urlToAudioBuffer from './modules/urlToAudioBuffer'
/**
 *  Add and create audio instance
 * @param key name of audio file
 * @param url url of audio file
 */
export function add (key: string, url: string): void {
  console.log('ADD', key, url)
  if (url !== undefined) {
    urlToAudioBuffer(url)
      .then(buffer => {
        sounds[key] = new Sound(buffer) // Store
      })
  }
}

/**
 * Remove stored key / audio
 * @param key
 */
export function remove (key: string): void {
  sounds[key] = null
}

/**
 * Copy one storage slot to another key
 * @param source key string
 * @param target key string
 */
export function copy (source: string, target: string): void {
  sounds[target] = sounds[source]
}

/**
 * Swap two storage slots
 * @param source key string
 * @param target key string
 */
export function swap (source: string, target: string): void {
  const targetSound = sounds[target]
  sounds[target] = sounds[source]
  sounds[source] = targetSound
}

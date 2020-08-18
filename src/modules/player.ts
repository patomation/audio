import context from './context'
import { sounds } from '../sounds'
import Sound from './Sound'

// MASTER FX
const master = context.createGain()
// TODO create other effect nodes

// CONNECT NODES
master.connect(context.destination) // Connects gain node to output
// TODO connect additional gain nodes

const createSource = (buffer: AudioBuffer): AudioBufferSourceNode => {
  const source = context.createBufferSource()
  source.buffer = buffer
  return source
}

const fadeOut = (gainNode: GainNode, time = 1): void => {
  gainNode.gain.cancelScheduledValues(context.currentTime) // May not need but what the hell
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + time)
  // gainNode.gain.linearRampToValueAtTime(0.0001, context.currentTime + time)
}

const fadeAll = (key: string, time: number): void => {
  // NoteOn false
  if (Object.prototype.hasOwnProperty.call(sounds, key) && sounds[key] !== null) {
    // Stop each gain node. By fading it out.
    sounds[key]?.gainNodes.forEach((gainNode) => {
      // Fade out gracefully
      fadeOut(gainNode, time)
    })
    // Reset gainNode cache
    sounds[key]?.resetGainNodes()
  }
}

interface Options {
  voiceOverlap?: boolean
  start?: number
  end?: number
}

export function play (
  key: string,
  options: Options = {}
): void {
  const {
    voiceOverlap,
    start,
    end
  } = options
  const sound: Sound = sounds[key] as Sound
  if (sound !== null) {
    // Crete new source
    const source = createSource(sounds[key]?.buffer as unknown as AudioBuffer)
    source.currentTime = 0.5
    // VoiceOverlap false
    if (voiceOverlap === false) {
      fadeAll(key, 0.2)
    }
    // Make new gain node
    const gainNode = context.createGain()

    // Make a storage space if one does not exist
    if (sound.gainNodes === undefined) sound.resetGainNodes()
    // Store each gain node created to stop them later
    sound.gainNodes.push(gainNode)

    // Connect sound to output
    source.connect(gainNode)
    gainNode.connect(master)

    // Start playing
    const offset: number = start !== undefined ? start : 0
    source.start(0, offset)

    // Schedule stop id end time defined
    const seconds: number = end !== undefined ? end : sound.buffer.duration
    setTimeout(() => {
      console.log('fade out')
      fadeOut(gainNode, 0.2)
    }, seconds * 1000) // Convert sec to milSec
  }
}

export function stop (key: string): void{
  // NoteOn false
  if (sounds[key] !== null) {
    fadeAll(key, 0.5)
  }
}

export function volume (value: number): void {
  master.gain.value = value
}

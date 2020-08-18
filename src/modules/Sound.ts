// Sound storage item
export default class Sound {
  constructor (buffer: AudioBuffer) {
    this.buffer = buffer
    this.gainNode = null
    this.gainNodes = []
  }

  buffer: AudioBuffer
  gainNode: GainNode | null
  gainNodes: GainNode[]

  resetGainNodes (): void {
    this.gainNodes = []
  }
}

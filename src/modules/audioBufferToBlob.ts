// Borrowed this code from somewhere:
// source: https://www.russellgood.com/how-to-convert-audiobuffer-to-audio-file/
// Of corse I modified the example to not require length prop
export default function audioBufferToBlob (audioBuffer: AudioBuffer): Blob {
  const setUint16 = (data: number): void => {
    view.setUint16(pos, data, true)
    pos += 2
  }

  const setUint32 = (data: number): void => {
    view.setUint32(pos, data, true)
    pos += 4
  }

  const numOfChan = audioBuffer.numberOfChannels
  const length = audioBuffer.length * numOfChan * 2 + 44
  const buffer = new ArrayBuffer(length)
  const view = new DataView(buffer)
  const channels = []
  let sample
  let offset = 0
  let pos = 0

  // write WAVE header
  setUint32(0x46464952) // "RIFF"
  setUint32(length - 8) // file length - 8
  setUint32(0x45564157) // "WAVE"

  setUint32(0x20746d66) // "fmt " chunk
  setUint32(16) // length = 16
  setUint16(1) // PCM (uncompressed)
  setUint16(numOfChan)
  setUint32(audioBuffer.sampleRate)
  setUint32(audioBuffer.sampleRate * 2 * numOfChan) // avg. bytes/sec
  setUint16(numOfChan * 2) // block-align
  setUint16(16) // 16-bit (hardcoded in this demo)

  setUint32(0x61746164) // "data" - chunk
  setUint32(length - pos - 4) // chunk length

  // write interleaved data
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) { channels.push(audioBuffer.getChannelData(i)) }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) { // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])) // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0 // scale to 16-bit signed int
      view.setInt16(pos, sample, true) // write 16-bit sample
      pos += 2
    }
    offset++ // next source sample
  }

  // create Blob
  return new Blob([buffer], { type: 'audio/wav' })
}

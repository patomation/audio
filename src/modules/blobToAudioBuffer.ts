import context from './context'

export default function blobToAudioBuffer (blob: Blob): Promise<AudioBuffer> {
  return new Promise((resolve) => {
    const fileReader = new FileReader()

    fileReader.onloadend = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer
      context.decodeAudioData(arrayBuffer, (audioBuffer) => {
        resolve(audioBuffer)
      })
    }

    fileReader.readAsArrayBuffer(blob)
  })
}

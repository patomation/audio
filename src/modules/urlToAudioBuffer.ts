import context from './context'

export default function urlToAudioBuffer (mediaUrl: string): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        // Get url response
        // const result = await fs.readFile('/'+mediaUrl) // Method used in electron + nodejs
        // Use fetch in browsers
        const response = await fetch(mediaUrl, {
          method: 'GET'
        })
        const arrayBuffer = await response.arrayBuffer()
        // decode array buffer into audio buffer
        const audioBuffer = await context.decodeAudioData(arrayBuffer)
        // // return audio buffer
        resolve(audioBuffer)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })()
  })
}

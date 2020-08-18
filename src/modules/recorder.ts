import { sounds } from '../sounds'
import Sound from './Sound'
import blobToAudioBuffer from './blobToAudioBuffer'

let isReady = false
let isRecording = false
let storageKey: string
// Event namespace
let onRecordStartCallback: () => void
let onRecordStopCallback: () => void
let mediaRecorder: MediaRecorder
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(mediaSource => {
    mediaRecorder = new window.MediaRecorder(mediaSource, { mimeType: 'audio/webm' })

    mediaRecorder.addEventListener('dataavailable', (e) => {
      // trigger stop event
      isRecording = false
      const blob: Blob = e.data
      // Store
      blobToAudioBuffer(blob)
        .then(buffer => {
          console.log('audio buffer created', buffer)

          sounds[storageKey] = new Sound(buffer)
        })
      if (onRecordStopCallback !== undefined) onRecordStopCallback()
    })

    mediaRecorder.addEventListener('start', () => {
      // trigger start event
      isRecording = true
      if (onRecordStartCallback !== undefined) onRecordStartCallback()
    })

    mediaRecorder.addEventListener('stop', () => {
      // Do nothing because dataavailable event listener will handle stop
    })
    isReady = true
  })
  .catch(err => console.error('Record Stream Error:', err))

export function onRecordStart (callback: () => void): void { onRecordStartCallback = callback }
export function onRecordStop (callback: () => void): void { onRecordStopCallback = callback }

// Start recorder
export function start (key: string): void {
  if (isReady && !isRecording) {
    storageKey = key
    mediaRecorder.start()
  }
}

// Stop recorder
export function stop (): void {
  if (isReady && isRecording) mediaRecorder.stop()
}

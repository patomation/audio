type MediaRecorderCallback = (event: { data: Blob }) => void

interface MediaRecorder {
  addEventListener: (key: string, callback: MediaRecorderCallback) => void
  start: () => void
  stop: () => void
}

type MediaRecorderConstructor = new(mediaSource: MediaStream, options: { mimeType: string }) => MediaRecorder

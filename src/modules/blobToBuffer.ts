// Convert a blob to buffer promise
export default function blobToBuffer (blob: Blob): Promise<ArrayBuffer> {
  return blob.arrayBuffer()
}

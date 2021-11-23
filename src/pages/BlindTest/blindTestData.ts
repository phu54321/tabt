import JSZip from 'jszip'
import { audioCtx } from './../../utils/sharedAudioCtx'

export interface BlindTestEntry {
  label: string
  wavData: AudioBuffer
}

export interface BlindTest {
  label: string
  entries: BlindTestEntry[]
}

/// ///////

export async function loadBlindTest (b64: string): Promise<BlindTest> {
  const z = new JSZip()
  await z.loadAsync(b64, { base64: true })

  const manifestFile = z.file('manifest.json')
  if (!manifestFile) throw new Error('No manifest.json')
  const manifest = JSON.parse(await manifestFile.async('string'))
  return {
    label: manifest.label,
    entries: await Promise.all(manifest.entries.map((e: any) => {
      return new Promise((resolve) => {
        const { label: entryLabel, filename } = e
        console.log(`loading ${filename}`)
        const f = z.file(filename)
        if (!f) throw new Error(`No file ${filename}`)
        console.log(2, filename)
        f.async('arraybuffer').then(b => {
          audioCtx.decodeAudioData(b, data => {
            console.log(4, filename)
            resolve({
              label: entryLabel,
              wavData: data
            })
          })
        })
      })
    }))
  }
}

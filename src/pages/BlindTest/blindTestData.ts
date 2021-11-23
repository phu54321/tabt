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
    entries: await Promise.all(manifest.entries.map(async (e: any) => {
      const { label: entryLabel, filename } = e
      console.log(`loading ${filename}`)
      const f = z.file(filename)
      if (!f) throw new Error(`No file ${filename}`)
      const data = await audioCtx.decodeAudioData(await f.async('arraybuffer'))
      return {
        label: entryLabel,
        wavData: data
      }
    }))
  }
}

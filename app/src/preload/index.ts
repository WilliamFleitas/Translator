import { contextBridge, ipcRenderer } from 'electron'

export interface StartStreamingType {
  status: 0 | 1 | 2
  sentence?: string
  words?: { word: string }[]
  channel_info?: {
    is_final: boolean
    speech_final: boolean
    from_finalize: boolean
  }
  message?: string
}

export type DeviceType = 'speaker' | 'mic'
export type DurationTimeType = 'unlimited' | '60' | '600' | '1800' | '3600'

export type ApiResponse<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
      code?: number
    }

export interface Api {
  startStreaming: (
    device: DeviceType,
    durationTime: DurationTimeType,
    audio_language: string,
    translation_language: string,
    deepgram_key: string | undefined,
    subsKey: string | undefined,
    region: string | undefined
  ) => Promise<ApiResponse<StartStreamingType>>
  stopStreaming: () => Promise<ApiResponse<{ status: string }>>
  getTranslation: (
    transcription: string,
    audio_language: string,
    translation_language: string,
    subsKey: string | undefined,
    region: string | undefined
  ) => Promise<ApiResponse<{ translation: string }>>
  setClickableOverlay: (enableOverlay: boolean) => void

  handleTranslationOverlay: (enableOverlay: boolean) => void

  on: (event: string, listener: (event: Electron.IpcRendererEvent, data: any) => void) => void
  removeListener: (
    event: string,
    listener: (event: Electron.IpcRendererEvent, data: any) => void
  ) => void
  windowControls: {
    minimize: () => void
    maximize: () => void
    close: () => void
  }
}

const api: Api = {
  startStreaming: async (
    device,
    durationTime,
    audio_language,
    translation_language,
    deepgram_key,
    subsKey,
    region
  ) => {
    return await ipcRenderer.invoke(
      'start-streaming',
      device,
      durationTime,
      audio_language,
      translation_language,
      deepgram_key,
      subsKey,
      region
    )
  },
  stopStreaming: async () => {
    return await ipcRenderer.invoke('stop-streaming')
  },
  getTranslation: async (transcription, audio_language, translation_language, subsKey, region) => {
    return await ipcRenderer.invoke(
      'get-translation',
      transcription,
      audio_language,
      translation_language,
      subsKey,
      region
    )
  },
  setClickableOverlay: (enableOverlay: boolean) => {
    ipcRenderer.invoke('clickable-overlay', enableOverlay)
  },

  handleTranslationOverlay: (enableOverlay) => {
    ipcRenderer.send('toggle-overlay', enableOverlay)
  },
  on: (event, listener) => {
    ipcRenderer.on(event, listener)
  },
  removeListener: (event, listener) => {
    ipcRenderer.removeListener(event, listener)
  },
  windowControls: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  // window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

import { useContext, useEffect, useState } from 'react'
import SelectMenu, { MenuOptionType } from '../../../../../components/menu/SelectMenu'
import { FaPlay, FaStop, FaMicrophone, FaLock } from 'react-icons/fa'
import { HiSpeakerWave } from 'react-icons/hi2'
import { GiDuration } from 'react-icons/gi'
import {
  TbTimeDuration60,
  TbTimeDuration30,
  TbTimeDuration10,
  TbTimeDuration0
} from 'react-icons/tb'

import { DurationTimeType } from '@renderer/globalTypes/globalApi'
import { toast } from 'react-toastify'
import { VCStatusContext } from '@renderer/components/context/VCContext'
import DefaultLoading from '@renderer/components/loading/DefaultLoading'
import { languages } from './TranslatorTextarea'
import { DeepgramSettingsStatusContext } from '@renderer/components/context/DeepgramSettingsContext'
import { AzureSettingsStatusContext } from '@renderer/components/context/AzureSettingsContext'

const timeDurationList = [
  {
    label: 'Unlimited',
    value: 'unlimited',
    id: 0
  },
  {
    label: '60 minutes',
    value: 3600,
    id: 1
  },
  {
    label: '30 minutes',
    value: 1800,
    id: 2
  },
  {
    label: '10 minutes',
    value: 600,
    id: 3
  },
  {
    label: '1 minute',
    value: 60,
    id: 4
  }
]

interface TranslatorControllerPropsType {
  transcriptionContent: string
  isCapturingAudio: boolean
  transcriptionIsLoading: boolean
  selectedTranslationLanguage: MenuOptionType
  selectedTranscriptionLanguage: MenuOptionType
  setTranscriptionSentence: React.Dispatch<React.SetStateAction<string>>
  setTranslationSentence: React.Dispatch<React.SetStateAction<string>>
  setIsCapturingAudio: React.Dispatch<React.SetStateAction<boolean>>
  setTranslationError: React.Dispatch<React.SetStateAction<string | null>>
  setTranscriptionIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setTranscriptionError: React.Dispatch<React.SetStateAction<string | null>>
  setTranscriptionWords: React.Dispatch<React.SetStateAction<string>>
  handleSelectedTranscriptionLanguageChange: (resObj: MenuOptionType) => void
}
const TranslatorController = ({
  transcriptionContent,
  isCapturingAudio,
  selectedTranslationLanguage,
  transcriptionIsLoading,
  selectedTranscriptionLanguage,
  setTranscriptionSentence,
  setTranslationSentence,
  setIsCapturingAudio,
  setTranslationError,
  setTranscriptionError,
  setTranscriptionIsLoading,
  setTranscriptionWords,
  handleSelectedTranscriptionLanguageChange
}: TranslatorControllerPropsType): React.ReactElement => {
  const { state } = useContext(VCStatusContext)
  const {
    deepgramSettingsState: { APIKey }
  } = useContext(DeepgramSettingsStatusContext)
  const {
    azureSettingsState: { APIKey: azureAPIKey, APIRegion: azureAPIRegion }
  } = useContext(AzureSettingsStatusContext)
  const audioDevices = [
    {
      label: 'Speaker',
      value: 'speaker',
      id: 0,
      disabled: state.default_audio_device && state.is_running && state.lock_status ? false : true,
      disabledTitle: 'Run Voicemeeter to unlock'
    },
    {
      label: 'Mic',
      value: 'mic',
      id: 1
    }
  ]

  const [selectedAudioDevice, setSelectedAudioDevice] = useState<MenuOptionType>(audioDevices[1])
  const [selectedTimeduration, setSelectedTimeduration] = useState<MenuOptionType>(
    timeDurationList[0]
  )

  const handleSelectedAudioDeviceChange = (resObj: MenuOptionType): void => {
    setSelectedAudioDevice(resObj)
  }
  const handleCaptureTimeChange = (resObj: MenuOptionType): void => {
    setSelectedTimeduration(resObj)
  }

  const handleStartRecording = async (): Promise<void> => {
    try {
      setTranscriptionIsLoading(true)
      setTranscriptionSentence('')
      setTranslationSentence('')
      setTranslationError(null)
      setTranscriptionError(null)
      setIsCapturingAudio(true)
      const response = await window.api.startStreaming(
        selectedAudioDevice.value as 'mic' | 'speaker',
        selectedTimeduration.value as DurationTimeType,
        selectedTranscriptionLanguage.value.toString(),
        selectedTranslationLanguage.value.toString(),
        APIKey,
        azureAPIKey,
        azureAPIRegion
      )
      if (response.success) {
        if (response.data.status !== undefined && response.data.status === 1) {
          setIsCapturingAudio(false)
        }
      } else {
        throw Error(response.error)
      }
    } catch (err: any) {
      setIsCapturingAudio(false)
      console.log('error', err)
      toast.error(`handleStartRecording ${err.message}`, {
        isLoading: false,
        autoClose: 5000
      })
    }
  }

  const handleStopRecording = async (): Promise<void> => {
    try {
      await window.api.stopStreaming()
      setIsCapturingAudio(false)
      setTranscriptionWords('')
      setTranscriptionSentence(transcriptionContent.slice(0, transcriptionContent.length - 2) + '.')
    } catch (error: any) {
      toast.error(`handleStopRecording ${error.message}`, {
        isLoading: false,
        autoClose: 5000
      })
    }
  }

  useEffect(() => {
    if (selectedAudioDevice.value === 'speaker') {
      if (!state.default_audio_device || !state.is_running || !state.lock_status) {
        handleSelectedAudioDeviceChange(audioDevices[1])
      }
    }
  }, [state])
  return (
    <nav className="py-3 px-4 gap-8 flex flex-col sm:flex-row w-full justify-between items-stretch text-start relative bg-secondary-background">
      <section className="flex flex-row w-full md:w-fit h-fit text-start items-center justify-between md:justify-start  gap-4 text-lg ">
        <div className="flex flex-row flex-grow lg:flex-grow-0 text-start items-center justify-between gap-4 whitespace-nowrap">
          <SelectMenu
            viewScroll="close"
            placeX="left"
            placeY="bottom"
            gap={1}
            shift={0}
            portal={true}
            position="anchor"
            optionsData={audioDevices}
            disableButton={isCapturingAudio}
            currentOption={selectedAudioDevice}
            handleOptionChange={handleSelectedAudioDeviceChange}
            enableArrow={true}
            customButtonClassName={
              'bg-primary-button hover:bg-primary-button-hover flex flex-row text-start items-center justify-between w-fit h-fit py-2 px-3 rounded-full text-lg font-bold text-white gap-3'
            }
            customIcon={
              selectedAudioDevice.value === 'mic' ? (
                <FaMicrophone className="w-5 h-5 " />
              ) : (
                <HiSpeakerWave className="w-5 h-5 " />
              )
            }
            customButtonTitle={`Capture audio from speaker or mic`}
          />
        </div>
        <div className="flex flex-row flex-grow lg:flex-grow-0 text-start items-center justify-between gap-4 whitespace-nowrap">
          <SelectMenu
            viewScroll="initial"
            placeX="left"
            placeY="bottom"
            gap={1}
            shift={0}
            portal={true}
            position="initial"
            disableButton={isCapturingAudio}
            optionsData={timeDurationList}
            currentOption={selectedTimeduration}
            handleOptionChange={handleCaptureTimeChange}
            enableArrow={true}
            customButtonClassName={
              'bg-primary-button hover:bg-primary-button-hover flex flex-row text-start items-center justify-between w-fit h-fit py-2 px-3 rounded-full text-lg font-bold text-white gap-3'
            }
            customIcon={
              selectedTimeduration.value === 'unlimited' ? (
                <GiDuration className="w-5 h-5 " />
              ) : selectedTimeduration.value === 3600 ? (
                <TbTimeDuration60 className="w-5 h-5 " />
              ) : selectedTimeduration.value === 1800 ? (
                <TbTimeDuration30 className="w-5 h-5 " />
              ) : selectedTimeduration.value === 600 ? (
                <TbTimeDuration10 className="w-5 h-5 " />
              ) : (
                <TbTimeDuration0 className="w-5 h-5 " />
              )
            }
            customButtonTitle={`Duration Time`}
          />
        </div>
        <div className="flex flex-row flex-grow lg:flex-grow-0 text-start items-center justify-between gap-4 whitespace-nowrap">
          <SelectMenu
            viewScroll="initial"
            placeX="left"
            placeY="bottom"
            gap={1}
            shift={0}
            portal={true}
            position="initial"
            disableButton={isCapturingAudio}
            optionsData={languages}
            currentOption={selectedTranscriptionLanguage}
            handleOptionChange={handleSelectedTranscriptionLanguageChange}
            enableArrow={true}
            customButtonClassName={
              'bg-primary-button hover:bg-primary-button-hover flex flex-row text-start items-center justify-between w-fit h-fit py-2 px-3 rounded-full text-lg font-bold text-white gap-3 uppercase'
            }
            customButtonContent={selectedTranscriptionLanguage.value.toString()}
            customButtonTitle={`Select Language`}
          />
        </div>

        {transcriptionIsLoading ? (
          <button
            className="bg-primary-button  flex flex-row text-start items-center justify-between w-fit h-full py-2 px-4 rounded-md text-lg font-bold uppercase text-white gap-2"
            title={`Loading..`}
            type="button"
            disabled={true}
          >
            <DefaultLoading size={1.25} color={'#fff'} />
          </button>
        ) : isCapturingAudio ? (
          <button
            className="bg-primary-button hover:bg-primary-button-hover flex flex-row text-start items-center justify-between w-fit h-fit py-2 px-4 rounded-md text-lg font-bold uppercase text-white gap-2"
            title="Stop recording"
            onClick={handleStopRecording}
            type="button"
          >
            <FaStop className="w-5 h-5 text-danger" />
          </button>
        ) : (
          <button
            className="bg-primary-button hover:bg-primary-button-hover flex flex-row text-start items-center justify-between w-fit h-fit py-2 px-4 rounded-md text-lg font-bold uppercase text-white gap-2"
            title={`Start recording`}
            onClick={handleStartRecording}
            type="button"
          >
            <FaPlay className="w-5 h-5 text-blue-400" />
          </button>
        )}
      </section>

      {APIKey === null || APIKey.length <= 0 ? (
        <div className="absolute top-0 bg-secondary-background/70 w-full h-full left-0 text-center items-center justify-center">
          <strong className="h-full text-center items-center justify-center flex flex-row gap-2 text-lg">
            <FaLock className="w-5 h-5 " /> Deepgram API Key needed.
          </strong>
        </div>
      ) : (
        <></>
      )}
    </nav>
  )
}

export default TranslatorController

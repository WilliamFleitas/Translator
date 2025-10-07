import { useContext, useEffect, useRef, useState } from 'react'
import TranslatorController from './TranslatorController'
import SelectMenu, { MenuOptionType } from '@renderer/components/menu/SelectMenu'
import { AzureSettingsStatusContext } from '@renderer/components/context/AzureSettingsContext'
import { PiBroomDuotone } from 'react-icons/pi'

export const deepgramLanguages = [
  { id: 0, value: 'detect_language', label: 'Detect Language' },
  { id: 1, value: 'multi', label: 'Multilingual (Spanish + English)' },
  { id: 2, value: 'bg', label: 'Bulgarian' },
  { id: 3, value: 'ca', label: 'Catalan' },
  { id: 4, value: 'zh', label: 'Chinese (Mandarin, Simplified)' },
  { id: 5, value: 'zh-CN', label: 'Chinese (Mandarin, Simplified)' },
  { id: 6, value: 'zh-Hans', label: 'Chinese (Mandarin, Simplified)' },
  { id: 7, value: 'zh-TW', label: 'Chinese (Mandarin, Traditional)' },
  { id: 8, value: 'zh-Hant', label: 'Chinese (Mandarin, Traditional)' },
  { id: 9, value: 'zh-HK', label: 'Chinese (Cantonese, Traditional)' },
  { id: 10, value: 'cs', label: 'Czech' },
  { id: 11, value: 'da', label: 'Danish' },
  { id: 12, value: 'da-DK', label: 'Danish (Denmark)' },
  { id: 13, value: 'nl', label: 'Dutch' },
  { id: 14, value: 'en', label: 'English' },
  { id: 15, value: 'en-US', label: 'English (US)' },
  { id: 16, value: 'en-AU', label: 'English (Australia)' },
  { id: 17, value: 'en-GB', label: 'English (UK)' },
  { id: 18, value: 'en-NZ', label: 'English (New Zealand)' },
  { id: 19, value: 'en-IN', label: 'English (India)' },
  { id: 20, value: 'et', label: 'Estonian' },
  { id: 21, value: 'fi', label: 'Finnish' },
  { id: 22, value: 'nl-BE', label: 'Flemish (Belgium)' },
  { id: 23, value: 'fr', label: 'French' },
  { id: 24, value: 'fr-CA', label: 'French (Canada)' },
  { id: 25, value: 'de', label: 'German' },
  { id: 26, value: 'de-CH', label: 'German (Switzerland)' },
  { id: 27, value: 'el', label: 'Greek' },
  { id: 28, value: 'hi', label: 'Hindi' },
  { id: 29, value: 'hu', label: 'Hungarian' },
  { id: 30, value: 'id', label: 'Indonesian' },
  { id: 31, value: 'it', label: 'Italian' },
  { id: 32, value: 'ja', label: 'Japanese' },
  { id: 33, value: 'ko', label: 'Korean' },
  { id: 34, value: 'ko-KR', label: 'Korean (South Korea)' },
  { id: 35, value: 'lv', label: 'Latvian' },
  { id: 36, value: 'lt', label: 'Lithuanian' },
  { id: 37, value: 'ms', label: 'Malay' },
  { id: 38, value: 'no', label: 'Norwegian' },
  { id: 39, value: 'pl', label: 'Polish' },
  { id: 40, value: 'pt', label: 'Portuguese' },
  { id: 41, value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { id: 42, value: 'pt-PT', label: 'Portuguese (Portugal)' },
  { id: 43, value: 'ro', label: 'Romanian' },
  { id: 44, value: 'ru', label: 'Russian' },
  { id: 45, value: 'sk', label: 'Slovak' },
  { id: 46, value: 'es', label: 'Spanish' },
  { id: 47, value: 'es-419', label: 'Spanish (Latin America)' },
  { id: 48, value: 'sv', label: 'Swedish' },
  { id: 49, value: 'sv-SE', label: 'Swedish (Sweden)' },
  { id: 50, value: 'th', label: 'Thai' },
  { id: 51, value: 'th-TH', label: 'Thai (Thailand)' },
  { id: 52, value: 'tr', label: 'Turkish' },
  { id: 53, value: 'uk', label: 'Ukrainian' },
  { id: 54, value: 'vi', label: 'Vietnamese' }
]

interface CustomTextareaPropsType {
  refValue: React.LegacyRef<HTMLTextAreaElement> | undefined
  content: string
  placeholder?: string
  disabled?: boolean
  handleChange: (event: any) => void
}
const CustomTextarea = ({
  refValue,
  content,
  placeholder,
  disabled = false,
  handleChange
}: CustomTextareaPropsType): React.ReactElement => {
  return (
    <textarea
      ref={refValue}
      value={content}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className="flex w-full h-full resize-none shrink  overflow-auto max-h-[15rem] lg:max-h-[25rem] bg-primary-button outline-none focus:border-0 focus:outline-none focus:ring-0 ring-0 px-4 text-2xl my-2"
    />
  )
}

interface TranslatorTextareaPropsType {
  transcriptionWords: string
  transcriptionContent: string
  translationContent: string
  translationError: string | null
  transcriptionError: string | null
  isCapturingAudio: boolean
  transcriptionIsLoading: boolean
  setTranscriptionSentence: React.Dispatch<React.SetStateAction<string>>
  setTranslationSentence: React.Dispatch<React.SetStateAction<string>>
  setIsCapturingAudio: React.Dispatch<React.SetStateAction<boolean>>
  setTranslationError: React.Dispatch<React.SetStateAction<string | null>>
  setTranscriptionError: React.Dispatch<React.SetStateAction<string | null>>
  setTranscriptionIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setTranscriptionWords: React.Dispatch<React.SetStateAction<string>>
}
const TranslatorTextarea = ({
  transcriptionWords,
  transcriptionContent,
  translationContent,
  translationError,
  transcriptionError,
  isCapturingAudio,
  transcriptionIsLoading,
  setIsCapturingAudio,
  setTranscriptionSentence,
  setTranslationSentence,
  setTranscriptionIsLoading,
  setTranslationError,
  setTranscriptionError,
  setTranscriptionWords
}: TranslatorTextareaPropsType): React.ReactElement => {
  const {
    azureSettingsState: { APIKey, APIRegion }
  } = useContext(AzureSettingsStatusContext)

  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [azureLanguages, setAzureLanguages] = useState<MenuOptionType[]>([])
  const [selectedTranslationLanguage, setSelectedTranslationLanguage] = useState<MenuOptionType>({
    label: 'Español',
    value: 'es',
    id: 0
  })
  const [overlayIsShowing, SetOverlayIsShowing] = useState<boolean>(false)
  const [selectedTranscriptionLanguage, setSelectedTranscriptionLanguage] =
    useState<MenuOptionType>(deepgramLanguages[0])
  const textarea1Ref = useRef<HTMLTextAreaElement | null>(null)
  const textarea2Ref = useRef<HTMLTextAreaElement | null>(null)

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const fetchTranslation = async (text: string): Promise<void> => {
    if (APIKey.length > 0 && APIRegion.length > 0) {
      const response = await window.api.getTranslation(
        text,
        selectedTranscriptionLanguage.value.toString(),
        selectedTranslationLanguage.value.toString(),
        APIKey,
        APIRegion
      )
      if (response.success === true) {
        setTranslationSentence(response.data.translation)
      } else {
        setTranslationError(response.error)
      }
    } else {
      setTranslationError('Missing Azure Key or Region')
    }
  }
  const showOverlay = (): void => {
    window.api.handleTranslationOverlay(!overlayIsShowing)
    SetOverlayIsShowing(!overlayIsShowing)
  }
  const handleTextarea1Change = (event): void => {
    const inputValue = event.target.value
    setText1(inputValue)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    event.target.style.height = 'auto'
    if (textarea1Ref.current && textarea2Ref.current) {
      textarea2Ref.current.style.height = 'auto'
      textarea1Ref.current.style.height = `${event.target.scrollHeight}px`
      textarea2Ref.current.style.height = `${textarea1Ref.current.scrollHeight}px`
    }
    debounceTimer.current = setTimeout(() => {
      if (inputValue.length > 0) {
        fetchTranslation(inputValue)
      } else {
        setText2('')
      }
    }, 1000)
  }
  const handleTextarea2Change = (): void => {}
  const cleanText = (): void => {
    setText1('')
    setText2('')
    if (textarea1Ref.current && textarea2Ref.current) {
      textarea1Ref.current.style.height = 'auto'
      textarea2Ref.current.style.height = 'auto'
    }
  }
  const handleSelectedTranslationLanguageChange = (resObj: MenuOptionType): void => {
    setSelectedTranslationLanguage(resObj)
  }
  const handleSelectedTranscriptionLanguageChange = (resObj: MenuOptionType): void => {
    setSelectedTranscriptionLanguage(resObj)
  }
  useEffect(() => {
    if (transcriptionContent.length) {
      setText1(transcriptionContent)
    }

    return (): void => {
      setText1('')
    }
  }, [transcriptionContent, transcriptionWords])
  useEffect(() => {
    if (translationContent.length) {
      setText2(translationContent)
    }

    return (): void => {
      setText2('')
    }
  }, [translationContent])
  useEffect(() => {
    if (textarea1Ref.current && textarea2Ref.current) {
      if (isCapturingAudio) {
        textarea1Ref.current.style.height = 'auto'
        textarea2Ref.current.style.height = 'auto'
        textarea1Ref.current.style.height = `${textarea1Ref.current.scrollHeight}px`
        textarea2Ref.current.style.height = `${textarea2Ref.current.scrollHeight}px`
      }
      const cursorPosition = textarea1Ref.current.selectionStart
      if (cursorPosition === text1.length) {
        textarea1Ref.current.scrollTop = textarea1Ref.current.scrollHeight
        textarea2Ref.current.scrollTop = textarea1Ref.current.scrollHeight
      }
    }
  }, [text1, text2, transcriptionWords])
  useEffect(() => {
    const getAzureLanguages = (): void => {
      fetch(
        'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation'
      )
        .then((response) => response.json())
        .then((data) => {
          if (Object.keys(data.translation)?.length) {
            setAzureLanguages(
              Object.keys(data.translation).map((key, index) => ({
                id: index,
                value: key,
                label: data.translation[key].name,
                dir: data.translation[key].dir
              }))
            )
          } else {
            throw Error('There was and error getting the Languages list from Azure')
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error.message)
          setAzureLanguages([
            {
              label: 'No options',
              value: 'none',
              id: 0
            }
          ])
        })
    }

    getAzureLanguages()
  }, [])

  return (
    <div className="flex flex-row flex-wrap lg:flex-nowrap gap-4 min-h-[10rem]  w-full h-fit">
      <div className="flex flex-col rounded-md w-full resize-none shrink  overflow-x-hidden bg-primary-button text-2xl isolate border-secondary-background border">
        <div className="flex w-full h-full shrink relative ">
          <CustomTextarea
            refValue={textarea1Ref}
            content={`${text1}${transcriptionWords}`}
            disabled={isCapturingAudio}
            handleChange={handleTextarea1Change}
            placeholder="Write here.."
          />
          {transcriptionError?.length ? (
            <strong className="bg-secondary-background/80 absolute top-0 left-0 w-full h-full flex text-start items-center justify-center grow gap-2 text-3xl border border-danger rounded-t-md px-6 py-2">
              <span className="text-danger text-3xl">Error: </span> {transcriptionError}
            </strong>
          ) : (
            <></>
          )}
          <button
            type="button"
            onClick={cleanText}
            className="absolute top-1 right-1 hover:bg-primary-button-hover p-1 rounded-md"
          >
            <PiBroomDuotone className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-auto">
          <TranslatorController
            isCapturingAudio={isCapturingAudio}
            transcriptionIsLoading={transcriptionIsLoading}
            selectedTranslationLanguage={selectedTranslationLanguage}
            selectedTranscriptionLanguage={selectedTranscriptionLanguage}
            setIsCapturingAudio={setIsCapturingAudio}
            setTranscriptionSentence={setTranscriptionSentence}
            setTranslationSentence={setTranslationSentence}
            setTranslationError={setTranslationError}
            setTranscriptionError={setTranscriptionError}
            setTranscriptionIsLoading={setTranscriptionIsLoading}
            setTranscriptionWords={setTranscriptionWords}
            handleSelectedTranscriptionLanguageChange={handleSelectedTranscriptionLanguageChange}
          />
        </div>
      </div>
      <div className="flex flex-col rounded-md w-full resize-none shrink overflow-x-hidden bg-primary-button  text-2xl isolate border-secondary-background border ">
        <div className="flex w-full h-full shrink relative ">
          <CustomTextarea
            refValue={textarea2Ref}
            content={text2}
            handleChange={handleTextarea2Change}
            placeholder="Translation.."
            disabled={true}
          />
          {APIKey.length <= 0 || APIRegion.length <= 0 || translationError?.length ? (
            <strong className="bg-secondary-background/80 absolute top-0 left-0 w-full h-full flex text-start items-center justify-center grow gap-2 text-3xl border border-danger rounded-t-md  px-6 py-2">
              <span className="text-danger text-3xl">Error: </span>{' '}
              {APIKey.length <= 0 || APIRegion.length <= 0
                ? 'Missing Azure Key or Region'
                : translationError}
            </strong>
          ) : (
            <></>
          )}
        </div>
        <div className="mt-auto">
          <nav className="py-3 px-4 gap-8 flex flex-col sm:flex-row w-full justify-between items-stretch text-start relative bg-secondary-background ">
            <section className="flex flex-row w-full md:w-fit h-fit text-start items-center justify-between md:justify-start  gap-4 text-lg">
              <div className="flex flex-row  text-start items-center justify-between gap-4 whitespace-nowrap">
                <SelectMenu
                  viewScroll="initial"
                  placeX="left"
                  placeY="bottom"
                  gap={1}
                  shift={0}
                  portal={true}
                  position="initial"
                  disableButton={
                    APIKey.length <= 0 || APIRegion.length <= 0 ? true : isCapturingAudio
                  }
                  optionsData={azureLanguages}
                  currentOption={selectedTranslationLanguage}
                  handleOptionChange={handleSelectedTranslationLanguageChange}
                  enableArrow={true}
                  customButtonClassName={` flex flex-row text-start items-center justify-between w-fit h-fit py-2 px-3 rounded-full text-lg font-bold text-white gap-3 uppercase ${APIKey.length <= 0 || APIRegion.length <= 0 ? 'bg-primary-button-hover' : 'bg-primary-button hover:bg-primary-button-hover'}`}
                  customButtonContent={selectedTranslationLanguage.value.toString()}
                  customButtonTitle={
                    APIKey.length <= 0 || APIRegion.length <= 0
                      ? 'Missing Azure Key or Region'
                      : `Select Translation Language`
                  }
                />
              </div>
              <div className="flex flex-row  text-start items-center justify-between gap-4 whitespace-nowrap">
                <label className="cursor-pointer bg-primary-button hover:bg-primary-button-hover flex flex-row text-start items-center justify-between w-fit h-fit py-2 px-3 rounded-full text-lg font-bold text-white gap-3 uppercase">
                  <span>Overlay</span>
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={overlayIsShowing}
                    onChange={showOverlay}
                  />
                  <div className="relative w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 dark:bg-secondary-background peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.4 after:start-[0.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600 border-none outline-none ring-0 hover:border-none hover:outline-none hover:ring-0 focus:border-none focus:outline-none focus:ring-0 active:border-none active:outline-none active:ring-0 "></div>
                </label>
              </div>
            </section>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default TranslatorTextarea

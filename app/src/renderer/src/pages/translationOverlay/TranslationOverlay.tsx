import { useEffect, useRef, useState } from 'react'
import { MdFullscreen } from 'react-icons/md'
import useTranslationListener from '@renderer/assets/customHooks/useTranslationListener'
import useTranscriptionListener from '@renderer/assets/customHooks/useTranscriptionListener'
import { PiBroomDuotone } from 'react-icons/pi'
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowLeftThick,
  TiArrowRightThick
} from 'react-icons/ti'
import { TbBackground } from 'react-icons/tb'

import './TranslationOverlay.css'

interface CustomTextareaPropsType {
  content: string
  refValue: React.LegacyRef<HTMLTextAreaElement> | undefined
  placeholder?: string
  disabled?: boolean
  color?: string
  tabIsEnabled: boolean
  enableOverlayBackground: boolean
}
const CustomTextarea = ({
  content,
  refValue,
  disabled,
  placeholder,
  color,
  tabIsEnabled,
  enableOverlayBackground
}: CustomTextareaPropsType): React.ReactElement => {
  return (
    <textarea
      ref={refValue}
      value={content}
      placeholder={placeholder}
      disabled={disabled}
      className={`custom-textarea text-[1.6rem] resize-none shrink  overflow-auto  flex text-start w-full h-full px-2 font-semibold outline-none focus:border-0 focus:outline-none focus:ring-0 ring-0 ${!tabIsEnabled && enableOverlayBackground ? 'bg-[#18171779]' : ''} rounded-md`}
      style={{ color: color, textShadow: tabIsEnabled ? '' : '-1px 1px 8px #ffffff' }}
    />
  )
}
const TranslationOverlay: React.FC = () => {
  const textarea1Ref = useRef<HTMLTextAreaElement | null>(null)
  const textarea2Ref = useRef<HTMLTextAreaElement | null>(null)

  const [tabIsEnabled, setTabIsEnabled] = useState<boolean>(false)
  const [transcriptionColor, setTranscriptionColor] = useState<string>('#ffffff')
  const [translationColor, setTranslationColor] = useState<string>('#f6b73c')
  const [enableTranscriptionOverlay, setEnableTranscriptionOverlay] = useState<boolean>(true)
  const [enableTranslationOverlay, setEnableTranslationOverlay] = useState<boolean>(true)
  const [enableOverlayBackground, setEnableOverlayBackground] = useState<boolean>(false)
  const [hoveredOverlay, setHoveredOverlay] = useState<boolean>(false)

  const { transcriptionSentence, transcriptionError, setTranscriptionSentence } =
    useTranscriptionListener({
      cleanState: true
    })
  const { translationSentence, translationError, setTranslationSentence } = useTranslationListener()

  const handleEnableTranscriptionOverlayClick = (): void => {
    if (enableTranscriptionOverlay && !enableTranslationOverlay) return
    setEnableTranscriptionOverlay(!enableTranscriptionOverlay)
  }
  const handleEnableTranslationOverlayClick = (): void => {
    if (enableTranslationOverlay && !enableTranscriptionOverlay) return
    setEnableTranslationOverlay(!enableTranslationOverlay)
  }
  const handleOverlayBackgroundClick = (): void => {
    setEnableOverlayBackground(!enableOverlayBackground)
  }
  const handleClearOverlayText = (): void => {
    setTranslationSentence('')
    setTranscriptionSentence('')
  }
  const handleClickableOverlayChange = (enableOverlay: boolean): void => {
    window.api.setClickableOverlay(enableOverlay)
    setHoveredOverlay(enableOverlay)
  }
  const handleOverlayColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault()
    const target = event.target as HTMLInputElement
    if (target.id === 'transcriptionColor') {
      setTranscriptionColor(target.value)
    } else {
      setTranslationColor(target.value)
    }
  }
  useEffect(() => {
    if (textarea1Ref.current && textarea2Ref.current) {
      textarea1Ref.current.scrollTop = textarea1Ref.current.scrollHeight
      textarea2Ref.current.scrollTop = textarea2Ref.current.scrollHeight
    }
  }, [transcriptionSentence, translationSentence])

  useEffect(() => {
    if (transcriptionSentence.length === 0) {
      setTranslationSentence('')
    }
  }, [transcriptionSentence])

  useEffect(() => {
    const handleOverlayState = (): void => {
      if (!hoveredOverlay) {
        if (tabIsEnabled) {
          window.api.setClickableOverlay(true)
        } else {
          window.api.setClickableOverlay(false)
        }
      }
    }
    handleOverlayState()
  }, [hoveredOverlay, tabIsEnabled])
  return (
    <div className={`flex flex-col  shrink w-full h-dvh  text-start items-start justify-start`}>
      <div className="flex flex-row w-full ml-auto h-fit text-start items-center justify-start gap-4">
        {translationError?.length || transcriptionError?.length ? (
          <div
            className={`flex flex-row w-fit grow h-fit px-2 py-1 max-h-8 overflow-hidden gap-1  border ${tabIsEnabled ? 'bg-danger border-primary-background rounded-t-md' : 'bg-danger/40 border-transparent rounded-md'}`}
            title={
              translationError?.length
                ? translationError
                : transcriptionError?.length
                  ? transcriptionError
                  : ''
            }
          >
            <span className="text-3xl">Error:</span>{' '}
            <small className="text-3xl ">
              {translationError?.length
                ? translationError?.length
                : transcriptionError?.length
                  ? transcriptionError?.length
                  : ''}
            </small>
          </div>
        ) : (
          <></>
        )}

        <div
          className={`ml-auto w-fit h-fit py-1 px-1   flex flex-row text-end items-end justify-end gap-2 border-t border-x rounded-t-md ${tabIsEnabled ? 'bg-secondary-background  border-primary-background' : 'border-transparent'}`}
        >
          {tabIsEnabled ? (
            <>
              <button
                className="pointer-events-auto bg-primary-button hover:bg-primary-button-hover rounded-md p-1 leading-0"
                title="Clean"
                type="button"
                onClick={handleClearOverlayText}
              >
                <PiBroomDuotone className="w-4 h-4" />
              </button>
              <button
                className={`pointer-events-auto bg-primary-button hover:bg-primary-button-hover rounded-md p-1 leading-0 ${enableOverlayBackground ? 'bg-primary-button-hover' : ''}`}
                title="Overlay Background"
                type="button"
                onClick={handleOverlayBackgroundClick}
              >
                <TbBackground className="w-4 h-4" />
              </button>
              <div className="pointer-events-auto bg-primary-button hover:bg-primary-button-hover rounded-md p-1 leading-0 ">
                <input
                  className="w-6 h-4"
                  type="color"
                  id="transcriptionColor"
                  title="transcription color"
                  value={transcriptionColor}
                  onChange={handleOverlayColorChange}
                />
              </div>
              <button
                className={`flex flex-row gap-1 text-start items-center justify-start pointer-events-auto bg-primary-button hover:bg-primary-button-hover rounded-md py-1 px-2 leading-0 `}
                style={{
                  color: transcriptionColor
                }}
                type="button"
                title={
                  enableTranscriptionOverlay
                    ? 'Hide Transcription overlay'
                    : 'Show Transcription overlay'
                }
                onClick={handleEnableTranscriptionOverlayClick}
              >
                {!enableTranscriptionOverlay ? (
                  <TiArrowSortedDown className="w-4 h-4 " />
                ) : (
                  <TiArrowSortedUp className="w-4 h-4 " />
                )}
              </button>
              <div className="pointer-events-auto bg-primary-button hover:bg-primary-button-hover rounded-md p-1 leading-0 ">
                <input
                  className="w-6 h-4"
                  type="color"
                  id="translationColor"
                  title="translation color"
                  value={translationColor}
                  onChange={handleOverlayColorChange}
                />
              </div>
              <button
                className={`flex flex-row gap-1 text-start items-center justify-start pointer-events-auto bg-primary-button hover:bg-primary-button-hover rounded-md py-1 px-2 leading-0`}
                style={{
                  color: translationColor
                }}
                type="button"
                title={
                  enableTranslationOverlay ? 'Hide Translation overlay' : 'Show Translation overlay'
                }
                onClick={handleEnableTranslationOverlayClick}
              >
                {!enableTranslationOverlay ? (
                  <TiArrowSortedDown className="w-4 h-4 " />
                ) : (
                  <TiArrowSortedUp className="w-4 h-4 " />
                )}
              </button>

              <button
                className="pointer-events-auto bg-primary-button hover:bg-primary-button-hover rounded-md p-1 leading-0   draggable-obj"
                title="Drag overlay"
                type="button"
              >
                <MdFullscreen className="w-4 h-4" />
              </button>
            </>
          ) : (
            <></>
          )}

          <button
            className={` pointer-events-auto hover:bg-primary-button-hover rounded-md p-1 leading-0 ${tabIsEnabled ? 'bg-primary-button' : 'bg-primary-button/30'}`}
            title={`${tabIsEnabled ? 'Disable background' : 'Enable background'}`}
            onMouseEnter={() => {
              handleClickableOverlayChange(true)
            }}
            onMouseLeave={() => {
              handleClickableOverlayChange(false)
            }}
            onClick={() => {
              setTabIsEnabled(!tabIsEnabled)
            }}
            type="button"
          >
            {' '}
            {tabIsEnabled ? (
              <TiArrowRightThick className="w-4 h-4 " />
            ) : (
              <TiArrowLeftThick className="w-4 h-4 " />
            )}
          </button>
        </div>
      </div>
      <div
        className={`flex-col text-start items-start justify-start w-full h-full  py-2 overflow-hidden  border-t border-x ${tabIsEnabled ? 'bg-secondary-background  border-primary-background' : 'border-transparent'}  ${transcriptionError?.length || transcriptionError?.length ? '' : 'rounded-tl-md'}  ${!enableTranscriptionOverlay ? 'hidden' : 'flex'}`}
      >
        <div className="flex flex-col h-full w-full overflow-hidden">
          <CustomTextarea
            color={transcriptionColor}
            disabled={true}
            refValue={textarea1Ref}
            placeholder="Transcription.."
            content={transcriptionSentence}
            tabIsEnabled={tabIsEnabled}
            enableOverlayBackground={enableOverlayBackground}
          />
        </div>
      </div>
      <span
        className={`w-full h-[0.2rem]  ${tabIsEnabled ? 'bg-primary-button' : 'bg-primary-button/10 rounded-md'}`}
      ></span>
      <div
        className={`flex-col text-start items-start justify-start w-full h-full  py-2 overflow-hidden rounded-b-md border-b border-x ${tabIsEnabled ? 'bg-secondary-background  border-primary-background' : 'border-transparent'} ${!enableTranslationOverlay ? 'hidden' : 'flex'}`}
      >
        <div className="flex flex-col h-full w-full overflow-hidden">
          <CustomTextarea
            color={translationColor}
            disabled={true}
            refValue={textarea2Ref}
            placeholder="Translation.."
            content={translationSentence}
            tabIsEnabled={tabIsEnabled}
            enableOverlayBackground={enableOverlayBackground}
          />
        </div>
      </div>
    </div>
  )
}

export default TranslationOverlay

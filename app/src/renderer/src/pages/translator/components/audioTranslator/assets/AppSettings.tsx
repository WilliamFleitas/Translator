import { useContext, useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import CustomAccordion from '@renderer/components/accordion/CustomAccordion'
import PasswordInput from '@renderer/components/customInput/PasswordInput'
import { FaRegEdit } from 'react-icons/fa'
import { AzureSettingsStatusContext } from '@renderer/components/context/AzureSettingsContext'
import { DeepgramSettingsStatusContext } from '@renderer/components/context/DeepgramSettingsContext'
import Modal from '@renderer/assets/Modal'
import TranslatorTutorial from './TranslatorTutorial'

const AppSettings = (): React.ReactElement => {
  const [azureAPIKeyValue, setAzureAPIKeyValue] = useState<string>('')
  const [azureAPIRegionValue, setAzureAPIRegionValue] = useState<string>('')
  const [editAzureSettingsIsEnabled, setEditAzureSettingsIsEnabled] = useState<boolean>(false)

  const [deepgramAPIKeyValue, setDeepgramAPIKeyValue] = useState<string>('')
  const [editDeepgramSettingsIsEnabled, setEditDeepgramSettingsIsEnabled] = useState<boolean>(false)

  const [enableTutorial, setEnableTutorial] = useState<boolean>(false)

  const { updateAzureSettingsState } = useContext(AzureSettingsStatusContext)
  const { updateDeepgramSettingsState } = useContext(DeepgramSettingsStatusContext)

  const handleEnableTutorialClick = (): void => {
    setEnableTutorial(!enableTutorial)
  }
  const handleAzureKeyChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement
    setAzureAPIKeyValue(target.value)
  }
  const handleAzureRegionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement
    setAzureAPIRegionValue(target.value)
  }
  const setAzureSettings = (): void => {
    localStorage.setItem('azureAPIKey', azureAPIKeyValue)
    localStorage.setItem('azureAPIRegion', azureAPIRegionValue)
    updateAzureSettingsState(azureAPIKeyValue, azureAPIRegionValue)
    setEditAzureSettingsIsEnabled(false)
  }

  const handleDeepgramKeyChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement
    setDeepgramAPIKeyValue(target.value)
  }

  const setDeepgramSettings = (): void => {
    localStorage.setItem('deepgramAPIKey', deepgramAPIKeyValue)
    updateDeepgramSettingsState(deepgramAPIKeyValue)
    setEditDeepgramSettingsIsEnabled(false)
  }
  useEffect(() => {
    const azureAPIKEY = localStorage.getItem('azureAPIKey')
    const azureAPIRegion = localStorage.getItem('azureAPIRegion')
    const deepgramAPIKEY = localStorage.getItem('deepgramAPIKey')
    if (azureAPIKEY?.length && azureAPIRegion?.length) {
      setAzureAPIKeyValue(azureAPIKEY)
      setAzureAPIRegionValue(azureAPIRegion)
      updateAzureSettingsState(azureAPIKEY, azureAPIRegion)
    } else {
      setAzureAPIKeyValue('')
      setAzureAPIRegionValue('')
      updateAzureSettingsState('', '')
    }
    if (deepgramAPIKEY?.length) {
      setDeepgramAPIKeyValue(deepgramAPIKEY)
      updateDeepgramSettingsState(deepgramAPIKEY)
    }
  }, [])
  return (
    <div className="flex flex-col text-start items-start justify-start w-full h-fit bg-secondary-background py-6 px-4 md:px-8 gap-4">
      <CustomAccordion
        accordionTitle={<strong className="text-3xl">Deepgram API Settings.</strong>}
        accordionContent={
          <div className="flex flex-row w-full h-fit text-start items-center justify-between gap-4">
            <PasswordInput
              inputValue={deepgramAPIKeyValue}
              placeholder="Deepgram API key here"
              disabled={!editDeepgramSettingsIsEnabled}
              inputOnChange={handleDeepgramKeyChange}
            />
            {editDeepgramSettingsIsEnabled ? (
              <button
                type="button"
                className="bg-primary-button hover:bg-primary-button-hover py-2 rounded-md px-4 h-full cursor-pointer"
                onClick={setDeepgramSettings}
              >
                <FaCheck className="w-5 h-5 text-success" />
              </button>
            ) : (
              <button
                type="button"
                className="bg-primary-button hover:bg-primary-button-hover py-2 rounded-md px-4 h-full cursor-pointer"
                onClick={() => {
                  setEditDeepgramSettingsIsEnabled(true)
                }}
              >
                <FaRegEdit className="w-5 h-5 text-success" />
              </button>
            )}
          </div>
        }
      />
      <CustomAccordion
        accordionTitle={<strong className="text-3xl">Azure API Settings.</strong>}
        accordionContent={
          <div className="flex flex-row w-full h-fit text-start items-center justify-between gap-4">
            <PasswordInput
              inputValue={azureAPIKeyValue}
              placeholder="Azure API key here"
              disabled={!editAzureSettingsIsEnabled}
              inputOnChange={handleAzureKeyChange}
            />
            <PasswordInput
              inputValue={azureAPIRegionValue}
              placeholder="Azure Region here"
              disabled={!editAzureSettingsIsEnabled}
              inputOnChange={handleAzureRegionChange}
            />
            {editAzureSettingsIsEnabled ? (
              <button
                type="button"
                className="bg-primary-button hover:bg-primary-button-hover py-2 rounded-md px-4 h-full cursor-pointer"
                onClick={setAzureSettings}
              >
                <FaCheck className="w-5 h-5 text-success" />
              </button>
            ) : (
              <button
                type="button"
                className="bg-primary-button hover:bg-primary-button-hover py-2 rounded-md px-4 h-full cursor-pointer"
                onClick={() => {
                  setEditAzureSettingsIsEnabled(true)
                }}
              >
                <FaRegEdit className="w-5 h-5 text-success" />
              </button>
            )}
          </div>
        }
      />
      <button
        className="text-3xl font-bold text-[#ffffff] hover:text-zinc-500 cursor-pointer"
        type="button"
        onClick={handleEnableTutorialClick}
      >
        How to get your API Key.
      </button>
      <Modal
        isOpen={enableTutorial}
        onClose={handleEnableTutorialClick}
        Content={<TranslatorTutorial />}
      />
    </div>
  )
}

export default AppSettings

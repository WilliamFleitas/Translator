import { useEffect } from 'react'
import PCAudioTranslator from './components/audioTranslator/PCAudioTranslator'
import { toast } from 'react-toastify'

const TranslatorPage: React.FC = () => {
  useEffect(() => {
    const updateErrorListener = (_: any, message: string): void => {
      console.error('Update error:', message)
      toast.error(`Error checking for updates: ${message}`, {
        isLoading: false,
        autoClose: 5000
      })
    }
    window.api.on('update_error', updateErrorListener)
    return (): void => {
      window.api.removeListener('update_error', updateErrorListener)
    }
  }, [])
  return (
    <div className="flex flex-col w-full text-start items-start justify-start h-dvh">
      <main className="flex flex-col w-full h-full border-t   border-secondary-button ">
        <PCAudioTranslator />
      </main>
    </div>
  )
}

export default TranslatorPage

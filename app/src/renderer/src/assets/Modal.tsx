import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IoClose } from 'react-icons/io5'

interface ModalProps {
  isOpen?: boolean
  onClose: (value: boolean) => void
  Content?: JSX.Element
}
export default function Modal({ Content, isOpen, onClose }: ModalProps): React.ReactElement {
  const cancelButtonRef = useRef(null)
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 " initialFocus={cancelButtonRef} onClose={onClose}>
        <div className={`fixed inset-0 z-10 w-full h-full overflow-y-auto sm:pb-14 xl:pb-0`}>
          <div className="flex flex-col w-full h-full  items-center justify-center  text-start   md:p-4 bg-[#3d3d3d54]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative no-scrollbar w-full h-full sm:h-fit bg-white dark:bg-[#252324] sm:bg-transparent sm:max-w-[75vw] md:max-w-[60vw]  sm:max-h-[85vh] sm:min-h-[50px]  overflow-x-hidden  overflow-y-scroll sm:rounded-md sm:isolate">
                <div className="  bg-white dark:bg-secondary-background  z-50 sm:rounded-md sm:isolate">
                  {Content}
                  <button
                    onClick={() => onClose(false)}
                    className=" absolute top-1 right-1 transition delay-100 text-zinc-400 hover:text-zinc-600"
                  >
                    <IoClose className="w-5 h-5 " />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

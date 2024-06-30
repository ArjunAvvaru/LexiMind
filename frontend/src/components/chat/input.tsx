import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { AppStatus, actions, useAppDispatch, useAppSelector,thunkActions } from 'store/provider'
import autosize from 'autosize'
import { cn } from 'lib/utils'
import UploadModal from 'components/upload_modal'
import Conversation from 'images/conversation'
import { ReactComponent as SendIcon } from 'images/paper_airplane_icon.svg'
import { ReactComponent as StopIcon } from 'images/stop_icon.svg'
import { TiAttachment } from "react-icons/ti";
import { AiTwotoneMessage } from "react-icons/ai";
import { BsFiletypePptx } from "react-icons/bs";
import { IoMdCloseCircle } from "react-icons/io";
import ChatModeSelect from 'components/chat/chat_mode_select'
import {motion} from 'framer-motion'

export default function ChatInput({
  onSubmit,
  onAbortRequest,
}) {
  const dispatch = useAppDispatch()
  const [message, setMessage] = useState<string>()
  const filesCount = useAppSelector((state) => state.files).length
  const chatStatus = useAppSelector((state) => state.chatStatus)
  const isMessageLoading = (chatStatus === AppStatus.StreamingMessage)
  const chatContext = useAppSelector((state) => state.chatContext)
  const textareaReference = useRef<HTMLTextAreaElement>(null)
  const isSubmitDisabled =
    !message || message.trim().length === 0 || isMessageLoading

  const setUploadModal = (value) => {
    dispatch(actions.setUploadModal({ isUploadModalVisible: value }))
  }

  const onGeneratePPT = () => {
    dispatch(thunkActions.askQuestion("Generate PPT"))
  }

  const onChatContextRemove = () => {
    dispatch(actions.setChatContext({ chatContext: {} }))
  }

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    if (!isSubmitDisabled) {
      onSubmit(message.trim())

      setMessage('')
      autosize(textareaReference.current)
    }
  }
  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    autosize(textareaReference.current)
    setMessage(event.target.value)
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  useLayoutEffect(() => {
    const ref = textareaReference?.current

    ref?.focus()
    autosize(ref)

    return () => {
      autosize.destroy(ref)
    }
  }, [])

  return (
    <motion.form
      className="flex flex-row space-x-2 px-6 items-center gap-2 pt-3 absolute bottom-0 w-full"
      onSubmit={handleSubmit}
      style={{ boxShadow: 'rgb(30 41 59) 0px -4px 8px 4px', background: "linear-gradient(to bottom, #0a0a0a 88%, #202020)", backgroundColor: "transparent", backgroundRepeat: "no-repeat" }}
      initial={{ bottom: -100, opacity: 0.3 }}
      animate={{ bottom: 0, opacity: 1 }}
    >
      <ChatModeSelect />
      <div className="flex relative flex-row w-full">
        <div className={`h-full border border-slate-400 bg-slate-600/50 disabled:opacity-75 mb-3 pr-20 border-1 rounded-md  leadingd-9 focus:bg-slate-700/80 pl-12 flex flex-grow text-slate-200 placeholder-slate-400 overflow-auto flex-col ${isMessageLoading?"pointer-events-none bg-slate-900/90 border-slate-800":""}`} style={{ height: '76px' }}>
          {chatContext.id&&<div className="flex flex-row mt-2.5 items-center"><span className='flex flex-row mr-1'>{`Context: ${chatContext.title}`}</span><IoMdCloseCircle className='hover:text-red-600 text-red-500 cursor-pointer' onClick={onChatContextRemove}/></div>}
          <div className='flex flex-row'>
          <textarea
            className={`flex flex-grow ${chatContext.id?"pt-0.5":"mt-2.5"} bg-transparent border-0 border-transparent outline-none text-slate-200 placeholder-slate-400 resize-none overflow-hidden`}
            ref={textareaReference}
            value={message}
            placeholder="Ask a follow up question"
            onKeyDown={handleKeyDown}
            onChange={onChange}
            disabled={isMessageLoading}
          ></textarea>
          </div>
        </div>
        <span className="absolute left-3 top-3 text-2xl">
          <AiTwotoneMessage />
        </span>
        <button className="hover:text-blue-500 text-3xl flex justify-center items-center text-slate-200 absolute right-7 z-10 top-1.5 font-light" onClick={() => setUploadModal(true)}>
          <TiAttachment />
          <span className=' text-xs absolute top-0 -right-0.5 bg-red-500 rounded-full text-white px-1'>{filesCount}</span>
        </button>
        <button className="hover:text-blue-500 flex justify-center items-center text-slate-200 text-3xl absolute left-2 z-10 top-12 font-light" onClick={onGeneratePPT}>
          <BsFiletypePptx />
        </button>
        {isMessageLoading ? (
          <button
            onClick={onAbortRequest}
            className="hover:bg-red-600 bg-red-500 px-2 py-1 rounded-md border cursor-pointer text-white animate-pulse hover:animate-pulse-stop self-start absolute right-5 top-11"
          >
            <StopIcon width={24} height={24} />
          </button>
        ) : (
          <button
            disabled={isSubmitDisabled}
            type="submit"
            className="enabled:hover:bg-blue-600 disabled:opacity-75 bg-slate-600 px-2 py-1 rounded-md border disabled:cursor-not-allowed cursor-pointer self-start absolute right-5 top-11"
          >
            <SendIcon width={24} height={24} />
          </button>
        )}
      </div>
    </motion.form>
  )
}

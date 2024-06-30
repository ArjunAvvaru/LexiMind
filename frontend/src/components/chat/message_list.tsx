import React, { useEffect, useRef, useState } from 'react'
import { ChatMessage } from './message'
import { ChatMessageType } from 'types'
import mainLogo from 'images/Leximind.svg'
import { AppStatus, useAppSelector } from 'store/provider'
import ChatModeCards from 'components/chat/chat_mode_cards'

export const ChatMessageList = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [userScrolled, setUserScrolled] = useState(false)
  const messages = useAppSelector((state) => state.conversation)
  const chatStatus = useAppSelector((state) => state.chatStatus)
  const isMessageLoading = (chatStatus === AppStatus.StreamingMessage)

  useEffect(() => {
    const container = containerRef.current
    // Scroll to bottom when new messages come in and the user hasn't scrolled up
    if (container && !userScrolled) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, userScrolled])

  const handleScroll = () => {
    const container = containerRef.current
    // Check if the user has scrolled up
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container
      const isAtBottom = scrollTop + clientHeight >= scrollHeight
      setUserScrolled(!isAtBottom)
    }
  }

  return (
    <div
      className="w-full overflow-auto pb-5 px-5"
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: 'calc(100vh - 200px)'}}
    >
      <div className="flex justify-center mt-10 gap-2">
        <img src={mainLogo} width={72} />
        <div className="flex justify-center flex-col gap-3">
          <div className=' text-5xl font-bold flex justify-center text-black'>LexiChat</div>
          <div className='text-xl flex justify-center text-slate-600'>Your everyday AI companion</div>
        </div>
      </div>
      <div className="flex justify-center mt-7 gap-2">
        <ChatModeCards isHome={false}/>
      </div>
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          loading={
            messages.length - 1 === index &&
            !message.content.length &&
            isMessageLoading
          }
          isChatStreaming={chatStatus === AppStatus.StreamingMessage}
          isLastMsg={messages.length - 1 === index}
          {...message}
        />
      ))}
    </div>
  )
}

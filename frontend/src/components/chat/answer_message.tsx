import { AppStatus, actions, useAppDispatch, useAppSelector } from 'store/provider'
import { Sources } from './sources'
import { ChatMessageType } from '../../types'
import { EuiMarkdownFormat } from '@elastic/eui';
import ailoadinggif from 'images/LexiChat.gif'
import "../../styles/euimarkdown.css"
import { BsChatText } from "react-icons/bs";
import mainLogo from 'images/Leximind.svg'
import { Stats } from 'components/chat/stats';
import {motion} from 'framer-motion'

interface AnswerMessageProps {
  text: ChatMessageType['content']
  sources: ChatMessageType['sources']
  onSourceClick: (source: string) => void
}

export const AnswerMessage = () => {
  // const llm_label = useAppSelector((state) => state.llm_label)
  const dispatch = useAppDispatch()
  const chatStatus = useAppSelector((state) => state.chatStatus)
  const llm_toggle = useAppSelector((state) => state.llm_toggle)
  const summary = useAppSelector((state) => state.answer)?useAppSelector((state) => state.answer):useAppSelector((state) => state.conversation)?.[1]
  const text = summary?.content
  const sources = summary?.sources || []
  const stats = summary?.stats || null
  const onSourceClick = (name) => {
    // dispatch(actions.sourceToggle({ name, expanded: true }))
    // setTimeout(() => {
    //     document
    //       .querySelector(`[data-source="${name}"]`)
    //       ?.scrollIntoView({ behavior: 'smooth' })
    //   }, 300)
  }
  const switchToChatTab = () => {
    dispatch(actions.setActiveTab({ activeTab: 'Chat' }))
  }
  const LetsChat = () => {
    return (
      <button className="bg-sky-600 text-white shadow rounded-full px-4 py-2 flex items-center space-x-2 hover:bg-sky-700" onClick={switchToChatTab}>
        <BsChatText className="mr-2" />
        Let's chat
      </button>
    )
  }
  return (
    llm_toggle && summary && !summary.isHuman ?
      <motion.div className="col-span-3 mt-3 relative" initial={{left:100, opacity:0.3}} animate={{left:0, opacity:1}}>
        <div className={`rounded-md shadow-lg px-6 py-4 border border-light-fog bg-gray-100 ${!text ? "items-center flex flex-col" : ""}`}>
          <header className="flex flex-row w-full justify-between mb-3 align-middle items-center">
            <div className="flex items-center gap-2">
              <img src={mainLogo} width={30} className='rounded-full px-1 py-0.5 cursor-pointer bg-slate-800' onClick={switchToChatTab} />
              <h2 className="text-slate-900 text-3xl font-extrabold leading-9">
                LexiChat
              </h2>
            </div>
            <div className='flex'> <LetsChat /></div>
          </header>

          {text ?
            <>
              <div
                className=" text-base text-slate-700"
                style={{ overflowWrap: "anywhere" }}
              >
                {/* <p dangerouslySetInnerHTML={{ __html: text }} className='llm-response'></p> */}
                <EuiMarkdownFormat textSize="s">{text}</EuiMarkdownFormat>
              </div>
              {!!sources?.length && (
                <div className="mt-2 gap-1 flex flex-col">
                  <div className="text-slate-600 font-bold text-sm">Sources</div>
                  <Sources sources={sources} />
                </div>
              )}
              {stats && (
                <div className="mt-3 gap-1 flex flex-col">
                  <Stats stats={stats} />
                </div>
              )}
              {chatStatus === AppStatus.Done ? <div className=' border-t border-zinc-300 pt-2 mt-2'><LetsChat /></div> : null}
            </> :
            <>
              <img width={80} src={ailoadinggif} alt="" />
              <p className="text-center text-slate-700 text-sm font-medium pt-3">
                Reasoning about your data...
              </p>
            </>
          }
        </div>
      </motion.div> : null
  )
}

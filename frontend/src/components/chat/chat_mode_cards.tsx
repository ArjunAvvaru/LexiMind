import React from 'react'
import ADEO_Chat_light from 'images/ai_still_light.svg'
import ADEO_Chat_dark from 'images/ai_still_dark.svg'
import DOC_Chat from 'images/Doc_Chat.png'
import Analyser_Chat from 'images/Analyser_Chat.png'
import { useAppDispatch, useAppSelector, actions, AppStatus } from 'store/provider'
import GetChatModes, {onChatModeClick} from 'components/chat/chat_modes'

export default function ChatModeCards({isHome}) {
    const dispatch = useAppDispatch()
    const appStatus = useAppSelector((state) => state.status)
    const chatStatus = useAppSelector((state) => state.chatStatus)
    const activeChatCard = useAppSelector((state) => state.activeChatCard)
    const cards = GetChatModes(isHome)

    const setUploadModal = (value) => {
        dispatch(actions.setUploadModal({ isUploadModalVisible: value }))
      }

    return (
        <div className="flex flex-wrap">
            {cards.map((card) => (
                <div key={`ADEO-GPT-Card-${card.id}`} className="p-4" onClick={()=>onChatModeClick(card.id, dispatch, setUploadModal, appStatus, chatStatus )}>
                    <div className={` hover:bg-gray-200 ${activeChatCard===card.id ?" bg-slate-800  border-gray-300":"bg-white bg-opacity-20 border-slate-500 "} ${activeChatCard===card.id&&isHome?" bg-white bg-opacity-30 hover:bg-opacity-25":"hover:bg-opacity-25"} border rounded-lg cursor-pointer shadow-md flex flex-row items-center p-3`}>
                        <img src={card.image} alt="chat" className=" h-24 w-24" />
                        <div className="p-4 flex flex-col">
                            <h3 className={`font-semibold text-lg ${activeChatCard===card.id || isHome?"text-slate-200":""}`}>{card.title}</h3>
                            <p className={`text-gray-500 ${activeChatCard===card.id || isHome?"text-slate-300":""} `}>{card.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

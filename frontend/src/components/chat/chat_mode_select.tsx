import React from 'react';
import GetChatModes, {onChatModeClick}  from 'components/chat/chat_modes'
import { useAppDispatch, useAppSelector, actions, AppStatus } from 'store/provider'
import "styles/chat_mode_select.css"

const ChatModeSelect = () => {
  const ChatModes = GetChatModes(true)
  const activeChatCard = useAppSelector((state) => state.activeChatCard)
  const dispatch = useAppDispatch()
  const appStatus = useAppSelector((state) => state.status)
  const chatStatus = useAppSelector((state) => state.chatStatus)
  const setUploadModal = (value) => {
      dispatch(actions.setUploadModal({ isUploadModalVisible: value }))
    }
  return (
    <div className='chat-mode-select overflow-auto border border-slate-600 rounded-md mb-3' style={{ height: '76px' }}>
      <ul>
        {ChatModes.map((mode) => (
          <li key={`Chat-Mode-Select-${mode.id}`} className={`p-2 border-b ${activeChatCard===mode.id?"bg-slate-900/90":"bg-slate-700"} cursor-pointer hover:bg-slate-800 border-slate-600 pl-2 pr-6`} onClick={()=>onChatModeClick(mode.id, dispatch, setUploadModal, appStatus, chatStatus )}>
            <div className="flex items-center flex-row">
              <img src={mode.image} alt="chat" className=" h-4 w-4 mr-2" />
              <div className={`font-semibold text-sm text-slate-200 text-nowrap`}>{mode.title}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatModeSelect;
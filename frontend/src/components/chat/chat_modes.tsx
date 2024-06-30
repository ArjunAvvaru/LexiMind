import React from 'react'
import LexiChat from 'images/LexiChat_still.svg'
import DOC_Chat from 'images/Doc_Chat.png'
import Analyser_Chat from 'images/Analyser_Chat.png'
import { useAppDispatch, useAppSelector, actions, AppStatus, thunkActions } from 'store/provider'

const GetChatModes = (isHome) => {
    const activeChatCard = useAppSelector((state) => state.activeChatCard)

    const cards = [
        { id: "lexi_chat", title: "LexiChat", description: "Chat with your ingested data", image: LexiChat},
        { id: "doc_chat", title: "Doc Chat", description: "Chat with your documents", image: DOC_Chat },
        { id: "analyser", title: "Analyser", description: "Analyse your csv,xls,xlsx", image: Analyser_Chat }
    ]

    return cards
}

export const onChatModeClick = (id, dispatch, setUploadModal, appStatus, chatStatus) => {
    dispatch(actions.setChatContext({ chatContext: {} }))
    dispatch(actions.setActiveChatCard({ id: id }))
    dispatch(actions.setFiles({ files: [] }))

    const isMessageLoading = (chatStatus === AppStatus.StreamingMessage)
    
    isMessageLoading && dispatch(thunkActions.abortRequest())

    if(id!=="lexi_chat"){
        setUploadModal(true)
    }
    else{
        if(appStatus===AppStatus.Idle){//when on home screen and clicked on ADEO GPT
            dispatch(actions.setActiveTab({ activeTab: "Chat" }))
            dispatch(actions.setStatus({ status: AppStatus.Done }))
        }
    }
}

export default GetChatModes
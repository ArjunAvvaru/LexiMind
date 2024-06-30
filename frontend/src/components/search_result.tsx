import React from 'react'
import { AppStatus, actions, useAppDispatch, useAppSelector } from 'store/provider'
import { SourceIcon } from 'components/source_icon'
import { IndexSources } from 'store/value_map'
import { BsChatText } from "react-icons/bs";
import { AiTwotoneMessage } from "react-icons/ai";
import {motion} from 'framer-motion'


export const SearchResult = ({
  id,
  Title,
  source,
  Genre,
  Director,
  page_content,
  ...otherProps
}) => {
  const dispatch = useAppDispatch()

  const onChatClick = () => {
    id && dispatch(actions.setChatContext({ chatContext: { id, Title, source } }))
    dispatch(actions.setActiveTab({ activeTab: 'Chat' }))
  }

  return (
    <div key={id} className="flex flex-row relative">
      <div className='flex flex-col'>
        <div className="flex flex-row gap-2">
          <SourceIcon
            className="w-6 bg-white rounded-full flex justify-center text-slate-400 text-xs"
            icon={IndexSources[source]}
          />
          <a href={otherProps["Wiki Page"]} className=" font-bold text-lg text-sky-600 hover:underline hover:text-orange-300 visited:text-purple-600 overflow-ellipsis" target="_blank" rel="noopener noreferrer">{Title}</a>
          {/*<BsChatText className='text-sky-600 hover:underline hover:text-orange-300 cursor-pointer' title='Start a chat with this result as context' onClick={onChatClick}/>*/}
        </div>
        <div className='flex flex-col'>
          <div className="flex items-center gap-5 whitespace-nowrap">
            <label className="flex items-center gap-2 ">
              <span className="text-zinc-400 font-medium text-xs ">Source</span>
              <div className='text-xs font-medium overflow-ellipsis overflow-hidden whitespace-nowrap'>{IndexSources[source]}</div>
            </label>
            <label className="flex items-center gap-2 ">
              <span className="text-zinc-400 font-medium text-xs ">Director</span>
              <div className='text-xs font-medium overflow-ellipsis overflow-hidden whitespace-nowrap'>{Director}</div>
            </label>
            <label className="flex items-center gap-2 ">
              <span className="text-zinc-400 font-medium text-xs ">Genre</span>
              <div className='text-xs font-medium overflow-ellipsis overflow-hidden whitespace-nowrap'>{Genre}</div>
            </label>
            <label className="flex items-center gap-2 ">
              <span className="text-zinc-400 font-medium text-xs ">Origin/Ethnicity</span>
              <div className='text-xs font-medium overflow-ellipsis overflow-hidden whitespace-nowrap'>{otherProps["Origin/Ethnicity"]}</div>
            </label>
            <label className="flex items-center gap-2 ">
              <span className="text-zinc-400 font-medium text-xs ">Release Year</span>
              <div className='text-xs font-medium overflow-ellipsis overflow-hidden whitespace-nowrap'>{otherProps["Release Year"]}</div>
            </label>
          </div>
          <p className="text-sm mb-2 overflow-ellipsis text-slate-700" style={{overflowWrap:"anywhere"}} dangerouslySetInnerHTML={{ __html:page_content }}>
          </p>
        </div>
      </div>
    </div>
  )
}

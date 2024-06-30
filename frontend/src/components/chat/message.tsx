import React from 'react'
import { ChatMessageType, SourceType } from 'types'
import { Loader } from 'components/loader'
import { Sources } from 'components/chat/sources'
import { FaRegUser } from "react-icons/fa";
import { EuiMarkdownFormat, EuiProvider } from '@elastic/eui';
import { ReactComponent as ElasticLogo } from 'images/elastic_logo.svg'
import AILogo from 'images/LexiChat_still.svg'
import AILoading from 'images/LexiChat.gif'
import { AppStatus } from 'store/provider';
import { isHtmlElement } from 'react-router-dom/dist/dom';
import { Stats } from 'components/chat/stats';

type ChatMessageProps = Omit<ChatMessageType, 'id'> & {
  isChatStreaming: boolean
  isLastMsg: boolean
}
export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isHuman,
  sources,
  stats,
  file_id,
  loading,
  isChatStreaming,
  isLastMsg
}) => {
  const messageIcon = isHuman ? (
    <span className="self-start p-2 rounded-md border border-slate-400 bg-slate-800 shadow-md">
      <FaRegUser width={24} height={24} className=' text-slate-200' />
    </span>
  ) : (
    <span className="self-start p-1 rounded-md border border-slate-400 bg-white shadow-md">
      {(isChatStreaming && isLastMsg)?<img src={AILoading} width={35} height={35} />:<img src={AILogo} width={35} height={35} />}
    </span>
  )
  // const isHTML = /(^# [^\n]+|^- [^\n]+|\[[^\]]+\]\([^)]+\))/m.test(content);
  const handleFileDownload = () => {
    fetch(`/exports/${file_id}`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${file_id}`; // replace with your actual file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        // alert('your file has downloaded!'); // or you can use a toast notification
      })
      .catch(() => alert('Failed to download!'));
  }
  
  return (
    <div>
      <div className={`flex mt-6 gap-2 ${isHuman ? 'justify-end' : ''}`}>
        {messageIcon}

        <div
          className={`p-4 rounded-xl   border  shadow-lg ${isHuman
              ? 'rounded-tr-none bg-slate-800/10 text-slate-700 border-light-fog -order-1'
              : 'bg-white text-slate-700 border-slate-200 rounded-tl-none'
            }`}
          style={{ maxWidth: '50%' }}
        >
          <span
            className={`leading-normal ${isHuman ? 'text-right' : ''}`} style={{ overflowWrap: "anywhere" }}
          >
            {/* {isHTML?<p dangerouslySetInnerHTML={{ __html: content || '' }} className='llm-response'></p>:""} */}
            <EuiMarkdownFormat textSize="s">{content}</EuiMarkdownFormat>
          </span>
          {!!sources?.length && (
            <div className="mt-2 gap-1 flex flex-col">
              <div className=" font-bold text-sm text-slate-600">Sources</div>
              <Sources sources={sources} />
            </div>
          )}
          {file_id && (
            <a onClick={handleFileDownload} className='mt-2 text-sky-600 cursor-pointer hover:underline hover:text-orange-300 visited:text-purple-600'>Click here to Download</a>
          )}
          {stats && (
                <div className="mt-3 gap-1 flex flex-col">
                  <Stats stats={stats} />
                </div>
          )}
          {loading && <Loader />}
        </div>
      </div>
    </div>
  )
}

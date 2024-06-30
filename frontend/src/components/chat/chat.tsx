import {
  actions,
  thunkActions,
  useAppDispatch,
  useAppSelector,
} from 'store/provider'
import ChatInput from 'components/chat/input'
import { ChatMessageList } from 'components/chat/message_list'
import FilesViewer from 'components/chat/files_viewer'


export const Chat = () => {
  const files = useAppSelector((state) => state.files)
  const pdfFilesCount = files.filter(file => file.fileExtension === 'pdf').length;
  const dispatch = useAppDispatch()
  const onSend = (query: string) => {
    dispatch(thunkActions.askQuestion(query))
  }
  const onAbortRequest = () => {
    dispatch(thunkActions.abortRequest())
  }
  const onSourceClick = (name) => {
    // dispatch(actions.sourceToggle({ name, expanded: true }))
    // setTimeout(() => {
    //     document
    //       .querySelector(`[data-source="${name}"]`)
    //       ?.scrollIntoView({ behavior: 'smooth' })
    //   }, 300)
  }
  return (
    <div className={`bg-[#eeeeee] flex-1 flex flex-col ${pdfFilesCount ? "grid grid-cols-5" : ""}`}>
      <div className={`relative flex-grow ${pdfFilesCount ? "col-span-3" : ""}`}>
        <ChatMessageList />
        <ChatInput
          onSubmit={onSend}
          onAbortRequest={onAbortRequest}
        />
      </div>
      {pdfFilesCount ?
        <FilesViewer files={files} /> : null
      }
    </div>
  )
}
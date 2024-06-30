import {
  actions,
  thunkActions,
  useAppDispatch,
  useAppSelector,
} from 'store/provider'
import { SourceIcon } from 'components/source_icon'
import { IndexSources } from 'store/value_map'

export const SourceItem = ({
  source
}) => {
  const dispatch = useAppDispatch()
  const files = useAppSelector((state) => state.files)
  const activeFileViewerPage = useAppSelector((state) => state.activeFileViewerPage)
  const onPDFSourceClick = (source) => {
    const filesIndex = files.findIndex((file) => file.serverId === source.server_Id)
    dispatch(actions.setActiveFilesTab({ activeFilesTab: `filetab-${filesIndex}` }))
    dispatch(actions.setActiveFileViewerPage({ activeFileViewerPage: source.page }))
  }
  return (
    source.page ?
      <button className="rounded flex items-center border-slate-700 border h-8 overflow-hidden" onClick={() => onPDFSourceClick(source)}>
        {source.page && <span className="px-1.5 h-full bg-slate-700 text-slate-200 flex items-center">{source.page}</span>}
        <span className='flex-grow text-slate-600 px-1.5 overflow-ellipsis overflow-hidden whitespace-nowrap' title={source.title}>{source.title}</span>
      </button> :
      <button className="rounded flex items-center border-slate-700 border h-8 overflow-hidden" onClick={() => window.open(source["Wiki Page"], '_blank')}>
        {source.source && <span className="px-1.5 h-full bg-slate-700 flex items-center">
          <SourceIcon
            className="w-5 h-5 rounded-full flex justify-center bg-white text-slate-200 text-xs"
            icon={IndexSources[source.source]}
          />
        </span>}
        <span className='flex-grow text-slate-600 px-1.5 overflow-ellipsis overflow-hidden whitespace-nowrap' title={source.Title}>{source.Title}</span>
      </button>
  )
}

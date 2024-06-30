import { useAppSelector, AppStatus } from 'store/provider'
import { Header } from 'components/header'
import { SearchResults } from 'components/search_results'
import { Chat } from 'components/chat/chat'
import Facets from 'components/facets'
import { AnswerMessage } from 'components/chat/answer_message'
export default function Search({ status, searchQuery, handleSearch }) {
  const searchStatus = useAppSelector((state) => state.searchStatus)
  const activeTab = useAppSelector((state) => state.activeTab)
  const llm_toggle = useAppSelector((state) => state.llm_toggle)
  return (
    <div className="min-w-screen min-h-screen flex flex-col">
      <Header
        onSearch={handleSearch}
        value={searchQuery}
        appStatus={status}
      />
      {activeTab === "Search" ? <div className="bg-white px-4 grid grid-cols-9 relative h-auto flex-1">
        {/*<Facets query={searchQuery} />*/}
        <SearchResults query={searchQuery} status={searchStatus} />
        <AnswerMessage />
      </div> : <Chat/>}
    </div>
  )
}
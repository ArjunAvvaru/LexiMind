import type { TypedUseSelectorHook } from 'react-redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { SourceType, ChatMessageType, FacetType } from 'types'
import {pageNavigationPlugin} from '@react-pdf-viewer/page-navigation';
import { get } from 'http'

type GlobalStateType = {
  status: AppStatus
  searchStatus: AppStatus
  chatStatus: AppStatus
  conversation: ChatMessageType[]
  answer: any
  sources: any
  sessionId: string | null
  llm_model: string | null
  llm_label: string | null
  llm_toggle: boolean
  semantic_toggle: boolean
  results_size: number
  results_page: number
  results_total: number
  results_total_pages: number
  facets: any
  filters: any
  files: any
  activeTab: string
  activeChatCard: string
  chatContext: any,
  activeFilesTab: string
  isUploadModalVisible: boolean
  activeFileViewerPage: number | string | null
}

class RetriableError extends Error {}
class FatalError extends Error {}
export enum AppStatus {
  Idle = 'idle',
  StreamingMessage = 'loading',
  Done = 'done',
  Error = 'error',
}
enum STREAMING_EVENTS {
  SESSION_ID = '[SESSION_ID]',
  SOURCE = '[SOURCE]',
  DONE = '[DONE]',
  SEARCH_DONE = "[SEARCH_DONE]",
  CHAT_DONE = "[CHAT_DONE]",
  TOTAL = '[TOTAL]',
  FACET = "[FACET]",
  MSG_SOURCE = "[MSG_SOURCE]",
  MSG_STATS = "[MSG_STATS]",
  FILE_ID = "[FILE_ID]"
}

const GLOBAL_STATE: GlobalStateType = {
  status: AppStatus.Idle,
  searchStatus: AppStatus.Idle,
  chatStatus: AppStatus.Idle,
  conversation: [],
  answer: null,
  sessionId: null,
  sources: [],
  llm_model: "starling",
  llm_label: "Starling",
  llm_toggle: true,
  semantic_toggle: true,
  results_size: 20,
  results_page: 0,
  results_total: 0,
  results_total_pages: 0,
  facets: {},
  filters: {},
  files: [],
  activeTab: "Search",
  activeChatCard: "lexi_chat",
  chatContext: {},
  activeFilesTab: "",
  activeFileViewerPage: 1,
  isUploadModalVisible: false,
}
const API_HOST = process.env.REACT_APP_API_HOST || (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'http://10.10.128.20:3001/api')

let abortController: AbortController | null = null
let chatAbortController: AbortController | null = null
const globalSlice = createSlice({
  name: 'global',
  initialState: GLOBAL_STATE as GlobalStateType,
  reducers: {
    addSource: (state, action) => {
      const source = action.payload.source
      // const rootSource = state.sources.find((s) => s.title === source.title)
      // if (rootSource) {
      //   if (!rootSource.summary.find((summary) => summary === source.summary)) {
      //     rootSource.summary = [...rootSource.summary, source.summary]
      //   }
      // } else {
      //   state.sources.push({ ...source, summary: [source.summary] })
      // }
      state.sources.push(source)
    },
    setStatus: (state, action) => {
      state.status = action.payload.status
    },
    setSearchStatus: (state, action) => {
      state.searchStatus = action.payload.status
    },
    setChatStatus: (state, action) => {
      state.chatStatus = action.payload.status
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload.sessionId
    },
    addMessage: (state, action) => {
      state.conversation.push(action.payload.conversation)
    },
    setLLMModel: (state, action) => {
      state.llm_model = action.payload.llm_model
    },
    setLLMLabel: (state, action) => {
      state.llm_label = action.payload.llm_label
    },
    setLLMToggle: (state, action) => {
      state.llm_toggle = action.payload.llm_toggle
    },
    setSemanticToggle: (state, action) => {
      state.semantic_toggle = action.payload.semantic_toggle
    },
    setFiles: (state, action) => {
      state.files = action.payload.files
    },
    addFile: (state, action) => {
      state.files.some(object => JSON.stringify(object) === JSON.stringify(action.payload.file))?null:state.files.push(action.payload.file)
    },
    removeFile: (state, action) => {
      state.files = state.files.filter(object => (object.serverId !== action.payload.file));
    },
    setResultsSize: (state, action) => {
      state.results_size = action.payload.results_size
    },
    setResultsPage: (state, action) => {
      state.results_page = action.payload.results_page
    },
    setResultsTotal: (state, action) => {
      state.results_total = action.payload.results_total
    },
    setResultsTotalPages: (state, action) => {
      state.results_total_pages = action.payload.results_total_pages
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload.activeTab
    },
    setActiveChatCard: (state, action) => {
      state.activeChatCard = action.payload.id
    },
    setChatContext: (state, action) => {
      state.chatContext = action.payload.chatContext
    },
    setActiveFilesTab: (state, action) => {
      state.activeFilesTab = action.payload.activeFilesTab
    },
    setActiveFileViewerPage: (state, action) => {
      state.activeFileViewerPage = action.payload.activeFileViewerPage
    },
    setUploadModal: (state, action) => {
      state.isUploadModalVisible = action.payload.isUploadModalVisible
    },
    setFacets: (state, action) => {
      state.facets = action.payload.facets
    },
    toggleFacet: (state, action) => {
      if(!state.filters.hasOwnProperty(action.payload.facet)){
        state.filters[action.payload.facet]={
          ...state.facets[action.payload.facet_group][action.payload.index],
          facet_group: action.payload.facet_group,
        }
        delete state.filters[action.payload.facet]["selected"]
        delete state.filters[action.payload.facet]["doc_count"]
        delete state.filters[action.payload.facet]["key"]
      }
      else{
        delete state.filters[action.payload.facet]
      }
    },
    updateMessage: (state, action) => {
      const messageIndex = state.conversation.findIndex(
        (c) => c.id === action.payload.id
      )

      if (messageIndex !== -1) {
        state.conversation[messageIndex] = {
          ...state.conversation[messageIndex],
          ...action.payload,
        }
      }
    },
    setAnswer: (state, action) => {
      state.answer = action.payload.answer
    },
    setMessageStats: (state, action) => {
      const messageIndex = state.conversation.findIndex((c) => c.id === action.payload.id)

      if (messageIndex!== -1) {
        state.conversation[messageIndex].stats=action.payload.stats
      }
    },
    setMessageFile: (state, action) => {
      const messageIndex = state.conversation.findIndex((c) => c.id === action.payload.id)

      if (messageIndex!== -1) {
        state.conversation[messageIndex].file_id=action.payload.file_id
      }
    },
    setMessageSources: (state, action) => {
      const messageIndex = state.conversation.findIndex((c) => c.id === action.payload.id)

      if (messageIndex!== -1) {
        state.conversation[messageIndex].sources=action.payload.sources
      }
    },
    removeMessage: (state, action) => {
      const messageIndex = state.conversation.findIndex(
        (c) => c.id === action.payload.id
      )

      if (messageIndex !== -1) {
        state.conversation.splice(messageIndex, 1)
      }
    },
    sourceToggle: (state, action) => {
      const source = state.sources.find((s) => s.name === action.payload.name)

      // if (source) {
      //   source.expanded = action.payload.expanded ?? !source.expanded
      // }
    },
    reset: (state) => {
      state.status = AppStatus.Idle
      state.searchStatus = AppStatus.Idle
      state.chatStatus = AppStatus.Idle
      state.sessionId = null
      state.conversation = []
      state.sources = []
      state.results_page = 0
      state.results_total = 0
      state.results_total_pages = 0
      state.results_size = 20
      state.files= []
      state.answer = null
      state.activeChatCard= GLOBAL_STATE.activeChatCard,
      state.chatContext= {},
      state.activeFilesTab= "",
      state.activeFileViewerPage= 1,
      state.isUploadModalVisible= false
    },
    resetFilters: (state) => {
      state.filters = {}
    },
    resetSources: (state) => {
      state.sources = []
    },
  },
})

const store = configureStore({
  reducer: globalSlice.reducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const actions = globalSlice.actions

export const thunkActions = {
  search: (query: string, resetFilters:boolean) => {
    return async function fetchSearch(dispatch, getState) {
      if (getState().status === AppStatus.StreamingMessage) {
        dispatch(thunkActions.abortRequest())
      }
      dispatch(actions.reset())
      if(resetFilters){
        dispatch(actions.resetFilters())
      }
      if(getState().llm_toggle==true){
        dispatch(
          actions.addMessage({
            conversation: {
              isHuman: true,
              content: query,
              id: getState().conversation.length + 1,
            },
          })
        )
        dispatch(thunkActions.chat(query,getState().filters,"initial"))
      }
      else{
        dispatch(thunkActions.searchOnly(query))
      }
    }
  },
  searchOnly: (query: string) => {
    return async function (dispatch, getState) {
      dispatch(actions.resetSources())
      dispatch(thunkActions.chat(query,getState().filters,"search"))
    }
  },
  askQuestion: (question: string) => {
    return async function (dispatch, getState) {
      const state = getState()

      dispatch(
        actions.addMessage({
          conversation: {
            isHuman: true,
            content: question,
            id: state.conversation.length + 1,
          },
        })
      )
      dispatch(thunkActions.chat(question,getState().filters,"chat"))
    }
  },
  chat: (question: string, filters:any, action:string) => {
    return async function fetchSearch(dispatch, getState) {
      abortController = new AbortController()
      const conversationId = getState().conversation.length + 1
      dispatch(actions.setStatus({ status: AppStatus.StreamingMessage }))
      if(action!=="search"){//when initial search or just chat
        chatAbortController = abortController
        dispatch(
          actions.addMessage({
            conversation: {
              isHuman: false,
              content: '',
              id: conversationId,
              sources: [],
            },
          })
        )
        dispatch(actions.setChatStatus({ status: AppStatus.StreamingMessage }))
      }
      if(action!=="chat"){
        dispatch(actions.setSearchStatus({ status: AppStatus.StreamingMessage }))
      }

      let countRetiresError = 0
      let message = ''
      const sessionId = getState().sessionId
      const llm_toggle = getState().llm_toggle
      const llm_model = getState().llm_model
      const semantic_toggle = getState().semantic_toggle
      const results_size = getState().results_size
      const results_page = getState().results_page
      const filters = getState().filters
      const files = getState().files.map(file => file.serverId)
      const chat_mode = getState().activeChatCard
      const context = getState().chatContext
      
      const sourcesMap: Map<string,{ name: string; url?: string; summary: string[] }> = new Map()

      await fetchEventSource(
        `${API_HOST}/chat?${sessionId ? `session_id=${sessionId}&` : ''}`,
        {
          method: 'POST',
          openWhenHidden: true,
          body: JSON.stringify({
            question,
            action,
            chat_mode,
            semantic_toggle,
            llm_model,
            results_size,
            results_page,
            filters,
            files,
            context,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
          async onmessage(event) {
            if (event.event === 'FatalError') {
              throw new FatalError(event.data)
            }

            if (event.data.startsWith(STREAMING_EVENTS.SESSION_ID)) {
              const sessionId = event.data.split(' ')[1].trim()
              dispatch(actions.setSessionId({ sessionId }))
            } else if (event.data.startsWith(STREAMING_EVENTS.TOTAL)) {
              const total = event.data.split(' ')[1].trim()
              dispatch(actions.setResultsTotal({ results_total: parseInt(total) }))
              dispatch(actions.setResultsTotalPages({ results_total_pages: Math.ceil(parseInt(total)/results_size) }))
            } else if (event.data.startsWith(STREAMING_EVENTS.SOURCE)) {
              const source = event.data.replace(
                `${STREAMING_EVENTS.SOURCE} `,
                ''
              )

              try {
                if (source) {
                  const parsedSource = JSON.parse(source.replaceAll('\n', ''))

                  if (parsedSource.Title) {
                    dispatch(
                      actions.addSource({
                        source: parsedSource,
                      })
                    )
                  }
                }
              } catch (e) {
                console.log('error', source, event.data)
                console.error(e)
              }
            } else if (event.data.startsWith(STREAMING_EVENTS.FACET)) {
              const facets = event.data.replace(
                `${STREAMING_EVENTS.FACET} `,
                ''
              )
              const parsedFacets = JSON.parse(facets)
              dispatch(
                actions.setFacets({ facets: parsedFacets })
              )
            } else if (event.data.startsWith(STREAMING_EVENTS.MSG_STATS)) {
              const stats = event.data.replace(
                `${STREAMING_EVENTS.MSG_STATS} `,
                ''
              )
              try {
                if (stats) {
                  const parsedStats = JSON.parse(stats.replaceAll('\n', ''))
                  dispatch(
                    actions.setMessageStats({
                      id: conversationId,
                      stats:parsedStats,
                    })
                  )
                }
              } catch (e) {
                console.log('error', stats, event.data)
                console.error(e)
              }
            } else if (event.data.startsWith(STREAMING_EVENTS.FILE_ID)) {
              const file_id = event.data.replace(
                `${STREAMING_EVENTS.FILE_ID} `,
                ''
              )
              try {
                if (file_id) {
                  const paresedFileId = JSON.parse(file_id.replaceAll('\n', ''))
                  dispatch(
                    actions.setMessageFile({
                      id: conversationId,
                      file_id:paresedFileId.file_id,
                    })
                  )
                }
              } catch (e) {
                console.log('error', file_id, event.data)
                console.error(e)
              }
            } else if (event.data.startsWith(STREAMING_EVENTS.MSG_SOURCE)) {
              const sources = event.data.replace(
                `${STREAMING_EVENTS.MSG_SOURCE} `,
                ''
              )
              try {
                if (sources) {
                  const parsedSources = JSON.parse(sources.replaceAll('\n', '')).msg_sources
                  dispatch(
                    actions.setMessageSources({
                      id: conversationId,
                      sources:parsedSources,
                    })
                  )
                }
              } catch (e) {
                console.log('error', sources, event.data)
                console.error(e)
              }
            } else if (event.data === STREAMING_EVENTS.SEARCH_DONE) {
              dispatch(actions.setSearchStatus({ status: AppStatus.Done }))
            } else if (event.data === STREAMING_EVENTS.CHAT_DONE) {
              dispatch(actions.setChatStatus({ status: AppStatus.Done }))
              if(action==="initial"){
                const answer = getState().conversation[getState().conversation.length - 1]
                dispatch(actions.setAnswer({ answer: answer }))
              }
            } else if (event.data === STREAMING_EVENTS.DONE) {
              dispatch(actions.setStatus({ status: AppStatus.Done }))
            } else {
              const token = JSON.parse(event.data)["token"]
              message += token

              dispatch(
                actions.updateMessage({
                  id: conversationId,
                  // content: message.replace(/SOURCES: (.+)+/, ''),
                  // content: message.replace(/\n\n/g, "\n"),
                  content: message,
                })
              )
            }
          },
          async onopen(response) {

            if (response.ok) {
              return
            } else if (
              response.status >= 400 &&
              response.status < 500 &&
              response.status !== 429
            ) {
              throw new FatalError()
            } else {
              throw new RetriableError()
            }
          },
          onerror(err) {

            if (err instanceof FatalError || countRetiresError > 3) {
              dispatch(actions.setStatus({ status: AppStatus.Error }))

              throw err
            } else {
              countRetiresError++
              console.error(err)
            }
          },
        }
      )
    }
  },
  abortRequest: () => {
    return function (dispatch, getState) {
      const messages = getState().conversation
      const lastMessage = messages[getState().conversation.length - 1]

      abortController?.abort()
      abortController = null

      chatAbortController?.abort()
      chatAbortController = null

      if (!lastMessage.content) {
        dispatch(
          actions.removeMessage({
            id: lastMessage.id,
          })
        )
      }
      dispatch(
        actions.setStatus({
          status: messages.length ? AppStatus.Done : AppStatus.Idle,
        })
      )
      dispatch(
        actions.setChatStatus({
          status: messages.length===2 && !lastMessage.content ? AppStatus.Idle : AppStatus.Done,
        })
      )
    }
  },
}

const parseSources = (
  message: string
) => {
  message = message.replaceAll("\"", "");
  const match = message.match(/SOURCES: (.+)+/)
  if (match) {
    return match[1].split(',').map(element => {
      return element.trim();
    });
  }
  return  []

}

export const GlobalStateProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

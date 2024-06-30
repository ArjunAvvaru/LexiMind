export interface Facet {
  name: string
  entries: {
    count: number
    value: string
  }[]
}

export interface SearchResponse {
  results: Result[]
  facets: Facet[]
  streaming_id: string
  conversation_id: string
}

export interface Result {
  id: string
  category: [string]
  content: [string]
  summary: [string]
  name: [string]
  url: [string]
}

export type SourceType = {
  name: string
  summary: string[]
  url: string
  source: string
  filetype: string | null
  updated_at?: string | null
  created_by?: any | null
  updated_by?: any | null
  // expanded: boolean
}

export type ChatMessageType = {
  id: string
  content: string
  isHuman?: boolean
  loading?: boolean
  sources?: any | null
  stats?: any | null
  file_id?: string | null
}

export type FacetType = {
  key: string
  from: number
  to: number
  from_as_string: string
  to_as_string: string
  doc_count: number
}
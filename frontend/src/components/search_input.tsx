import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { AppStatus, actions, thunkActions, useAppDispatch, useAppSelector } from 'store/provider'
import { ReactComponent as RefreshIcon } from 'images/refresh_icon.svg'
import { ReactComponent as SearchIcon } from 'images/search_icon.svg'
import { ReactComponent as ArrowIcon } from 'images/arrow_icon.svg'
import { FaRegArrowAltCircleRight } from "react-icons/fa";

import { TiAttachment } from "react-icons/ti";

export default function SearchInput({ onSearch, value, appStatus, className }) {
  const dispatch = useAppDispatch()
  const [query, setQuery] = useState<string>(value)
  const filesCount = useAppSelector((state) => state.files).length
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!!query.trim().length) {
      onSearch(query.trim())
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value)

  const setUploadModal = (value) => {
    dispatch(actions.setUploadModal({ isUploadModalVisible: value }))
  }
  // useEffect(() => {
  //   setQuery(value)
  // }, [value])

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="relative flex w-full items-center h-14 gap-2">
        <input
          type="search"
          className={`hover:border-sky-600 bg-white outline-none focus-visible:border-blue-600 w-full h-14 rounded-full border border-slate-600 px-3 py-2.5 pl-12 text-base font-medium placeholder-slate-400 text-slate-700 shadow ${appStatus === AppStatus.Idle ? 'pr-28' : 'pr-40'
            }`}
          value={query}
          onChange={handleChange}
          placeholder="What is on your mind?"
        />
        <span className="pointer-events-none absolute left-4">
          <SearchIcon />
        </span>
        {appStatus === AppStatus.Idle ? (
          <>
                  <button type="button" className="hover:text-sky-500 text-4xl flex justify-center items-center text-sky-400 absolute right-20 z-10 font-light" onClick={()=>setUploadModal(true)}>
                  <TiAttachment/>
                  <span className=' text-xs absolute top-0 -right-0.5 bg-red-500 rounded-full text-white px-1'>{filesCount}</span>
                </button>
          <button
            className="hover:bg-sky-500 disabled:text-slate-400 disabled:bg-sky-900 disabled:border-none px-3 py-2 shadow-sm border border-slate-600 bg-sky-600 text-slate-200 rounded-md text-xl flex items-center absolute right-4 z-10"
            type="submit"
            disabled={!query.length}
          >
            <FaRegArrowAltCircleRight />
          </button>
          </>
        ) : (
          <button
            className="hover:bg-sky-500 disabled:text-slate-400 disabled:bg-sky-900 disabled:border-none shadow-sm rounded-md border border-slate-600 bg-sky-600 hover:text-blue-100 px-3 py-2 flex justify-center items-center text-slate-200 font-bold absolute right-4 z-10"
            type="submit"
          >
            <span className="mr-2">
              <RefreshIcon width={24} height={24} />
            </span>
            Start over
          </button>
        )}
      </div>
    </form>
  )
}

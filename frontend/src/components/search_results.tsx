import React, { useState } from 'react';
import {
  AppStatus,
  useAppSelector,
} from 'store/provider'
import { SearchResult } from './search_result'
import Pagination from './pagination'
import SearchInfo from './searchresults_info'
import { RingLoader } from 'react-spinners'
import { Player } from '@lottiefiles/react-lottie-player';
import { no_results } from 'lottie/no-results';
import { searching } from 'lottie/searching';
import {motion, AnimatePresence} from 'framer-motion'

export const SearchResults = ({query, status}) =>{
  const sources = useAppSelector((state) => state.sources)

  return (
    <div className="col-span-6 mr-8 mt-2 ">
      {status===AppStatus.Done?(sources.length>0?     
      <div className='flex flex-col gap-2 justify-center '>
        <div className='flex justify-between flex-row'>
          <SearchInfo/>
          <Pagination query={query}/>
        </div>
        <div className="flex gap-y-4 flex-col">
            {sources?.map((source, index) => (
              <SearchResult
                key={`${source.Title}-${index}`}
                {...source}
              />
            ))}
        </div>
        <div className='flex justify-around'><Pagination query={query}/></div>
      </div>:
      <div className='mt-7'>
      <Player
        autoplay
        loop
        src={no_results}
        style={{ height: '300px', width: '300px' }}
      >
      </Player>
      <p className="text-center text-zinc-500 text-sm font-medium">
        No Results
      </p></div>):
      <>
      <div className='flex justify-center mt-7'>
        <Player
          autoplay
          loop
          src={searching}
          style={{ height: '400px', width: '400px' }}
        >
        </Player>
      </div>
      <p className="text-center text-zinc-500 text-sm font-medium">
        Searching....
      </p>
    </>}
    </div>
  )
}
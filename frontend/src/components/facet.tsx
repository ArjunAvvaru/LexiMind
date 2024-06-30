import React, {useState} from 'react'
import {
    actions,
    thunkActions,
    useAppDispatch,
    useAppSelector,
  } from 'store/provider'
import { SourceIcon } from './source_icon'
import "./../styles/checkbox.css"

export default function Facet({facet, index, facet_group, query}) {
    const dispatch = useAppDispatch()
    const filters = useAppSelector((state) => state.filters)
    const selected = filters.hasOwnProperty(facet.key)
    const handleFacetClick = (index,facet, facet_group, query) => {
        dispatch(actions.toggleFacet({index,facet, facet_group}))
        dispatch(thunkActions.search(query, false))
       }
    const displayFacet = facet.key.startsWith(facet_group+" - ")?facet.key.replace(facet_group+" - ",""):facet.key
    return (
            <div title={facet.key} className='flex flex-row gap-2 hover:underline cursor-pointer items-center' onClick={()=>handleFacetClick(index, facet.key, facet_group, query)}>
                <input type="checkbox" className="h-5 w-5 flex-shrink-0 appearance-none rounded-sm cursor-pointer hover:border hover:border-slate-300 bg-slate-200 transition-all" checked={selected} onChange={() => {}}/>
                <SourceIcon className='w-5 h-fit flex-shrink-0' icon={facet.key}/>
                <span className='text-sm font-normal capitalize overflow-ellipsis overflow-hidden whitespace-nowrap flex-grow'>{displayFacet}</span>
                <span className='text-xs font-medium flex-shrink-0 text-slate-700 ml-auto'>{facet.doc_count}</span>
            </div>
    )
}

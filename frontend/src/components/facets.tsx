import React from 'react'
import {useAppSelector, actions, useAppDispatch, thunkActions} from 'store/provider'
import Facet from 'components/facet'
import {motion} from 'framer-motion'


export default function Facets({query}) {
 const facets = useAppSelector((state) => state.facets)

  return (
    <motion.div className='col-span-1 px-2 flex flex-col mt-8 mr-5 gap-4 relative' initial={{right:100, opacity:0.5}} animate={{right:0, opacity:1}}> 
    {Object.keys(facets)?.map((facet_group) => (
        <div>
        <div className=' text-base font-bold mb-2'>{facet_group}</div>
        <div className='flex flex-col gap-2'>
            {facets[facet_group]?.map((facet, index) => (
                <Facet key={`${facet_group}-facet-${index}`} facet={facet} index={index} facet_group={facet_group} query={query}/>
            ))}
        </div>
        </div>
    ))}
  </motion.div>)
}

import React, { useState, createContext, useEffect } from 'react'
import {
  actions,
  AppStatus,
  thunkActions,
  useAppDispatch,
  useAppSelector,
} from 'store/provider'
import SearchInput from 'components/search_input'
import main_Logo from 'images/Leximind.svg'
import AIChatCards from 'components/ai_chat_cards_home'
import Search from 'components/search'
import UploadModal from 'components/upload_modal'
import '@elastic/eui/dist/eui_theme_light.min.css';
import {motion} from 'framer-motion'

const App = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.status)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    dispatch(thunkActions.search(query, true))
  }

  const isUploadModalVisible = useAppSelector((state) => state.isUploadModalVisible);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {

    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      {isUploadModalVisible ? <UploadModal/>:null}
      {status === AppStatus.Idle ? (
        <motion.div className=" min-h-screen relative" initial={{top:-100, opacity:0}} animate={{top:0, opacity:1}}>
          {/*<ParticlesBG />*/}
          <div className='background-pattern flex absolute w-screen h-screen'></div>
          <div className="mx-auto flex flex-col items-center absolute top-72 left-0 right-0">
            <div className='flex flex-row items-center gap-2 flex-nowrap mb-4'>
              <img className=" w-24 mb-3 mr-3" src={main_Logo} alt="" />
              <span className='text-slate-200 text-8xl font-bold text-nowrap'>LexiMind</span>
            </div>
            <SearchInput
              onSearch={handleSearch}
              value={searchQuery}
              appStatus={status}
              className={` w-[940px]`}
            />
            {/* <AIButtonGroupHome /> */}
            <AIChatCards/>
          </div>
        </motion.div>
      ) : (
        <Search status={status} searchQuery={searchQuery} handleSearch={handleSearch} />
      )}
    </div>
  )
}

export default App
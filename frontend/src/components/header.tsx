import SearchInput from 'components/search_input'
import AIButtonGroup from 'components/ai_button_group'
import LLMToggle from 'components/llm_toggle'
import SemanticToggle from 'components/semantic_toggle'
import Tabs from 'components/tabs'
import main_Logo from 'images/Leximind.svg'
import { useAppSelector } from 'store/provider'
import { act } from 'react-dom/test-utils'
import {motion} from 'framer-motion'

export const Header = ({ onSearch, value, appStatus }) => {
  const llm_toggle = useAppSelector((state) => state.llm_toggle)
  const activeTab = useAppSelector((state) => state.activeTab)
  return (
    <motion.div className='flex flex-col gap-1 px-8 pt-4 w-full relative ' style={{background:"linear-gradient(to bottom, #202020, #0a0a0a 88%)", backgroundColor:"transparent", backgroundRepeat:"no-repeat"}} initial={{top:-100, opacity:0.3}} animate={{top:0, opacity:1}}>
      <div className={`flex flex-row w-full space-x-10 items-center`}>
        <div className="pr-8 border-r border-ink flex">
          <a href="/" className="flex items-center gap-2">
            <img width={30} src={main_Logo} alt="Logo" />
            <span className='text-slate-200 text-3xl font-bold text-nowrap'>LexiMind</span>
          </a>
        </div>
        <div className={`w-2/4`}>
          <SearchInput
            onSearch={onSearch}
            value={value}
            appStatus={appStatus}
            className={`w-full`}
          />
        </div>
      </div>
      <Tabs query={value} />
    </motion.div>
  )
}
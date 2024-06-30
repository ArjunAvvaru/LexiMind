import AIButtonGroup from 'components/ai_button_group'
import { useAppSelector} from 'store/provider'

export default function AIButtonGroupHome() {
    const llm_enabled = useAppSelector((state) => state.llm_toggle)

    return (
        llm_enabled?<div className="mt-5"><AIButtonGroup/></div>:<div className="mt-4" style={{height:"46px"}}></div>
        )
}
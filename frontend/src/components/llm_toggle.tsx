// import ToggleSwitch from "./toggle_switch";
import { actions, useAppDispatch, useAppSelector} from 'store/provider'
import { EuiSwitch } from '@elastic/eui';

export default function LLMToggle() {
    const dispatch = useAppDispatch()
    const llm_toggle = useAppSelector((state) => state.llm_toggle)
    const handleLLMToggle = () => {
        dispatch(actions.setLLMToggle({llm_toggle: !llm_toggle}))
      }

    return (
        <div className="flex items-center">
            <span className="text-white mr-3">LLM</span>
            <EuiSwitch
                label=""
                checked={llm_toggle}
                onChange={handleLLMToggle}
            />
            {/* <ToggleSwitch label="LLM" toggle={llm_toggle} handleToggle={handleLLMToggle} /> */}
        </div>
    );
}
// import ToggleSwitch from "./toggle_switch";
import { actions, useAppDispatch, useAppSelector} from 'store/provider'
import { EuiSwitch } from '@elastic/eui';

export default function SemanticToggle() {
    const dispatch = useAppDispatch()
    const semantic_toggle = useAppSelector((state) => state.semantic_toggle)
    const handleSemanticToggle = () => {
        dispatch(actions.setSemanticToggle({semantic_toggle: !semantic_toggle}))
      }

    return (
        <div className="flex items-center">
            <span className="text-white mr-3">Semantic</span>
            <EuiSwitch
                label=""
                checked={semantic_toggle}
                onChange={handleSemanticToggle}
            />
            {/* <ToggleSwitch label="Semantic" toggle={semantic_toggle} handleToggle={handleSemanticToggle} /> */}
        </div>
    );
}
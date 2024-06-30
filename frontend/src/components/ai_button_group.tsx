import { actions, useAppDispatch, useAppSelector} from 'store/provider'
import { motion } from 'framer-motion';
import { GiKite } from "react-icons/gi";
import { FaEarlybirds, FaPaperPlane, FaMicrosoft } from "react-icons/fa";

export default function AIButtonGroup() {
    const dispatch = useAppDispatch()
    const llm_model = useAppSelector((state) => state.llm_model)
    const handleLLMChange = (model, label) => {
        dispatch(actions.setLLMModel({llm_model: model}))
        dispatch(actions.setLLMLabel({llm_label: label}))
      }

    const ai_buttons = [
    {model:"starling", label: 'Starling', icon: <FaEarlybirds className="mr-2" />, color: 'bg-sky-600' },
    {model:"zephyr", label: 'Zephyr', icon: <GiKite className="mr-2" />, color: 'bg-sky-600' },
    {model:"notus", label: 'Notus', icon: <FaPaperPlane className="mr-2" />, color: 'bg-sky-600' },
    {model:"phi-2", label: 'Phi-2', icon: <FaMicrosoft className="mr-2" />, color: 'bg-sky-600' }
    ];

    return (1!=1?
        <motion.div className="bg-slate-700 border-slate-600 border rounded-md inline-flex bg-blue">
            {ai_buttons.map((button, index) => (
                <motion.button
                    key={index}
                    // whileHover={{ scale: 1.1 }}
                    onClick={() => handleLLMChange(button.model, button.label)}
                    className={`text-white px-4 py-2 flex items-center first:rounded-l-md last:rounded-r-md border-e last:border-none border-slate-600 overflow-ellipsis overflow-hidden whitespace-nowrap ${llm_model === button.model ? button.color : ''}`}
                >
                    {button.icon} {button.label}
                </motion.button>
            ))}
        </motion.div>:null
    );
};
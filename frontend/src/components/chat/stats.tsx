import { SourceItem } from '../source_item'
import { SourceType } from 'types'

export const Stats = ({
    stats,
}) => {
    return (
        <div className="flex flex-row flex-wrap gap-3 items-baseline">
            <div className="text-slate-600 font-bold text-sm">Stats</div>
            <div className="flex flex-row gap-3">
                <div className="flex flex-row">
                    <span className="text-slate-500 font-medium text-xs mr-1">Time taken for first token</span>
                    <div className="text-xs font-medium overflow-ellipsis overflow-hidden whitespace-nowrap">{`${stats.ttft} min`}</div>
                </div>
                <div className="flex flex-row">
                    <span className="text-slate-500 font-medium text-xs mr-1">Time taken to finish</span>
                    <div className="text-xs font-medium overflow-ellipsis overflow-hidden whitespace-nowrap">{`${stats.ttf} min`}</div>
                </div>
            </div>
        </div>
    )
}

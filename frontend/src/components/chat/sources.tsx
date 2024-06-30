import { SourceItem } from '../source_item'
import { SourceType } from 'types'

export const Sources = ({
  sources,
}) => {
  return (    
      <>
        <div className="flex flex-row flex-wrap gap-2">
          {sources.map((source,index) => (
            <SourceItem
              key={source.id}
              source={source}
            />
          ))}
        </div>
      </>
  )
}

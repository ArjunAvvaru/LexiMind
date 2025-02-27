import { BeatLoader } from 'react-spinners'

export const Loader = ({
  className,
  size = 7,
}: {
  className?: string
  size?: number
}) => (
  <div className={className || 'ml-4'}>
    <BeatLoader size={size} color='rgb(51, 65, 85)' />
  </div>
)

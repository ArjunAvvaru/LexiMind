import { useAppSelector } from 'store/provider';
import { ReactComponent as LightBulb } from 'images/light_bulb_icon.svg'

export default function SearchInfo () {
    var size = useAppSelector((state) => state.results_size)
    const activePage = useAppSelector((state) => state.results_page)
    const start = size*activePage+1
    const total = useAppSelector((state) => state.results_total)
    if (size > (total-(size*activePage))) {
        size = total-(size*activePage)
    }
    const end = start+size-1
    return ( total>0?
        <div className='flex flex-row items-center mb-3 text-zinc-500 text-sm'>
          <LightBulb />
          <p className="pt-1">
               {/* Showing <b>{size}</b> of <b>{total}</b> results */}
                Showing <b>{start}</b> - <b>{end}</b> of <b>{total}</b> results
            </p>
        </div>: null
    );
}
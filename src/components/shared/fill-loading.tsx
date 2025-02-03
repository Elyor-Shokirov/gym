import { BiLoaderCircle } from 'react-icons/bi'
import { Skeleton } from '../ui/skeleton'

const FillLoading = () => {
	return (
		<Skeleton className='absolute inset-0 flex justify-center items-center w-full h-full opacity-60 z-50'>
			<BiLoaderCircle className='text-black animate-spin w-8 h-8  [animation-duration:_2s]' />
		</Skeleton>
	)
}

export default FillLoading

import { db } from '@/firebase'
import { cn } from '@/lib/utils'
import { ITask, ITaskData } from '@/types'
import { QueryObserverResult } from '@tanstack/react-query'
import { doc, updateDoc } from 'firebase/firestore'
import { Edit2, Trash } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CiPause1, CiPlay1 } from 'react-icons/ci'
import { HiStatusOnline } from 'react-icons/hi'
import { MdOutlineTaskAlt } from 'react-icons/md'
import { RxReload } from 'react-icons/rx'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import FillLoading from './fill-loading'
interface Props {
	task: ITask
	onStartEditing: () => void
	onDelete: () => void
	refetch: () => Promise<QueryObserverResult<ITaskData, Error>>
}

const TaskItem = ({ task, onStartEditing, onDelete, refetch }: Props) => {
	const [isLoading, setIsLoading] = useState(false)

	const activeColor = useMemo(() => {
		switch (task.status) {
			case 'unstarted':
				return 'text-blue-500'
			case 'in_progress':
				return 'text-green-500'
			case 'paused':
				return 'text-red-500'
		}
	}, [task.status])

	const onStart = async () => {
		setIsLoading(true)
		const ref = doc(db, 'tasks', task.id)
		try {
			await updateDoc(ref, {
				status: 'in_progress',
				startTime: Date.now(),
			})
			refetch()
		} catch (error) {
			toast.error('An error occured')
		} finally {
			setIsLoading(false)
		}
	}

	const onPause = async () => {
		setIsLoading(true)
		const ref = doc(db, 'tasks', task.id)
		try {
			const elapsed = task.startTime ? Date.now() - task.startTime : 0
			const newTotalTime = (task.totalTime || 0) + elapsed
			await updateDoc(ref, {
				status: 'paused',
				endTime: Date.now(),
				totalTime: newTotalTime,
			})
			refetch()
		} catch (error) {
			toast.error('An error occured')
		} finally {
			setIsLoading(false)
		}
	}

	const renderBtns = () => {
		switch (task.status) {
			case 'unstarted':
				return (
					<Button
						variant={'ghost'}
						size={'icon'}
						className='w-8 h-8'
						onClick={onStart}
					>
						<CiPlay1 className='w-5 h-5 text-indigo-500' />
					</Button>
				)
			case 'in_progress':
				return (
					<Button
						variant={'ghost'}
						size={'icon'}
						className='w-8 h-8'
						onClick={onPause}
					>
						<CiPause1 className={cn('w-5 h-5 text-indigo-500 ', activeColor)} />
					</Button>
				)
			case 'paused':
				return (
					<Button
						variant={'ghost'}
						size={'icon'}
						className='w-8 h-8'
						onClick={onStart}
					>
						<RxReload className='w-5 h-5 text-indigo-500' />
					</Button>
				)
		}
	}

	return (
		<Card className='w-full p-4 shadow-md grid md:grid-cols-4 grid-cols-1 items-center relative'>
			{isLoading && <FillLoading />}
			<div className='flex gap-1 items-center md:col-span-2 col-span-1'>
				<MdOutlineTaskAlt />
				<span className='capitalize'>{task.title}</span>
			</div>
			<div className='flex gap-1 items-center'>
				<HiStatusOnline className={activeColor} />
				<span className={cn('capitalize text-sm')}>{task.status}</span>
			</div>
			<div className='flex gap-1 items-center justify-self-end'>
				{renderBtns()}
				<Button
					variant={'secondary'}
					size={'icon'}
					className='w-8 h-8'
					onClick={onStartEditing}
				>
					<Edit2 className='w-5 h-5 ' />
				</Button>
				<Button
					variant={'destructive'}
					size={'icon'}
					className='w-8 h-8'
					onClick={onDelete}
				>
					<Trash className='w-5 h-5 ' />
				</Button>
			</div>
		</Card>
	)
}

export default TaskItem

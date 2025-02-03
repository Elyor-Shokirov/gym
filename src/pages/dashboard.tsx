import TaskForm from '@/components/forms/task-form'
import FillLoading from '@/components/shared/fill-loading'
import TaskItem from '@/components/shared/task-item'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { db } from '@/firebase'
import { taskSchema } from '@/lib/validation'
import { TaskService } from '@/service/task.service'
import { useUserState } from '@/stores/user.store'
import { ITask } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { addMilliseconds, addMinutes, format } from 'date-fns'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	updateDoc,
} from 'firebase/firestore'
import { BadgePlus } from 'lucide-react'
import { useState } from 'react'
import { GoAlert } from 'react-icons/go'
import { toast } from 'sonner'
import { z } from 'zod'

const Dashboard = () => {
	const [isDeleting, setIsDeleting] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [currentTask, setCurrentTask] = useState<ITask | null>(null)
	const [open, setOpen] = useState(false)
	const { user } = useUserState()

	const { isPending, error, data, refetch } = useQuery({
		queryKey: ['tasks-data'],
		queryFn: TaskService.getTasks,
	})

	const onAdd = async (values: z.infer<typeof taskSchema>) => {
		if (!user) return null
		return addDoc(collection(db, 'tasks'), {
			title: values.title,
			status: 'unstarted',
			startTime: null,
			endTime: null,
			userId: user?.uid,
		})
			.then(() => refetch())
			.finally(() => setOpen(false))
	}

	const onUpdate = async ({ title }: z.infer<typeof taskSchema>) => {
		if (!user) return null
		if (!currentTask) return null
		const ref = doc(db, 'tasks', currentTask.id)

		return updateDoc(ref, { title })
			.then(() => refetch())
			.finally(() => setIsEditing(false))
	}

	const onDelete = (id: string) => {
		setIsDeleting(true)
		const promise = deleteDoc(doc(db, 'tasks', id))
			.then(() => refetch())
			.finally(() => setIsDeleting(false))
		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully deleted',
			error: 'Somthing went wrong',
		})
	}

	const onStartEditing = (task: ITask) => {
		setIsEditing(true)
		setCurrentTask(task)
	}

	const formatForDate = (time: number) => {
		const date = addMilliseconds(new Date(0), time)
		const formattedDate = format(
			addMinutes(date, date.getTimezoneOffset()),
			'HH:mm:ss'
		)
		return formattedDate
	}

	return (
		<>
			<div className='h-screen max-w-6xl mx-auto flex items-center '>
				<div className='grid md:grid-cols-2 grid-cols-1 w-full gap-8 max-md:p-8'>
					<div className='flex flex-col space-y-3'>
						<div className='w-full p-4 rounded-md flex justify-between bg-gradient-to-t from-background to-secondary'>
							<div className='text-2xl font-bold'>Traning</div>
							<Button size={'icon'} onClick={() => setOpen(true)}>
								<BadgePlus />
							</Button>
						</div>
						<Separator />
						<div className='w-full p-4 rounded-md flex justify-between bg-gradient-to-b from-background to-secondary relative min-h-60'>
							{(isPending || isDeleting) && <FillLoading />}
							{error && (
								<Alert variant='destructive' className='w-full'>
									<GoAlert className='h-6 w-6' />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>{error.message}</AlertDescription>
								</Alert>
							)}
							{data && (
								<div className='flex flex-col space-y-3 w-full'>
									{!isEditing &&
										data.tasks.map(task => (
											<TaskItem
												key={task.id}
												task={task}
												onStartEditing={() => onStartEditing(task)}
												onDelete={() => onDelete(task.id)}
												refetch={refetch}
											/>
										))}
									{isEditing && (
										<TaskForm
											title={currentTask?.title}
											isEdit={true}
											handler={
												onUpdate as (
													values: z.infer<typeof taskSchema>
												) => Promise<void | null>
											}
											onClose={() => setIsEditing(false)}
										/>
									)}
								</div>
							)}
						</div>
					</div>
					<div className='flex flex-col space-y-3  w-full'>
						<div className='p-4 rounded-md bg-gradient-to-r from-blue-900 to-background relative h-24'>
							<div className='text-2xl font-bold'>Total week</div>
							{isPending ? (
								<FillLoading />
							) : (
								data && (
									<>
										<div className='text-3xl font-bold'>
											{formatForDate(data?.weekTotal)}
										</div>
									</>
								)
							)}
						</div>
						<div className='p-4 rounded-md bg-gradient-to-r from-secondary to-background relative h-24'>
							<div className='text-2xl font-bold'>Total Month</div>
							{isPending ? (
								<FillLoading />
							) : (
								data && (
									<>
										<div className='text-3xl font-bold'>
											{formatForDate(data?.monthTotal)}
										</div>
									</>
								)
							)}
						</div>
						<div className='p-4 rounded-md bg-gradient-to-r from-destructive to-background relative h-24'>
							<div className='text-2xl font-bold'>Total Time</div>
							{isPending ? (
								<FillLoading />
							) : (
								data && (
									<>
										<div className='text-3xl font-bold'>
											{formatForDate(data?.total)}
										</div>
									</>
								)
							)}
						</div>
					</div>
				</div>
			</div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger></DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create a new tasks</DialogTitle>
					</DialogHeader>
					<Separator />
					<TaskForm
						handler={
							onAdd as (
								values: z.infer<typeof taskSchema>
							) => Promise<void | null>
						}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default Dashboard

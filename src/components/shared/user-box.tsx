import { auth } from '@/firebase'
import { useUserState } from '@/stores/user.store'
import { LogOut } from 'lucide-react'
import { CgGym } from 'react-icons/cg'
import { LuLoader } from 'react-icons/lu'
import { useNavigate } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const UserBox = () => {
	const { user, setUser } = useUserState()
	const navigate = useNavigate()
	if (!user) return <LuLoader className='animate-spin' />

	const onLogOut = () => {
		auth.signOut().then(() => {
			setUser(null)
			navigate('/')
		})
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user.photoURL!} />
					<AvatarFallback className='uppercase'>
						{user.email![0]}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className='w-80'
				align='start'
				alignOffset={11}
				forceMount
			>
				<div className='flex flex-col space-y-4 p-2'>
					<p className='text-xs font-medium leading-none text-muted-foreground'>
						{user.email}
					</p>
					<div className='flex items-center gap-x-2'>
						<div className='rounded-md bg-secondary p-1'>
							<Avatar className='cursor-pointer'>
								<AvatarImage src={user.photoURL!} />
								<AvatarFallback className='uppercase'>
									{user.email![0]}
								</AvatarFallback>
							</Avatar>
						</div>
						<div className='space-y-1'>
							<p className='line-clamp-1 text-sm'>
								{user.displayName ?? user.email}
							</p>
						</div>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem className='cursor-pointer'>
					<CgGym className='w-4 h-4 mr-2' />
					<span>Gym</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					className='cursor-pointer bg-destructive hover:text-black'
					onClick={onLogOut}
				>
					<LogOut className='w-4 h-4 mr-2' />
					<span className='text-white '>Logout</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserBox

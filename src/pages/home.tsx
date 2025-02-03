import men from '@/assets/men.png'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { futeredItems, programs } from '@/constants'
import { auth } from '@/firebase'
import { useUserState } from '@/stores/user.store'
import { LogOut } from 'lucide-react'
import { CgGym } from 'react-icons/cg'
import { FaArrowRightLong } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router'

const Home = () => {
	const { user, setUser } = useUserState()
	const navigate = useNavigate()

	const onLogOut = () => {
		auth.signOut().then(() => {
			setUser(null)
			navigate('/')
		})
	}

	return (
		<>
			<div className='md:max-w-6xl mx-auto container w-full  h-screen flex items-center justify-between'>
				<div className='  flex h-full flex-col justify-center max-md:p-5'>
					<h1 className='md:text-9xl text-3xl font-semibold uppercase '>
						Workout with me
					</h1>
					<p className='text-muted-foreground'>
						A huge selection of health and fitness content, healthy recipes and
						transformation stories to help you get fit and stay fit!
					</p>
					{user ? (
						<>
							<div className='flex gap-4'>
								<Link to='/dashboard'>
									<Button className='w-fit mt-6 font-bold h-12' size={'lg'}>
										<span>Go to Gym</span>
										<CgGym className='h-5 w-5 ml-2' />
									</Button>
								</Link>

								<Button
									className='w-fit mt-6 font-bold h-12'
									variant={'destructive'}
									size={'lg'}
									onClick={onLogOut}
								>
									<span>Log Out</span>
									<LogOut className='h-5 w-5 ml-2' />
								</Button>
							</div>
						</>
					) : (
						<Link to={'/auth'}>
							<Button className='w-fit mt-6 font-bold h-12' size={'lg'}>
								Join club now
							</Button>
						</Link>
					)}
					<div className='mt-24'>
						<p className='text-muted-foreground'>AS FEATURED IN</p>
						<div className='flex flex-wrap items-center gap-4 mt-2 max-md:justify-center'>
							{futeredItems.map((Icon, index) => (
								<Icon key={index} className='w-14 h-14' />
							))}
						</div>
					</div>
				</div>
				<img src={men} className='md:w-1/2 hidden md:block' />
			</div>
			<div className='container max-w-6xl mx-auto max-md:p-6'>
				<h1 className='text-4xl'>Not sure where to start?</h1>
				<p className='mt-2 text-muted-foreground'>
					Programs offer day-to-day guidance on an interactive calendar to keep
					you on track.
				</p>
				<div className='grid md:grid-cols-3 grid-cols-1 gap-4 my-8'>
					{programs.map(item => (
						<Card
							key={item.title}
							className='p-8 relative cursor-pointer group'
						>
							<h3>{item.title}</h3>
							<p className='text-sm text-muted-foreground mt-2'>{item.descr}</p>
							<Button
								size={'icon'}
								variant={'ghost'}
								className='absolute right-2 top-1/2 group-hover:translate-x-1 transition-transform'
							>
								<FaArrowRightLong />
							</Button>
						</Card>
					))}
				</div>
			</div>
		</>
	)
}

export default Home

import Login from '@/components/auth/login'
import Register from '@/components/auth/register'
import Social from '@/components/auth/social'
import { Card } from '@/components/ui/card'
import { useAuthState } from '@/stores/auth.store'

const Auth = () => {
	const { authState } = useAuthState()

	return (
		<div className='w-full h-screen bg-gradient-to-t from-foreground flex items-center justify-center max-md:p-3'>
			<Card className='max-md:p-8 md:w-1/3 w-full  relative p-8'>
				{authState === 'login' && <Login />}
				{authState === 'register' && <Register />}
				<Social />
			</Card>
		</div>
	)
}

export default Auth

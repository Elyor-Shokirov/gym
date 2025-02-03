import { Route, Routes } from 'react-router'
import Navbar from './components/shared/navbar'
import { Toaster } from './components/ui/sonner'
import Auth from './pages/auth'
import Dashboard from './pages/dashboard'
import Home from './pages/home'

const App = () => {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/auth' element={<Auth />} />
			</Routes>
			<Toaster position='top-center' />
		</>
	)
}

export default App

import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const { user, setShowLogin, logout, credit } = useContext(AppContext)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setLoggingOut(true)
    logout()
    setTimeout(() => {
      setLoggingOut(false)
      navigate('/')
    }, 1500)
  }

  return (
    <>
      <div className='flex items-center justify-between py-4'>
        <Link to='/'>
          <img src={assets.logo} alt="" className='w-28 sm:w-32 lg:w-40' />
        </Link>

        <div>
          {user ? (
            <div className='flex items-center gap-2 sm:gap-3'>
              <button 
                onClick={() => navigate('/buy')} 
                className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'
              >
                <img className='w-5' src={assets.credit_star} alt="" />
                <p className='text-xs sm:text-sm font-medium text-gray-600'>
                  Credits left : {credit}
                </p>
              </button>
              <p className='text-gray-600 max-sm:hidden pl-4'>Hi, {user.name}</p>
              <div className='relative group'>
                <img src={assets.profile_icon} className='w-10 drop-shadow' alt="" />
                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                  <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                    <li 
                      onClick={handleLogout}
                      className='py-1 px-2 cursor-pointer pr-10 hover:bg-gray-100 transition-all duration-300'
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-2 sm:gap-5'>
              <p onClick={() => navigate('/buy')} className='cursor-pointer'>Pricing</p>
              <button 
                onClick={() => setShowLogin(true)} 
                className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full'
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      {loggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">Logging out...</p>
        </div>
      )}
    </>
  )
}

export default Navbar
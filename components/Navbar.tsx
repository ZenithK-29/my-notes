"use client"
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react' 
import { useRouter } from "next/navigation";

const Navbar = () => {

  const {data: session} = useSession()
  console.log(session)
  const router = useRouter()

  return (
    <div className='flex bg-amber-500 justify-around'>
      <div className="logo flex items-center h-12">
        <Link href={"/"}><h1 className='logo font-bold text-3xl text-orange-900'>My_Notes</h1></Link>
        <img src="/logo.png" alt="" className='w-7 h-7'/>
      </div>
      <ul className='flex items-center gap-10 font-semibold'>
        <Link href={"/"}><li className='hover:text-amber-100 cursor-pointer'>Home</li></Link>
        {session ? (
          <>
          <button onClick={()=>signOut()} className='bg-amber-300 p-2  rounded-md text-white cursor-pointer py-2'>Sign out</button>
          <button onClick={()=>{router.push("/dashboard")}} className='text-white bg-gradient-to-r cursor-pointer rounded-md py-2.5 from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-bold rounded-base text-sm px-4 text-center leading-5'>Welcome {session.user.email}</button>
          </>
        ) : (
          <>
            <button className='bg-amber-300 p-2  rounded-md text-white cursor-pointer py-1'><Link href={"/login"}>Login</Link></button>
            <button className='bg-amber-300 p-2  rounded-md text-white cursor-pointer py-1'><Link href={"/register"}>SignUp</Link></button>
          </>
        )
          
        
        }
      </ul>
    </div>
  )
}

export default Navbar

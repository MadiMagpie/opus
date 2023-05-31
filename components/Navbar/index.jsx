"use client";
import Image from "next/image";
import { useState } from "react";
import NewDebut from "../NewDebut";
import { IoSearch } from 'react-icons/io5'
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Navbar() {
       const {data: session} = useSession();
       const r = useRouter();
       const [newDebut, setNewDebut] = useState(false);

       function closeDebut() {
              setNewDebut(false);
       }
       function openDebut() {
              setNewDebut(true);
       }

       return(
              <>
              {newDebut && <NewDebut onClick={closeDebut}/>}
                     <div className = 'nav backdrop-filter backdrop-blur-md w-screen grow-0 fixed z-30 flex mb-32items-center text-grey-800 justify-between space-x-3 px-8 py-2'>
                            {/* logo */}
                            <div className='cursor-pointer'
                            onClick = {() => r.push('/')}>
                                   <Image
                                   src = '/opusLogo.png'
                                   alt = 'opus logo'
                                   width={50}
                                   height={50}
                                   />
                            </div>
                            <div className ='flex items-center text-grey-800 space-x-8'>
                                   {/* search */}
                                   {/* make functional later */}
                                   {/* <div className="flex focus:shadow-lg items-center h-10 p-3 rounded-full bg-white border-2 border-slate-600 relative w-[45px] md:w-[200px] ">
                                          <IoSearch 
                                          size = {25} 
                                          className=" text-gray-500 z-50"/>
                                          <input 
                                          className = 'absolute inset-0 rounded-full pl-11 border-none placeholder:text-gray-400 text-gray-700 hidden md:inline'
                                          type = 'text'
                                          placeholder = 'Search Opus'/>
                                   </div> */}
                                   {/* session conditionals */}
                                   {session && (
                                          <>
                                                 <div className="cursor-pointer flex flex-row items-center space-x-2 ">
                                                 <img 
                                                 onClick = { () => r.push('/profile')}
                                                 className="rounded-full w-10 h-10 hover:scale-110 transition duration-300 ease-in-out"
                                                 src = {session?.user?.image}
                                                 alt = 'default profile picture'
                                                 />
                                                 </div>
                                                 <button 
                                                 onClick = {openDebut} 
                                                 className = 'bg-gradient-to-br from-cyan-600 to-emerald-700 text-white rounded-lg w-40 h-10 font-semibold tracking-wider hover:scale-110 transition duration-300 ease-in-out shadow-md text-lg'> 
                                                 Make debut 
                                                 </button>
                                          </>
                                   )}
                                   {!session && (
                                          <>
                                                 <button 
                                                 onClick = {signIn}
                                                 className = 'bg-emerald-700 text-white rounded-full w-40 h-10 font-bold shadow-md hover:bg-green-900 text-lg'>
                                                        Sign in
                                                 </button>
                                          </>
                                   )}    
                            </div>
                     </div>
              </>
       )
}
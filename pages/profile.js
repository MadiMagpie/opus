import Navbar from "@/components/Navbar"
import { useSession, signOut, signIn } from "next-auth/react";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../firebase";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Debuts from "@/components/Debuts";
import Footer from "@/components/Footer";

function LogOut({onClick}){
       return(
              <div className = 'flex items-center justify-center w-screen h-screen z-50 fixed'>
                     <div className = 'top-24 min-h-32 modal flex-col p-5 space-x-2 rounded-md'>
                            <span>Are you sure you want to log out?</span>
                            <div className = 'flex pt-4 space-x-3 '>
                                   <button onClick = {signOut} className="bg-emerald-800 text-white rounded-md w-28 h-7 font-bold shadow-md hover:bg-green-900 text-sm disabled:opacity-50">
                                          Log out
                                   </button>
                                   <button onClick = {onClick} className="bg-emerald-50 text-emerald-800 rounded-md w-28 h-7 font-bold shadow-sm text-sm disabled:opacity-50">
                                          Cancel
                                   </button>
                            </div>
                     </div>
              </div>
       )
}

export default function Profile() {
       const {data: session} = useSession();
       const r = useRouter();
       const [logOut, setLogOut] = useState(false);
       const [debuts, setDebuts] = useState([]);

       function closeLogOut() {
              setLogOut(false);
       }
       function openLogOut() {
              setLogOut(true);
       }

       useEffect(() => {
              const fetchDebuts = async () => {
                     if (session && session.user && session.user.uid) {
                       const debutsQuery = query(
                         collection(db, 'posts'),
                         where('id', '==', session.user.uid) 
                       );
               
                       const querySnapshot = await getDocs(debutsQuery);
                       const fetchedDebuts = querySnapshot.docs.map((doc) => ({
                         id: doc.id,
                         ...doc.data(),
                       }));
               
                       setDebuts(fetchedDebuts);
                     }
                   };
              if (!session) {
                signIn();
              } else {
                fetchDebuts();
              }
            }, [session]);

       if (!session) {
         return (
           <div className="w-full h-full flex justify-center items-center bg-white">
             <h1>Not signed in. Redirecting...</h1>
           </div>
         );
       }       

       return (
              <>
              {logOut && <LogOut onClick={closeLogOut}/>}
              <main className = 'flex flex-col' >
                     <Navbar/>
                     <div className = 'paper'>
                            <div className = 'scrollable flex flex-col items-center pt-32 pb-20 justify-start min-w-full space-y-6'>
                                   <div className = 'pt-10 pb-24 bg-gradient-to-t space-y-10 from-cyan-600/10 to-white/60 w-9/12 flex flex-col items-center justify-center space-x-9 rounded-md' >
                                          <div className = 'self-end pr-10'>
                                                 <button 
                                                 onClick = {openLogOut}
                                                 className = 'border-emerald-700 border-2 rounded-lg w-32 h-10 font-medium tracking-wider shadow-md hover:bg-emerald-100/50'>
                                                        logout
                                                 </button>
                                          </div>
                                          <div className = 'flex space-x-5 '>
                                                 <img 
                                                 className = "rounded-full w-25 h-25"
                                                 src = {session?.user?.image}
                                                 alt = 'default profile picture'
                                                 />
                                                 <div className = 'flex flex-col items-start justify-center text-sm'>
                                                        <h4 className = 'font-semibold text-xl'> 
                                                               {session?.user?.name} 
                                                        </h4>
                                                        <span className = 'font-light text-gray-500 text-lg'> 
                                                               @{session?.user?.username} 
                                                        </span>
                                                 </div>
                                          </div>
                                          <div>
                                                 <span className = 'text-lg'>
                                                        You've made {debuts.length} debut's so far! 
                                                 </span>
                                          </div>
                                   </div>
                                   <div className = 'flex flex-col items-center pt-32 pb-20 min-w-full space-y-12'>
                                          {debuts.length > 0 ? (
                                                 debuts.map((debut) => (
                                                 <Debuts key={debut.id} post={debut} />
                                                 ))
                                          ) : (
                                                 <p>No debuts yet. You should make one!</p>
                                          )}
                                          <Footer/>

                                 </div>
                            </div>
                     </div>
              </main>
              </> 
       )
}
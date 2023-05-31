import {getProviders, signIn} from 'next-auth/react'

export default function signin({providers}){
       return(
              <div style = {{height: '100vh'}} className = 'paper bg-no-repeat bg-cover flex flex-col md:flex-row items-center h-fit justify-center space-y-10 p-10'>
                     <div className='max-w-md md:max-w-2xl'>
                            <img 
                                   className = 'w-fit'
                                   src = '/dalle-book.png'
                                   alt = 'dalle book'
                            />
                     </div>
                     <div className = 'py-14 px-14 bg-white/20 md:py-32 md:px-8 rounded-md flex flex-col items-center min-w-84 justify-evenly space-y-4'>
                            <div className = 'flex flex-col items-center space-y-4'>
                                   <span className ='text-4xl font-bold'>
                                          Welcome to Opus
                                   </span>
                                   <span>
                                          Let your ideas loose and get inspired.  
                                   </span>
                            </div>
                            <div className = 'flex flex-col items-center pt-10'>
                                   <span className = 'text-lg pb-5'>
                                          Sign in to get started.
                                   </span>
                                   <div className = 'flex bg-white/75 p-5 rounded-md hover:bg-emerald-100/60 cursor-pointer hover:shadow-md'>
                                   {Object.values(providers).map((provider) => (
                                          <div 
                                          key = {provider.name}>
                                                 <button onClick = {()=> signIn(provider.id, {callbackUrl: '/'})}> Sign in with {provider.name}</button>
                                          </div>
                                   ))}
                                   </div>
                            </div>
                            
                     </div>
              </div>
       )
}

export async function getServerSideProps(){
       const providers = await getProviders();
       return{
              props:{
                     providers,
              },
       }
}
import Navbar from '../components/Navbar'
import Feed from '../components/Feed'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <main className='flex flex-col' >
        <Navbar/>
        <Feed/>
      </main>
      {/* <Footer/> */}
    </>    
  )
}

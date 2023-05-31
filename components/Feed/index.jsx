import { useEffect, useState } from 'react';
import Debuts from '../Debuts'
import { onSnapshot, orderBy, collection, query } from 'firebase/firestore';
import { db } from '../../firebase';
import Footer from '../Footer';

export default function Feed() {
       const [posts, setPosts] = useState([]); 
       useEffect(() => {
              return onSnapshot(
                     query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
                     (snapshot) => {
                            setPosts(snapshot.docs);
                     }
              );
       },[]);
       return(
              <div className='paper'>
                     <div className = 'scrollable flex flex-col items-center pt-32 pb-20  min-w-full space-y-12'>
                            {posts.map((post) => (
                                   <Debuts
                                   key = {post.id}
                                   post = {post}
                                   />
                            ))}
                            <Footer/>
                     </div>
              </div>
       )
}
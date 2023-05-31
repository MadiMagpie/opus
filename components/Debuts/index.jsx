import { FaRegHeart } from 'react-icons/fa'
import { FaHeart } from 'react-icons/fa'
import { FaRegComment } from 'react-icons/fa'
import { IoEllipsisHorizontal } from 'react-icons/io5'
import { FaComment } from 'react-icons/fa'
import { HiOutlineTrash } from 'react-icons/hi'
import { LuEdit3 } from 'react-icons/lu'
import { IoClose } from 'react-icons/io5'
import Moment from 'react-moment'
import { collection, deleteDoc, updateDoc, doc, onSnapshot, setDoc, } from 'firebase/firestore'
import { db, storage } from '../../firebase'
import { useSession, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { deleteObject, ref } from 'firebase/storage'

function ConfirmDelete({ handleDelete, handleCancelDelete }) {
       return (
         <div className="flex items-center justify-center w-screen h-screen z-50 fixed">
           <div className="top-24 min-h-32 modal flex-col p-5 space-x-2 rounded-md items-center">
             <span>Are you sure you want to delete this debut?</span>
             <div className="flex pt-4 space-x-3 items-center justify-center">
               <button
                 onClick={handleDelete}
                 className="bg-emerald-700 text-white rounded-md w-28 h-7 font-bold shadow-md hover:bg-green-900 text-sm disabled:opacity-50">
                 Delete debut
               </button>
               <button
                 onClick={handleCancelDelete}
                 className="bg-emerald-50 text-emerald-800 rounded-md w-28 h-7 font-bold shadow-sm text-sm disabled:opacity-50">
                 Cancel
               </button>
             </div>
           </div>
         </div>
       );
     }

function EditModal({handleDelete, handleEditMode, handleCancelEdit}){
       return(
              <div className = 'modal p-4 pt-4 z-10 space-y-3 rounded-md '>
                     <div className='flex cursor-pointer self-end justify-end'>
                            <IoClose 
                            className='hover:text-teal-700'
                            size = {20}
                            onClick = {handleCancelEdit}/>
                     </div>
                     <div 
                     className = 'hoverEffect flex justify-between items-end space-x-3 '
                     onClick = {handleEditMode}>
                            <LuEdit3
                            size = {20} />
                            <span className = 'text-sm md:text-md' >
                                   Edit caption
                            </span>
                     </div>
                     <div 
                     className = 'hoverEffect flex justify-between items-end space-x-3'
                     onClick = {handleDelete}>
                            <HiOutlineTrash 
                            size = {20} />
                            <span className = 'text-sm md:text-md'>
                                   Delete debut
                            </span>
                     </div>
              </div>
       )
}
     
export default function Debuts({ post }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedCaption, setUpdatedCaption] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts', post.id, 'likes'), (snapshot) =>
      setLikes(snapshot.docs)
    );

    return () => {
      unsubscribe();
    };
  }, [db]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session?.user.uid) !== -1);
  }, [likes]);

  async function likePost() {
    if (session) {
      if (hasLiked) {
        await deleteDoc(doc(db, 'posts', post.id, 'likes', session?.user.uid));
      } else {
        await setDoc(doc(db, 'posts', post.id, 'likes', session?.user.uid), {
          username: session.user.username,
        });
      }
    } else {
      signIn();
    }
  }

  async function handleUpdate() {
       if (updatedCaption !== '') {
         await updateDoc(doc(db, 'posts', post.id), {
           caption: updatedCaption
         });
         setEditMode(false);
       }
     }

  function handleDelete() {
    setShowConfirmDelete(true);
  }

  function handleCancelDelete() {
    setShowConfirmDelete(false);
  }

  function handleEditModal() {
       setShowEditModal(true);
  }     
  function handleEditMode(){
       setShowEditModal(false);
       setEditMode(true);
       setUpdatedCaption(post.data().caption);
  }

  function handleCancelEdit() {
       setUpdatedCaption('');
       setShowEditModal(false);
       setEditMode(false);
  }

  function confirmDelete() {
    deleteDoc(doc(db, 'posts', post.id))
      .then(() => {
        deleteObject(ref(storage, `posts/${post.id}/image`))
          .then(() => {
            // Deletion done
          })
          .catch((error) => {
            console.log('Error deleting post image:', error);
          });
      })
      .catch((error) => {
        console.log('Error deleting post:', error);
      });
  }

  return (
       <>
       {showConfirmDelete && <ConfirmDelete 
       handleDelete={confirmDelete} 
       handleCancelDelete={handleCancelDelete} />}
       <div className = 'bg-stone-50 p-10 flex flex-col rounded-2xl w-9/12 shadow-sm cursor-pointer divide-y divide-gray-200'>
              <div className = 'flex items-start justify-between p-2 pb-5 md:flex-row md:items-center'>
                     <div>
                            <div className = 'flex space-x-2'>
                                   <img 
                                   className = 'rounded-full w-10 h-10'
                                   src = {post.data ? post?.data().userPic : post.userPic}
                                   alt = 'user profile picture'
                                   />
                                   <div className = 'flex flex-col items-start text-sm'>
                                          <h4 className = 'font-semibold'> 
                                                 {post.data ? post?.data().name : post.name} 
                                          </h4>
                                          <span className = 'font-light text-gray-500'> 
                                                 @{post.data ? post?.data().username : post.username}
                                          </span>
                                   </div>
                            </div>
                            <span className = 'text-xs font-light'>
                                   <Moment fromNow>
                                          {post.data ? post?.data().timestamp?.toDate() : post.timestamp?.toDate()}
                                   </Moment>
                            </span>       
                     </div>
                     {session?.user.uid === (post?.data ? post.data().id : post.id) && (
                            <div className = 'self-start'>
                                   {showEditModal ?  <EditModal 
                                   handleDelete = {handleDelete} 
                                   handleEditMode = {handleEditMode}
                                   handleCancelEdit = {handleCancelEdit}/> :
                                   <IoEllipsisHorizontal
                                   size = {30}
                                   onClick = {handleEditModal}
                                   className = 'hover:text-teal-800'/>
                                   }
                            </div>  
                     )}         
              </div>
              {editMode ? (
                     //edit mode
                     <div className = 'divide-y divide-gray-200'>
                            <div>
                                   {/* image */}
                                   <img
                                   className = "image rounded-lg"
                                   src = {post.data ? post?.data().img : post?.img}
                                   alt = 'debut image'
                                   />
                                   {/* caption */}
                                   <textarea
                                   value = {updatedCaption}
                                   className = 'w-full'
                                   onChange = {(e) => setUpdatedCaption(e.target.value)}
                                   />
                            </div>
                            {/* buttons */}
                            <div className = 'flex space-x-10 pt-10 items-center justify-end'>
                                   <button 
                                   onClick = {handleUpdate}
                                   className = 'bg-emerald-700 text-white rounded-lg w-40 h-10 font-semibold tracking-wider shadow-md hover:bg-green-900 text-md'>
                                          Update Caption
                                   </button>
                                   <button 
                                   onClick = {handleCancelEdit}
                                   className = 'border-emerald-700 border-2 rounded-lg w-32 h-10 font-medium tracking-wider shadow-md hover:bg-emerald-100/50'>
                                          Cancel
                                   </button>
                            </div>
                     </div>
                     ) : ( 
                     //standard mode
                     <div className = 'divide-y divide-gray-200'>
                            <div>
                                   {/* image */}
                                   <img
                                   className = "image rounded-lg"
                                   src = {post.data ? post?.data().img : post?.img}
                                   alt = 'debut image'
                                   />
                                   {/* caption */}
                                   <p className = 'text-center text-lg pt-6 pb-8 sm:text-[16px]'>
                                          {post.data ? post.data().caption : post.caption}
                                   </p>
                            </div>
                            {/* icons */}
                            <div className = 'flex space-x-10 pt-10 items-center justify-end'>
                                   <div className='relative'>
                                          {hasLiked ? (
                                                 <FaHeart 
                                                 size = {30} 
                                                 className = 'text-red-500'
                                                 onClick = {likePost}/>
                                                 ) : (
                                                 <FaRegHeart
                                                 size = {30}
                                                 className = 'hover:text-red-500'
                                                 onClick = {likePost}/>
                                                 )
                                          } 
                                          {likes.length > 0 && (
                                                 <span className = {`${hasLiked ? 'text-white absolute top-[5px] left-[11.5px] text-sm select-none' : 'select-none text-gray-800 absolute top-[5px] left-[11.5px] text-sm'}`} >
                                                        {' '}
                                                        {likes.length}
                                                 </span>
                                          )} 
                                   </div>             
                                   <FaRegComment 
                                   size = {30} 
                                   className = 'hover:text-stone-500'/>
                            </div>
                     </div>
              )} 
       </div>
       </>
  )
}
import { TbPhotoPlus } from 'react-icons/tb';
import { TbPhotoOff } from 'react-icons/tb';
import { IoClose } from 'react-icons/io5';
import { useSession} from "next-auth/react";
import { useState } from "react";
import { db, storage } from "../../firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRef } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { Loader } from "../Loader"

export default function NewDebut({onClick }) {
       const {data: session} = useSession();
       const [input, setInput] = useState('');
       const [selectedFile, setSelectedFile] = useState(null); // [file, setFile
       const [loading, setLoading] = useState(false);
       const filePickerRef = useRef(null);

       const sendPost = async () => {
              if(loading) return;
              setLoading(true);

              const docRef = await addDoc(collection(db, "posts"), {
                     id: session?.user?.uid,
                     caption: input,
                     userPic: session?.user?.image,
                     timestamp: serverTimestamp(),
                     name: session?.user?.name,
                     username: session?.user?.username,
              });
              const imageRef = ref(storage, `posts/${docRef.id}/image`);
              if(setSelectedFile){
                     await uploadString(imageRef, selectedFile, 'data_url').then(async() => {
                            const downloadURL = await getDownloadURL(imageRef);
                            await updateDoc(doc(db, 'posts', docRef.id), {
                                   img: downloadURL,
                            })
                     });
              }
              setLoading(false);
              setTimeout(onClick, 500);
       }

       const addImageToPost = (e) => {
              const reader = new FileReader();
              if (e.target.files[0]) {
                     reader.readAsDataURL(e.target.files[0]);
              }
              reader.onload = (readerEvent) => {
                     setSelectedFile(readerEvent.target.result);
              }
       };
       
       return(
              <div className = 'flex items-center justify-center h-screen w-screen z-50 fixed '>
                     <div className = 'top-24 modal flex-col p-5 space-x-2 rounded-md w-9/12 divide-y divide-gray-200'>
                            <div className='flex justify-between pb-3'>
                                   <div className = 'hoverEffect flex space-x-2'>
                                          <img className='rounded-full w-10 h-10'
                                          src = {session?.user?.image}
                                          alt = 'user profile picture'
                                          />
                                          <div className='flex flex-col items-start text-sm'>
                                                 <h4 className= 'font-semibold'> {session?.user?.name} </h4>
                                                 <span className='text-gray-500 font-light'>@{session?.user?.username}</span>
                                          </div>
                                   </div>    
                                   <div className='flex cursor-pointer'>
                                          <IoClose 
                                          size = {20}
                                          onClick = {onClick}/>
                                   </div>   
                            </div>
                            <div className = 'flex pt-4 space-x-3 '>
                                   <div className='w-full divide-y divide-gray-200'>
                                          <div className='pb-2'>
                                                 <div className = 'flex-col items-center justify-center space-y-5'>
                                                        {selectedFile && (
                                                               <div className = 'flex items-center justify-center'>                                                                             
                                                                      <img className = ' max-h-[50vh] object-contain' src = {selectedFile} alt = 'selected file'/>
                                                               </div>
                                                        )}
                                                        <textarea 
                                                        value = {input}
                                                        className='w-full border-none focus:border-zinc-500 focus:outline-none text-lg placeholder-gray-400 text-gray-700 tracking-wide'
                                                        rows = '3'
                                                        placeholder="Show off what you're workin' on."
                                                        onChange = {(e) => setInput(e.target.value)}
                                                        />
                                                 </div>
                                          </div>
                                          <div className="pt-8 py-3 flex space-x-3 justify-between items-center relative">
                                                 {!selectedFile && <div>
                                                        <div className="flex text-sm items-center space-x-2 hoverEffect group"
                                                        onClick = {() => filePickerRef.current.click()}>
                                                               <TbPhotoPlus 
                                                               size={35}
                                                               />
                                                               <p className="hidden transition-opacity duration-300 text-md opacity-0 group-hover:opacity-100 md:inline-flex">
                                                                      Add media
                                                               </p>
                                                        </div>
                                                        <input type = 'file' hidden ref = {filePickerRef} onChange = {addImageToPost}/>
                                                        
                                                        </div>
                                                 }
                                                 {selectedFile && <div>
                                                        <div className="flex text-sm items-center space-x-2 hoverEffect group"
                                                        onClick = {() => setSelectedFile(null)}>
                                                               <TbPhotoOff 
                                                               size={35}
                                                               />
                                                               <p className="hidden transition-opacity duration-300 opacity-0 text-md group-hover:opacity-100 md:inline-flex">
                                                                      Remove media
                                                               </p>
                                                        </div>
                                                        <input type = 'file' hidden ref = {filePickerRef} onChange = {addImageToPost}/>
                                                        
                                                        </div>
                                                 }
                                                 <button 
                                                 disabled = {!input.trim()} 
                                                 onClick = {sendPost}
                                                 className="bg-gradient-to-br from-cyan-600 to-emerald-700 text-white rounded-full w-32 h-10 font-bold shadow-md hover:bg-green-900 text-sm disabled:opacity-50">
                                                        {!loading && (
                                                               <span>
                                                                      Make debut
                                                               </span>
                                                        )}
                                                        {loading && (
                                                               <div className = 'flex items-center justify-center'>
                                                                      <Loader/>
                                                               </div>
                                                        )}
                                                 </button>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </div>
       )
}
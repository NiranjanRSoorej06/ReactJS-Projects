import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword,signOut} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyDrwe-pm8UeUL1uIevilKh7s2qZXMXbEMY",
  authDomain: "netflix-clone-51cc4.firebaseapp.com",
  projectId: "netflix-clone-51cc4",
  storageBucket: "netflix-clone-51cc4.firebasestorage.app",
  messagingSenderId: "666101290302",
  appId: "1:666101290302:web:a17a50ab41ab6c0102086f"
};

const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db= getFirestore(app);

const signup=async (name,email,password)=>{
  try{
    const res=await createUserWithEmailAndPassword(auth,email,password);
    const user=res.user;
 
    await addDoc(collection(db,"user"),{
      uid:user.uid,
      name,
      authProvider:"local",
      email,
    });
  }catch(error){
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" ")); 
  }
}

const login= async (email,password)=>{
  try{
    await signInWithEmailAndPassword(auth,email,password);
  }catch(error){
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));  
  }
}

const logout=()=>{
  signOut(auth);
}

export {auth,db,login,signup,logout};
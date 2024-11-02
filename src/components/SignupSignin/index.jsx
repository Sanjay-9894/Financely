import React, { useState } from 'react'
import "./styles.css";
import Input from '../Input';
import Button from '../Button';
import { toast } from 'react-toastify';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from '../../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider } from 'firebase/auth/web-extension';

const SignupSignin = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const [loginForm,setLoginForm] = useState(false);
    const navigate = useNavigate();

    function SignupwithEmail(){
        setLoading(true);

        // Authenticate the user , or basically create a new account using email with password
        if(name!="" && email!="" && password!="" && confirmPassword!=""){
            if(password === confirmPassword){

                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                  // Signed in
                  const user = userCredential.user;
                  toast.success("User Created")
                  setLoading(false)
                  setName("")
                  setEmail("")
                  setConfirmPassword("")
                  createDoc(user);
                  toast.success("doc Created")
                  navigate("/dashboard")
                  // ...
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  toast.error(errorMessage)
                  setLoading(false)
                  // ..
                });    

            }
            else{
                toast.error("Password and Confirm Password don't match")
                setLoading(false)
            }
           
        }
        else{
            toast.error("All fields are mandatory")
            setLoading(false)

        }

    }

    function LoginusingEmail(){
        setLoading(true);
        if(email!="" && password!="" ){
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)
                toast.success("User Logged in")
                setLoading(false);
                navigate("/dashboard");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false);
                toast.error(errorMessage)
            });

        }
        else{
            toast.error("All fields are mandatory")
            setLoading(false);

        }
    

    }

    async function createDoc(user){
        setLoading(true);
        // Make sure that the doc doesnt matches with the existing UID
        // create a Doc
        if(!user) return;

        const userRef = doc(db,"users",user.uid);
        const userData = await getDoc(userRef)
        if(!userData.exists()){
            try{
                await setDoc(userRef, {
                    name:user.displayName ? user.displayName : name,
                    email:user.email,
                    photoURL: user.photoURL ? user.photoURL : "",
                    createdAt:new Date(),
                });
                toast.success("Doc created!");
                setLoading(false);
            }
            catch(e){
                toast.error(e.message);
                setLoading(false);
            }

        }
        else{
            toast.error("Doc already exists")
            setLoading(false);
        }
       
    }

    function googleAuth(){
        setLoading(true);
        try{
            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(user);
                createDoc(user)
                setLoading(false);
                navigate("/dashboard")
                toast.success("User Authenticated")
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                
            })

        }catch(error){
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage)
            setLoading(false);
        }
        
      
    }

  return (
    <>
    {loginForm ? ( 
        <div className='signup-wrapper'>
            <h2 className='title'>Loginon on <span style={{color: "var(--theme)"}}>Financely.</span></h2>
            <form>
                <Input label={"Email"} 
                    type = "email"
                    state ={email}
                    setstate={setEmail}
                    placeholder={"John Doe@gmail.com"}
                />
                <Input label={"Password"} 
                    type = "password"
                    state ={password}
                    setstate={setPassword}
                    placeholder={"Example@123"}
                />
               
                <Button
                    disabled = {loading}
                    text={loading? "Loading..." :"Login Using Email and Password"}
                    onClick={LoginusingEmail}
                />
                <p className='p-login' onClick={() => setLoginForm(!loginForm)}>or</p>
                <Button
                    onClick={googleAuth}    
                    text={loading? "Loading..." :"Login Using Google"}
                    blue={true}
                />
                <p className='p-login'
                style={{cursor:"pointer"}}
                onClick={() => setLoginForm(!loginForm)}>or don't have an Account already?Click Here</p>
            </form>
        </div>
    ): (
        <div className='signup-wrapper'>
            <h2 className='title'>Sign Up on <span style={{color: "var(--theme)"}}>Financely.</span></h2>
            <form>
                <Input label={"Full Name"} 
                    type = "text"
                    state ={name}
                    setstate={setName}
                    placeholder={"John Doe"}
                />
                <Input label={"Email"} 
                    type = "email"
                    state ={email}
                    setstate={setEmail}
                    placeholder={"John Doe@gmail.com"}
                />
                <Input label={"Password"} 
                    type = "password"
                    state ={password}
                    setstate={setPassword}
                    placeholder={"Example@123"}
                />
                <Input label={"Confirm Password"} 
                    type = "password"
                    state ={confirmPassword}
                    setstate={setConfirmPassword}
                    placeholder={"Example@123"}
                />
                <Button
                    disabled = {loading}
                    text={loading? "Loading..." :"Signup Using Email and Password"}
                    onClick={SignupwithEmail}
                />
                <p className = "p-login">or</p>
                <Button
                    onClick={googleAuth}  
                    text={loading? "Loading..." :"Signup Using Google"}
                    blue={true}
                />
                <p className = "p-login"
                 style={{cursor:"pointer"}}
                 onClick={() => setLoginForm(!loginForm)}>or have an Account already?Click Here</p>
            </form>
        </div>
    )}
      
    </>
  )
}

export default SignupSignin

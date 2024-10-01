// import React from 'react';
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// const provider = new GoogleAuthProvider();
// const auth = getAuth();

// export const loginWithGoogle = async () => {
//   try {
//     await signInWithPopup(auth, provider);
//   } catch (error) {
//     console.error("Error during Google Sign-In", error);
//   }
// };

// src/components/Auth.js
import React from 'react';
import { auth, provider } from '../Firebase'; // Import auth and provider
import { signInWithPopup } from 'firebase/auth';

const loginWithGoogle = () => {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            // Successfully signed in
            const user = result.user;
            console.log('User signed in:', user);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    return (
        <div>
            <h1>Login with Google</h1>
            <button onClick={handleLogin}>Sign in with Google</button>
        </div>
    );
};

export default loginWithGoogle;

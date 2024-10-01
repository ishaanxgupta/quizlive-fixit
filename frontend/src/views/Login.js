// import React from 'react';
// import loginWithGoogle from '../components/Auth';

// const Login = () => {
//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <button onClick={loginWithGoogle}>Login with Google</button>
//     </div>
//   );
// };

// export default Login;
// src/views/Login.js
import React from 'react';
import { auth, provider } from '../Firebase'; // Import Firebase auth and provider
import { signInWithPopup } from 'firebase/auth'; // Import signInWithPopup

const Login = () => {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            // Successfully signed in
            const user = result.user;
            console.log('User signed in:', user);
            // You can also redirect the user or update your application state here
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <button onClick={handleLogin}>Login with Google</button>
        </div>
    );
};

export default Login;


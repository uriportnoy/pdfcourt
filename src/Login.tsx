import React, { useState } from "react";
import { signInEmailAndPassword, createUserEmailAndPassword, signOut } from "./timeline/firebase";

export default function LoginForm ()  {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const userCredential = await signInEmailAndPassword(email, password);
            setUser(userCredential.user);
            setError("");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserEmailAndPassword(email, password);
            setUser(userCredential.user);
            setError("");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
            {user ? (
                <div>
                    <h3>Welcome, {user.email}</h3>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <h2>Login</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ display: "block", margin: "10px auto", padding: "8px" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ display: "block", margin: "10px auto", padding: "8px" }}
                    />
                    <button onClick={handleLogin} style={{ margin: "5px" }}>Login</button>
                    <button onClick={handleSignUp} style={{ margin: "5px" }}>Sign Up</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            )}
        </div>
    );
};


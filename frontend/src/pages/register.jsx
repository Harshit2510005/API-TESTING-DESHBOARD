import React, { useState } from 'react';
import { register as registerUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ email, password });
            alert("Registration Successful! Please log in.");
            navigate('/');
        } catch (err) {
            alert("Registration Failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] font-sans px-4">
            <div className="bg-[#1e293b] p-6 sm:p-8 rounded-xl border border-slate-700 shadow-xl w-full max-w-md text-white">
                <h2 className="text-3xl font-bold text-[#00d4ff] mb-6 text-center">Register</h2>
                <form onSubmit={handleRegister} className="space-y-5" autoComplete="off">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        autoComplete="off"
                        className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 outline-none focus:border-[#00d4ff] text-white"
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        autoComplete="new-password"
                        className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 outline-none focus:border-[#00d4ff] text-white"
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#00d4ff] text-slate-900 font-bold py-3 rounded-lg hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all"
                    >
                        Create Account
                    </button>
                </form>
                <p className="mt-6 text-center text-slate-400">
                    Already have an account? <Link to="/" className="text-[#00d4ff] hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};
export default Register;
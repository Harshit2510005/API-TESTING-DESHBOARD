import React, { useState, useEffect } from 'react';
import { login as loginUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Generate random CAPTCHA code on component mount
    useEffect(() => {
        generateCaptcha();
        // Clear form fields on component mount
        setEmail('');
        setPassword('');
        setCaptchaInput('');
    }, []);

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like I, O, 1, 0
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(code);
        setCaptchaInput('');
        setCaptchaVerified(false);
    };

    const verifyCaptcha = () => {
        if (captchaInput.toUpperCase() === captchaCode) {
            setCaptchaVerified(true);
        } else {
            alert("❌ CAPTCHA गलत है!");
            generateCaptcha();
            setCaptchaVerified(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!captchaVerified) {
            alert("⚠️ पहले CAPTCHA वेरिफाई करें!");
            return;
        }

        setLoading(true);
        try {
            const { data } = await loginUser({ email, password });
            localStorage.setItem('token', data.token);
            
            // Update parent component's token state
            if (setToken) {
                setToken(data.token);
            }
            
            // Clear form after successful login
            setEmail('');
            setPassword('');
            setCaptchaInput('');
            
            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err) {
            alert("❌ Login Failed: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0f172a] via-[#1a1f3a] to-[#0f172a] font-sans relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="relative z-10 bg-[#1e293b] p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md text-white">
                <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#0084d4] mb-2 text-center">Welcome Back</h2>
                <p className="text-center text-slate-400 mb-8 text-sm">API Testing Dashboard</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="text-xs text-slate-400 mb-2 block">📧 Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            autoComplete="off"
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 text-white transition"
                            value={email}
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="text-xs text-slate-400 mb-2 block">🔐 Password</label>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            autoComplete="new-password"
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 text-white transition"
                            value={password}
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* CAPTCHA Section */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700 rounded-xl p-6 space-y-4 mt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🛡️</span>
                                <label className="text-sm font-semibold text-slate-300">Verify CAPTCHA</label>
                            </div>
                            <button 
                                type="button"
                                onClick={generateCaptcha}
                                className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg transition font-medium"
                            >
                                🔄 New
                            </button>
                        </div>
                        
                        {/* Premium CAPTCHA Display */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur-xl group-hover:blur-2xl transition"></div>
                            <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-cyan-500/30 rounded-lg p-6 text-center overflow-hidden">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 212, 255, 0.1) 10px, rgba(0, 212, 255, 0.1) 20px)'
                                }}></div>
                                
                                {/* CAPTCHA Text with Styling */}
                                <div className="font-sans text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 tracking-[0.2em] sm:tracking-[0.35em] select-none relative z-10 drop-shadow-lg"
                                    style={{
                                        textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
                                        fontFamily: 'monospace',
                                    }}>
                                    {captchaCode}
                                </div>
                            </div>
                        </div>

                        {/* Input Section */}
                        <div className="space-y-3">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Enter 6 characters" 
                                    className="w-full bg-slate-800 border-2 border-slate-600 focus:border-cyan-500 rounded-lg p-3 outline-none text-center uppercase font-bold text-lg tracking-widest transition focus:ring-2 focus:ring-cyan-500/20"
                                    value={captchaInput}
                                    onChange={e => setCaptchaInput(e.target.value)} 
                                    maxLength="6"
                                />
                            </div>

                            {/* Verify Button */}
                            <button 
                                type="button"
                                onClick={verifyCaptcha}
                                className={`w-full py-2 rounded-lg font-bold transition-all ${
                                    captchaVerified 
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default' 
                                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
                                }`}
                            >
                                {captchaVerified ? '✅ Verified' : '🔍 Verify'}
                            </button>
                        </div>

                        {/* Verification Status */}
                        {captchaVerified && (
                            <div className="text-center text-green-400 text-sm font-medium animate-pulse">
                                ✓ CAPTCHA verified successfully!
                            </div>
                        )}
                    </div>

                    {/* Login Button */}
                    <button 
                        type="submit"
                        disabled={loading || !captchaVerified}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-6"
                    >
                        {loading ? '⏳ Logging in...' : '🚀 Login'}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">Register here</Link>
                </p>

                <div className="mt-4 text-center text-xs text-slate-500">
                    🔒 Secured with CAPTCHA verification
                </div>
            </div>
        </div>
    );
};
export default Login;
import { useState } from "react";  

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        // Add login logic here
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Login</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow">
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                    </form>
                    
                </div>
            </div>
        </div>
    );
}

export default Login;
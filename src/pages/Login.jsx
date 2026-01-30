import { useState } from "react";  
import axios from "axios";

function Login() {
    const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (formData.email.length === 0) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (formData.password.length === 0) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
        const body = {
            email: formData.email,
            password: formData.password
        };
        const config = { withCredentials: true };
        try {
            const response = await axios.post("http://localhost:5003/auth/login", body, config);
            console.log(response);
            setMessage("Login successful!");
        } catch (error) {
            console.error("Login failed:", error);
            setErrors({ form: "Login failed. Please check your credentials." });
            setMessage("");
        }
    }
  };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-4">Login to Continue</h3>
                            {message && <div className="alert alert-success">{message}</div>}
                            {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <small className="text-danger d-block mt-1">{errors.email}</small>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <small className="text-danger d-block mt-1">{errors.password}</small>}
                                </div>

                                <button type="submit" className="btn btn-primary w-100 mb-3">
                                    Login
                                </button>
                            </form>

                            <div className="text-center">
                                <a href="#" className="text-decoration-none me-3">Forgot Password?</a>
                                <a href="#" className="text-decoration-none">Sign Up</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;


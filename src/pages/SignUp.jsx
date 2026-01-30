import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp({ setUser }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
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
        if (formData.name.length === 0) {
            newErrors.name = "Name is required";
            isValid = false;
        }
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
                username: formData.name,
                email: formData.email,
                password: formData.password
            };
            const config = { withCredentials: true };
            try {
                const response = await axios.post("http://localhost:5003/auth/register", body, config);
                console.log(response.data);
                setMessage("Registration successful! Redirecting to dashboard...");
                setUser(response.data.user);
                setErrors({});
                navigate("/dashboard");
            } catch (error) {
                console.error("Registration failed:", error);
                setErrors({ form: "Registration failed. Please try again." });
                setMessage("");
            }
        }
    };
    return (
        <div className="container mt-5">
            <h2>Sign Up</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {errors.form && <div className="alert alert-danger">{errors.form}</div>}
            <form onSubmit={handleFormSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="name" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
    

}

export default SignUp;
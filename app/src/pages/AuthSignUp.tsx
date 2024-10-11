import { Link } from "react-router-dom";
import "../styles/backend.css?v=1.0.0"
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";


interface IRegisterForm {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }

const AuthSignUp = () => {
    const [formData, setFormData] = useState<IRegisterForm>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
      });
      
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/registration', formData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            window.location.href = '/';
        } catch (error) {
            console.error('Registration failed:', error);
        }
        };

    return (
        <div className="wrapper">
            <section className="login-content">
                <div className="container h-100">
                    <div className="row justify-content-center align-items-center height-self-center">
                    <div className="col-md-5 col-sm-12 col-12 align-self-center">
                        <div className="sign-user_card">
                            <h3 className="mb-3">Регистрация</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                <div className="col-lg-6">
                                    <div className="floating-label form-group">
                                        <input className="floating-input form-control" name="first_name" value={formData.first_name} type="text" placeholder=" " onChange={handleChange}/>
                                        <label>Full Name</label>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="floating-label form-group">
                                        <input className="floating-input form-control" name="last_name" value={formData.last_name} type="text" placeholder=" " onChange={handleChange}/>
                                        <label>Last Name</label>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="floating-label form-group">
                                        <input className="floating-input form-control" name="email" value={formData.email} type="email" placeholder=" " onChange={handleChange}/>
                                        <label>Email</label>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="floating-label form-group">
                                        <input className="floating-input form-control"  name="password" value={formData.password} type="password" placeholder=" " onChange={handleChange}/>
                                        <label>Password</label>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="floating-label form-group">
                                        <input className="floating-input form-control" type="password" placeholder=" "/>
                                        <label>Confirm Password</label>
                                    </div>
                                </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
                            </form>
                            <Link to={"/login"}>Уже есть аккаунт? Войти</Link>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
        </div>
    )

};

export default AuthSignUp;
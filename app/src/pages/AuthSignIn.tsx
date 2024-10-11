import { Link } from "react-router-dom";
import "../styles/backend.css?v=1.0.0"
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";


const AuthSignIn = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://127.0.0.1:8000/authorization', { email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        window.location.href = '/'; 
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

    return (
        <div className="wrapper">
            <section className="login-content">
                <div className="container h-100">
                    <div className="row justify-content-center align-items-center height-self-center">
                    <div className="col-md-5 col-sm-12 col-12 align-self-center">
                        <div className="sign-user_card">
                            <h3 className="mb-3">Авторизация</h3>
                            <form  onSubmit={handleSubmit}>
                                <div className="row">
                                <div className="col-lg-12">
                                    <div className="floating-label form-group">
                                        <input className="floating-input form-control" value={email} type="email" placeholder=" " required  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
                                        <label>Email</label>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="floating-label form-group">
                                        <input className="floating-input form-control" value={password} type="password" placeholder=" " required  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
                                        <label>Password</label>
                                    </div>
                                </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Войти</button>
                            </form>
                            <Link to={"/register"}>Нет аккаунта? Зарегистрироваться</Link>

                        </div>
                    </div>
                    </div>
                </div>
            </section>
        </div>
    )

};

export default AuthSignIn;
import React, { useState } from "react";
import './css/signup.css'
import GoogleIcon from './assets/img/google.png';
import FacebookIcon from "./assets/img/facebook.png";

const Signup = () => {

    //check if url is login page or not
    const currentURL = window.location.href;
    const isLogin = currentURL.includes("login");

    //react state for form input values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        pass: ''
    })

    //handle change when there is an input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevVal) => { return ({ ...prevVal, [name]: value }) })
    }

    const handleForm = (event) => {
        event.preventDefault();
        console.log("i have been clicked");
        const url = isLogin ? 'login' : 'signup';
        const postURL = 'http://localhost:3000/api/' + url;
        // fetch(url,)
        fetch(postURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }


    return (<>
        <div className="container">
            {/* side img */}
            <div className="overlay">
                <div className="img">
                </div>
                <div className="form">
                    {/* top part of form with name email and password */}
                    <div className="form-top">
                        <form onSubmit={handleForm}>
                            <div className="nested-form">
                                {/* to show login and ignore name when on login page */}
                                {isLogin ? <h2>Login into Account</h2> : <>
                                    <h2>Create an Account</h2>
                                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                                </>}

                                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                                <input type="password" name="pass" placeholder="Password" value={formData.pass} onChange={handleChange} required />
                                <button className="btns" type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>

                                {isLogin ? <>
                                    <p className="login-text">Don't have an account? <a href="/">Signup</a></p></>
                                    :
                                    <><p className="login-text">Already have an account? <a href="/login">Login</a></p>
                                    </>
                                }
                            </div>
                        </form>
                    </div>
                    <h4>Continue with</h4>
                    {/* top part of form to signup with google and facebook */}
                    <div className="form-bottom">
                        <button className="google">
                            <img src={GoogleIcon} className="img-icon btns" alt='' />
                        </button>
                        <p>- or -</p>
                        <button className="facebook">
                            <img src={FacebookIcon} className="img-icon btns" alt="" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </>)
}

export default Signup;
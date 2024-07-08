import React, { Component } from 'react'

import app from "./firbase_config";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
const auth = getAuth(app);

export default class SignUp extends Component {

  constructor(props){
    super(props)
    this.state={
      fname:"",
      lname:"",
      mobile:"",
      email:"",
      password:"",
      verifyButton: false,
      verifyOtp: false,
      otp: "",

      verified: false,

    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSignInSubmit = this.onSignInSubmit.bind(this);
    this.verifyCode = this.verifyCode.bind(this);
  }

  onCaptchVerify(){
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          this.onSignInSubmit();

        },
        // "expired-callback": () => {

        // },
      },
      auth
    );
  }

  onSignInSubmit(){
    this.onCaptchVerify();
    const phoneNumber = "+91" + this.state.mobile;
    console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      alert("Otp sent");
      this.setState( { verifyOtp: true});
    })
    .catch((error) => {
      //alert("Incorrect Otp");
    });
  }

  verifyCode(){
    window.confirmationResult
    .confirm(this.state.otp)
    .then((result) => {
      const user = result.user;
      console.log(user);
      alert("Verification done");
      this.setState({
        verified: true,
        verifyOtp: false,
      });
    })
    .catch((error) => {
      alert("Invalid otp");
    });
  }

  changeMobile(e){
    this.setState({ mobile: e.target.value }, function(){
      if( this.state.mobile.length === 10){
        this.setState({
          verifyButton: true,
        });
      }
    }); 
  }

  handleSubmit(e){
    e.preventDefault();

    if( this.state.verified){
      const { fname, lname, mobile, email, password } = this.state;
      console.log( fname, lname, mobile, email, password);

      fetch("http://localhost:5000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          fname,
          lname,
          mobile,
          email,
          password,
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
      });
      alert("Now you can Sign In");
      window.location.href = "/sign-in";
    }
    else{
      alert("Please verify your phone");
    }
    
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign Up</h3>

        <div id="recaptcha-container"></div>

        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            onChange={e=>this.setState({ fname:e.target.value })}
            />
        </div>

        
        <div className="mb-3">
          <label>Last name</label>
          <input type="text" className="form-control" placeholder="Last name"
            onChange={e=>this.setState({ lname:e.target.value })} 
            />
        </div>

        <div className="mb-3">
          <label>Mobile Number</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter phone"
            onChange={(e)=> this.changeMobile(e)}
            />
            {this.state.verifyButton ? 
              <input
                type="button"
                value={ this.state.verified ? "Verified" : "Verify" }
                //value="Verify"
                onClick={this.onSignInSubmit}
                style={{
                  backgroundColor: "#0163d2",
                  width: "100%",
                  padding: 8,
                  color: "white",
                  border: "none",
                }}
              /> 
              : null
            }
        </div>
        
        { this.state.verifyOtp ? 
          <div className="mb-3">
            <label>OTP</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter OTP"
              onChange={e=>this.setState({ otp: e.target.value })}
              />
              <input
                type="button"
                value="OTP"
                onClick={this.verifyCode}
                style={{
                  backgroundColor: "#0163d2",
                  width: "100%",
                  padding: 8,
                  color: "white",
                  border: "none",
                }}
              />
          </div>
          : null 
        }
        
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={e=>this.setState({ email:e.target.value })}
            />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={e=>this.setState({ password:e.target.value })}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered : <a href="/sign-in">Sign In</a>
        </p>
      </form>
    )
  }
}

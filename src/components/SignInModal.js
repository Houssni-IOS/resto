import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';


function SignInModal(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setError] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password}),
      });

      if (response.ok) {
        const data = await response.json();
        setLoggedIn(true); // Set the logged-in state to true
        setUserRole(data.role); // Set the user role received from the response
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Email or password invalid',
        });
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  if (isLoggedIn) {
    // Redirect the user to the appropriate page based on the role
    if (userRole === 'user') {
      return <Navigate to="/user-page" />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin-page" />;
    }
  }

  return (
    <div className={`modal ${props.showModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sign In To Eat Map</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => props.setShowModal(false)}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={handleEmailChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input className="form-control" placeholder="Password" type="password" id="password" value={password} onChange={handlePasswordChange} required />
              </div>
              {props.isOwner && (
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="owner" value={props.isOwner} onChange={() => { }} checked={props.isOwner} />
                  <label className="form-check-label" htmlFor="owner">I am an owner</label>
                </div>
              )}
              <button type="submit" className="btn btn-primary">Sign In</button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}

export default SignInModal;

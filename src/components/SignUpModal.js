import React, { useState } from 'react';
import Swal from 'sweetalert2';

function SignUpModal({ showModal, setShowModal }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // show SweetAlert modal on successful signup
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'You have successfully signed up',
        showConfirmButton: false,
        timer: 1500
      })
      // Clear the form data
      setFormData({ name: '', email: '', password: '' });
      // Close the modal
      handleClose();
    })
    .catch(error => {
      console.error(error);
      // show SweetAlert modal on error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      });
    });
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className={`modal${showModal ? ' d-block' : ' d-none'}`} id="signUpModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-center">
            <h5 className="modal-title mx-auto" id="exampleModalLabel"><b>Sign Up To Eat Map</b></h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group mt-4">
                <input type="text" className="form-control" id="name" name="name" placeholder='Name' value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group mt-4">
                <input type="text" className="form-control" id="email" name="email" placeholder='Email' value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="form-group mt-4">
                <input type="password" className="form-control" id="password" name="password" placeholder='Password' value={formData.password} onChange={handleInputChange} />
              </div>
            </form>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button type="button" className="btn btn-primary border-0" style={{ backgroundColor: '#063E25' }} onClick={handleSubmit}><b>Sign Up</b></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpModal;

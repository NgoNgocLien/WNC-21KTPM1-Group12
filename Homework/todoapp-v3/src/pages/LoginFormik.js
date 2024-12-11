import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';


const loginSchema = Yup.object().shape({
  // only 0-9, a-z, A-Z, and _ are allowed
  username: Yup.string().matches(/^[0-9a-zA-Z_]+$/, 'Only 0-9, a-z, A-Z, and _ are allowed').required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    alert("Login form submitted");
    // API call to authenticate and get access token
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      const { accessToken } = data;

      if (accessToken) {
        localStorage.setItem('token', accessToken);
        navigate('/');
      } else {
        setErrorMessage('Username or password is wrong');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('System error');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="w-25 card p-4">
        <h2 className="text-center">Login</h2>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={(values, actions) => {
            handleLogin(values);
          }}
        >
          <Form className='d-flex flex-column'>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <Field
                type="text"
                className="form-control"
                name="username"
              />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <Field
                type="password"
                className="form-control"
                name="password"
              />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary w-100" >
              Login
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;

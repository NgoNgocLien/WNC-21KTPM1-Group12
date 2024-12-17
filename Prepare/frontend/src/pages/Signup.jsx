import { Formik } from 'formik';
import { useUserStore } from '../stores/useUserStore';
import { Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const signupSchema = Yup.object().shape({
  // only 0-9, a-z, A-Z, and _ are allowed
  username: Yup.string().matches(/^[0-9a-zA-Z_]+$/, 'Only 0-9, a-z, A-Z, and _ are allowed').required('Username is required'),
  password: Yup.string().required('Password is required'),
});

export default function Signup() {

  const user = useUserStore((state) => state.user);
  const signup = useUserStore((state) => state.signup);
  const loading = useUserStore((state) => state.loading);

  return (
    <main className="container">
      <div className="d-flex justify-content-center align-items-center vh-100">
        {loading ?
          <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div> :
          <div className="card p-5 shadow rounded-3 bg-light w-30">
            <h2 className="text-center">Sign up</h2>
            <Formik
              initialValues={{ username: user.username, password: user.password }}
              validationSchema={signupSchema}
              onSubmit={(values) => {
                signup(values);
              }}
            >
              <Form className="col">
                <div class="row mt-3 ">
                  <label for="username" class="form-label">Username</label>
                  <Field type="username" class="form-control" name="username" id="username" placeholder="Enter your username" />
                </div>
                <ErrorMessage name="username" component="div" className="text-danger" />
                <div class="row mt-3">
                  <label for="password" class="form-label">Password</label>
                  <Field type="password" class="form-control" name="password" id="password" placeholder="Enter your password" />
                </div>
                <ErrorMessage name="password" component="div" className="text-danger" />
                <div class="row mt-5">
                  <button type="submit" class="btn btn-primary">Sign up</button>
                </div>
              </Form>
            </Formik>
          </div>
        }
      </div>
    </main>
  )
}

import { useParams } from "react-router-dom";

import { Formik } from "formik";
import { Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
})

export default function Login() {
  const { role } = useParams()

  return (
    <div className="h-screen bg-red-50">
      <div className="fixed w-96 h-screen px-2 py-2">
        <img src="../login-banner.jpg" alt="Banner" className="w-full h-full rounded-xl border-2 border-white object-cover object-left" />
      </div>
      <div className="flex flex-col justify-center ms-96 h-full">
        <div className="mx-auto w-full max-w-sm">
          <h2 className="text-start text-3xl/9 font-bold text-gray-900">
            Đăng nhập
          </h2>
          <p className="mt-2 mb-12 text-start text-lg/6 text-gray-900">
            Tài khoản khách hàng
          </p>
          <Formik
            initialValues={{ username: 0, password: 0 }}
            validationSchema={loginSchema}
            onSubmit={(values) => {
              console.log(values)
            }}
          >
            <Form className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-lg/6 font-medium text-gray-900">
                  Tên đăng nhập
                </label>
                <div className="mt-2">
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="Nhập tên đăng nhập"
                    className="block w-full rounded-xl bg-white px-3 py-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-red-800 text-md/6"
                  />
                </div>
                <ErrorMessage name="username" component="div" className="text-red-800" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-lg/6 font-medium text-gray-900">
                    Mật khẩu
                  </label>
                  <div className="text-md">
                    <a href="/" className="font-semibold text-red-800 hover:text-red-700">
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu"
                    className="block w-full rounded-xl bg-white px-3 py-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-red-800 text-md/6"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-800" />
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-xl bg-red-800 px-3 py-3 text-lg/6 font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
                >
                  Đăng nhập
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  )
}

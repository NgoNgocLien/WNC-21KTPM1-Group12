import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid h-screen place-items-center px-6 py-24">
      <div className="text-center">
        <p className="text-2xl font-semibold text-red-800">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900">
          Không tìm thấy trang
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Xin lỗi, chúng tôi không thể tìm thấy trang mà bạn đang tìm kiếm.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <NavLink
            to="/"
            className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900"
          >
            Quay về trang chủ
          </NavLink>
          <NavLink
            to="/"
            className="relative px-4 py-2 bg-white text-red-800 rounded-lg hover:bg-red-800 hover:text-white"
          >
            Liên hệ hỗ trợ <span aria-hidden="true">&rarr;</span>
            <span className="absolute inset-0 rounded-lg border-2 border-red-800 pointer-events-none"></span>
          </NavLink>
        </div>
      </div>
    </main>
  );
}

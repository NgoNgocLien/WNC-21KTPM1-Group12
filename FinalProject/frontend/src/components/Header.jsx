import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  BriefcaseIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export default function Header() {

  return (
    <header className="w-screen fixed bg-red-800 text-white font-semibold">
      <nav className="flex items-center max-w-6xl justify-between mx-auto py-4 px-4" >
        <div className="flex items-center justify-start gap-2 cursor-default">
          <image src="https://via.placeholder.com/150" alt="Logo" className="w-8 h-8 rounded-full border-2 border-white" />
          <h1 className="text-xl italic">NoMeoBank</h1>
        </div>

        <PopoverGroup className="flex gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-md font-semibold text-white hover:text-gray-100">
              Đăng nhập
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute -right-8 top-full z-10 mt-3 w-screen max-w-60 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="group gap-x-2 relative flex items-center rounded-md p-2 text-sm/6 hover:bg-gray-100">
                <div className="flex size-11 flex-none items-center justify-center rounded-2xl bg-gray-100 group-hover:bg-white">
                  <UserGroupIcon className="size-6 text-gray-900 group-hover:text-red-800" />
                </div>
                <Link to="/login" className="flex-auto block font-semibold text-gray-900">
                  Tài khoản khách hàng
                </Link>
              </div>
              <div className="group gap-x-2 relative flex items-center rounded-md p-2 text-sm/6 hover:bg-gray-100">
                <div className="flex size-11 flex-none items-center justify-center rounded-2xl bg-gray-100 group-hover:bg-white">
                  <BriefcaseIcon className="size-6 text-gray-900 group-hover:text-red-800" />
                </div>
                <Link to="/login" className="flex-auto block font-semibold text-gray-900">
                  Tài khoản nhân viên
                </Link>
              </div><div className="group gap-x-2 relative flex items-center rounded-md p-2 text-sm/6 hover:bg-gray-100">
                <div className="flex size-11 flex-none items-center justify-center rounded-2xl bg-gray-100 group-hover:bg-white">
                  <BuildingLibraryIcon className="size-6 text-gray-900 group-hover:text-red-800" />
                </div>
                <Link to="/login" className="flex-auto block font-semibold text-gray-900">
                  Tài khoản quản trị viên
                </Link>
              </div>
            </PopoverPanel>
          </Popover>


        </PopoverGroup>


      </nav>

    </header>
  )
}

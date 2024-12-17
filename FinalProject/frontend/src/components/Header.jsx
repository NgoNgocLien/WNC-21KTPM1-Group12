'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'

const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

// test
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <img
              alt=""
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            />
          </a>
        </div>
        <PopoverGroup className="justify-end">
          <Popover className="relative">
            <PopoverButton className="flex items-end text-lg font-semibold text-gray-900 rounded-full bg-red-400 border-none px-3 py-1 hover:border-none focus:border-none">
              Login
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute -right-8 top-full z-10 mt-3 w-max overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div
                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-base hover:bg-gray-50"
              >
                <div className="flex-auto">
                  <a href="/" className="block font-semibold text-gray-900">
                    Login as customer
                  </a>
                </div>
              </div>
              <div
                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-base hover:bg-gray-50"
              >
                <div className="flex-auto">
                  <a href="/" className="block font-semibold text-gray-900">
                    Login as employee
                  </a>
                </div>
              </div>
              <div
                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-base hover:bg-gray-50"
              >
                <div className="flex-auto">
                  <a href="/" className="block font-semibold text-gray-900">
                    Login as admin
                  </a>
                </div>
              </div>
            </PopoverPanel>
          </Popover>
        </PopoverGroup>
      </nav>

    </header>
  )
}

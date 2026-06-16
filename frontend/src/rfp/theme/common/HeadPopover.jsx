import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import React, { Fragment } from "react";
import {
  HiCubeTransparent,
  HiMiniRectangleStack,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineSwatch,
} from "react-icons/hi2";

const solutions = [
  {
    name: "Insights",
    description: "Measure actions your users take",
    href: "##",
    icon: <HiOutlineChatBubbleLeftEllipsis fontSize={22} />,
  },
  {
    name: "Automations",
    description: "Create your own targeted content",
    href: "##",
    icon: <HiOutlineChatBubbleLeftEllipsis fontSize={22} />,
  },
  {
    name: "Reports",
    description: "Keep track of your growth",
    href: "##",
    icon: <HiOutlineChatBubbleLeftEllipsis fontSize={22} />,
  },
];

export default function HeadPopover() {
  return (
    <Popover className="relative">
      <PopoverButton className="flex p-1.5 rounded-md  items-center hover:text-opacity-100  focus:outline-none active:bg-zinc-300">
        <HiOutlineSwatch fontSize={18} />
      </PopoverButton>
      {/* <PopoverPanel anchor="bottom" className="flex flex-col bg-white/75">
        <a href="/analytics">Analytics</a>
        <a href="/engagement">Engagement</a>
        <a href="/security">Security</a>
        <a href="/integrations">Integrations</a>
      </PopoverPanel> */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute -left-80 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
            <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
              {solutions.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-purple sm:h-12 sm:w-12">
                    {item.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="bg-gray-50 p-4">
              <a
                href="##"
                className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
              >
                <span className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    Documentation
                  </span>
                </span>
                <span className="block text-sm text-gray-500">
                  Start integrating products and tools
                </span>
              </a>
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}

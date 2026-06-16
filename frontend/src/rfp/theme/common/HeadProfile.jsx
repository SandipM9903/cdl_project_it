import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React from "react";
import {
  HiMiniPencilSquare,
  HiOutlineArchiveBoxArrowDown,
  HiOutlineArrowRightOnRectangle,
  HiOutlineDocumentDuplicate,
  HiOutlineTrash,
  HiOutlineUserCircle,
  HiPaperAirplane,
} from "react-icons/hi2";

export default function HeadProfile() {
  return (
    <div>
      <Menu>
        <MenuButton className="flex p-1.5 rounded-md  items-center hover:text-opacity-100  focus:outline-none active:bg-zinc-300">
          <span className="sr-only">user</span>

          <div
            className="h-7 w-7 rounded-full bg-sky-588 bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage:
                'url("data:image/jpeg;base64,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")',
            }}
          >
            <span className="sr-only">Messy</span>
          </div>
          {/* <HiOutlineUserCircle fontSize={18} /> */}
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right   shadow-lg ring-1 ring-black/5 rounded-xl border border-white/5 bg-gray-50 p-1 text-sm/6 text-gray-800 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <button className="group flex w-full items-center gap-1 rounded-lg py-1.5 px-3   data-[focus]:bg-violet-500 data-[focus]:text-white/75 ">
              <HiMiniPencilSquare
                className="mr-1  text-violet-400"
                fontSize={16}
              />
              My Profile
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘E
              </kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-1 rounded-lg py-1.5 px-3 data-[focus]:bg-violet-500 data-[focus]:text-white/75 ">
              <HiOutlineDocumentDuplicate
                className="mr-1  text-violet-400"
                fontSize={16}
              />
              Preferences
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘D
              </kbd>
            </button>
          </MenuItem>
          <div className="my-1 h-px bg-gray-100" />
          <MenuItem>
            <button className="group flex w-full items-center gap-1 rounded-lg py-1.5 px-3 data-[focus]:bg-violet-500 data-[focus]:text-white/75 ">
              <HiOutlineArchiveBoxArrowDown
                className="mr-1  text-violet-400"
                fontSize={16}
              />
              Settings
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘A
              </kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-1 rounded-lg py-1.5 px-3 data-[focus]:bg-violet-500 data-[focus]:text-white/75 ">
              <HiPaperAirplane
                className="mr-1  text-violet-400"
                fontSize={16}
              />
              Change Password
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘A
              </kbd>
            </button>
          </MenuItem>
          <div className="my-1 h-px bg-gray-100" />
          <MenuItem>
            <button className="group flex w-full items-center gap-1 rounded-lg py-1.5 px-3 data-[focus]:bg-violet-500 data-[focus]:text-white/75 ">
              <HiOutlineArrowRightOnRectangle
                className="mr-1  text-violet-400"
                fontSize={16}
              />
              Logout
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘D
              </kbd>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}

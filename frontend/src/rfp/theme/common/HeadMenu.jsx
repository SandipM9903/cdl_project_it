import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React from "react";
import {
  HiMiniPencilSquare,
  HiMiniViewColumns,
  HiMiniWallet,
  HiOutlineArchiveBoxArrowDown,
  HiOutlineDocumentDuplicate,
  HiOutlineTrash,
  HiOutlineWallet,
  HiPaperAirplane,
} from "react-icons/hi2";

export default function HeadMenu() {
  return (
    <Menu>
      <MenuButton className="flex p-1.5 rounded-md  items-center hover:text-opacity-100  focus:outline-none active:bg-zinc-300">
        <HiOutlineWallet fontSize="18" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm/6 text-gray-800 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <button className="group flex w-full items-center gap-1 rounded-lg py-1.5 px-3   data-[focus]:bg-violet-500 data-[focus]:text-white/75 ">
            <HiMiniPencilSquare
              className="mr-1  text-violet-400"
              fontSize={16}
            />
            Edit
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
            Duplicate
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
            Archive
            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
              ⌘A
            </kbd>
          </button>
        </MenuItem>
        <MenuItem>
          <button className="group flex w-full items-center gap-1 rounded-lg py-1.5 px-3 data-[focus]:bg-violet-500 data-[focus]:text-white/75 ">
            <HiPaperAirplane className="mr-1  text-violet-400" fontSize={16} />
            Move
            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
              ⌘A
            </kbd>
          </button>
        </MenuItem>
        <div className="my-1 h-px bg-gray-100" />
        <MenuItem>
          <button className="group flex w-full items-center gap-1 rounded-lg py-1.5 px-3 data-[focus]:bg-violet-500 data-[focus]:text-white/75 ">
            <HiOutlineTrash className="mr-1  text-violet-400" fontSize={16} />
            Delete
            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
              ⌘D
            </kbd>
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

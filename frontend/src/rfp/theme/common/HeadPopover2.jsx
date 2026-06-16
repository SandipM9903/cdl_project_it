import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import React from "react";
import { HiOutlineTicket } from "react-icons/hi2";

export default function HeadPopover2() {
  return (
    <Popover>
      <PopoverButton className="block text-sm/6 font-semibold text-purple/50 focus:outline-none data-[active]:text-purple data-[hover]:text-purple data-[focus]:outline-1 data-[focus]:outline-white">
        <HiOutlineTicket fontSize="18" />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom"
        className="divide-y divide-gray/5 rounded-xl bg-sky-50 shadow-lg ring-1 ring-black/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
      >
        <div className="p-3">
          <a
            className="block rounded-lg py-2 px-3 transition hover:bg-black/5"
            href="#"
          >
            <p className="font-semibold text-purple">Insights</p>
            <p className="text-purple/50">Measure actions your users take</p>
          </a>
          <a
            className="block rounded-lg py-2 px-3 transition hover:bg-black/5"
            href="#"
          >
            <p className="font-semibold text-purple">Automations</p>
            <p className="text-purple/50">Create your own targeted content</p>
          </a>
          <a
            className="block rounded-lg py-2 px-3 transition hover:bg-black/5"
            href="#"
          >
            <p className="font-semibold text-purple">Reports</p>
            <p className="text-purple/50">Keep track of your growth</p>
          </a>
        </div>
        <div className="p-3">
          <a
            className="block rounded-lg py-2 px-3 transition hover:bg-black/5"
            href="#"
          >
            <p className="font-semibold text-purple">Documentation</p>
            <p className="text-purple/50">
              Start integrating products and tools
            </p>
          </a>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

import { Link, useLocation } from "react-router-dom";

import {
  
 
  
  HiOutlineUsers,
} from "react-icons/hi2";
import classNames from "classnames";

const linkClasses =
  "flex items-center text-sm gap-2 px-3 py-2 rounded-lg hover:bg-zinc-200 hover:no-underline active:bg-zinc-300 ";

function _link(item) {
  const { pathname } = useLocation();
  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path ? "text-sky-500 bg-sky-50" : "",
        linkClasses
      )}
    >
      <span className="text-lg">{item.icon}</span>
      {item.label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <div className=" flex flex-col w-80 pt-0 pr-1 pb-2  pl-2 border-r bg-white/75 ">
      
      <div className="flex-1 py-1 flex flex-col gap-0.5">
        

        
        {_link({
          label: "pTrace",
          path: "/app/RFP",
          icon: <HiOutlineUsers />,
        })}
        
      </div>



      
    </div>
  );
}

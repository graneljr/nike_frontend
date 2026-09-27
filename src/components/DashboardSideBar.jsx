import { faHouse, faUser } from "@fortawesome/free-regular-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

const DashbaordSideBar = ({ userData }) => {
  const linkClass = ({ isActive }) =>
    `transition-all ease-in-out duration-400  py-3 px-3 flex items-center gap-5  font-semibold rounded-md ${
      isActive ?   "bg-black text-white":"text-black bg-white hover:bg-black hover:text-white"
    }`;
  const userNav = [
      {
      icon: faHouse,
      label: "Dashboard",
      url: "/dashboard",
    },
    {
      icon: faUser,
      label: "Profile",
      url: "/profile",
    },
    {
      icon: faCartShopping,
      label: "Orders",
      url: "/orders",
    },
  ];
  const filterNav = userData?.role === "user" ? userNav : "" || [];
  return (
    <div className="flex flex-col gap-6 w-[17%] h-screen bg-zinc-50 p-4">
      <div className="w-full flex gap-2">
        <span className=" flex w-[50px] h-[50px] items-center justify-center rounded-md bg-black">
          <h1 className="text-4xl text-white font-bold ">
            {userData?.fullName.charAt(0)}
          </h1>
        </span>
        <div className="flex-1 flex flex-col justify-between">
          <h1 className="font-bold ">{userData?.fullName}</h1>
          <p className="text-gray-400 text-sm">{userData?.email}</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        {filterNav?.map((nav) => {
        const Icon = nav.icon
        return(
            (
          <NavLink to={nav.url} className={linkClass}>
            <FontAwesomeIcon icon={Icon}/>
            {nav.label}
          </NavLink>
        )
        )
        }
        )}
      </div>
    </div>
  );
};

export default DashbaordSideBar;

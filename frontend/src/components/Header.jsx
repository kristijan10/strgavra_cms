import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/authContext.js";

const MenuItem = ({ item, closeMenu }) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const { logout } = useAuth();

  const actionMap = {
    logout,
  };

  const handleClick = () => {
    if (item.action && actionMap[item.action]) actionMap[item.action]();
    closeMenu(); // Zatvori meni u svakom slučaju
  };

  return (
    <li className="pt-2.5">
      {item.type === "link" && (
        <Link
          to={item.link}
          onClick={handleClick}
          className="hover:text-gray-200"
        >
          {item.title}
        </Link>
      )}
      {item.type === "button" && (
        <button
          onClick={handleClick}
          className="hover:text-gray-200 cursor-pointer"
        >
          {item.title}
        </button>
      )}
      {item.type === "submenu" && (
        <div
          className="cursor-pointer hover:text-gray-200"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <span>{item.title}</span>
          {item.subMenu && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-4 inline ml-2 transition-transform ${
                subMenuOpen ? "rotate-180" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          )}
        </div>
      )}
      {item.subMenu && (
        <ul
          className={`pl-4 hover:text-gray-50 ${
            subMenuOpen ? "block" : "hidden"
          }`}
        >
          {item.subMenu.map((subItem, index) => (
            <li key={index} className="pt-2.5">
              <Link
                to={subItem.link}
                onClick={handleClick}
                className="hover:text-gray-200"
              >
                {subItem.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Header = ({ menuItems }) => {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    if (window.innerWidth < 765) setOpen(false);
  };

  return (
    <header>
      {/* Hamburger meni */}
      <div className="relative bg-blue-600 flex items-center p-4 md:hidden">
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-10 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        {/* Overlay za uvlacenje hamburger menija */}
        <div
          className={`fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-40 md:hidden ${
            open ? "visible" : "hidden"
          }`}
          onClick={() => setOpen(!open)}
        ></div>
      </div>

      <nav
        className={`fixed bg-blue-500 text-white w-64 p-4 pr-0 transition-all duration-300 z-50 top-0 h-screen
          md:static md:h-full
          ${open ? "left-0" : "-left-64"}`}
      >
        <ul>
          {menuItems.map((item, i) => (
            <MenuItem item={item} key={i} closeMenu={closeMenu} />
          ))}
        </ul>
      </nav>
    </header>
  );
};
export default Header;

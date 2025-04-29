import { createElement } from "react";
import { Outlet, Route, Routes } from "react-router";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SubDashboard from "./pages/SubDashboard";
import Analytics from "./pages/Analytics";
import Profil from "./pages/Profil";
import Navigacija from "./pages/Navigacija";
import Ponuda from "./pages/Ponuda";

const componentMap = {
  Dashboard,
  SubDashboard,
  Analytics,
  Profil,
  Navigacija,
  Ponuda,
};

const routes = [
  {
    title: "Dashboard",
    type: "link",
    link: "/",
  },
  {
    title: "Navigacija",
    type: "link",
    link: "/navigacija",
  },
  // {
  //   title: "Reports",
  //   type: "submenu",
  //   subMenu: [
  //     {
  //       title: "Sub-Dashboard",
  //       type: "link",
  //       link: "/sub-dashboard",
  //     },
  //     { title: "Analytics", type: "link", link: "/analytics" },
  //   ],
  // },
  // {
  //   title: "Profil",
  //   type: "link",
  //   link: "/profile",
  // },
  {
    title: "Ponuda",
    type: "link",
    link: "/ponuda",
  },
  {
    title: "Odjava",
    type: "button",
    action: "logout",
  },
];

const toCamelCase = (str) => str.replace(/-./g, (m) => m[1].toUpperCase());

const Layout = ({ menuItems }) => {
  return (
    <div className="md:flex min-h-screen">
      <Header menuItems={menuItems} />

      <main className="md:flex-1">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout menuItems={routes} />}>
        {routes
          .flatMap((route, i) =>
            route.type === "link"
              ? [{ ...route, key: i }]
              : route.type === "submenu"
              ? route.subMenu.map((sub, j) => ({ ...sub, key: `${i}-${j}` }))
              : []
          )
          .map(({ title, link, key }) => {
            const component = componentMap[toCamelCase(title)];

            return (
              <Route
                key={key}
                path={link}
                element={
                  component ? (
                    createElement(component)
                  ) : (
                    <p>Komponenta {toCamelCase(title)} ne postoji</p>
                  )
                }
              />
            );
          })}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

import { Link, Outlet, Route, Routes } from "react-router";
import Header from "./components/Header";

const routes = [
  {
    title: "Dashboard",
    link: "/",
  },
  {
    title: "Reports",
    subMenu: [
      { title: "Sub-Dashboard", link: "/sub-dashboard" },
      { title: "Analytics", link: "/analytics" },
    ],
  },
  {
    title: "Odjava",
    link: "/logout",
  },
];

const Layout = () => {
  return (
    <div className="md:flex min-h-screen">
      <Header menuItems={routes} />
      <main className="md:flex-1">
        <Outlet />
      </main>
    </div>
  );
};

// TODO: Dodati stranice Not Found i Login

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {routes.map((route, index) =>
          route.link ? (
            <Route
              key={index}
              path={route.link}
              element={<p>{route.title}</p>}
            />
          ) : (
            route.subMenu.map((subRoute, subIndex) => (
              <Route
                key={`${index}-${subIndex}`}
                path={subRoute.link}
                element={<p>{subRoute.title}</p>}
              />
            ))
          )
        )}
      </Route>

      <Route path="/login" element={<p>Login</p>} />

      <Route
        path="*"
        element={
          <>
            <p>Not found</p>
            <Link to="/">Home</Link>
          </>
        }
      />
    </Routes>
  );
}

export default App;

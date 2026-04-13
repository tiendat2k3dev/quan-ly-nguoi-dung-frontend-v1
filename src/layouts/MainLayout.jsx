// Layout chính với sidebar navigation và header, sử dụng Outlet cho nested routes
import { NavLink, Outlet } from "react-router-dom";
import Header from "./Herader";
import "./mainlayout.css";

const MainLayout = () => {
  return (
    <div>
      <Header />

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/account"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              Account
            </NavLink>

            <NavLink
              to="/department"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              Department
            </NavLink>
          </nav>
        </aside>

        {/* Content */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

import { Outlet } from "react-router-dom";
import NavbarLayout from "./navbar";

const Layout = () => {
  return (
    <NavbarLayout>
      <Outlet />
    </NavbarLayout>
  );
};

export default Layout;
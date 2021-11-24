import { Drawer } from "@material-ui/core";
import { ReactNode } from "react";
import NavContent from "./NavContent";
import "./sidebar.scss";

function Sidebar() {
  return (
    <div className={`sidebar`} id="sidebarContent">
      <Drawer variant="permanent" anchor="left">
        <NavContent />
      </Drawer>
    </div>
  );
}

export default Sidebar;

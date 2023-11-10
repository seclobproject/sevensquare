import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";
import Users from "views/Users";
import Wallet from "views/Wallet";

var routes = [
  {
    path: "/dashboard",
    name: "Packages",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
    layout: "/",
  },
  {
    path: "/users",
    name: "Users",
    icon: "tim-icons icon-badge",
    component: <Users />,
    layout: "/",
  },
  {
    path: "/wallet",
    name: "Wallet",
    icon: "tim-icons icon-coins",
    component: <Wallet />,
    layout: "/",
  },
  {
    path: "/icons",
    name: "Users",
    icon: "tim-icons icon-atom",
    component: <Icons />,
    layout: "/",
  },
  {
    path: "/map",
    name: "Map",
    rtlName: "خرائط",
    icon: "tim-icons icon-pin",
    component: <Map />,
    layout: "/",
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: <Notifications />,
    layout: "/",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: <UserProfile />,
    layout: "/",
  },
  {
    path: "/tables",
    name: "Table List",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-puzzle-10",
    component: <TableList />,
    layout: "/",
  },
  {
    path: "/typography",
    name: "Typography",
    rtlName: "طباعة",
    icon: "tim-icons icon-align-center",
    component: <Typography />,
    layout: "/",
  },
];
export default routes;

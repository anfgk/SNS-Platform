import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/common/Layout.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import Main from "../pages/Main";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Detail from "../pages/Mypage.jsx";
import ModalLive from "../components/Modal/ModalLive.jsx";
import Comment from "../components/common/Comment.jsx";
import NotFound from "../pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Main />,
      },
      {
        path: "mypage",
        element: <Detail />,
      },
      {
        path: "modallive/:id",
        element: <ModalLive />,
      },
      {
        path: "comment",
        element: <Comment />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

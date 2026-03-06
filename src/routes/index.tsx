import React from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";

import path from "./path";
import Home from "../pages/Home";
import LoginPage from "../pages/Login";
import IntroPage from "../pages/Intro";
import SignUpPage from "../pages/SignUp";
import withCredencial from "../components/withCredencial";
import CasePage from "../pages/Case";
import Layout from "../components/Layout";
import AnswerPage from "../pages/Answer";
import ForgotPasswordPage from "../pages/ForgotPassword";
import ResetPasswordPage from "../pages/ResetPassword";
import AdminRlPage from "../pages/AdminRl";
import AdminRlDetailPage from "../pages/AdminRlDetail";
import AdminUploadPage from "../pages/AdminUpload";

const AuthedAppLayout = withCredencial(Layout);

const routes: RouteObject[] = [
  {
    path: path.root,
    element: (
      <AuthedAppLayout>
        <Outlet />
      </AuthedAppLayout>
    ),
    children: [
      {
        path: path.root,
        element: <Home />,
      },
      {
        path: path.answer,
        element: <AnswerPage />,
      },
      {
        path: path.case,
        element: <CasePage />,
      },
      {
        path: path.adminRl,
        element: <AdminRlPage />,
      },
      {
        path: path.adminRlDetail,
        element: <AdminRlDetailPage />,
      },
      {
        path: path.adminUpload,
        element: <AdminUploadPage />,
      },
    ],
  },
  {
    path: path.login,
    element: <LoginPage />,
  },
  {
    path: path.intro,
    element: <IntroPage />,
  },
  {
    path: path.signup,
    element: <SignUpPage />,
  },
  {
    path: path.forgotPassword,
    element: <ForgotPasswordPage />,
  },
  {
    path: path.resetPassword,
    element: <ResetPasswordPage />,
  },
  {
    path: "*",
    element: <Navigate to={path.root} />,
  },
];

export { routes };

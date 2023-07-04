import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Self } from "@data/interface";
import { StateProvider } from "./state";
import { Home, Login, Register, User, EditUser, Image, Upload, Followers, Followings, Converter, Search, Message, Resolution, Utilities, History, Watermark, Dynamic } from "./pages";
import { NoImage, NotFound, NoUser } from "@pages/ErrorPages";
import "semantic-ui-css/semantic.min.css";

const readSelf = (): Self | null => {
  const self = localStorage.getItem("self");

  if (self === null) {
    return null;
  }

  return JSON.parse(self);
};

const App = () => {
  const [self, rawSetSelf] = useState(readSelf());

  const setSelf = (self: Self | null) => {
    if (self === null) {
      localStorage.removeItem("self");
    } else {
      localStorage.setItem("self", JSON.stringify(self));
    }

    rawSetSelf(self);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home.Page />,
    },
    {
      path: "/login",
      element: <Login.Page />,
      loader: () => Login.loader(self),
    },
    {
      path: "/register",
      element: <Register.Page />,
      loader: () => Register.loader(self),
    },
    {
      path: "/upload",
      element: <Upload.Page />,
    },
    {
      path: "/user/:username",
      element: <User.Page />,
      loader: User.loader,
      errorElement: <NoUser />,
    },
    {
      path: "/user/:username/edit",
      element: <EditUser.Page />,
      loader: EditUser.loader,
      errorElement: <NoUser />,
    },
    {
      path: "/image/:id",
      element: <Image.Page />,
      loader: Image.loader,
      errorElement: <NoImage />,
    },
    {
      path: "/user/:username/follower",
      element: <Followers.Page />,
      loader: Followers.loader,
      errorElement: <NoUser />,
    },
    {
      path: "/user/:username/following",
      element: <Followings.Page />,
      loader: Followers.loader,
      errorElement: <NoUser />,
    },
    {
      path: "/convert",
      element: <Converter.Page />,
      errorElement: <NoUser />,
    },
    {
      path: "/search",
      element: <Search.Page />,
    },
    {
      path: "/message",
      element: <Message.Page />,
    },
    {
      path: "/resolution",
      element: <Resolution.Page />,
    },
    {
      path: "/utilities",
      element: <Utilities.Page />,
    },
    {
      path: "/history",
      element: <History.Page />,
    },
    {
      path: "/watermark",
      element: <Watermark.Page />,
    },
    {
      path: "/dynamic",
      element: <Dynamic.Page />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <React.StrictMode>
      <StateProvider self={self} setSelf={setSelf}>
        <RouterProvider router={router} />
      </StateProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);

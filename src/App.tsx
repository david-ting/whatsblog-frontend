import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "draft-js/dist/Draft.css";
import "./styling/index.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Navigator from "./components/Navigator";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import SignUpPage from "./pages/SignUpPage";
import PostPage from "./pages/PostPage";
import UserSettingPage from "./pages/UserSettingPage";
import AuthorProfilePage from "./pages/AuthorProfilePage";
import { UserContext } from "./customContext/UserContextProvider";

function App() {
  const { currentUser } = useContext(UserContext);
  return (
    <Router>
      <Navigator />
      <Switch>
        <Route path="/" exact>
          {<HomePage />}
        </Route>
        <Route path="/log-in" exact>
          {!currentUser.loggedIn ? <LoginPage /> : <Redirect to="/" />}
        </Route>
        <Route path="/sign-up" exact>
          {!currentUser.loggedIn ? <SignUpPage /> : <Redirect to="/" />}
        </Route>
        <Route path="/user/new_post" exact>
          {currentUser.loggedIn ? <UserPage /> : <Redirect to="/" />}
        </Route>
        <Route path="/user/previous_posts" exact>
          {currentUser.loggedIn ? <UserPage /> : <Redirect to="/" />}
        </Route>
        <Route path="/user/setting" exact>
          {currentUser.loggedIn ? <UserSettingPage /> : <Redirect to="/" />}
        </Route>
        <Route path="/author/profile/:user_id" exact>
          <AuthorProfilePage />
        </Route>
        <Route path="/post/:post_id" exact>
          <PostPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

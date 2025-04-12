import React, {lazy, Suspense, useEffect} from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ProtectedRoute from "./ProtectedRoute";

function App() {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const history = useHistory();

  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      history.push("/");
    }
  }, [history]);

  useEffect(() => {
    addEventListener("register-result", handleRegister);
    return () => removeEventListener("register-result", handleRegister);
  }, []);

  function handleRegister(event) {
    if (event.detail.successful) {
      history.push("/signin");
    }
  }

  useEffect(() => {
    addEventListener("login-result", handleLogin);
    return () => removeEventListener("login-result", handleLogin);
  }, []);

  function handleLogin(event) {
    if (event.detail.successful) {
      setIsLoggedIn(true);
      history.push("/");
    } else {
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    addEventListener("user-data", handleUserData);
    return () => removeEventListener("user-data", handleUserData);
  }, []);

  function handleUserData(event) {
    setEmail(event.detail.email);
    setIsLoggedIn(true);
  }

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signin");
  }

  const Login = lazy(() => import('auth/Login').catch(() => {
      return {
        default: () => <div className="error">Login component is not available!</div>
      };
    })
  );

  const Register = lazy(() => import('auth/Register').catch(() => {
      return {
        default: () => <div className="error">Register component is not available!</div>
      };
    })
  );

  const Auth = lazy(() => import('auth/Auth').catch(() => {
      return {
        default: () => <div className="error">Auth component is not available!</div>
      };
    })
  );

  return (
    <div className="page__content">
      <Header email={email} onSignOut={onSignOut} />
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={Main}
          loggedIn={isLoggedIn}
        />
        <Route path="/signup">
          <Suspense fallback="<div>Loading Register</div>">
            <Register />
          </Suspense>
        </Route>
        <Route path="/signin">
          <Suspense fallback="<div>Loading Login</div>">
            <Login />
          </Suspense>
        </Route>
      </Switch>
      <Footer />
      <Suspense fallback="<div>Loading Auth</div>">
        <Auth />
      </Suspense>
    </div>
  );
}

export default App;

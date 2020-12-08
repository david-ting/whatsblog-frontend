import React, { createContext, useReducer, useEffect } from "react";
import { getUser, logoutUser } from "../customFunc/asyncRequests/authRequests";

type User =
  | {
      loggedIn: false;
    }
  | {
      loggedIn: true;
      name: string;
      email: string;
      profile_url: string | null;
    };

type Actions =
  | {
      type: "LOG-OUT";
    }
  | {
      type: "LOG-IN";
      payload: {
        name: string;
        email: string;
        profile_url: string | null;
      };
    }
  | {
      type: "UPDATE";
      payload: {
        profile_url: string;
      };
    };

const reducers = (state: User, action: Actions): User => {
  switch (action.type) {
    case "LOG-OUT":
      return { loggedIn: false };
    case "LOG-IN":
      return {
        loggedIn: true,
        name: action.payload.name,
        email: action.payload.email,
        profile_url: action.payload.profile_url,
      };
    case "UPDATE":
      if (state.loggedIn) {
        return {
          ...state,
          profile_url: action.payload.profile_url,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

const loggedIn = localStorage.getItem("loggedIn");
const name = localStorage.getItem("name");
const email = localStorage.getItem("email");
const profile_url = localStorage.getItem("profile_url");

const initialState: User =
  loggedIn === "true" && name !== null && email !== null && profile_url !== null
    ? {
        loggedIn: true,
        name,
        email,
        profile_url: profile_url === "null" ? null : profile_url,
      }
    : {
        loggedIn: false,
      };

export const UserContext = createContext<{
  currentUser: User;
  dispatchCurrentUser: React.Dispatch<Actions>;
  logoutHandler: () => void;
}>({
  currentUser: initialState,
  dispatchCurrentUser: () => {
    return;
  },
  logoutHandler: () => {
    return;
  },
});

const UserContextProvider: React.FC<{}> = ({ children }) => {
  const [currentUser, dispatchCurrentUser] = useReducer(reducers, initialState);

  const logoutHandler = () => {
    dispatchCurrentUser({ type: "LOG-OUT" });
    localStorage.clear();

    logoutUser()
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn !== "true") return;

    getUser()
      .then((res) => {
        if (res.status === 200) {
          const name = localStorage.getItem("name");
          const email = localStorage.getItem("email");
          const profile_url = localStorage.getItem("profile_url");

          if (
            name !== res.data.name ||
            email !== res.data.email ||
            !(
              profile_url === res.data.profile_url ||
              (profile_url === "null" && res.data.profile_url === null)
            )
          ) {
            //"something went wrong. please relogin"
            logoutHandler();
          }
        } else {
          //"session expired. please relogin"
          logoutHandler();
        }
      })
      .catch((err) => {
        console.error(err);
        //"something went wrong. please relogin"
        logoutHandler();
      });
  }, [dispatchCurrentUser]);

  return (
    <UserContext.Provider
      value={{ currentUser, dispatchCurrentUser, logoutHandler }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

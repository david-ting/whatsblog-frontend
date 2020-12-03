import React, { createContext, useReducer, useEffect} from "react";
import { getUser } from "../customFunc/asyncRequests/authRequests";

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

const initialState: User = {
  loggedIn: false,
};

export const UserContext = createContext<{
  currentUser: User;
  dispatchCurrentUser: React.Dispatch<Actions>;
}>({
  currentUser: initialState,
  dispatchCurrentUser: () => {
    return;
  },
});

const UserContextProvider: React.FC<{}> = ({ children }) => {
  const [currentUser, dispatchCurrentUser] = useReducer(reducers, initialState);

  useEffect(() => {
    getUser()
      .then((res) => {
        if (res.status === 200) {
          dispatchCurrentUser({
            type: "LOG-IN",
            payload: {
              name: res.data.name,
              email: res.data.email,
              profile_url: res.data.profile_url,
            },
          });
        }
      })
      .catch((_err) => {});
  }, [dispatchCurrentUser]);

  return (
    <UserContext.Provider value={{ currentUser, dispatchCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

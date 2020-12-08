import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { FaRocket, FaUser } from "react-icons/fa";
import { ImMenu } from "react-icons/im";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { UserContext } from "../customContext/UserContextProvider";
import { FiSettings } from "react-icons/fi";
import DefaultProfileIcon from "./DefaultProfileIcon";

const Navigator: React.FC<{}> = () => {
  const { currentUser, logoutHandler } = useContext(UserContext);
  const userExpanedRef = useRef<HTMLDivElement>(null);
  const [userExpanded, setUserExpanded] = useState<boolean>(false);

  const expandUser = () => {
    setUserExpanded(!userExpanded);
  };

  useEffect(() => {
    if (userExpanded) {
      if (userExpanedRef.current !== null) {
        userExpanedRef.current.focus();
      }
    }
  }, [userExpanded]);

  return (
    <nav>
      <Navbar id="navigator" expand="md">
        <Navbar.Brand className="py-2">
          <Link to="/" className="white-link">
            <span className="mr-2">
              <FaRocket />
            </span>
            <b>Whatsblog</b>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <IconContext.Provider value={{ color: "white", size: "22.4px" }}>
            <ImMenu />
          </IconContext.Provider>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-md-auto">
            <Link to="/" className="mr-2 px-3 py-2 white-link">
              Home
            </Link>
            {currentUser.loggedIn && (
              <Link to="/user/new_post" className="px-3 py-2 white-link">
                Manage Posts
              </Link>
            )}
          </Nav>
          {!currentUser.loggedIn && (
            <Nav>
              <Link to="/sign-up" className="mr-2 px-3 py-2 white-link">
                Sign up{" "}
              </Link>
              <Link to="/log-in" className="mr-2 px-3 py-2 white-link">
                Login
              </Link>
            </Nav>
          )}
          {currentUser.loggedIn && (
            <>
              <div id="navigator-user">
                <div
                  onMouseDown={(event) => {
                    event.preventDefault();
                    expandUser();
                  }}
                >
                  <IconContext.Provider value={{ color: "rgb(54, 89, 166)" }}>
                    <FaUser />
                  </IconContext.Provider>
                </div>
                <div
                  onMouseDown={(event) => {
                    event.preventDefault();
                    expandUser();
                  }}
                >
                  <span>{currentUser.name}</span>
                  {currentUser.profile_url ? (
                    <img
                      id="navigator-profile"
                      src={currentUser.profile_url}
                      alt="profile"
                    ></img>
                  ) : (
                    <DefaultProfileIcon name={currentUser.name} size={30} />
                  )}
                </div>
                {userExpanded && (
                  <div
                    tabIndex={-1}
                    id="navigator-user-expanded"
                    ref={userExpanedRef}
                    onBlur={() => {
                      setUserExpanded(false);
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <span>{currentUser.name}</span>
                    <div>
                      <Link to="/user/setting">
                        <IconContext.Provider
                          value={{ size: "19.2px", color: "rgb(54, 89, 166)" }}
                        >
                          <FiSettings />
                        </IconContext.Provider>
                        <span className="ml-1">Setting</span>
                      </Link>
                    </div>
                    <div>
                      <Button
                        className="themeColor-btn"
                        onClick={logoutHandler}
                      >
                        Log out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </nav>
  );
};

export default Navigator;

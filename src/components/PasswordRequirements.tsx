import React from "react";
import { IconContext } from "react-icons";
import { TiTick } from "react-icons/ti";

const PasswordRequirements: React.FC<{
  password: string;
  passwordRules: boolean[];
}> = ({ password, passwordRules }) => {
  return (
    <IconContext.Provider value={{ color: "green", size: "17.6px" }}>
      <i style={{ fontSize: "15px", color: "gray" }}>
        Requirements:
        <br></br>
        i) at least 8 characters long{" "}
        {password.length > 0 && passwordRules[0] && <TiTick />}
        <br></br>
        ii) 3 character types (uppercase alphabet, lowercase alphabet, numbers)
        {password.length > 0 && passwordRules[1] && <TiTick />}
        <br></br>
        iii) no white spaces at the start and end
        {password.length > 0 && passwordRules[2] && <TiTick />}
      </i>
    </IconContext.Provider>
  );
};

export default PasswordRequirements;

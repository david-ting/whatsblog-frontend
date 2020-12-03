import { useReducer } from "react";

interface AlertType {
  show: boolean;
  variant: string;
  content: string;
}

type ActionType =
  | {
      type: "SHOW";
      variant: string;
      content: string;
    }
  | {
      type: "HIDE";
    };

const reducer = (_state: AlertType, action: ActionType) => {
  switch (action.type) {
    case "SHOW":
      return {
        show: true,
        variant: action.variant,
        content: action.content,
      };
    case "HIDE":
      return {
        show: false,
        variant: "",
        content: "",
      };
  }
};

const useAlert = () => {
  const [showAlert, dispatchShowAlert] = useReducer(reducer, {
    show: false,
    content: "",
    variant: "",
  });
  return { showAlert, dispatchShowAlert };
};

export default useAlert;

import { useContext } from "react";
import { UIStateContext, UIStateContextValue } from "../context/ui-state-context";

export default function useUIState(): UIStateContextValue {
  return useContext(UIStateContext);
}

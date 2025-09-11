import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet } from "react-router-dom";
import LogininfoContextProvider from "../store/authStore";
const App = () => {
  return (
    <LogininfoContextProvider>
    
      <Outlet /> 
    </LogininfoContextProvider>
  );
};
export default App;

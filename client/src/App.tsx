import { BrowserRouter } from "react-router-dom";
import Main from "./components/Main";
import Header from "./components/Header";
import { useApplyTheme } from "./hooks/useApplyTheme";

function App() {
  useApplyTheme()
  
  return (
    <>  
      <BrowserRouter>
        <Header />
        <Main />
      </BrowserRouter>
    </>
  );
}

export default App;

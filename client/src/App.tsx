import { BrowserRouter } from "react-router-dom";
import Main from "./components/Main";
import Header from "./components/Header";

function App() {
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

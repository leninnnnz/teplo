import './App.css';
import {Header} from "./components/header/header";
import {Footer} from "./components/footer/footer";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Error} from "./components/error/error";
import {Main} from "./components/main/main";
import {FinancialReportsPage} from "./pages/financial-reports";
import {ImportantInfoPage} from "./pages/important-info";
import {ClientInfoPage} from "./pages/client-info";

function App() {

  return (
    <div className="App">
        <BrowserRouter >
            <Header/>

            <Routes>
                <Route path={'/'} element={<Main/>}/>
                <Route path={'/financial-reports'} element={<FinancialReportsPage/>}/>
                <Route path={'/important-info'} element={<ImportantInfoPage/>}/>
                <Route path={'client-info'} element={<ClientInfoPage/>}/>
                <Route path={'*'} element={<Error/>}/>
            </Routes>

      <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default App;

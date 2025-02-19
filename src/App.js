import './App.css';
import {Header} from "./components/header/header";
import {Footer} from "./components/footer/footer";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Error} from "./components/error/error";
import {Main} from "./components/main/main";
import {FinancialReportsPage} from "./pages/financial-reports";
import {ImportantInfoPage} from "./pages/important-info";
import {ClientInfoPage} from "./pages/client-info";
import {ContactsInfoPage} from "./pages/contacts";
import {FraudPreventionPage} from "./pages/fraud-prevention";
import {ProcurementInfoPage} from "./pages/procurement-info";
import {DisclosureInfoPage} from "./pages/disclosure-info";
import {BusinessScopePage} from "./pages/business-scope";
import {PartnersInfoPage} from "./pages/partners";
import {TariffsInfoPage} from "./pages/tariffs";
import {TechnoConnectionPage} from "./pages/technical-connection";
import {OccupationalSafetyPage} from "./pages/occupational-safety";
import style from "./widgets/contacts/index.module.scss";

function App() {

  return (
    <div className="App">
        <BrowserRouter >
            <Header/>

            <div className={style.contentBox}>
                <Routes>
                <Route path={'/'} element={<Main/>}/>
                    <Route path={'/financial-reports'} element={<FinancialReportsPage/>}/>
                    <Route path={'/important-info'} element={<ImportantInfoPage/>}/>
                    <Route path={'/client-info'} element={<ClientInfoPage/>}/>
                    <Route path={'/contacts'} element={<ContactsInfoPage/>}/>
                    <Route path={'/fraud-prevention'} element={<FraudPreventionPage/>}/>
                    <Route path={'/procurement-info'} element={<ProcurementInfoPage/>}/>
                    <Route path={'/disclosure-info'} element={<DisclosureInfoPage/>}/>
                    <Route path={'/business-scope'} element={<BusinessScopePage/>}/>
                    <Route path={'/partners'} element={<PartnersInfoPage/>}/>
                    <Route path={'/tariffs'} element={<TariffsInfoPage/>}/>
                    <Route path={'/technical-connection'} element={<TechnoConnectionPage/>}/>
                    <Route path={'/occupational-safety'} element={<OccupationalSafetyPage/>}/>

                    <Route path={'*'} element={<Error/>}/>
                </Routes>
            </div>

      <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default App;

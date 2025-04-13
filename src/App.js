import './App.css';
import { Header } from './widgets/header/header';
import { Footer } from './widgets/footer/footer';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Error } from './pages/error/error';
import { FinancialReportsPage } from './pages/financial-reports';
import { ImportantInfoPage } from './pages/important-info';
import { ClientInfoPage } from './pages/client-info';
import { ContactsInfoPage } from './pages/contacts';
import { FraudPreventionPage } from './pages/fraud-prevention';
import { ProcurementInfoPage } from './pages/procurement-info';
import { DisclosureInfoPage } from './pages/disclosure-info';
import { BusinessScopePage } from './pages/business-scope';
import { PartnersInfoPage } from './pages/partners';
import { TariffsInfoPage } from './pages/tariffs';
import { TechnoConnectionPage } from './pages/technical-connection';
import { OccupationalSafetyPage } from './pages/occupational-safety';
import { AuthorizationPage } from './pages/authorization';
import style from './widgets/contacts/index.module.scss';
import { ProfileSettingsPage } from './pages/profile-settings';
import { MyApplicationsPage } from './pages/my-applications';
import { AdminPage } from './pages/admin/admin';
import { SubmitApplicationPage } from './pages/submit-application';
import { ApplicationDetailsPage } from './pages/application-details';
import { EmployeeApplicationsPage } from './pages/employee-applications';
import { EmployeeApplicationDetailsPage } from './pages/employee-application-details';

function Layout() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/authorization';

    return (
        <>
            {!isAuthPage && <Header />}
            <div className={style.contentBox}>
                <Routes>
                    <Route path={'/'} element={<ImportantInfoPage />} />
                    <Route path={'/financial-reports'} element={<FinancialReportsPage />} />
                    <Route path={'/important-info'} element={<ImportantInfoPage />} />
                    <Route path={'/client-info'} element={<ClientInfoPage />} />
                    <Route path={'/contacts'} element={<ContactsInfoPage />} />
                    <Route path={'/fraud-prevention'} element={<FraudPreventionPage />} />
                    <Route path={'/procurement-info'} element={<ProcurementInfoPage />} />
                    <Route path={'/disclosure-info'} element={<DisclosureInfoPage />} />
                    <Route path={'/business-scope'} element={<BusinessScopePage />} />
                    <Route path={'/partners'} element={<PartnersInfoPage />} />
                    <Route path={'/tariffs'} element={<TariffsInfoPage />} />
                    <Route path={'/technical-connection'} element={<TechnoConnectionPage />} />
                    <Route path={'/occupational-safety'} element={<OccupationalSafetyPage />} />
                    <Route path="/authorization" element={<AuthorizationPage />} />
                    <Route path="/profile-settings" element={<ProfileSettingsPage />} />
                    <Route path="/my-applications" element={<MyApplicationsPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/submit-application" element={<SubmitApplicationPage />} />
                    <Route path="/employee/applications" element={<EmployeeApplicationsPage />} />
                    <Route path="/employee/applications/:id" element={<EmployeeApplicationDetailsPage />} />
                    <Route path="//application/:id" element={<ApplicationDetailsPage />} />
                    <Route path={'*'} element={<Error />} />
                </Routes>
            </div>
            {!isAuthPage && <Footer />}
        </>
    );
}

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </div>
    );
}

export default App;

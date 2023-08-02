import ReactDOM from 'react-dom';
import App from './App';
import About from 'views/About';
import Home from 'views/home/Home';
import Login from 'views/Login';
import AccountConfirmation from 'views/signup/AccountConfirmation';
import StripeReAuth from 'views/StripeReAuth';
import ResetPassword from 'views/resetPassword/resetPassword';
import ForgotPassword from 'views/forgotPassword/forgotPassword';
import ChangePassword from 'views/changePassword/changePassword';
import ContractDetails from 'views/contractdetails/ContractDetails';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PayoutDetails from 'views/payoutdetails/PayoutDetails';
import WorkRoom from 'views/workroom/WorkRoom';
import { AccountType } from 'views/signup/AccountType';
import { SignupRenderer } from 'views/signup/SignupRenderer';
import { AdminUsers } from 'views/adminUsers/AdminUsers';
import { AdminUser } from 'views/adminUsers/AdminUser';
import { AdminSkills } from 'views/adminSkills/AdminSkills';
import { ViewUser } from 'views/users/ViewUser';
import { PayoutDecider } from 'views/payoutdetails/PayoutDecider';
import { ViewContracts } from 'views/viewContracts/ViewContracts';
import { ViewNetwork } from 'views/network/ViewNetwork';
import { ViewUsers } from 'views/users/ViewUsers';
import { EditUser } from 'views/users/EditUser';
import { Dispute } from 'views/dispute/Dispute';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="users" element={<ViewUsers />} />
        <Route path="users/:id" element={<ViewUser />} />
        <Route path="users/:id/edit" element={<EditUser />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/users/:id" element={<AdminUser />} />
        <Route path="admin/skills" element={<AdminSkills />} />
        <Route path="Signup" element={<AccountType />} />
        <Route path="Signup/Details" element={<SignupRenderer />} />
        <Route path="ForgotPassword" element={<ForgotPassword />} />
        <Route path="ResetPassword" element={<ResetPassword />} />
        <Route path="ChangePassword" element={<ChangePassword />} />
        <Route path="Login" element={<Login />} />
        <Route path="Confirmation" element={<AccountConfirmation />} />
        <Route path="StripeReAuth" element={<StripeReAuth />} />
        <Route path="PayoutDetails" element={<PayoutDetails />} />
        <Route path="PaymentDecider" element={<PayoutDecider />} />
        <Route path="ContractDetails" element={<ContractDetails />} />
        <Route path="WorkRoom/" element={<WorkRoom />} />
        <Route path="WorkRoom/:id" element={<WorkRoom />} />
        <Route path="ContractHistory" element={<ViewContracts />} />
        <Route path="WorkRoom/:id/:recipientUserId" element={<WorkRoom />} />
        <Route path="Network" element={<ViewNetwork />} />
        <Route path="Network/:status" element={<ViewNetwork />} />
        <Route path="about" element={<About />} />
        <Route path="Dispute" element={<Dispute />} />
        <Route path="Dispute/:id" element={<Dispute />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals({});

const appHeight = (): void => {
  const doc = document.documentElement;
  doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};
window.addEventListener('resize', appHeight);
appHeight();

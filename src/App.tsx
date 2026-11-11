import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Layout from './layout/Layout';
import Login from './pages/LoginPage';
import SignUp from './pages/SignUpPage';
import Home from './pages/HomePage';
import Coordi from './pages/CoordiPage';
import CoordiCreate from './pages/CoordiCreatePage';
import Mypage from './pages/MyPage';
import ToastConfig from "./components/ToastConfig/ToastConfig";
import MyProfile from "./pages/MyProfilePage";
import MyCoordi from "./pages/MyCoordiPage";
import CoordiEdit from "./pages/CoordiEditPage";
import MyLikeCoordi from "./pages/MyLikeCoordiPage";

function App() {

  return (
    <BrowserRouter>
      <ToastConfig />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>

          <Route path="/home" element={<Home />} />
          <Route path="/coordi" element={<Coordi />} />
          <Route path="/coordi/new" element={<CoordiCreate />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/myprofile" element={<MyProfile />}></Route>
          <Route path="/mypage/mycoordi" element={<MyCoordi />}></Route>
          <Route path="/coordi/:id/edit" element={<CoordiEdit />}></Route>
          <Route path="/mypage/mylikecoordi" element={<MyLikeCoordi />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

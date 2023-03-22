import { FC } from "react";
import { LoginForm } from "../components";

const LoginPage: FC = () => {
    return (<main className="bg-login-bgnd h-screen bg-cover bg-center pt-[20%]">
        <LoginForm/>
    </main>)
}
export default LoginPage;
import App from "@/App";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import ChatsPage from "@/pages/ChatsPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RegisterPage from "@/pages/RegisterPage";
import { createBrowserRouter } from "react-router-dom";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <ProtectedRoute> <ChatsPage /></ProtectedRoute>},
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage />},
            { path: '*', element: <NotFoundPage />}
        ]
    }
])
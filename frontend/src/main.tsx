import './styles/globals.css';
import './styles/theme.css';
import './styles/windows-live-messenger.css';
import './styles/windows-live-chat-modal.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/index';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)

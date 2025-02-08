import { jsx as _jsx } from "react/jsx-runtime";
import "../styles/globals.css";
export const metadata = {
    title: 'Mina zkApp UI',
    description: 'built with o1js',
    icons: {
        icon: '/assets/favicon.ico',
    },
};
export default function RootLayout({ children }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { children: children }) }));
}

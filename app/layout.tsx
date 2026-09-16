import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'AtenPlay — Small Games. Big Adventures.',template:'%s | AtenPlay'},description:'Original Android games by AtenPlay.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}

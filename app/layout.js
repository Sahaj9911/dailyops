import './globals.css';
import { DataProvider } from '@/context/DataContext';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'DailyOps — Manufacturing Operations CRM',
  description: 'Lightweight operational CRM for small apparel and bag manufacturing businesses. Track purchases, production, expenses, and get AI-powered business insights.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}

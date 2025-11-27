import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Debate Drawer',
  description: 'Random debate winner selector',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="si">
      <body>{children}</body>
    </html>
  );
}

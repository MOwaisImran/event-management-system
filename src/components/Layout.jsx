import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from './Toast';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Toast />
      <footer className="footer">Event data © Ticketmaster Discovery API</footer>
    </>
  );
}
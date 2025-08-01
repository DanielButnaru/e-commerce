import{LayoutDashboard, Menu} from 'lucide-react';

import {useState} from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import CartButton from './CartButton'
import MobileMenu from './MobileMenu';
import {Button} from '../ui/button';
import UserButton from './UserButton';

import WishlistButton from './WishlistButton';






const Navbar = () =>{
    const [mobileOpen, setMobileOpen] = useState(false);

 return (
    <header className="w-full shadow-md bg-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-bold">
          MyShop
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex gap-6">
          {/* {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))} */}
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          <SearchBar />
          <CartButton />
          <UserButton />
          <WishlistButton />
          <Link to="/admin">
          <Button variant="ghost" size="icon" className='cursor-pointer'>
            <LayoutDashboard />
          </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu open={mobileOpen} setOpen={setMobileOpen} />
    </header>
  )
}

export default Navbar

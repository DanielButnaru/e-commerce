import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'

interface MobileMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
  // navLinks: { href: string; label: string }[]
}

const MobileMenu = ({ open, setOpen  }: MobileMenuProps) => {
  if (!open) return null

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg z-50 p-6 md:hidden"
    >
      <div className="flex justify-end">
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X />
        </Button>
      </div>
      {/* <nav className="mt-8 space-y-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => setOpen(false)}
            className="block text-lg font-medium hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav> */}
    </motion.div>
  )
}

export default MobileMenu

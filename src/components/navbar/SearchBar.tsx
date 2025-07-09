import { Input } from '../ui/input'
import { Search } from 'lucide-react'

const SearchBar = () => {
  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search products..."
        className="pl-8 pr-4 h-9 w-56 "
      />
    </div>
  )
}

export default SearchBar

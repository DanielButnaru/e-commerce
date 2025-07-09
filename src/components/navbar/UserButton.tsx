import { Button } from "../ui/button";
import { User } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { logoutUser } from "../../firebase/authService";

const UserButton = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="reltive">
      <Button onClick={toggleDropdown} variant="ghost" size="icon">
        <User />
      </Button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-2 mt-2 w-60 bg-white shadow-lg rounded-lg"
      >
        <div className="py-2 border-b border-gray-200">
          {currentUser ? (
            <>
              <span className="inline-flex items-center px-4 py-2 text-xs text-gray-700">
                {currentUser.displayName} - {currentUser.email}
              </span>
          
            </>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={closeDropdown}
            >
              Login
            </Link>
          )}
        </div>
        <DropdownItem onClick={() => alert("Profile clicked")}>
          Profile
        </DropdownItem>
        <DropdownItem onClick={() => alert("Settings clicked")}>
          Settings
        </DropdownItem>
        <DropdownItem onClick={() => dispatch(logoutUser()) }>
          Logout
        </DropdownItem>
      </Dropdown>
    </div>
  );
};
export default UserButton;

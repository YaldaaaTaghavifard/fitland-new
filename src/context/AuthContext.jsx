
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { storageService } from "../services/storageService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storageService.initialize();

    const savedUser = storageService.getCurrentUser();

    if (savedUser) {
      const users = storageService.getUsers();

      const validUser = users.find(
        (item) => item.id === savedUser.id
      );

      if (validUser) {
        const { password, ...safeUser } = validUser;
        setUser(safeUser);
      } else {
        storageService.clearCurrentUser();
      }
    }

    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = storageService.getUsers();

    const foundUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "ایمیل یا رمز عبور اشتباه است."
      };
    }

    const { password: ignoredPassword, ...safeUser } = foundUser;

    storageService.saveCurrentUser(safeUser);
    setUser(safeUser);

    return {
      success: true,
      user: safeUser
    };
  };

  const register = (formData) => {
    const users = storageService.getUsers();

    const emailExists = users.some(
      (item) =>
        item.email.toLowerCase() === formData.email.trim().toLowerCase()
    );

    if (emailExists) {
      return {
        success: false,
        message: "این ایمیل قبلاً ثبت شده است."
      };
    }

    const phoneExists = users.some(
      (item) => item.phone === formData.phone
    );

    if (phoneExists) {
      return {
        success: false,
        message: "این شماره موبایل قبلاً ثبت شده است."
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: formData.role,
      createdAt: new Date().toISOString()
    };

    storageService.saveUsers([...users, newUser]);

    const { password: ignoredPassword, ...safeUser } = newUser;

    storageService.saveCurrentUser(safeUser);
    setUser(safeUser);

    return {
      success: true,
      user: safeUser
    };
  };

  const logout = () => {
    storageService.clearCurrentUser();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth باید داخل AuthProvider استفاده شود.");
  }

  return context;
}

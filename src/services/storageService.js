
import { initialUsers } from "../data/seedData";

const USERS_KEY = "fitland_users";
const CURRENT_USER_KEY = "fitland_current_user";

export const storageService = {
  initialize() {
    const users = localStorage.getItem(USERS_KEY);

    if (!users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }
  },

  getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  },

  saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser() {
    return JSON.parse(
      localStorage.getItem(CURRENT_USER_KEY) || "null"
    );
  },

  saveCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

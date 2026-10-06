import { INITIAL_REGISTERED_USERS, INITIAL_USER } from "../../js/data.js";

function loadUsers() {
  const savedUsers = localStorage.getItem("qb_users_db");
  if (!savedUsers) return [...INITIAL_REGISTERED_USERS];

  try {
    const users = JSON.parse(savedUsers);
    if (Array.isArray(users)) return users;
  } catch (error) {
    console.warn("Could not read saved Quantum Brain accounts; using initial accounts.", error);
  }

  return [...INITIAL_REGISTERED_USERS];
}

export function authenticateUser(identifier, password) {
  const term = identifier.trim().toLowerCase();
  if (!term || !password) {
    return { error: "Please enter your username and password." };
  }

  const users = loadUsers();
  let user = users.find(
    (candidate) =>
      candidate.email?.toLowerCase() === term ||
      candidate.username?.toLowerCase() === term,
  );

  if (!user && (term.includes("elena") || term.includes("quinfosys"))) {
    user = { ...INITIAL_USER, username: "elena" };
    users.push(user);
    localStorage.setItem("qb_users_db", JSON.stringify(users));
  }

  if (!user) {
    return { error: `No account found for "${identifier}". Please Create an account.` };
  }

  localStorage.setItem("qb_user", JSON.stringify(user));
  localStorage.setItem("qb_auth", "true");
  return { user };
}

export function registerUser({ name, username, email, mobile }) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();
  const users = loadUsers();
  const existingUser = users.find(
    (candidate) =>
      candidate.email?.toLowerCase() === normalizedEmail ||
      candidate.username?.toLowerCase() === normalizedUsername.toLowerCase(),
  );

  if (existingUser) {
    return {
      error: "An account with this email or username already exists. Please Sign In.",
    };
  }

  const user = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    mobile: mobile.trim(),
    role: "Quantum Research Associate",
    organization: "Quinfosys Research",
    tier: "Researcher Standard",
    stats: {
      activeProjects: 0,
      indexedPapers: 0,
      reasoningRuns: 0,
      quantumSimulations: 0,
    },
  };

  users.push(user);
  localStorage.setItem("qb_users_db", JSON.stringify(users));
  localStorage.setItem("qb_user", JSON.stringify(user));
  localStorage.setItem("qb_auth", "true");
  return { user };
}

export function signOutUser() {
  localStorage.removeItem("qb_user");
  localStorage.removeItem("qb_auth");
}

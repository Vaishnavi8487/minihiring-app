const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

type AuthResult = { error: null } | { error: { message: string } };

export async function signUp(email: string, password: string): Promise<AuthResult> {
  await delay(400);
  const users = JSON.parse(localStorage.getItem('fake_users') || '[]') as Array<{ email: string; password: string }>;
  if (users.find(u => u.email === email)) return { error: { message: 'User already exists' } };
  users.push({ email, password });
  localStorage.setItem('fake_users', JSON.stringify(users));
  return { error: null } as const;
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  await delay(300);
  const users = JSON.parse(localStorage.getItem('fake_users') || '[]') as Array<{ email: string; password: string }>;
  const match = users.find(u => u.email === email && u.password === password);
  if (!match) return { error: { message: 'Invalid credentials' } };
  localStorage.setItem('fake_session', JSON.stringify({ email }));
  return { error: null } as const;
}

export function signOut() {
  localStorage.removeItem('fake_session');
}

export function getSession(): { email: string } | null {
  const raw = localStorage.getItem('fake_session');
  return raw ? JSON.parse(raw) : null;
}



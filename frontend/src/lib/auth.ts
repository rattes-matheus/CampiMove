
export function saveUserSession(userId: string) {

  localStorage.setItem('userId', userId);
}

export function getUserId(): string | null {

  return localStorage.getItem('userId');
}

export function clearUserSession() {

  localStorage.removeItem('userId');
}

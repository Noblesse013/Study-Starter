// Web-only notifications wrapper (Capacitor removed)
export async function requestPerm(): Promise<boolean> {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') return true;
    const res = await Notification.requestPermission();
    return res === 'granted';
  }
  return false;
}

export async function notify(title: string, body?: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}



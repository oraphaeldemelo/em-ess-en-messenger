export const storage = {
    get<T>(k: string): T | null {
        const raw = localStorage.getItem(k);
        return raw ? (JSON.parse(raw) as T) : null;
    },
    set(k: string, v: unknown) {
        localStorage.setItem(k, JSON.stringify(v));
    },
    remove(k: string) {
        localStorage.removeItem(k);
    }
}
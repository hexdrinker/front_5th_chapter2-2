export const useLocalStorage = () => {
  const setItem = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getItem = (key: string) => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key)!)
      : null;
  };

  const removeItem = (key: string) => {
    const item = getItem(key);
    if (!item) {
      return;
    }
    localStorage.removeItem(key);
  };

  const clear = () => {
    localStorage.clear();
  };

  return {
    setItem,
    getItem,
    removeItem,
    clear,
  };
};

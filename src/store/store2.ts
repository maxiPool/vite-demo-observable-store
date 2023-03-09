function createStore(initialState: any) {
  let currentState = initialState;
  const listeners = new Set();
  return {
    getState: () => currentState,
    setState: (newState: any) => {
      currentState = newState;
      listeners.forEach((listener: any) => listener(currentState));
    },
    subscribe: (listener: any) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const store = createStore({
  value1: 0,
  value2: 0,
});

export default store;

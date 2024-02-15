import create from 'zustand'

const useStore = create((set) => ({
    gameCode: '',
    gameName:'',
    boardCategory: '',
    categoryName: '',
    setGameCode: (gameCode) => set({ gameCode }),
    setGameName: (gameName) => set({ gameName }),
    setBoardCategory: (boardCategory) => set({ boardCategory }),
    setCategoryName: (categoryName) => set({ categoryName }),
}));

export default useStore;

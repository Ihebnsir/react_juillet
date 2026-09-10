const unavailable = () => null;
const unavailableMutation = () => { throw new Error('HOME_CONTENT_UNAVAILABLE'); };

export const getStats = unavailable;
export const updateStats = unavailableMutation;
export const getTextesAPropos = unavailable;
export const updateTextesAPropos = unavailableMutation;
export const getPlatformMetrics = unavailable;
export const updatePlatformMetrics = unavailableMutation;
export const getTemoignages = () => [];
export const addTemoignage = unavailableMutation;
export const updateTemoignage = unavailableMutation;

export const deleteTemoignage = unavailableMutation;
export const getCategoriesVisibles = () => [];
export const toggleCategorieVisible = unavailableMutation;

export const getCurrentContact = (id) => localStorage.getItem(id)!;
export const setCurrentContact = (id) =>
	localStorage.setItem('current-contact', id)!;

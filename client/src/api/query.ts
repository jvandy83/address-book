import axios from 'axios';

const fetchContacts = async () => {
	try {
		const { data } = await axios.get(
			`${process.env.REACT_APP_BASE_URL}/persons`,
		);
		return data.contacts;
	} catch (error) {
		console.error(error);
	}
};

const fetchCurrentContact = async (id: number) => {
	try {
		const { data } = await axios.get(
			`${process.env.REACT_APP_BASE_URL}/persons/${id}`,
		);
		return data.contact;
	} catch (error) {
		console.error(error);
	}
};

export const queries = {
	fetchContacts,
	fetchCurrentContact,
};

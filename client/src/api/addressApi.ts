import { BASE_URL } from './client';

import axios from 'axios';
import { abbrState } from '../utils';

const createAddress = async (values, id) => {
	const { stateInitials } = values;
	const convertedStateInitialsToName = abbrState(stateInitials, 'name');
	await axios.post(
		`${BASE_URL}/address/${id}`,
		{
			...values,
			state: convertedStateInitialsToName,
		},
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
};

const updateAddress = async (updates, personId) => {
	const { stateInitials } = updates;
	const convertedStateInitialsToName = abbrState(stateInitials, 'name');

	await axios.put(
		`${BASE_URL}/address/${personId}`,
		{
			...updates,
			state: convertedStateInitialsToName,
		},
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
};

const fetchAddress = async (id: string) => {
	const res = await axios.get(`${BASE_URL}/address/${id}`);
	return res.data.address;
};

const addressApi = {
	createAddress,
	updateAddress,
	fetchAddress,
};

export default addressApi;

// const updateAddress = async () => {
// 	const convertedStateInitialsToName = abbrState(
// 		updatedAddress.stateInitials,
// 		'name',
// 	);

// 	try {
// 		const { data } = await axios.get(
// 			`${process.env.REACT_APP_BASE_URL}/address/${currentContact.id}`,
// 		);
// 		if (!data.address) {
// 			try {
// 				await axios.post(
// 					`${process.env.REACT_APP_BASE_URL}/address/${currentContact.id}`,
// 					{
// 						...updatedAddress,
// 						state: convertedStateInitialsToName,
// 						personId: currentContact.id,
// 					},
// 					{
// 						headers: {
// 							'Content-Type': 'application/json',
// 						},
// 					},
// 				);
// 				setAddress(initialAddressState);
// 				navigate(`/contact/${currentContact.id}`);
// 			} catch (err) {
// 				console.error(err);
// 			}
// 		} else {
// 			await axios
// 				.put(
// 					`${process.env.REACT_APP_BASE_URL}/address/${currentContact.id}`,
// 					{
// 						...updatedAddress,
// 						state: convertedStateInitialsToName,
// 						personId: currentContact.id,
// 					},
// 					{
// 						headers: {
// 							'Content-Type': 'application/json',
// 						},
// 					},
// 				)
// 				.then((res) => {
// 					navigate(`/contact/${currentContact.id}`);
// 				});
// 		}
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

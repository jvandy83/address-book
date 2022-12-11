import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '../redux/hooks';

import { createAddress } from '../redux/features/address/addressSlice';

import { InputField } from '../components/InputField';

import { Form } from '../components/Form';

import { usps } from '../usps';

import { SubmitButton } from '../components/button/SubmitButton';
import { AddressFormState } from '~../types/address';

type ZipLookup = {
	city: string;
	state: string;
	zip: string;
};

export const AddressForm = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { id } = useParams();

	const [address, setAddress] = useState<AddressFormState>({
		city: '',
		stateInitials: '',
		zipCode: '',
		street: '',
	});
	const [zipLookup, setZipLookup] = useState<ZipLookup>({
		city: '',
		state: '',
		zip: '',
	});

	const handleSubmit = () => {
		
		dispatch(createAddress({ ...address, id }));
		navigate(`/contact/${id}`);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === 'zipCode') {
			usps.cityStateLookup(value, function (err, result) {
				if (err) {
					console.error(err);
				} else {
					const { city, state, zip } = result;
					setAddress((prev) => ({
						...prev,
						city,
						stateInitials: state,
						zipCode: zip,
					}));
				}
			});
		}
		setAddress((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<Form>
			<SubmitButton
				submitAndSave={handleSubmit}
				isDiffed={
					Object.values(address).filter((inputField) => inputField.length > 0)
						.length > 0
				}
			/>
			<div className='flex justify-center py-4'>
				<h1 className='text-4xl font-indiaFlower text-white'>Add an Address</h1>
			</div>
			<InputField
				placeholder='Zip Code'
				id='zipCode'
				name='zipCode'
				value={address.zipCode}
				handleChange={handleChange}
				type='text'
			/>
			<InputField
				placeholder='Street'
				id='Street'
				name='street'
				value={address.street}
				handleChange={handleChange}
				type='text'
			/>
			<InputField
				placeholder='City'
				id='City'
				name='city'
				value={address.city || zipLookup.city}
				handleChange={handleChange}
				type='text'
			/>

			<InputField
				placeholder='State'
				id='State'
				name='stateInitials'
				value={address.stateInitials || zipLookup.state}
				handleChange={handleChange}
				type='text'
			/>
		</Form>
	);
};

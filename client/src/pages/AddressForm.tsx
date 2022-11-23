import React, { useEffect, useState } from 'react';

import { InputField } from '../components/InputField';

import { Form } from '../components/Form';

import { usps } from '../usps';

import { FormStatus } from '../../types/FormStatus';
import { AddressFormType } from '../../types/AddressForm';
interface IProps {
	setStatus: React.Dispatch<React.SetStateAction<FormStatus>>;
	status: FormStatus;
	handleClick: (values: AddressFormType) => void;
	address: AddressFormType;
	setAddress: React.Dispatch<React.SetStateAction<AddressFormType>>;
	editing: boolean;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

type ZipLookup = {
	city: string;
	state: string;
	zip: string;
};

export const AddressForm = ({
	address,
	setAddress,
	handleClick,
	status,
	setStatus,
	editing,
	setEditing,
}: IProps) => {
	const [zipLookup, setZipLookup] = useState<ZipLookup>({
		city: '',
		state: '',
		zip: '',
	});
	const [zipFound, setZipFound] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === 'zipCode') {
			usps.cityStateLookup(value, function (err, result) {
				if (err) {
					console.error(err);
				} else {
					const { city, state, zip } = result;
					setZipLookup({ city, state, zip });
					setZipFound(true);
				}
			});
		}
		let isDiffed = false;
		if (!editing) setEditing(true);
		for (let field in address) {
			isDiffed = address[field] ? true : false;
		}
		!isDiffed && !value && editing && setEditing(false);
		setAddress((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	useEffect(() => {
		status.submittingAddress &&
			setAddress((prev) => ({
				...prev,
				personId: JSON.parse(localStorage.getItem('new_user')!),
			}));
		return () => {
			setStatus({
				enteringContact: false,
				enteringAddress: false,
				submittingContact: false,
				submittingAddress: false,
			});
		};
	}, [status.submittingAddress]);

	return (
		<Form>
			<button
				onClick={() => handleClick(address)}
				className={`absolute top-4 right-6 ${
					editing ? 'text-blue-300' : 'text-grayBlue'
				}`}
				disabled={!editing}
			>
				Done
			</button>
			<div className='flex justify-center py-4'>
				<h1 className='text-4xl font-indiaFlower text-white'>Add an Address</h1>
			</div>
			<InputField
				placeholder='Zip Code'
				id='zipCode'
				name='zipCode'
				value={address.zipCode || zipLookup.zip}
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

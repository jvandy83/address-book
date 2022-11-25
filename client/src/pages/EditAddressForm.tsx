import React, { useRef, useState, useEffect } from 'react';

import { InputField } from '../components/InputField';
import { Form } from '../components/Form';
import { SubmitButton } from '../components/button/SubmitButton';

import { initialAddressResponseState } from '../App';

import { AddressFormType } from '../../types/AddressForm';
import { AddressResponseType } from '../../types/AddressResponse';

import axios from 'axios';

interface IProps {
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
	editing: boolean;
	setUpdatedAddress: React.Dispatch<React.SetStateAction<AddressFormType>>;
	updateAddress: () => void;
}

export const EditAddressForm = ({
	setEditing,
	editing,
	setUpdatedAddress,
	updateAddress,
}: IProps) => {
	const streetRef = useRef<HTMLInputElement>(null);
	const cityRef = useRef<HTMLInputElement>(null);
	const zipCodeRef = useRef<HTMLInputElement>(null);
	const stateRef = useRef<HTMLInputElement>(null);

	const [address, setAddress] = useState<AddressResponseType>(
		initialAddressResponseState,
	);

	const [refState, setRefState] = useState(address);
	const [isDiffed, setDiffed] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!editing) setEditing(true);
		if (streetRef.current) {
			console.log(streetRef.current.value);
			setUpdatedAddress((prev) => ({
				...prev,
				street: streetRef.current!.value,
			}));
			if (!isDiffed && streetRef.current.value !== refState?.street) {
				setDiffed(true);
			}
		}
		if (cityRef.current) {
			console.log(cityRef.current.value);
			setUpdatedAddress((prev) => ({
				...prev,
				city: cityRef.current!.value,
			}));
			if (!isDiffed && cityRef.current.value !== refState?.city) {
				setDiffed(true);
			}
		}
		if (zipCodeRef.current) {
			console.log(zipCodeRef.current.value);
			setUpdatedAddress((prev) => ({
				...prev,
				zipCode: zipCodeRef.current!.value,
			}));
			if (!isDiffed && zipCodeRef.current.value !== refState?.zip_code) {
				setDiffed(true);
			}
		}
		if (stateRef.current) {
			console.log(stateRef.current.value);
			setUpdatedAddress((prev) => ({
				...prev,
				stateInitials: stateRef.current!.value,
			}));
			if (!isDiffed && stateRef.current.value !== refState?.state) {
				setDiffed(true);
			}
		}
		!isDiffed && editing && setEditing(false);
	};

	useEffect(() => {
		if (streetRef.current) {
			streetRef.current.value = address?.street || '';
		}
		if (cityRef.current) {
			cityRef.current.value = address?.city || '';
		}
		if (zipCodeRef.current) {
			zipCodeRef.current.value = address?.zip_code || '';
		}
		if (stateRef.current) {
			stateRef.current.value = address?.state_initials || '';
		}
	}, [
		address?.street,
		address?.city,
		address?.zip_code,
		address?.state_initials,
	]);

	useEffect(() => {
		const currentUserId = JSON.parse(localStorage.getItem('current-contact')!);
		axios.get(`http://localhost:8000/address/${currentUserId}`).then((res) => {
			const { data } = res;
			setAddress(data.address);
			console.log('***address data*** ', data);
		});
	}, []);
	return (
		<Form>
			<SubmitButton editing={editing} submitAndSave={updateAddress} />
			<InputField
				ref={zipCodeRef}
				label='Zipcode'
				placeholder='Zip Code'
				id='ZipCode'
				name='zipCode'
				handleChange={handleChange}
				type='text'
			/>
			<InputField
				ref={streetRef}
				label='Street'
				placeholder='Street'
				id='Street'
				name='street'
				handleChange={handleChange}
				type='text'
			/>
			<InputField
				ref={cityRef}
				label='City'
				placeholder='City'
				id='City'
				name='city'
				handleChange={handleChange}
				type='text'
			/>
			<InputField
				ref={stateRef}
				label='State'
				placeholder='State'
				id='State'
				name='state'
				handleChange={handleChange}
				type='text'
			/>
		</Form>
	);
};

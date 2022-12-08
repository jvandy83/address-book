import React, { useRef, useState, useEffect } from 'react';

import { InputField } from '../components/InputField';
import { Form } from '../components/Form';
import { SubmitButton } from '../components/button/SubmitButton';

import { initialAddressResponseState } from '../App';

import { AddressFormType } from '../../types/AddressForm';

import axios from 'axios';

interface IProps {
	setUpdatedAddress: React.Dispatch<React.SetStateAction<AddressFormType>>;
	updateAddress: () => void;
}

export const EditAddressForm = ({
	setUpdatedAddress,
	updateAddress,
}: IProps) => {
	const streetRef = useRef<HTMLInputElement>(null);
	const cityRef = useRef<HTMLInputElement>(null);
	const zipCodeRef = useRef<HTMLInputElement>(null);
	const stateRef = useRef<HTMLInputElement>(null);

	const [existingAddress, setExisitngAddress] = useState(
		initialAddressResponseState,
	);
	const [diffState, setDiffedState] = useState({
		city: false,
		state: false,
		zipCode: false,
		street: false,
	});

	const checkDiffAndUpdateState = () => {
		if (streetRef.current) {
			setUpdatedAddress((prev) => ({
				...prev,
				street: streetRef.current!.value,
			}));
			setDiffedState((prev) => ({
				...prev,
				street: streetRef.current.value !== existingAddress?.street,
			}));
		}
		if (cityRef.current) {
			setUpdatedAddress((prev) => ({
				...prev,
				city: cityRef.current!.value,
			}));
			setDiffedState((prev) => ({
				...prev,
				city: cityRef.current.value !== existingAddress?.city,
			}));
		}
		if (zipCodeRef.current) {
			setUpdatedAddress((prev) => ({
				...prev,
				zipCode: zipCodeRef.current!.value,
			}));
			setDiffedState((prev) => ({
				...prev,
				zipCode: zipCodeRef.current.value !== existingAddress?.zip_code,
			}));
		}
		if (stateRef.current) {
			setUpdatedAddress((prev) => ({
				...prev,
				stateInitials: stateRef.current!.value,
			}));
			setDiffedState((prev) => ({
				...prev,
				state: stateRef.current.value !== existingAddress?.state_initials,
			}));
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		checkDiffAndUpdateState();
	};

	useEffect(() => {
		if (streetRef.current) {
			streetRef.current.value = existingAddress?.street || '';
		}
		if (cityRef.current) {
			cityRef.current.value = existingAddress?.city || '';
		}
		if (zipCodeRef.current) {
			zipCodeRef.current.value = existingAddress?.zip_code || '';
		}
		if (stateRef.current) {
			stateRef.current.value = existingAddress?.state_initials || '';
		}
	}, [
		existingAddress?.street,
		existingAddress?.city,
		existingAddress?.zip_code,
		existingAddress?.state_initials,
	]);

	useEffect(() => {
		const currentContactId = JSON.parse(
			localStorage.getItem('current-contact')!,
		);
		axios
			.get(`${process.env.REACT_APP_BASE_URL}/address/${currentContactId}`)
			.then((res) => {
				const { data } = res;
				setExisitngAddress(data.address);
			});
	}, []);
	return (
		<Form>
			<SubmitButton
				isDiffed={
					Object.values(diffState).filter((val) => val !== false).length > 0
				}
				submitAndSave={updateAddress}
			/>
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

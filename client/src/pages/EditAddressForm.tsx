import React, { useRef, useState, useEffect } from 'react';

import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { updateAddress } from '../redux/features/address/addressSlice';

import { InputField } from '../components/InputField';
import { Form } from '../components/Form';
import { SubmitButton } from '../components/button/SubmitButton';

import { fetchAddress } from '../redux/features/address/addressSlice';

import { useAppDispatch, useAppSelector } from '../redux/hooks';

const setCurrentAddressValues = ({
	streetRef,
	cityRef,
	zipCodeRef,
	stateRef,
	address,
}) => {
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
};

export const EditAddressForm = () => {
	const { id } = useParams();

	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const location = useLocation();

	const { address } = useAppSelector((state) => state);
	const { currentContact } = useAppSelector((state) => state.contact);

	const streetRef = useRef<HTMLInputElement>(null);
	const cityRef = useRef<HTMLInputElement>(null);
	const zipCodeRef = useRef<HTMLInputElement>(null);
	const stateRef = useRef<HTMLInputElement>(null);

	const [updatedAddress, setUpdatedAddress] = useState({
		street: '',
		city: '',
		zipCode: '',
		stateInitials: '',
	});

	const [diffState, setDiffedState] = useState({
		city: false,
		state: false,
		zipCode: false,
		street: false,
	});

	const handleUpdate = () => {
		const updates = { ...updatedAddress, personId: id };
		dispatch(updateAddress(updates));
		navigate(`/contact/${id}`, { state: { from: location } });
	};

	const checkDiffAndUpdateState = () => {
		if (streetRef.current) {
			setUpdatedAddress((prev) => ({
				...prev,
				street: streetRef.current!.value,
			}));
			setDiffedState((prev) => ({
				...prev,
				street: streetRef.current.value !== address?.street,
			}));
		}
		if (cityRef.current) {
			setUpdatedAddress((prev) => ({
				...prev,
				city: cityRef.current!.value,
			}));
			setDiffedState((prev) => ({
				...prev,
				city: cityRef.current.value !== address?.city,
			}));
		}
		if (zipCodeRef.current) {
			setUpdatedAddress((prev) => ({
				...prev,
				zipCode: zipCodeRef.current!.value,
			}));
			setDiffedState((prev) => ({
				...prev,
				zipCode: zipCodeRef.current.value !== address?.zip_code,
			}));
		}
		if (stateRef.current) {
			setUpdatedAddress((prev) => ({
				...prev,
				stateInitials: stateRef.current!.value,
			}));
			setDiffedState((prev) => ({
				...prev,
				state: stateRef.current.value !== address?.state_initials,
			}));
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		checkDiffAndUpdateState();
	};

	useEffect(() => {
		dispatch(fetchAddress(id));
		setCurrentAddressValues({
			streetRef,
			stateRef,
			cityRef,
			zipCodeRef,
			address,
		});
	}, [streetRef.current, cityRef.current, zipCodeRef.current]);

	return (
		<Form>
			<SubmitButton
				isDiffed={
					Object.values(diffState).filter((val) => val !== false).length > 0
				}
				submitAndSave={handleUpdate}
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

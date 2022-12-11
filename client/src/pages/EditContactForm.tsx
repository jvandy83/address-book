import React, { useRef, useEffect, useState } from 'react';

import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
	fetchCurrentContact,
	updateContact,
} from '../redux/features/contact/contactSlice';

import { Form } from '../components/Form';

import { InputField } from '../components/InputField';
import { SubmitButton } from '../components/button/SubmitButton';
import { ContactType } from '~../types/Contact';

export const EditContactForm = () => {
	const [updatedContact, setUpdatedContact] = useState<ContactType>({
		firstName: '',
		lastName: '',
		email: '',
		id: '',
		company: '',
		phoneNumber: '',
	});

	const dispatch = useAppDispatch();

	const { currentContact } = useAppSelector((state) => state.contact);

	const { id } = useParams();

	const navigate = useNavigate();

	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const companyRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const phoneNumberRef = useRef<HTMLInputElement>(null);

	const [diffState, setDiffState] = useState({
		firstName: false,
		lastName: false,
		company: false,
		phoneNumber: false,
	});

	const handleSubmit = () => {
		const data = { updatedContact, id };
		dispatch(updateContact(data));
		navigate(`/contact/${id}`);
	};

	const handleSubmitAndRedirect = () => {
		const data = { updatedContact, id };
		dispatch(updateContact(data));
		navigate(`/edit-address-form/${id}`);
	};

	const handleRedirectWithoutSubmit = () => {
		navigate(`/edit-address-form/${id}`);
	};

	const checkDiffAndUpdateState = () => {
		if (firstNameRef.current) {
			setDiffState((prev) => ({
				...prev,
				firstName: firstNameRef.current.value !== currentContact.first_name,
			}));
			setUpdatedContact((prev) => ({
				...prev,
				firstName: firstNameRef.current.value,
			}));
		}
		if (lastNameRef.current) {
			setDiffState((prev) => ({
				...prev,
				lastName: lastNameRef.current.value !== currentContact.last_name,
			}));
			setUpdatedContact((prev) => ({
				...prev,
				lastName: lastNameRef.current.value,
			}));
		}
		if (companyRef.current) {
			setDiffState((prev) => ({
				...prev,
				company: companyRef.current.value !== currentContact.company,
			}));
			setUpdatedContact((prev) => ({
				...prev,
				company: companyRef.current.value,
			}));
		}
		if (emailRef.current) {
			setDiffState((prev) => ({
				...prev,
				email: emailRef.current.value !== currentContact.email,
			}));
			setUpdatedContact((prev) => ({
				...prev,
				email: emailRef.current.value,
			}));
		}
		if (phoneNumberRef.current) {
			setDiffState((prev) => ({
				...prev,
				phoneNumber:
					phoneNumberRef.current.value !== currentContact.phone_number,
			}));
			setUpdatedContact((prev) => ({
				...prev,
				phoneNumber: phoneNumberRef.current.value,
			}));
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		checkDiffAndUpdateState();
	};

	useEffect(() => {
		if (firstNameRef.current) {
			firstNameRef.current.value = currentContact?.first_name || '';
		}
		if (lastNameRef.current) {
			lastNameRef.current.value = currentContact?.last_name || '';
		}
		if (emailRef.current) {
			emailRef.current.value = currentContact?.email || '';
		}
		if (companyRef.current) {
			companyRef.current.value = currentContact?.company || '';
		}
		if (phoneNumberRef.current) {
			phoneNumberRef.current.value = currentContact?.phone_number || '';
		}
	}, [
		currentContact?.first_name,
		currentContact?.last_name,
		currentContact?.company,
		currentContact?.email,
		currentContact?.phone_number,
	]);

	useEffect(() => {
		dispatch(fetchCurrentContact(id));
	}, []);

	return (
		<Form>
			<SubmitButton
				submitAndSave={handleSubmit}
				isDiffed={
					Object.values(diffState).filter((val) => val !== false).length > 0
				}
			/>
			<InputField
				handleChange={handleChange}
				label='First Name'
				ref={firstNameRef}
				placeholder='First Name'
				id='firstName'
				name='firstName'
				type='text'
			/>
			<InputField
				handleChange={handleChange}
				label='Last Name'
				ref={lastNameRef}
				placeholder='Last Name'
				id='lastName'
				name='lastName'
				type='text'
			/>
			<InputField
				handleChange={handleChange}
				label='Company'
				ref={companyRef}
				placeholder='Company'
				id='company'
				name='company'
				type='text'
			/>
			<InputField
				handleChange={handleChange}
				label='Phone'
				ref={phoneNumberRef}
				placeholder='Phone'
				id='phoneNumber'
				name='phoneNumber'
				type='text'
			/>
			<InputField
				handleChange={handleChange}
				label='Email'
				ref={emailRef}
				placeholder='Email'
				id='email'
				name='email'
				type='text'
			/>
			<div className={`flex py-2`}>
				<button
					// handle submit contact
					// and redirect to address form
					onClick={
						Object.values(diffState).filter((val) => val !== false).length > 0
							? handleSubmitAndRedirect
							: handleRedirectWithoutSubmit
					}
					className=' bg-blue-600 hover:bg-blue-500 rounded-full w-12 h-10 flex justify-center items-center text-3xl cursor-pointer'
				>
					<span className='-translate-y-0.5'>+</span>
				</button>
				<div className='h-10 bg-grayBlue text-white w-full rounded ml-4 px-4 py-2'>
					add address
				</div>
			</div>
		</Form>
	);
};

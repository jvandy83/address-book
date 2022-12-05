import React, { useRef, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Form } from '../components/Form';

import { InputField } from '../components/InputField';
import { SubmitButton } from '../components/button/SubmitButton';

import { initialContactResponse } from '../App';

import { ContactFormType } from '../../types/Contact';
import { ContactResponseType } from '../../types/Contact';
import axios from 'axios';

interface IProps {
	handleSubmitAndRedirect: () => void;
	updateContact: () => void;
	setUpdatedContact: React.Dispatch<React.SetStateAction<ContactFormType>>;
}

export const EditContactForm = ({
	handleSubmitAndRedirect,
	updateContact,
	setUpdatedContact,
}: IProps) => {
	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const companyRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const phoneNumberRef = useRef<HTMLInputElement>(null);

	const [exisitingContact, setExistingContact] = useState<ContactResponseType>(
		initialContactResponse,
	);
	const [diffState, setDiffState] = useState({
		firstName: false,
		lastName: false,
		company: false,
		phoneNumber: false,
	});

	const navigate = useNavigate();

	const handleRedirectWithoutSubmit = () => {
		const currentContactId = JSON.parse(
			localStorage.getItem('current-contact')!,
		);

		navigate(`/edit-address-form/${currentContactId}`);
	};

	const checkDiffAndUpdateState = () => {
		if (firstNameRef.current) {
			setDiffState((prev) => ({
				...prev,
				firstName: firstNameRef.current.value !== exisitingContact.first_name,
			}));
			setUpdatedContact((prev) => ({
				...prev,
				firstName: firstNameRef.current.value,
			}));
		}
		if (lastNameRef.current) {
			setDiffState((prev) => ({
				...prev,
				lastName: lastNameRef.current.value !== exisitingContact.last_name,
			}));
			setUpdatedContact((prev) => ({
				...prev,
				lastName: lastNameRef.current.value,
			}));
		}
		if (companyRef.current) {
			setDiffState((prev) => ({
				...prev,
				company: companyRef.current.value !== exisitingContact.company,
			}));
			setUpdatedContact((prev) => ({
				...prev,
				company: companyRef.current.value,
			}));
		}
		if (emailRef.current) {
			setDiffState((prev) => ({
				...prev,
				email: emailRef.current.value !== exisitingContact.email,
			}));
			setUpdatedContact((prev) => ({
				...prev,
				email: emailRef.current.value,
			}));
		}
		if (phoneNumberRef.current) {
			setDiffState((prev) => ({
				...prev,
				phoneNumber: phoneNumberRef.current.value !== exisitingContact.phone_number,
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
			firstNameRef.current.value = exisitingContact?.first_name || '';
		}
		if (lastNameRef.current) {
			lastNameRef.current.value = exisitingContact?.last_name || '';
		}
		if (emailRef.current) {
			emailRef.current.value = exisitingContact?.email || '';
		}
		if (companyRef.current) {
			companyRef.current.value = exisitingContact?.company || '';
		}
		if (phoneNumberRef.current) {
			phoneNumberRef.current.value = exisitingContact?.phone_number || '';
		}
	}, [
		exisitingContact?.first_name,
		exisitingContact?.last_name,
		exisitingContact?.company,
		exisitingContact?.email,
		exisitingContact?.phone_number,
	]);

	useEffect(() => {
		const currentUserId = JSON.parse(localStorage.getItem('current-contact')!);
		currentUserId &&
			axios
				.get(`${process.env.REACT_APP_BASE_URL}/persons/${currentUserId}`)
				.then((res) => {
					const { data } = res;
					setExistingContact(data.contact);
				});
	}, []);

	return (
		<Form>
			<SubmitButton
				submitAndSave={updateContact}
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

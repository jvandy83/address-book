import React, { useRef, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Form } from '../components/Form';

import { InputField } from '../components/InputField';
import { SubmitAndRedirect } from '../components/button/SubmitAndRedirect';
import { SubmitButton } from '../components/button/SubmitButton';

import { initialContactResponse } from '../App';

import { ContactWithAddress } from '../../types/ContactWithAddress';
import { ContactFormType } from '../../types/Contact';
import { ContactResponseType } from '../../types/Contact';
import axios from 'axios';

interface IProps {
	editing: boolean;
	handleSubmitAndRedirect: () => void;
	updateContact: () => void;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
	setUpdatedContact: React.Dispatch<React.SetStateAction<ContactFormType>>;
}

export const EditContactForm = ({
	editing,
	setEditing,
	handleSubmitAndRedirect,
	updateContact,
	setUpdatedContact,
}: IProps) => {
	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const companyRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const phoneNumberRef = useRef<HTMLInputElement>(null);

	const [refState, setRefState] = useState<ContactResponseType>(
		initialContactResponse,
	);
	const [isDiffed, setDiffed] = useState(false);

	const navigate = useNavigate();

	const handleRedirectWithoutSubmit = () => {
		const currentContactId = JSON.parse(
			localStorage.getItem('current-contact')!,
		);
		console.log(currentContactId);

		navigate(`/edit-address-form/${currentContactId}`);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!editing) setEditing(true);
		if (firstNameRef.current) {
			setUpdatedContact((prev) => ({
				...prev,
				firstName: firstNameRef.current!.value,
			}));
			if (!isDiffed && firstNameRef.current.value !== refState.first_name) {
				setDiffed(true);
			}
		}
		console.log(isDiffed);
		if (lastNameRef.current) {
			setUpdatedContact((prev) => ({
				...prev,
				lastName: lastNameRef.current!.value,
			}));
			if (!isDiffed && lastNameRef.current.value !== refState.last_name) {
				setDiffed(true);
			}
		}
		if (companyRef.current) {
			setUpdatedContact((prev) => ({
				...prev,
				company: companyRef.current!.value,
			}));
			if (!isDiffed && companyRef.current.value !== refState.company) {
				setDiffed(true);
			}
		}
		if (emailRef.current) {
			setUpdatedContact((prev) => ({
				...prev,
				email: emailRef.current!.value,
			}));
			if (!isDiffed && emailRef.current.value !== refState.email) {
				setDiffed(true);
			}
		}
		if (phoneNumberRef.current) {
			setUpdatedContact((prev) => ({
				...prev,
				phoneNumber: phoneNumberRef.current!.value,
			}));
			if (!isDiffed && phoneNumberRef.current.value !== refState.phone_number) {
				setDiffed(true);
			}
		}
		!isDiffed && editing && setEditing(false);
	};

	useEffect(() => {
		if (firstNameRef.current) {
			firstNameRef.current.value = refState?.first_name || '';
		}
		if (lastNameRef.current) {
			lastNameRef.current.value = refState?.last_name || '';
		}
		if (emailRef.current) {
			emailRef.current.value = refState?.email || '';
		}
		if (companyRef.current) {
			companyRef.current.value = refState?.company || '';
		}
		if (phoneNumberRef.current) {
			phoneNumberRef.current.value = refState?.phone_number || '';
		}
	}, [
		refState?.first_name,
		refState?.last_name,
		refState?.company,
		refState?.email,
		refState?.phone_number,
	]);

	useEffect(() => {
		const currentUserId = JSON.parse(localStorage.getItem('current-contact')!);
		currentUserId &&
			axios
				.get(`http://localhost:8000/persons/${currentUserId}`)
				.then((res) => {
					const { data } = res;
					setRefState(data.contact);
				});
	}, []);

	return (
		<Form>
			<SubmitButton submitAndSave={updateContact} editing={editing} />
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
						isDiffed ? handleSubmitAndRedirect : handleRedirectWithoutSubmit
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

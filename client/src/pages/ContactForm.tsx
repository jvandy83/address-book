import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { createContact } from '../redux/features/contact/contactSlice';

import { InputField } from '../components/InputField';
import { SubmitButton } from '../components/button/SubmitButton';

import { Form } from '../components/Form';
import { SubmitAndRedirect } from '../components/button/SubmitAndRedirect';

import { useAppDispatch, useAppSelector } from '../redux/hooks';

export const ContactForm = () => {
	const [submitting, setSubmitting] = useState(false);
	const [submittingWithRedirect, setSubmittingWithRedirect] = useState(false);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { currentContact } = useAppSelector((state) => state.contact);

	const [contactForm, setContactForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
		company: '',
	});

	const handleSubmit = () => {
		setSubmitting(true);

		dispatch(createContact(contactForm));
	};

	const handleSubmitAndRedirect = () => {
		setSubmittingWithRedirect(true);

		dispatch(createContact(contactForm));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setContactForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	useEffect(() => {
		const newUserCreated = submitting && currentContact?.id;

		newUserCreated && navigate(`/contact/${currentContact.id}`);

		return () => setSubmitting(false);
	}, [currentContact?.id]);
	useEffect(() => {
		const newUserCreated = submittingWithRedirect && currentContact?.id;

		newUserCreated && navigate(`/address-form/${currentContact.id}`);

		return () => setSubmittingWithRedirect(false);
	}, [currentContact?.id]);

	return (
		<Form>
			<SubmitButton
				submitAndSave={handleSubmit}
				isDiffed={
					Object.values(contactForm).filter(
						(inputField) => inputField.length > 0,
					).length > 0
				}
			/>
			<div className='text-center py-4'>
				<h1 className='text-4xl font-indiaFlower text-white'>
					Create a Contact
				</h1>
			</div>
			<InputField
				placeholder='First Name'
				id='firstName'
				name='firstName'
				value={contactForm.firstName}
				handleChange={handleChange}
				type='text'
			/>
			<InputField
				placeholder='Last Name'
				id='lastName'
				name='lastName'
				value={contactForm.lastName}
				handleChange={handleChange}
				type='text'
			/>
			<InputField
				placeholder='Company'
				id='company'
				name='company'
				value={contactForm.company}
				handleChange={handleChange}
				type='text'
			/>
			<InputField
				placeholder='Phone'
				id='phoneNumber'
				name='phoneNumber'
				value={contactForm.phoneNumber}
				handleChange={handleChange}
				type='text'
			/>
			<InputField
				placeholder='Email'
				id='email'
				name='email'
				value={contactForm.email}
				handleChange={handleChange}
				type='text'
			/>
			<SubmitAndRedirect
				handleSubmitAndRedirect={handleSubmitAndRedirect}
				isDiffed={
					Object.values(contactForm).filter(
						(inputField) => inputField.length > 0,
					).length > 0
				}
			/>
		</Form>
	);
};

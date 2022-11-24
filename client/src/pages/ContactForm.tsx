import React from 'react';
import { InputField } from '../components/InputField';
import { SubmitButton } from '../components/button/SubmitButton';
import { ContactFormType } from '../../types/Contact';

import { Form } from '../components/Form';
import { SubmitAndRedirect } from '../components/button/SubmitAndRedirect';

interface IProps {
	handleSubmitAndSave: () => void;
	handleSubmitAndRedirect: () => void;
	setContactForm: React.Dispatch<React.SetStateAction<ContactFormType>>;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
	contactForm: ContactFormType;
	editing: boolean;
}

export const ContactForm = ({
	handleSubmitAndSave,
	handleSubmitAndRedirect,
	setContactForm,
	setEditing,
	contactForm,
	editing,
}: IProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		console.log(value);
		let isDiffed = false;
		if (!editing) setEditing(true);
		for (let field in contactForm) {
			isDiffed = contactForm[field] ? true : false;
		}
		!isDiffed && !value && editing && setEditing(false);
		setContactForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<Form>
			<SubmitButton submitAndSave={handleSubmitAndSave} editing={editing} />
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
				editing={editing}
			/>
		</Form>
	);
};

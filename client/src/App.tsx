import React, { useState, useEffect } from 'react';

import { Route, Routes, useNavigate } from 'react-router-dom';

import { ContactForm } from './pages/ContactForm';
import { AddressForm } from './pages/AddressForm';
import { EditContactForm } from './pages/EditContactForm';
import { EditAddressForm } from './pages/EditAddressForm';
import { Contact } from './pages/Contact';
import { ContactList } from './pages/ContactList';

import { Layout } from './components/Layout';

import { abbrState } from './utils';

import { FormStatus } from '../types/FormStatus';
import { ContactFormType } from '../types/Contact';
import {
	ContactsWithAddresses,
	ContactWithAddress,
} from '../types/ContactWithAddress';

import axios from 'axios';

const initialStatus = {
	enteringContact: false,
	enteringAddress: false,
	submittingContact: false,
	submittingAddress: false,
};

export const initialContactResponse = {
	first_name: '',
	last_name: '',
	email: '',
	phone_number: '',
	company: '',
	id: 0,
};
export const initialContactState = {
	first_name: '',
	last_name: '',
	phone_number: '',
	email: '',
	company: '',
	id: 0,
	person_id: 0,
	street: '',
	city: '',
	zip_code: '',
	state: '',
	state_initials: '',
};

const initialContactFormState = {
	firstName: '',
	lastName: '',
	phoneNumber: '',
	email: '',
	company: '',
};

export const initialAddressState = {
	street: '',
	city: '',
	zipCode: '',
	stateInitials: '',
};

export const initialAddressResponseState = {
	street: '',
	city: '',
	zip_code: '',
	state: '',
	state_initials: '',
};

export const App = () => {
	const navigate = useNavigate();
	// address state
	const [address, setAddress] = useState(initialAddressState);
	console.log(address);
	const [updatedAddress, setUpdatedAddress] = useState(initialAddressState);
	// contact state
	const [contacts, setContacts] = useState<ContactsWithAddresses>([]);
	const [contactForm, setContactForm] = useState<ContactFormType>(
		initialContactFormState,
	);
	const [updatedContact, setUpdatedContact] = useState(initialContactFormState);
	const [currentContact, setCurrentContact] =
		useState<ContactWithAddress>(initialContactState);
	//
	const [status, setStatus] = useState<FormStatus>(initialStatus);

	const [editing, setEditing] = useState(false);

	const [searchResults, setSearchResults] = useState<ContactsWithAddresses>([]);

	//// CONTACT HANDLERS
	const createContact = async (values) => {
		try {
			const { data } = await axios.post(
				'http://localhost:8000/person',
				{ ...values },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);
			localStorage.setItem('new-contact', String(data['contact'].id));
			return data;
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmitAndSaveContact = async () => {
		try {
			const data = await createContact(contactForm);
			setStatus((prev) => ({
				...prev,
				submittingContact: true,
			}));
			navigate(`/contact/${data.contact.id}`);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmitAndRedirectToAddress = async () => {
		await createContact(contactForm);
		setStatus((prev) => ({
			...prev,
			enteringAddress: true,
		}));
		setEditing(false);
		const newContactId = JSON.parse(localStorage.getItem('new-contact')!);
		navigate(`/address-form/${newContactId}`);
	};

	const fetchContacts = async () => {
		try {
			const { data } = await axios.get('http://localhost:8000/persons');
			console.log(data);
			setContacts(data.contacts);
		} catch (error) {
			console.error(error);
		}
	};

	const updateContact = async () => {
		try {
			axios.put(
				`http://localhost:8000/person/${currentContact.id}`,
				{
					...updatedContact,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);
			setUpdatedContact(initialContactFormState);
			setEditing(false);
			navigate(`/contact/${currentContact.id}`);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteContact = async (id) => {
		localStorage.removeItem('current-contact');
		localStorage.removeItem('new-contact');
		try {
			await axios.delete(`http://localhost:8000/person/${id}`);
		} catch (err) {
			console.error(err);
		}
	};
	//// END OF CONTACT HANDLERS

	//// ADDRESS HANDLERS
	const createAddress = async (values) => {
		const newContactId = JSON.parse(localStorage.getItem('new-contact')!);
		setStatus((prev) => ({
			...prev,
			submittingAddress: true,
		}));
		const convertedStateInitialsToName = abbrState(
			values.stateInitials,
			'name',
		);
		try {
			const { data } = await axios.post(
				`http://localhost:8000/address/${newContactId}`,
				{
					...values,
					state: convertedStateInitialsToName,
					personId: newContactId,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);
			setAddress(initialAddressState);
			setEditing(false);
			navigate(`/contact/${newContactId}`);
		} catch (error) {
			console.error(error);
		}
	};

	const updateAddress = async () => {
		const convertedStateInitialsToName = abbrState(
			updatedAddress.stateInitials,
			'name',
		);

		try {
			const { data } = await axios.get(
				`http://localhost:8000/address/${currentContact.id}`,
			);
			console.log(data);
			if (!data.address) {
				try {
					axios.post(
						`http://localhost:8000/address/${currentContact.id}`,
						{
							...updatedAddress,
							state: convertedStateInitialsToName,
							personId: currentContact.id,
						},
						{
							headers: {
								'Content-Type': 'application/json',
							},
						},
					);
					setAddress(initialAddressState);
					setEditing(false);
					navigate(`/contact/${currentContact.id}`);
				} catch (err) {
					console.error(err);
				}
			} else {
				axios
					.put(
						`http://localhost:8000/address/${currentContact.id}`,
						{
							...updatedAddress,
							state: convertedStateInitialsToName,
							personId: currentContact.id,
						},
						{
							headers: {
								'Content-Type': 'application/json',
							},
						},
					)
					.then((res) => {
						setEditing(false);
						navigate(`/contact/${currentContact.id}`);
					});
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const currentContactId = JSON.parse(
			localStorage.getItem('current-contact')!,
		);
		console.log('***currentContactId***', currentContactId);
		currentContactId &&
			axios
				.get(`http://localhost:8000/persons/${currentContactId}`)
				.then((res) => {
					const { data } = res;
					setCurrentContact(data.contact);
				});
	}, [JSON.parse(localStorage.getItem('current-contact')!)]);

	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route
					path='/contact-form'
					element={
						<ContactForm
							contactForm={contactForm}
							handleSubmitAndRedirect={handleSubmitAndRedirectToAddress}
							handleSubmitAndSave={handleSubmitAndSaveContact}
							setContactForm={setContactForm}
							editing={editing}
							setEditing={setEditing}
						/>
					}
				/>
				<Route
					path='/edit-contact-form/:id'
					element={
						<EditContactForm
							editing={editing}
							setEditing={setEditing}
							handleSubmitAndRedirect={handleSubmitAndRedirectToAddress}
							updateContact={updateContact}
							setUpdatedContact={setUpdatedContact}
						/>
					}
				/>
				<Route
					path='/edit-address-form/:id'
					element={
						<EditAddressForm
							setUpdatedAddress={setUpdatedAddress}
							editing={editing}
							setEditing={setEditing}
							updateAddress={updateAddress}
						/>
					}
				/>
				<Route
					path='/address-form/:id'
					element={
						<AddressForm
							handleClick={createAddress}
							status={status}
							setStatus={setStatus}
							address={address}
							setAddress={setAddress}
							editing={editing}
							setEditing={setEditing}
						/>
					}
				/>
				<Route
					path='/contact/:id'
					element={
						<Contact
							deleteContact={deleteContact}
							setSearchResults={setSearchResults}
						/>
					}
				/>
				<Route
					path='/'
					element={
						<ContactList
							setSearchResults={setSearchResults}
							searchResults={searchResults}
							contacts={contacts}
							fetchContacts={fetchContacts}
						/>
					}
				/>
			</Route>
		</Routes>
	);
};

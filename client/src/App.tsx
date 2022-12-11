import React, { useState, useEffect } from 'react';

import { Route, Routes } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './redux/hooks';

import { ContactForm } from './pages/ContactForm';
import { AddressForm } from './pages/AddressForm';
import { EditContactForm } from './pages/EditContactForm';
import { EditAddressForm } from './pages/EditAddressForm';
import { Contact } from './pages/Contact';
import { ContactList } from './pages/ContactList';

import { Layout } from './components/Layout';

import { ContactsWithAddresses } from '../types/ContactWithAddress';

import { fetchCurrentContact } from './redux/features/contact/contactSlice';

export const App = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const currentContactId = JSON.parse(
			localStorage.getItem('current-contact')!,
		);
		dispatch(fetchCurrentContact(currentContactId));
	}, []);
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route path='/contact-form' element={<ContactForm />} />
				<Route path='/edit-contact-form/:id' element={<EditContactForm />} />
				<Route path='/edit-address-form/:id' element={<EditAddressForm />} />
				<Route path='/address-form/:id' element={<AddressForm />} />
				<Route path='/contact/:id' element={<Contact />} />
				<Route
					path='/'
					element={
						<ContactList />
					}
				/>
			</Route>
		</Routes>
	);
};

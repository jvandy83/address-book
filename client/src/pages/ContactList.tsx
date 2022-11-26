import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { AddressBook } from '../components/AddressBook';

import { ContactsWithAddresses } from '../../types/ContactWithAddress';

interface IProps {
	contacts: ContactsWithAddresses;
	fetchContacts: () => void;
	fetchContact: (id: number) => void;
	setSearchResults: React.Dispatch<React.SetStateAction<ContactsWithAddresses>>;
	searchResults: ContactsWithAddresses;
}

export const ContactList = ({
	contacts,
	fetchContacts,
	fetchContact,
	searchResults,
	setSearchResults,
}: IProps) => {
	console.log('hello');

	const navigate = useNavigate();
	const renderHeaders = () => {
		return (
			<ul className='grid grid-cols-5 w-full text-white p-2'>
				<li className='flex justify-center'>Name</li>
				<li className='flex justify-center'>Address</li>
				<li className='flex justify-center'>Email</li>
				<li className='flex justify-center'>Phone</li>
				<li className='flex justify-center'>Company</li>
			</ul>
		);
	};

	const selectCurrentContactAndRedirect = (c) => {
		localStorage.setItem('current-contact', c.id);
		navigate(`/contact/${c.id}`);
	};

	const renderSearchResults = () => {
		return searchResults?.map((result) => (
			<li
				onClick={() => selectCurrentContactAndRedirect(result)}
				className='grid grid-cols-5 w-full bg-fadedBlue p-2 first:border-t border-b cursor-pointer hover:bg-fadedBlueHover'
				key={result.id}
			>
				<div className='flex justify-center items-center'>
					{result.first_name} {result.last_name}
				</div>
				<div className='flex flex-col justify-center mx-auto'>
					<div className='w-full'>{result.street}</div>
					<div>
						{result.city}
						{result.city && ','} {result.state_initials} {result.zip_code}
					</div>
				</div>
				<div className='flex justify-center items-center break-all'>
					{result.email}
				</div>
				<div className='flex justify-center items-center'>
					{result.phone_number}
				</div>
				<div className='flex justify-center items-center'>{result.company}</div>
			</li>
		));
	};

	const renderContacts = () => {
		return contacts?.map((c) => (
			<li
				onClick={() => selectCurrentContactAndRedirect(c)}
				className='grid grid-cols-5 w-full bg-fadedBlue p-2 first:border-t border-b cursor-pointer hover:bg-fadedBlueHover'
				key={c.id}
			>
				<div className='flex justify-center items-center'>
					{c.first_name} {c.last_name}
				</div>
				<div className='flex flex-col justify-center mx-auto'>
					<div className='w-full'>{c.street}</div>
					<div>
						{c.city}
						{c.city && ','} {c.state_initials} {c.zip_code}
					</div>
				</div>
				<div className='flex justify-center items-center break-all'>
					{c.email}
				</div>
				<div className='flex justify-center items-center'>{c.phone_number}</div>
				<div className='flex justify-center items-center'>{c.company}</div>
			</li>
		));
	};

	useEffect(() => {
		fetchContacts();
	}, []);

	return (
		<AddressBook setSearchResults={setSearchResults}>
			{renderHeaders()}
			<ul className='text-white h-4/5 flex flex-col'>
				{searchResults.length ? renderSearchResults() : renderContacts()}
			</ul>
		</AddressBook>
	);
};

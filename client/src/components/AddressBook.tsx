import React, { useEffect, useState } from 'react';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { ContactsWithAddresses } from '../../types/ContactWithAddress';
import { Navbar } from './Navbar';

interface IProps {
	children: React.ReactNode;
	setSearchResults?: React.Dispatch<
		React.SetStateAction<ContactsWithAddresses>
	>;
}

export const AddressBook = ({ children, setSearchResults }: IProps) => {
	const navigate = useNavigate();

	const [hideNav, setHideNav] = useState(false);
	const [searchString, setSearchString] = useState('');

	const { pathname } = useLocation();

	const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
		setSearchString(target.value);
	};

	const searchForContact = async () => {
		const { data } = await axios.post(
			`${process.env.REACT_APP_BASE_URL}/search`,
			{
				data: searchString,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		setSearchResults(data.matches);
	};

	const clearSearchResults = () => {
		setSearchString('');
		setSearchResults && setSearchResults([]);
		navigate('/');
	};

	useEffect(() => {
		if (pathname.includes('form')) {
			if (!hideNav) setHideNav(true);
		} else {
			setHideNav(false);
		}
	}, [pathname]);

	return (
		<div className='lg:w-7/8 max-w-4xl text-darkBlue bg-darkBlue h-screen w-screen xl:h-4/5 xl:rounded-lg flex flex-col  px-4'>
			<Navbar
				handleChange={handleChange}
				clearSearchResults={clearSearchResults}
				searchForContact={searchForContact}
				searchString={searchString}
				hideNav={hideNav}
			/>
			{children}
		</div>
	);
};

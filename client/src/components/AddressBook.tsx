import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../redux/hooks';

import { clearSearchResults } from '../redux/features/contact/contactSlice';

import { Navbar } from './Navbar';

interface IProps {
	children: React.ReactNode;
}

export const AddressBook = ({ children }: IProps) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [hideNav, setHideNav] = useState(false);
	const [searchString, setSearchString] = useState('');

	const { pathname } = useLocation();

	const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
		setSearchString(target.value);
	};

	const reset = () => {
		setSearchString('');
		dispatch(clearSearchResults());
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
		<div className='lg:w-7/8 max-w-4xl text-darkBlue bg-darkBlue h-screen w-screen xl:h-4/5 xl:rounded-lg flex flex-col relative px-4'>
			<Navbar
				handleChange={handleChange}
				clearSearchResults={reset}
				searchString={searchString}
				hideNav={hideNav}
			/>
			{children}
		</div>
	);
};

import React, { useEffect, useState } from 'react';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import FA from 'react-fontawesome';
import axios from 'axios';
import { ContactsWithAddresses } from '../../types/ContactWithAddress';

interface IProps {
	children: React.ReactNode;
	setSearchResults: React.Dispatch<React.SetStateAction<ContactsWithAddresses>>;
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
		<div className='lg:w-7/8 max-w-5xl relative text-darkBlue bg-darkBlue h-screen w-screen top-0 bottom-0 left-0 right-0  xl:h-4/5 lg:p-8 xl:rounded-lg flex flex-col justify-center px-4'>
			<nav>
				<ul className='absolute top-4 flex justify-between w-24'>
					<li
						onClick={clearSearchResults}
						className='text-orange-500 cursor-pointer hover:text-orange-400'
					>
						<FA name='users' size='lg' />
					</li>
					<li className='text-green-600 cursor-pointer hover:text-green-500'>
						<button onClick={searchForContact}>
							<FA name='search' size='lg' />
						</button>
					</li>
				</ul>
				<div className='absolute top-4 left-36'>
					<input
						onChange={handleChange}
						name='search'
						value={searchString || ''}
						className='w-52 rounded shadow-inner-sm outline-none px-2'
						type='text'
					/>
				</div>
				{!hideNav && (
					<NavLink to='/contact-form'>
						<div className=' bg-blue-600 hover:bg-blue-500 rounded-full w-6 h-6 flex justify-center items-center text-xl cursor-pointer absolute top-4 right-6'>
							<span className='-translate-y-0.5'>+</span>
						</div>
					</NavLink>
				)}
			</nav>
			{children}
		</div>
	);
};

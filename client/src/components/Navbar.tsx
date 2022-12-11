import React from 'react';

import { NavLink } from 'react-router-dom';

import FA from 'react-fontawesome';
import { searchContacts } from '../redux/features/contact/contactSlice';

interface IProps {
	hideNav: boolean;
	clearSearchResults: () => void;
	handleChange: React.ChangeEventHandler<HTMLInputElement>;
	searchString: string;
}

export const Navbar = ({
	hideNav,
	clearSearchResults,
	handleChange,
	searchString,
}: IProps) => {
	return (
		<nav className='py-4 px-2'>
			<div className='flex justify-between'>
				<div className='flex justify-between w-1/2'>
					<button
						onClick={clearSearchResults}
						className='text-orange-500 cursor-pointer hover:text-orange-400'
					>
						<FA name='users' size='lg' />
					</button>
					<div className='flex pr-4'>
						<button
							className='text-green-600 cursor-pointer hover:text-green-500 pr-4'
							onClick={() => searchContacts(searchString)}
						>
							<FA name='search' size='lg' />
						</button>
						<div>
							<input
								onChange={handleChange}
								name='search'
								value={searchString || ''}
								className='w-52 rounded shadow-inner-sm outline-none px-2'
								type='text'
							/>
						</div>
					</div>
				</div>
				{!hideNav && (
					<NavLink to='/contact-form'>
						<li className='bg-blue-600 hover:bg-blue-500 rounded-full w-6 h-6 flex justify-center items-center text-xl cursor-pointer'>
							<span className='-translate-y-0.5'>+</span>
						</li>
					</NavLink>
				)}
			</div>
		</nav>
	);
};

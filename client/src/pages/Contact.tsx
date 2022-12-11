import React, { useState, useEffect } from 'react';

import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../redux/hooks';

import { deleteContact } from '../redux/features/contact/contactSlice';

import { fetchCurrentContact } from '../redux/features/contact/contactSlice';

import { AddressBook } from '../components/AddressBook';

import FA from 'react-fontawesome';

export const Contact = () => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { currentContact } = useAppSelector((state) => state.contact);

	const handleDeleteContact = (id) => {
		dispatch(deleteContact(id));
		navigate('/');
	};

	useEffect(() => {
		dispatch(fetchCurrentContact(id));
	}, []);

	useEffect(() => {
		dispatch(fetchCurrentContact(id));
	}, [location.state?.from?.pathname]);

	return (
		<AddressBook>
			<div className='text-white h-4/5 flex flex-col lg:border-2 max-w-xl mx-auto w-full rounded-lg group relative'>
				<div className='absolute top-2 left-4 hidden group-hover:block'>
					<a
						className='text-green-500'
						href={`mailto:${currentContact?.email}`}
					>
						<FA name='send' size='md' />
					</a>
				</div>
				<div className='absolute top-2 right-2 hidden group-hover:block'>
					<button
						onClick={() => navigate(`/edit-contact-form/${currentContact?.id}`)}
						className='text-blue-500 hover:text-blue-400'
					>
						<FA name='edit' size='lg' />
					</button>
					<button
						onClick={() => handleDeleteContact(currentContact?.id)}
						className='text-red-500 hover:text-red-400 px-4'
					>
						<FA name='trash' size='lg' />
					</button>
				</div>
				<div className='border-b w-full h-full flex flex-col items-center justify-center'>
					<div className='border-2 rounded-full w-24 h-24 flex justify-center items-center mb-8'>
						<FA name='user' size='4x' />
					</div>
					<h1 className='text-2xl'>
						{currentContact?.first_name} {currentContact?.last_name}
					</h1>
					<p>{currentContact?.company && currentContact?.company}</p>
				</div>
				<div className='h-full flex justify-center items-center'>
					<div className='flex flex-col justify-center w-full px-4 md:px-0 sm:w-3/5'>
						<div className='flex justify-between py-2'>
							<span>Phone: </span>
							<p>{currentContact?.phone_number}</p>
						</div>
						<div className='flex justify-between py-2'>
							<span>Email: </span>
							<p>{currentContact?.email}</p>
						</div>
						<div className='flex justify-between py-2'>
							<span>Address: </span>
							<div className='flex flex-col items-end'>
								<p>{currentContact?.street}</p>
								<p>
									<span className='pr-1'>
										{currentContact?.city}
										{currentContact?.city && ','}
									</span>
									<span className='pr-1'>{currentContact?.state_initials}</span>
									<span>{currentContact?.zip_code}</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AddressBook>
	);
};

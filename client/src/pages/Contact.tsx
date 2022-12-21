import React, { useState, useEffect, useRef } from 'react';

import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
	deleteContact,
	addProfilePicture,
} from '../redux/features/contact/contactSlice';

import { fetchCurrentContact } from '../redux/features/contact/contactSlice';

import { AddressBook } from '../components/AddressBook';

import FA from 'react-fontawesome';

import axios from 'axios';
import { profile } from 'console';

// TODO:
// refactor the flow of
// updating a contact and
// fetching updated contact
// without useEffect X 2

export const Contact = () => {
	const [selectedFile, setSelectedFile] = useState<any>({});
	const [fileIsSelected, setFileIsSelected] = useState(false);

	const [loadNewProfilePicture, setLoadNewProfilePicture] = useState(false);

	const { id } = useParams();
	const fileInputRef = useRef(null);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { currentContact } = useAppSelector((state) => state.contact);

	const uploadFile = async (file, s3Data, dataUrl, url) => {
		// TODO:
		// start loading when
		// uploadFile is called
		const uploadObject = { ...s3Data.fields, file };

		try {
			const res = await axios.get(dataUrl, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			console.log(res.data);
		} catch (error) {
			console.error(error);
		}

		try {
			const res = await axios.post(dataUrl, uploadObject, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			if (res.status === 204) {
				// stop loading when
				// status === 204
				dispatch(addProfilePicture({ url, id }));
				setLoadNewProfilePicture(true);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const getSignedRequest = async (file) => {
		if (currentContact?.profile_picture) {
			//...
			try {
				await axios.post(
					`${process.env.REACT_APP_BASE_URL}/contact/profile-picture`,
					{
						url: currentContact?.profile_picture,
					},
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				);
			} catch (error) {
				console.error(error);
			}
		}

		let res;
		try {
			res = await axios.get(
				`${process.env.REACT_APP_BASE_URL}/sign-s3?file_name=${file.name}&file_type=${file.type}`,
			);
			console.log(res);
		} catch (error) {
			console.error(error);
		}

		try {
			const { data, url } = res.data;
			uploadFile(file, data, data.url, url);
			const updateInfo = { profilePicture: url, id };
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteContact = (id) => {
		dispatch(deleteContact(id));
		navigate('/');
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.files[0]);
		setSelectedFile(e.target.files[0]);
		setFileIsSelected(true);
	};

	useEffect(() => {
		dispatch(fetchCurrentContact(id));
	}, []);

	useEffect(() => {
		dispatch(fetchCurrentContact(id));
		return () => setLoadNewProfilePicture(false);
	}, [location.state?.from?.pathname, loadNewProfilePicture]);

	useEffect(() => {
		fileIsSelected && getSignedRequest(selectedFile);
		return () => setFileIsSelected(false);
	}, [fileIsSelected]);

	return (
		<AddressBook>
			<div className='text-white h-4/5 flex flex-col lg:border-2 max-w-xl mx-auto w-full rounded-lg relative'>
				<div className='absolute top-2 left-4'>
					<a
						className='text-green-500'
						href={`mailto:${currentContact?.email}`}
					>
						<FA name='send' size='md' />
					</a>
				</div>
				<div className='absolute top-2 right-2'>
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
					<div className='rounded-full w-24 h-24 flex justify-center items-center mb-8 group relative'>
						{(currentContact?.profile_picture && (
							<div
								style={{
									backgroundImage: `url(${currentContact?.profile_picture})`,
								}}
								className='w-24 bg-cover bg-center rounded-full group-hover:opacity-20'
							>
								<div className='w-24 h-24' />
							</div>
						)) || (
							<FA className='group-hover:opacity-20' name='user' size='4x' />
						)}
						<button
							onClick={() => console.log(fileInputRef.current.click())}
							className='absolute hidden group-hover:block top-10 right-8'
						>
							edit
						</button>
						<input
							className='hidden'
							ref={fileInputRef}
							onChange={handleFileUpload}
							type='file'
							name='file'
							id='file'
						/>
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

import React from 'react';

import { AddressBook } from './AddressBook';

interface IProps {
	children: React.ReactNode;
}

export const Form = ({ children }) => {
	return (
		<AddressBook>
			<div className='mx-auto w-full md:w-3/4 lg:w-3/4 xl:w-7/12'>
				{children}
			</div>
		</AddressBook>
	);
};

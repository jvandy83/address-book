import React from 'react';

import { Outlet } from 'react-router-dom';

export const Layout = () => {
	return (
		<div className='bg-grayBlue h-screen flex justify-center items-center text-gray-900 '>
			<Outlet />
		</div>
	);
};

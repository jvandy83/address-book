import React from 'react';
import { ContactFormType } from '../../../types/Contact';

interface IProps {
	isDiffed: boolean;
	handleSubmitAndRedirect: () => void;
}

export const SubmitAndRedirect = ({
	isDiffed,
	handleSubmitAndRedirect,
}: IProps) => {
	return (
		<div className={`flex py-2 ${!isDiffed && 'invisible'}`}>
			<button
				disabled={!isDiffed}
				// handle submit contact
				// and redirect to address form
				onClick={handleSubmitAndRedirect}
				className=' bg-blue-600 hover:bg-blue-500 rounded-full w-12 h-10 flex justify-center items-center text-3xl cursor-pointer'
			>
				<span className='-translate-y-0.5'>+</span>
			</button>
			<div className='h-10 bg-grayBlue text-white w-full rounded ml-4 px-4 py-2'>
				add address
			</div>
		</div>
	);
};

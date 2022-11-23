import React, { useRef } from 'react';

interface IProps {
	type: string;
	id: string;
	name: string;
	value?: string;
	handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	ref?: React.RefObject<HTMLInputElement>;
	label?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, IProps>(
	({ type, id, name, value, handleChange, placeholder, label }, ref) => {
		return (
			<div className='py-4'>
				<label htmlFor={id}>
					<span className='text-white text-lg'>{label}</span>
				</label>
				<input
					ref={ref}
					className='outline-none rounded shadow-inner-sm w-full py-1 px-2'
					placeholder={placeholder}
					type={type}
					id={id}
					name={name}
					value={value}
					onChange={handleChange}
					autoComplete='none'
				/>
			</div>
		);
	},
);

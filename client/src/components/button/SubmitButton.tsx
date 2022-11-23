import React from 'react';

interface IProps {
	editing: boolean;
	submitAndSave: () => void;
}

export const SubmitButton = ({ submitAndSave, editing }: IProps) => {
	return (
		<button
			onClick={submitAndSave}
			className={`absolute top-4 right-6 ${
				editing ? 'text-blue-300' : 'text-grayBlue'
			}`}
			disabled={!editing}
		>
			Done
		</button>
	);
};

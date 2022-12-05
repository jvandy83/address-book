import React from 'react';

interface IProps {
	isDiffed: boolean;
	submitAndSave: () => void;
}

export const SubmitButton = ({ submitAndSave, isDiffed }: IProps) => {
	return (
		<button
			onClick={submitAndSave}
			className={`absolute top-4 right-6 ${
				isDiffed ? 'text-blue-300' : 'text-grayBlue'
			}`}
			disabled={!isDiffed}
		>
			Done
		</button>
	);
};

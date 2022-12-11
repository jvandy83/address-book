declare var process: {
	env: {
		REACT_APP_BASE_URL: string;
	};
};

export const BASE_URL = process.env.REACT_APP_BASE_URL;

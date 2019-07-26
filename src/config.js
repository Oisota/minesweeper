/* eslint no-process-env: 0 */
const config = {};

switch (process.env.NODE_ENV) {
	case 'production':
		config.ENV = 'production';
		break;
	default:
		config.ENV = 'development';
}

export default config;

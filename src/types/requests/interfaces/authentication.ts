export interface AuthenticationParameters {
	strategy: string;
	email: string;
	password: string;
}

export interface AuthenticationResponse {
	accessToken: string;
}

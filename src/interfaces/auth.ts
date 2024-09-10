interface IToken {
    accessToken: string;
    expiresIn: number;
}

export interface IAuthResponse {
    token: {
        accessToken: IToken;
        refreshToken: IToken;
    };
}

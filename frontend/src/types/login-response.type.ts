export type LoginResponseType = {
    error: boolean,
    response: InfoResponseType | ErrorResponseType,
    redirect?: string
}

export type InfoResponseType = {
    tokens: { accessToken: string, refreshToken: string },
    user: UserInfoResponseType
}

export type UserInfoResponseType = {
    name: string,
    lastName: string,
    id: number
}

type ErrorResponseType = {
    error: boolean,
    message: string,
    validation?: { key: string, message: string, }
}

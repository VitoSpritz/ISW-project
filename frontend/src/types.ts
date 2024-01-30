export interface User{
    username: string,
    email: string
}

export interface room{
    id: string,
    roomName: string
}

export interface messageBody{
    userId: string,
    message: string
}
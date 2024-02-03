export interface User{
    username: string,
    email: string
}

export interface room{
    id: string,
    roomName: string
}

export interface roomOwner extends room{
    roomCreator: string
}

export interface messageBody{
    userId: string,
    message: string,
    utente: string,
    showimg: boolean,
    messageId: number
}

export interface bannedUser{
    email: string,
    id: string,
    inizio_sospensione: string,
    fine_sospensione: string
}

export interface Moderator{
    email: string,
    id: string,
    user: string
}
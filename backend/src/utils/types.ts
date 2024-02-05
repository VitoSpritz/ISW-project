export interface messageBody {
    userId: string;
    message: string;
    utente: string;
    showimg: boolean;
    messageId: number;
}

export interface room{
    id: string,
    roomName: string
}

export interface roomOwner extends room{
    roomCreator: string
}
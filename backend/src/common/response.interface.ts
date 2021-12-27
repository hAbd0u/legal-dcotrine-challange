export default interface IResponse {
    status: number, 
    success?: string,
    error?: string,
    details: {
        description: string,
        id?: string,
        query?: string
    }
}
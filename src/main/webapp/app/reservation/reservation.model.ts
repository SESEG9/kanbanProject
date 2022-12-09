export interface Customer {
    name: string,
    birthday: string,
    gender: string,
    billingAddress: string,
    email: string,
    telephone: string,
}
export interface ReservationRoom {
    roomID: number,
    capacityID: number
}
export interface Reservation {
    dicountCode?: string,
    startDate: string,
    duration: number,
    billingCustomer: Customer,
    customers: Customer[],
    rooms: ReservationRoom[]
}
export interface CapacityResponse {
    id: number,
    name: string,
    capacity: number
}
export interface RoomResponse {
    id: number,
    price: number,
    capacity: CapacityResponse,
    room: {id: number, identifyer: string, maxCapacity: number}
}
export interface ReservationResponse {
    id: number,
    bookingCode: string,
    discount: number,
    price: number,
    startDate: string,
    duration: number,
    canceled: boolean,
    customers: Customer[],
    billingCustomer: Customer,
    rooms: RoomResponse[]
}

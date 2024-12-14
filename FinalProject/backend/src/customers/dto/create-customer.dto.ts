export class CreateCustomerDto {
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone: string;
  refresh_token?: string;
}

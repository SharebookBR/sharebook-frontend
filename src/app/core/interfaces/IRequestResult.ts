export interface IRequestResult<TypeOut> {
  messages: Array<string>;
  success: boolean;
  successMessage: string;
  value: TypeOut;
}

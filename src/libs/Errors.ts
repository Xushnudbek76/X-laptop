export enum HttpCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data is found",
  CREATE_FAILED = "Create failed",
  UPDATE_FAILED = "Update failed",

  USED_NICK_PHONE = "Nick or phone number is already in use!",
 NO_MEMBER_NICK = "Member with that nick does not exist!",
 WRONG_PASSWORD = "Password is incorrect, please try again!",
}

class Errors extends Error {
  public code: HttpCode;
  public message: Message;
  
  static standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  };

  constructor(statusCode: HttpCode, statusMessage: Message) {
    super();
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;
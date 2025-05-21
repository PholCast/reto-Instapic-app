import { PartialType } from "@nestjs/mapped-types";
import { LoginDto } from "./login-request.dto";

export class SignUpDto extends PartialType(LoginDto){
    email:string;
    name:string;
} 
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService:JwtService){}

  canActivate(context: ExecutionContext): boolean {
    let request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if(authorization){
      try{
        const token = this.getToken(authorization);
        this.jwtService.verify(token);
        return true;
      }catch(error){
        throw new UnauthorizedException({code:'503', detail:'Acceso no autorizado'});
      }
    }
    throw new UnauthorizedException({code:'503', detail:'Acceso no autorizado'});
  }

  private getToken(authorization:string):string{
    const token = authorization.split(' ');
    return token[1] ? token[1]:'';
  }
}

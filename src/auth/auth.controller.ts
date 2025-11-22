import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type ConfirmEmailDto, confirmEmailSchema, createSignupSchema, type CreateSignupDto, loginSchema, type LoginDto, signUpGoogleSchema, type SignUpGoogleDto, loginGoogleSchema, type LoginGoogleDto, forgotPasswordSchema, type ForgotPasswordDto, resetPasswordSchema, type ResetPasswordDto } from './dto/create-auth.dto';
import { ZodValidationPipe } from 'src/Common/pipe/zod.pip';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService,) {}


  @UsePipes(new ZodValidationPipe(createSignupSchema))
  @Post(`signup`)
  create(@Body() body: CreateSignupDto ) {
    return this.authService.create(body);
  }

  @UsePipes(new ZodValidationPipe(confirmEmailSchema))
  @Patch(`confirm-email`)
  confirmEmail(@Body()  confirmEmailDto: ConfirmEmailDto) {
    return this.authService.confirmEmail( confirmEmailDto);
  }

  @UsePipes(new ZodValidationPipe(loginSchema))
  @Post(`login`)
  login(@Body()  loginDto: LoginDto) {
    return this.authService.login( loginDto);
  }

  @UsePipes(new ZodValidationPipe(signUpGoogleSchema))
  @Post(`signUp-google`)
  signUpGoogle(@Body()  signUpGoogleDto: SignUpGoogleDto) {
    return this.authService.signUpGoogle( signUpGoogleDto);
  }

  @UsePipes(new ZodValidationPipe(loginGoogleSchema))
  @Post(`login-google`)
  loginGoogle(@Body()  loginGoogleDto: LoginGoogleDto) {
    return this.authService.loginGoogle( loginGoogleDto);
  }

  @UsePipes(new ZodValidationPipe(forgotPasswordSchema))
  @Post(`forgot-password`)
  forgotPassword(@Body()  forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword( forgotPasswordDto);
  }

  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  @Patch(`reset-password`)
  resetPassword(@Body()  resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword( resetPasswordDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() ) {
  //   return this.authService.update(+id);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

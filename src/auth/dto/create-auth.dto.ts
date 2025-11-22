import { GenderEnum, ProviderEnum, UserRolesEnum } from "src/Common/enums/User.enum";
import { z } from "zod";



const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);


export const createSignupSchema = z.strictObject({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    role: z.enum(UserRolesEnum).default(UserRolesEnum.USER),
    password: z.string().min(3).max(6),
    confirmPassword: z.string().min(3).max(6),
    provider: z.enum(ProviderEnum).default(ProviderEnum.SYSTEM),
    gender: z.enum(GenderEnum).default(GenderEnum.MALE),





    DOB: z.string().transform((str, ctx) => {
        const date = new Date(str);
        if (isNaN(date.getTime())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "age must be a valid date",
            });
            return z.NEVER;
        }
        return date;
    })
    .pipe(z.date())
    .refine((date) => date < new Date(), {
        message: "age must be smaller than the current date",
    })
    .refine((date) => date <= eighteenYearsAgo, {
        message: "age must be greater than 18 years",
    }),
    


    mobileNumber: z.string(),
    isConfirmed: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type CreateSignupDto = z.infer<typeof createSignupSchema>


export const confirmEmailSchema = z.strictObject({
    email: z.string().email(),
    code: z.string(),
})
export type ConfirmEmailDto = z.infer<typeof confirmEmailSchema>


export const loginSchema = z.strictObject({
    email: z.string().email(),
    password: z.string().min(3).max(6),
})
export type LoginDto = z.infer<typeof loginSchema>



export const signUpGoogleSchema = z.strictObject({

    idToken: z.string(),

})

export type SignUpGoogleDto = z.infer<typeof signUpGoogleSchema>



export const loginGoogleSchema = z.strictObject({
   idToken: z.string(),
})

export type LoginGoogleDto = z.infer<typeof loginGoogleSchema>

export const forgotPasswordSchema = z.strictObject({
    email: z.string().email(),
})

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>


export const resetPasswordSchema = z.strictObject({
    email: z.string().email(),
    code: z.string(),
    password: z.string().min(3).max(6),
    confirmPassword: z.string().min(3).max(6),
})

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>




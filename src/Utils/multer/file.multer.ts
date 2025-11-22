import { FileInterceptor } from "@nestjs/platform-express"

export const uploadFileToMemory = () => {
    return FileInterceptor('file'); 
}
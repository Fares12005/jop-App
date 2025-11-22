import bcrypt from 'bcrypt';



export const hashPassword = async ({plantext , salt = Number(process.env.SALT)}) => {return await bcrypt.hash(plantext , salt)}
export const CombarePassword = async ({plantext , hash}) => {return await bcrypt.compare(plantext , hash)}
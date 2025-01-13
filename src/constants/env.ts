
const getEnv = (key:string, defaultValue?:string) : string=>{
    const value = process.env[key] || defaultValue

    if(value === undefined){
        throw Error(`the ${key} value is missing`)
    }

    return value
}


export const PORT = getEnv("PORT","3000");
export const NODE_ENV = getEnv("NODE_ENV");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const MONGO_URI = getEnv("MONGO_URI");
export const JWT_SECRET = getEnv("JWT_SECRET");  
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const EMAIL_APP_PASSWORD = getEnv("EMAIL_APP_PASSWORD");

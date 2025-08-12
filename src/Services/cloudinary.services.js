import   cloudinary from 'cloudinary';
import  dotenv from 'dotenv'
dotenv.config()
cloudinary.config({ 
  cloud_name:process.env.cloudinary_name , 
  api_key:   process.env.cloudinary_api_key, 
  api_secret:process.env.cloudinary_api_Sercret,
  cloud_name:'doxf5mulx',
  
api_secret:'uQLTzQ0EN-ITuk8CZzpMGC8UI_A' ,
api_key:'486654281383387'
});

export default cloudinary.v2

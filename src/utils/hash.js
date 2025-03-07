import bcrypt from 'bcrypt';

export const hash =  password=> 
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    


export const isValidPassword = (password, hash) => 
   bcrypt.compareSync(password, hash );

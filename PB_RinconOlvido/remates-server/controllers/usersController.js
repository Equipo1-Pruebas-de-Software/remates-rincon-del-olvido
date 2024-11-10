import User from "../models/User.js";

export default class UserController{

    async getEmailFromId(userId){
        try{
            const user = await User.findByPk(userId);
            if (!user) {
                return '';
            }
            return user.email;
        } catch (error) {
            console.log('Unable to retrieve user: ', error)
        }
    }

}
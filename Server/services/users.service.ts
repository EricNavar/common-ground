import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@/interfaces/users.interface'
import userModel from '@/models/users.models';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class UserService {
    public users = userModel;

    public async findAllUser(): Promise<User[]> {
        const users: User[] = await this.users.find();
        return users;
    }

    /**
     * 
     * @param {String} userId - id of user
     * @returns {User} found user object
     */
    public async findUserById(userId: string): Promise<User> {
        if (isEmpty(userId)) throw new HttpException(400, "UserId is empty");

        const findUser : User = await this.users.findOne({ _id: userId });
        if (!findUser) throw new HttpException(409, "User doesn't exist");

        return findUser;
    }
    
    /**
     * 
     * @param {String} userEmail - email of user
     * @returns {User} found user object
     */
    public async findUserByEmail(userEmail: string): Promise<User> {
        if (isEmpty(userEmail)) throw new HttpException(400, "UserEmail is empty");

        const findUser : User = await this.users.findOne({ email: userEmail });
        if (!findUser) throw new HttpException(409, "User doesn't exist");

        return findUser;
    }

    /**
     * 
     * @param {CreateUserDto} userData - data to create user
     * @returns {User} created user object 
     */
    public async createUser(userData: CreateUserDto): Promise<User> {
        if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

        const findUser: User = await this.users.findOne({ email: {$eq: userData.email} });
        if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

        this.users.register(new userModel({email: userData.email, firstname: userData.firstname, lastname: userData.lastname, role: "user"}), userData.password, (err: Error, user : User) => {
            if(err)
            {
                throw new HttpException(409, "Your account could not be saved. Error: " + err);
            }
        });

        const createdUser : User = await this.users.findOne({ email: {$eq: userData.email} });
        return createdUser;
    }

    /**
     * 
     * @param {String} userId - id of user 
     * @returns deleted user
     */
    public async deleteUser(userId: string): Promise<User> {
        const deleteUserById: User = await this.users.findByIdAndDelete(userId);
        if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

        return deleteUserById;
    }

    /**
     * 
     * @param {String[]} ids - list or single user ids
     * @returns {Array} array of user ids which matches
     */
    public async getUserByIds(ids: string | string[]) : Promise<User[]> {
        try {
            const users = await this.users.find({_id: {$in: ids}});
            return users;
        } catch(error) {
            throw error;
        }
    }

}

export default UserService;

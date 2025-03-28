class UserRepository {
    constructor(dao) {
        this.dao = dao
    }
    createUser = async (newUser) => {
       return  await this.dao.create(newUser)
    }
    getUsers = async  () => {
      return   await this.dao.get()
    }

}

export default UserRepository;
import * as httpStatus from '../../util/httpStatus';
import JsonResponse from '../../util/JsonResponse';
import User from './userModel';

class UserController {
    async getAll(req, res) {
        return res.status(httpStatus.OK)
            .json(JsonResponse.success('Users fetched sucessfully', httpStatus.OK, await User.find({})))
    }
}

export default new UserController();
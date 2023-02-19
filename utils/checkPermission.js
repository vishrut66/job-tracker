const checkPermission = (reqUser, resUserId) => {

    if (reqUser.userId === resUserId.toString()) {
        return true
    } else {
        return false
    }

}

export default checkPermission
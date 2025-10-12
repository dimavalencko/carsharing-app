export const IdentityEndpoints = {
  USERS: {
    GET_ALL: 'identity.users.getAll',
    GET_BY_ID: 'identity.users.getById',
    GET_BY_EMAIL: 'identity.users.getByEmail',
    UPDATE: 'identity.users.update',
    DELETE: 'identity.users.delete',
    GET_PROFILE: 'identity.users.getProfile',
    UPDATE_PROFILE: 'identity.users.updateProfile',
  },
  AUTH: {
    LOGIN: 'identity.auth.login',
    REGISTER: 'identity.auth.register',
    VALIDATE_TOKEN: 'identity.auth.validateToken',
    REFRESH: 'identity.auth.refresh',
    CHANGE_PASSWORD: 'identity.auth.changePassword',
    LOGOUT: 'identity.auth.logout',
    VALIDATE_USER: 'identity.auth.validateUser',
    REVOKE_SESSIONS: 'identity.auth.revokeSessions',
  },
  DRIVER_LICENSE: {
    CREATE: 'identity.driverLicense.create',
    GET: 'identity.driverLicense.get',
    UPDATE: 'identity.driverLicense.update',
    DELETE: 'identity.driverLicense.delete',
    CAN_RENT_CAR: 'identity.driverLicense.canRentCar',
    GET_STATUS: 'identity.driverLicense.getStatus',
  },
  ADMIN: {
    GET_ALL_USERS: 'identity.admin.getAllUsers',
    GET_USER_DETAILS: 'identity.admin.getUserDetails',
    GET_USER_DRIVER_LICENSE: 'identity.admin.getUserDriverLicense',
    GET_SYSTEM_STATS: 'identity.admin.getSystemStats',
    GET_ACTIVE_SESSIONS: 'identity.admin.getActiveSessions',
    FORCE_LOGOUT_USER: 'identity.admin.forceLogoutUser',
    GET_LOGIN_HISTORY: 'identity.admin.getLoginHistory',
  },
  HEALTH: {
    CHECK: 'identity.health.check',
    CHECK_DB: 'identity.health.check_db'
  }
} as const;
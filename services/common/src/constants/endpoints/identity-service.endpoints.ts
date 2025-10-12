export const IdentityEndpoints = {
  USERS: {
    GET_ALL: 'identity.users.getAll',
    GET_BY_ID: 'identity.users.getById',
    CREATE: 'identity.users.create',
    UPDATE: 'identity.users.update',
    DELETE: 'identity.users.delete'
  },
  AUTH: {
    LOGIN: 'identity.auth.login',
    REGISTER: 'identity.auth.register',
    VALIDATE_TOKEN: 'identity.auth.validateToken',
    REFRESH: 'identity.auth.refresh'
  },
  HEALTH: {
    CHECK: 'identity.health.check',
    CHECK_DB: 'identity.health.check_db'
  }
} as const;
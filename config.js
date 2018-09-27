'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://admin:admin1234@ds263832.mlab.com:63832/travelers_app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://admin:admin1234@ds263832.mlab.com:63832/travelers_app';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
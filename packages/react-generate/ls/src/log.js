import Log, {ENV} from 'nw-log';

export const log = new Log({
    userId: '',
    key: 'comic',
    env: process.env.LOG_ENV === ENV.GA ? ENV.GA : ENV.ST
});

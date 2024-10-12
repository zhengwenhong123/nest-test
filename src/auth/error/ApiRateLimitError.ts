export class ApiRateLimitError extends Error {
    constructor() {
        super('Api 调用次数超过10次,请一分钟后重试');
        this.name = 'ApiRateLimitError';
    }
}
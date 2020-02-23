/**
 * Serialize JSON response according to
 * JSEND guidelines
 */
export default class JsonResponse {
    static success(message, code, data = []) {
        return {
            status: 'success',
            message,
            code,
            data,
        };
    }

    static fail(message, code, data = []) {
        return {
            status: 'fail',
            message,
            code,
            data,
        };
    }

    static error(message, code) {
        return {
            status: 'error',
            message,
            code,
        };
    }
}
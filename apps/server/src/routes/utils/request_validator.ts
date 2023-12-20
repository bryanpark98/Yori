import { ApiError } from '../../common/api_error';
import logger from '../../utils/logger';

export class RequestValidator {
  static validate<RequestType>(request: any): RequestType {
    const castRequest = request as RequestType;
    if (castRequest == null) {
      logger.error(`Invalid request: ${request}`);
      throw new ApiError('Invalid request', 400);
    }
    return castRequest;
  }
}

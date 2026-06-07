import { SetMetadata } from '@nestjs/common';
import { SKIP_TRANSFORM_KEY } from '../interceptors/transform.interceptor';

/**
 * Opt a handler out of the global response envelope (TransformInterceptor).
 * Needed for endpoints that issue raw HTTP redirects (e.g. Paymob browser
 * callback) where a JSON wrapper would break the flow.
 */
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);

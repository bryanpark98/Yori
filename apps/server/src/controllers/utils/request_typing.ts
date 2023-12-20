export function routeCreateOrUpdateRequest<
  T extends object,
  U extends object,
  V,
>(request: T | U, create: (request: T) => V, update: (request: U) => V): V {
  if ('id' in request) {
    return update(request as U);
  } else {
    return create(request as T);
  }
}

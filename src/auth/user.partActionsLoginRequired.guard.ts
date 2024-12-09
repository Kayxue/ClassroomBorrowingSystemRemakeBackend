import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class partActionsLoginRequiredGuard implements CanActivate {
  private readonly queriesRequired: [string, any][];

  public constructor(...queries: [string, any][]) {
    this.queriesRequired = queries;
  }

  public canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (
      this.queriesRequired.filter((e) => e[1].toString() == request.query[e[0]])
        .length &&
      !request.isAuthenticated()
    ) {
      throw new ForbiddenException("此操作需要登入！");
    }
    return true;
  }
}

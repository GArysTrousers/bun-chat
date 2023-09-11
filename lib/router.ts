
export class Router {

  routes: IRoute[] = [];

  constructor() { }

  add(route: IRoute) {
    this.routes.push(route)
  }

  async resolve(req: Request) {
    const url = new URL(req.url)
    console.log(url.pathname);

    for (const route of this.routes) {
      if (url.pathname.match(route.pattern)) {
        return await route.resolver(req)
      }
    }
    return new Response(null, { status: 404 })
  }
}

interface IRoute {
  pattern: string;
  resolver: (req: Request) => Promise<Response>;
}

export class Route implements IRoute {

  pattern: string;
  resolver: (req: Request) => Promise<Response>;

  constructor(pattern: string, resolver: (req: Request) => Promise<Response>) {
    this.pattern = pattern;
    this.resolver = resolver;
  }
}

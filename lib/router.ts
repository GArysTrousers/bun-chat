export class Router {

  routes: Route[] = [];

  constructor() {
    
  }

  add(pattern:string, resolver:(req:Request)=>Response) {
    this.routes.push(new Route(pattern, resolver))
  }

  resolve(req: Request) {
    const url = new URL(req.url)
    console.log(url.pathname);
    
    for (const route of this.routes) {
      if (url.pathname.match(route.pattern)) {
        return route.resolver(req)
      }
    }
    return new Response('', {status:404})
  }
}

export class Route {

  pattern: string;
  resolver: (req:Request) => Response;

  constructor(pattern: string, resolver: (req:Request) => Response) {
    this.pattern = pattern;
    this.resolver = resolver;
  }
}
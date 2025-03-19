import { Service } from '..';
import { authenticateToken } from './auth_v1';

const service: Service = {
	path: '/v1/test/',

	fetch: async (request: Request, env: Env, ctx: ExecutionContext, subPath: string): Promise<Response | void> => {
		const authContext = await authenticateToken(request.headers, env);

		switch (request.method + ' ' + subPath.split('/')[0]) {
			case 'GET ping': {
				return new Response('Pong');
			}
		}
	},
};

export default service;

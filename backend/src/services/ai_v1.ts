import { Service } from '..';
import { initContentPrompt, initSystemPrompt } from '../prompts';
import { Category, Profile } from '../types';
import { authenticateToken } from './auth_v1';
import OpenAI from 'openai';
import { z } from 'zod';
import { enumToStringArray } from '../util';

type InitPayload = {
	name: string;
	company: string;
	problem: string;
	profile: Profile;
};

const gptResponseSchema = z.object({
	areas: z.record(z.enum(enumToStringArray(Category)), z.number()),
});

const service: Service = {
	path: '/v1/ai/',

	fetch: async (request: Request, env: Env, ctx: ExecutionContext, subPath: string): Promise<Response | void> => {
		const authContext = await authenticateToken(request.headers, env);

		switch (request.method + ' ' + subPath.split('/')[0]) {
			case 'POST init': {
				const client = new OpenAI({
					apiKey: env.GPT_TOKEN,
				});

				const payload = await request.json<InitPayload>();

				const completions = await client.chat.completions.create({
					model: 'gpt-4o',
					messages: [
						{
							role: 'system',
							content: initSystemPrompt(),
						},
						{
							role: 'user',
							content: initContentPrompt({ problem: payload.problem, profile: payload.profile }),
						},
					],
				});

				const gptAreaResponse = gptResponseSchema.safeParse(completions.choices[0].message.content);

				if (!gptAreaResponse.success) {
					return new Response('Invalid Prompt', { status: 400 });
				}

				const areas = gptAreaResponse.data.areas;

				return new Response(JSON.stringify(areas.data), { status: 200 });
			}
			case 'POST message': {
				return new Response('Message');
			}
		}
	},
};

export default service;

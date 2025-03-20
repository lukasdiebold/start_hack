import { Service } from '..';
import { AreaKV, ContactKV, Profile } from '../types';
import { authenticateToken } from './auth_v1';
import OpenAI from 'openai';
import { z } from 'zod';
import { enumToStringArray } from '../util';
import { safeJSON } from 'openai/core.mjs';

type InitPayload = {
	name: string;
	company: string;
	problem: string;
	profile: Profile;
};

type InitResponse = AreaData[];

type AreaData = {
	area: {
		name: string;
		rating: number;
		contacts: ContactData[];
	};
};
type ContactDataWithRating = ContactData & { rating: number };

type ContactData = {
	name: string;
	id: string;
	description: string;
	institution: string;
	category: string;
	email: string;
	website: string;
};

const areasResponseSchema = z.object({
	areasWithRating: z.record(z.string(), z.number()),
});

const contactsResponseSchema = z.object({
	contactsWithRating: z.record(z.string(), z.number()),
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

				const areas = await env.AREA_KV.list();

				console.log(JSON.stringify(areas));

				const areasCompletions = await client.chat.completions.create({
					model: 'gpt-4o',
					messages: [
						{
							role: 'system',
							content: `
							You are a helpful assistant which guides users though an innovation process. Your users are managing directors of company 
							who look into how to innovate their business. In a first stage, we try to find the best innovation focus area for the company 
							based on the sector they work in and the problems they face. Based on the following focus areas, output an 'areas' object 
							without any codeblocks, where the number represents the percentage of a fitting for the current situation. 
							{
								"areasWithRating": {
									${areas.keys.map((area) => {
										return `"${area.name}": [percentage (0 - 100)],`;
									})} 
								}
							}W
							`,
						},
						{
							role: 'user',
							content: `
								Calculate the fit of the areas for the following person. ${payload.name} works at ${payload.company} 
								and has the problem: "${payload.problem}".
							`,
						},
					],
				});

				const areasContent = areasCompletions.choices[0].message.content;

				console.log('content: ', areasContent);

				if (!areasContent) {
					console.log('No Areas Content');
					return new Response('Invalid Areas Prompt', { status: 400 });
				}

				const areasObject = safeJSON(areasContent);

				if (!areasObject) {
					console.log('Areas Content Invalid JSON:', areasContent);
					return new Response('Invalid Areas Prompt', { status: 400 });
				}

				const areasZodObject = areasResponseSchema.safeParse(areasObject);

				if (!areasZodObject.success) {
					return new Response('Invalid Areas Prompt', { status: 400 });
				}

				const areasWithRating = areasZodObject.data.areasWithRating;

				const existingAreaKeys = areas.keys.map((ns) => ns.name);

				const filteredAreas = Object.keys(areasWithRating)
					.filter((area) => existingAreaKeys.includes(area))
					.sort((keyA, keyB) => (areasWithRating[keyA] - areasWithRating[keyB] ? 1 : -1))
					.slice(0, 4);

				console.log('filtered Areas: ', filteredAreas);

				let initResponse: InitResponse = [];

				for (let area of filteredAreas) {
					console.log(area);
					const areaKvData = await env.AREA_KV.get<AreaKV>(area);

					if (!areaKvData) {
						console.log(`Area ${area} Data Not Found`);
						continue;
					}

					let contacts: ContactData[] = [];

					for (let contactId in areaKvData.contactIds) {
						const contactKvData = await env.CONTACTS_KV.get<ContactKV>(contactId);

						if (!contactKvData) {
							console.log(`Contact ${contactId} Data Not Found`);
							continue;
						}

						contacts.push({
							id: contactId,
							...contactKvData,
						});
					}

					initResponse.push({
						area: {
							name: area,
							rating: areasWithRating[area],
							contacts,
						},
					});
				}

				return new Response(JSON.stringify(initResponse), { status: 200 });
			}
			case 'POST message': {
				return new Response('Message');
			}
		}
	},
};

export default service;

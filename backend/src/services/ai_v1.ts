import { Service } from '..';
import { Area, AreaKV, ContactKV, Profile } from '../types';
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

const areaResponseSchema = z.object({
	areas: z.record(z.enum(enumToStringArray(Area)), z.number()),
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

				const areaCompletions = await client.chat.completions.create({
					model: 'gpt-4o',
					messages: [
						{
							role: 'system',
							content: `Output an 'areas' object without any codeblocks, where the number represents the percentage of a fitting: 
							{
								"areas": {
									${enumToStringArray(Area).map((area) => {
										return `"${area}": [percentage (0 - 100)],`;
									})} 
								}
							}
							`,
						},
						{
							role: 'user',
							content: `I am ${payload.profile.toLowerCase}. 
								Give me the percentages of how strong the areas ${
									//build a string of possible areas
									enumToStringArray(Area)
										.map((area) => area.toLowerCase)
										.join(',\n')
								} influences the problem: "${payload.problem}".`,
						},
					],
				});

				const areaContent = areaCompletions.choices[0].message.content;

				if (!areaContent) {
					console.log('No Area Content');
					return new Response('Invalid Prompt', { status: 400 });
				}

				const areaObject = safeJSON(areaContent);

				if (!areaObject) {
					console.log('Area Content Invalid JSON:', areaContent);
					return new Response('Invalid Prompt', { status: 400 });
				}

				const areaZodObject = areaResponseSchema.safeParse(areaObject);

				if (!areaZodObject.success) {
					console.log(areaZodObject.error);
					return new Response('Invalid Prompt', { status: 400 });
				}

				const areas = areaZodObject.data.areas;

				const nullableAreaObjects = await Promise.all(
					Object.keys(areas)
						.sort((keyA, keyB) => (areas[keyA] - areas[keyB] ? 1 : -1))
						.map(async (area) => {
							const areaData = await env.AREA_KV.get<AreaKV>(area);

							if (!areaData) {
								console.log(`No Data For Area: ${area}`);
								return null;
							}

							const nullableContacts = await Promise.all(
								areaData.contactIds.map(async (contactId) => {
									const contactData = await env.CONTACTS_KV.get<ContactKV>(contactId);

									if (!contactData) {
										console.log(`No Data For Contact: ${contactId}`);
										return null;
									}

									return {
										name: contactData.name,
										id: contactId,
										description: contactData.description,
										institution: contactData.institution,
										category: contactData.category,
										email: contactData.email,
										website: contactData.website,
									};
								})
							);

							const contacts = nullableContacts.filter((contact) => !!contact);

							const contactCompletions = await client.chat.completions.create({
								model: 'gpt-4o',
								messages: [
									{
										role: 'system',
										content: `Output an 'areas' object without any codeblocks, where the number represents the percentage of a fitting: 
										{
											"areas": {
												${contacts.map((contact) => {
													return `"${contact.id}": [percentage (0 - 100)],`;
												})} 
											}
										}
										`,
									},
									{
										role: 'user',
										content: `I am ${payload.profile.toLowerCase}. 
											Give me the percentages of how good my contacts can help me ${
												//build a string of possible contacts
												contacts.map((contact) => `${contact.id}: ${contact.description}`).join(', ')
											} 
											with my problem: "${payload.problem}".`,
									},
								],
							});

							return { area, percentage: areas[area], contacts };
						})
				);

				const areaObjects = nullableAreaObjects.filter((areaObject) => !!areaObject).splice(0, 4);

				return new Response(JSON.stringify(areaObjects), { status: 200 });
			}
			case 'POST message': {
				return new Response('Message');
			}
		}
	},
};

export default service;

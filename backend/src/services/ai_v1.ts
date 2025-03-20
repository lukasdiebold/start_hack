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

type InitResponse = {
	area: AreaData[];
};

type AreaData = {
	name: string;
	rating: number;
	contacts: ContactDataWithRating[];
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

				const areasCompletions = await client.chat.completions.create({
					model: 'gpt-4o',
					messages: [
						{
							role: 'system',
							content: `Output an 'areas' object without any codeblocks, where the number represents the percentage of a fitting: 
							{
								"areasWithRating": {
									${areas.keys.map((area) => {
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
									areas.keys.map((area) => area.name.toLowerCase).join(',\n')
								} influences the problem: "${payload.problem}".`,
						},
					],
				});

				const areasContent = areasCompletions.choices[0].message.content;

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
					console.log('Object: ' + JSON.stringify(areasObject) + ', Zod error :' + areasZodObject.error);
					return new Response('Invalid Areas Prompt', { status: 400 });
				}

				const areasWithRating = areasZodObject.data.areasWithRating;

				const nullableAreaData = await Promise.all(
					Object.keys(areasWithRating)
						.sort((keyA, keyB) => (areasWithRating[keyA] - areasWithRating[keyB] ? 1 : -1))
						.map(async (area) => {
							const areaData = await env.AREA_KV.get<AreaKV>(area);

							if (!areaData) {
								console.log(`No Data For Area: ${area}`);
								return null;
							}

							const nullableContactsData = await Promise.all(
								areaData.contactIds.map(async (contactId) => {
									const contactData = await env.CONTACTS_KV.get<ContactKV>(contactId);

									if (!contactData) {
										console.log(`No Data For Contact: ${contactId}`);
										return null;
									}

									const contact: ContactData = {
										name: contactData.name,
										id: contactId,
										description: contactData.description,
										institution: contactData.institution,
										category: contactData.category,
										email: contactData.email,
										website: contactData.website,
									};

									return contact;
								})
							);

							const contactsData = nullableContactsData.filter((contact) => !!contact);

							const contactCompletions = await client.chat.completions.create({
								model: 'gpt-4o',
								messages: [
									{
										role: 'system',
										content: `Output an 'contacts' object without any codeblocks, where the number represents the percentage of a fitting: 
										{
											"contactsWithRating": {
												${contactsData.map((contact) => {
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
												contactsData.map((contact) => `${contact.id}: ${contact.description}`).join(', ')
											} 
											with my problem: "${payload.problem}".`,
									},
								],
							});

							const contactsContent = contactCompletions.choices[0].message.content;

							if (!contactsContent) {
								console.log('No Contacts Content');
								return null;
							}

							const contactsObject = safeJSON(contactsContent);

							if (!contactsObject) {
								console.log('Contacts Content Invalid JSON:', areasContent);
								return null;
							}

							const contactsZodObject = contactsResponseSchema.safeParse(contactsObject);

							if (!contactsZodObject.success) {
								console.log(contactsZodObject.error);
								return null;
							}

							const contactsWithRating = contactsZodObject.data.contactsWithRating;

							const contacts = Object.keys(contactsWithRating)
								.sort((keyA, keyB) => (contactsWithRating[keyA] - contactsWithRating[keyB] ? 1 : -1))
								.map((contactId) => {
									const contactData = contactsData.find((contact) => contact.id === contactId);

									if (!contactData) {
										console.log(`No Data For Contact: ${contactId}`);
										return null;
									}

									const contact: ContactDataWithRating = {
										id: contactData.id,
										category: contactData.category,
										description: contactData.description,
										email: contactData.email,
										institution: contactData.institution,
										name: contactData.name,
										website: contactData.website,
										rating: contactsWithRating[contactId],
									};

									return contact;
								})
								.filter((contact) => !!contact);

							const nullableAreaData: AreaData | null = {
								name: area,
								rating: areasWithRating[area],
								contacts,
							};

							return nullableAreaData;
						})
				);

				const initResponse: InitResponse = {
					area: nullableAreaData.filter((areaObject) => !!areaObject).splice(0, 4),
				};

				return new Response(JSON.stringify(initResponse), { status: 200 });
			}
			case 'POST message': {
				return new Response('Message');
			}
		}
	},
};

export default service;

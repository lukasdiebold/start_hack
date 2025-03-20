import { Category, Profile } from './types';
import { enumToStringArray } from './util';

type InitContentPromptPayload = {
	profile: Profile;
	problem: string;
};

type MessageContentPromptPayload = {
	name: string;
	company: string;
	profile: Profile;
	problem: string;
};

export const initSystemPrompt = (): string => {
	return `Output in the following JSON format, where the number represents the percentage of a fitting: 
  "
  {
	areas: {
		Technology: 80,  // 80% in Technology
		Health: 15,      // 15% in Health
		Education: 5,    // 5% in Education
	}
  "
`;
};

export const initContentPrompt = ({ problem, profile }: InitContentPromptPayload): string => {
	return `I am ${profile.toLowerCase}. Give me the percentages of how strong the areas ${enumToStringArray(Category)
		.map((category) => category.toLowerCase)
		.join(', ')} influences the problem: "${problem}".`;
};

export const messageSystemPrompt = (): string => {
	return 'string';
};

export const messageContentPrompt = ({ name, company, problem, profile }: MessageContentPromptPayload): string => {
	return `The users name is ${name}, he works at the company ${company}, the user is ${profile.toLowerCase()}`;
};

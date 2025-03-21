import json
import os
import openai

# Get API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Initialize OpenAI client
client = openai.OpenAI(api_key=api_key)

# read different focus areas from distinct_focus_areas.csv
import pandas as pd
df = pd.read_csv("distinct_focus_areas.csv")
focus_areas = df["Focus Area"].tolist()


INIT_SYSTEM = f"""
You are a helpful assistant which guides users though an innovation process. Your users are managing directors of company 
who look into how to innovate their business. In a first stage, we try to find the best innovation focus area for the company 
based on the sector they work in and the problems they face. For each of the following focus areas, you should provide a
how good a match this focus area is for the current situation. The focus areas are: {focus_areas}. Identify the five most
relevant focus areas for the company. Return only a json list of strings of these most important focus areas.
"""

user = {
	"name": "John Doe",
	"company": "Acme Corp",
	"problem": "Struggling with customer retention strategies",
	"profile": "MOTIVATED"
}

INIT_USER = f"""{json.dumps(user)}"""



def chat_with_openai(system_message, user_message, model="gpt-4o"):
    """
    Send a message to OpenAI API with specified system and user messages.
    
    Args:
        system_message (str): The system message providing context
        user_message (str): The user's input message
        model (str): The model to use for completion
        
    Returns:
        str: The assistant's response
    """
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ]
    )
    
    return response.choices[0].message.content

if __name__ == "__main__":
    # Example usage
    
    response = chat_with_openai(INIT_SYSTEM, INIT_USER)
    # print(f"System: {INIT_SYSTEM}")
    # print(f"User: {INIT_USER}")
    print(f"Assistant: {response}")
    # parse response
    print(type(response))

    # string to list
    most_important = json.loads(response)
    print(type(most_important))

    for i in most_important:
        if i not in focus_areas:
            print(f"Focus Area {i} not in list of focus areas")
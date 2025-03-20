import os
import openai

# Get API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Initialize OpenAI client
client = openai.OpenAI(api_key=api_key)



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
    system_msg = "You are a helpful assistant."
    user_msg = "Tell me about artificial intelligence in 3 sentences."
    
    response = chat_with_openai(system_msg, user_msg)
    print(f"System: {system_msg}")
    print(f"User: {user_msg}")
    print(f"Assistant: {response}")
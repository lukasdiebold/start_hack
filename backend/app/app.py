"""
Main FastAPI application for Innovation Ecosystem.
"""
import json
import os
from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from openai import OpenAI

from createDB import (
    Experts, User, SessionLocal, create_user, InnovationAreas, 
)
from import_innovation_data import ExpertAreas, import_innovation_data
from passwordUtil import verify_password
import openai

# Create app
app = FastAPI(title="Innovation Ecosystem API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Secret key and algorithm for JWT
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")


# Get API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Initialize OpenAI client
client = openai.OpenAI(api_key=api_key)

# Model schemas
class Person(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    address: Optional[str] = None
    other: Optional[str] = None
    capabilities: Optional[List[Dict[str, Any]]] = None

class InnovationArea(BaseModel):
    id: int
    name: str

class Expert(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    institution: Optional[str] = None
    category: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    areas: Optional[List[InnovationArea]] = None

class Event(BaseModel):
    id: int
    task_name: str
    start: str
    end: str
    details: Optional[str] = None
    other: Optional[str] = None
    requirements: Optional[List[Dict[str, Any]]] = None

class ProjectCreate(BaseModel):
    project_name: str
    start: str
    end: str

class ProjectUpdate(BaseModel):
    project_id: int
    start: str
    end: str

class Capability(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class OverwriteEvent(BaseModel):
    id: int
    task_name: str
    start: str
    end: str
    details: Optional[str] = None
    other: Optional[str] = None
    requirements: List[Dict[str, Any]]

class OverwritePerson(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    address: Optional[str] = None
    other: Optional[str] = None
    capabilities: List[Dict[str, Any]]

class UpdateScheduleEvent(BaseModel):
    id: int
    project_id: int
    task_name: str
    start: str
    end: str
    people: List[Dict[str, Any]]

class UpdateEventTime(BaseModel):
    id: int
    start: str
    end: str

class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    company_sector: Optional[str] = None
    problem: Optional[str] = None
    profile: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Dependency functions
def get_session_local():
    """
    Get a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Create a JWT access token.
    """
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    """
    Decode a JWT access token.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session_local)):
    """
    Get the current user from the token.
    """
    payload = decode_access_token(token)
    username = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint.
    """
    return {"message": "Welcome to the Innovation Ecosystem API"}

# Authentication endpoints
@app.post("/register", response_model=dict, tags=["Authentication"])
async def register_user(user: UserCreate, db: Session = Depends(get_session_local)):
    """
    Register a new user.
    """
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Create and return the new user
    create_user(
        db, 
        username=user.username, 
        password=user.password,
        email=user.email,
        company=user.company,
        role=user.role,
        company_sector=user.company_sector,
        problem=user.problem,
        profile=user.profile
    )
    return {"message": "User created successfully"}

@app.post("/token", response_model=Token, tags=["Authentication"])
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_session_local)):
    """
    Authenticate user and return JWT token.
    """
    # Fetch user from database
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create and return access token
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=dict, tags=["Authentication"])
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get information about the current user.
    """
    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "email": current_user.user_email,
        "company": current_user.user_company,
        "role": current_user.user_role,
        "company_sector": current_user.user_company_sector,
        "profile": current_user.user_profile
    }

@app.get("/init", response_model=list)
async def init(current_user: User = Depends(get_current_user), db: Session = Depends(get_session_local)):
    """
    Initialize AI matching process based on user problem.
    
    Args:
        payload: Initial data including user name, company, problem and profile
        context: JWT payload from authentication middleware
        
    Returns:
        List of matched innovation areas with contacts
        
    Raises:
        HTTPException: If OpenAI API fails or returned data is invalid
    """


    
    # Get list of all areas names
    areas_list = db.query(InnovationAreas).all()
    # print(areas_list)

    print("Pre Request")
    try:
        # Query GPT-4o to analyze the user's problem
        areas_completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": f"""
                    You are a helpful assistant which guides users though an innovation process. Your users are managing directors of company 
                    who look into how to innovate their business. In a first stage, we try to find the best innovation focus area for the company 
                    based on the sector they work in and the problems they face. Based on the following focus areas, output an 'areas' object 
                    that is a mapping from the area name to a percentage (0-100) representing how well it fits the current situation. 
                    The focus areas are: {', '.join([area.innovation_area_name for area in areas_list])}. Return only this json object, no additional text.
                    """
                },
                {
                    "role": "user",
                    "content": f"""
                    Calculate the fit of the areas for the following person. {current_user.username} works at {current_user.user_company} 
                    and has the problem: "{current_user.user_problem}".
                    """
                }
            ]
        )
        print("Post Request")
        
        # Extract content from the AI response
        areas_content = areas_completion.choices[0].message.content
        
        if not areas_content:
            print(areas_content)
            raise HTTPException(status_code=400, detail="Invalid Areas Prompt1")
        
        areas_content = areas_content.strip().replace("\\n", "").replace("```", "").replace("json", "")
        # Parse JSON from the AI response
        try:
            areas_with_rating = json.loads(areas_content)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail="Invalid Areas Prompt2")
        
            
        # Validate against expected schema
        if not isinstance(areas_with_rating, dict):
            raise HTTPException(status_code=400, detail="Invalid Areas Prompt3")
            
        
        # Get list of valid area keys
        # print(areas_list)
        existing_area_keys = [area.innovation_area_name for area in areas_list]
        
    
        # Filter, sort, and limit areas by rating
        filtered_areas = (
            sorted(
                [area for area in areas_with_rating.keys() if area in existing_area_keys],
                key=lambda a: areas_with_rating[a],
                reverse=True
            )[:4]
        )
        # print(filtered_areas)
        
        # Initialize response
        init_response = []
        
        # For each area, fetch details and relevant contacts
        for area in filtered_areas:
            # Get area data from KV
            area_data = db.query(InnovationAreas).filter(InnovationAreas.innovation_area_name == area).first()
            
            if not area_data:
                continue
                
            contacts = []
            # print(area_data)
            print(area)

            matching_contacts = db.query(ExpertAreas).filter(ExpertAreas.area_id == area_data.innovation_area_id).all()
            # print(matching_contacts)
            
            # Fetch contacts for this area
            for c in matching_contacts:
                contact_data = db.query(Experts).filter(Experts.expert_id == c.expert_id).first()
                
                if not contact_data:
                    continue

                # print(contact_data)
                    
                # Add contact with ID
                contacts.append(
                    {
                        "name": contact_data.expert_name, 
                        "description": contact_data.expert_description,
                        "institution": contact_data.expert_institution,
                        "email": contact_data.expert_email,
                        "website": contact_data.expert_website
                     }
                )
                
            # Add area with contacts to response
            init_response.append({
                "area": {
                    "name": area,
                    "rating": areas_with_rating[area],
                    "contacts": contacts
                }
            })
            
        # Return response using the RootModel pattern
        return init_response
        
    except Exception as e:
        # Log error and return 500
        print(f"Error in AI init: {str(e)}")
        raise HTTPException(status_code=500, detail="AI Service Error")


@app.get("/message", response_model=dict)
async def message(current_user: User = Depends(get_current_user), db: Session = Depends(get_session_local)):
    """
    Placeholder for future message endpoint.
    
    Args:
        context: JWT payload from authentication middleware
        
    Returns:
        Simple message response
    """



    




    return {"message": "Message endpoint"}



if __name__ == "__main__":
    # import_innovation_data()
    # run using uvicorn
    import uvicorn
    # automatically restart server when code changes
    # uvicorn.run(app, host="0.0.0.0", port=8000, debug=True)
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

    # uvicorn.run(app, host="0.0.0.0", port=8000, )